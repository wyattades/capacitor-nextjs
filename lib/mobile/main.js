import React, { Component, useEffect, useMemo, useState } from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
// import useAsync from "react-use/lib/useAsync";
import { useRouter } from "next/router";

import routeResolver from "config/routes";
import { encodeQuery } from "lib/utils";

import AppWrapper from "pages/_app";
import ErrorPage from "pages/_error";

/**
 * Entrypoint for the mobile app
 */

const HOST = "http://localhost:3000"; // TODO
const DEPLOYMENT_ID = "development"; // TODO

// Load all pages in an object
// e.g. { 'item/[item_id]': { comp: ItemPage, ssp: false } }
const pages = {};
const pagesCtx = require.context("pages/", true, /^.*?\/(?!_)[^\/]+\.js$/);
pagesCtx.keys().forEach((key) => {
  const pageKey = key.replace(/^\.\//, "").replace(/\.\w+$/, "");
  const mod = pagesCtx(key);

  pages[pageKey] = {
    comp: mod.default,
    ssp: !!mod.__N_SSP,
  };
});

const pageRegexp = (pageKey) => {
  if (pageKey === "index") return /^\/$/;
  const parts = pageKey.split("/").map((p) => {
    // const m = p.match(/^\[(\w+)\]$/);
    // if (m) return `(?<${m[1]}>\\w+)`
    if (p === "show") return `(?<show>\\w+)`;
    else return p;
  });
  return new RegExp(`^\\/${parts.join("\\/")}$`);
};

const Page404 = (props) => <ErrorPage {...props} code={404} />;

const getPageMatch = (pathname) => {
  const { route, params } = routeResolver.matchRoute(pathname);

  const pageKey = route?.name.replace(/\./g, "/");

  const pageData = pageKey ? pages[pageKey] : null;

  if (pageData) {
    return {
      pageKey,
      pageComp: pageData.comp,
      ssp: pageData.ssp,
      params: params || {},
    };
  } else
    return {
      pageKey: "_404",
      pageComp: Page404,
      ssp: false,
      params: {},
    };
};

const fetchSspProps = async (pageKey, query) => {
  try {
    const res = await fetch(
      `${HOST}/_next/data/${DEPLOYMENT_ID}/${pageKey}.json${encodeQuery(
        query,
        true
      )}`
    );
    if (!res.ok) throw new Error("Ssp fetch error: " + res.statusText);
    const json = await res.json();
    return { pageProps: json?.pageProps || null };
  } catch (error) {
    console.error("fetchSspProps error:", error);

    return { error };
  }
};

const InitialLoading = () => <p>Initial app loading state...</p>;

const AppRoot = () => {
  const { pathname } = useRouter();

  const pageMatch = useMemo(() => getPageMatch(pathname), [pathname]);

  const [pageData, setPageData] = useState(() => {
    const { pageComp, ssp } = pageMatch;

    if (ssp) {
      return { pageComp: InitialLoading, pageProps: {} };
    } else {
      return { pageComp, pageProps: {} };
    }
  });

  useEffect(() => {
    const { pageKey, pageComp, params, ssp } = pageMatch;

    let canceled = false;

    if (ssp) {
      fetchSspProps(pageKey, params).then(({ pageProps, error }) => {
        if (canceled) return;
        if (pageProps) setPageData({ pageComp, pageProps });
        else setPageData({ pageComp: ErrorPage, pageProps: { error } });
      });
    } else {
      setPageData({ pageComp, pageProps: {} });
    }

    return () => {
      canceled = true;
    };
  }, [pageMatch]);

  return (
    <AppWrapper
      Component={pageData.pageComp}
      pageProps={pageData.pageProps || {}}
    />
  );
};

ReactDOM.render(
  <Router>
    <AppRoot />
  </Router>,
  document.getElementById("app-root")
);
