import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useRouter } from "next/router";
import _ from "lodash";

import routeResolver from "config/routes";
import { encodeQuery } from "lib/utils";

import AppWrapper from "pages/_app";
import ErrorPage from "pages/_error";

// Load all the pages we want:
import * as index from "pages/index";
import * as about from "pages/about";
import * as itemsShow from "pages/items/show";

import InitialLoading from "./InitialLoading";

/**
 * Entrypoint for the mobile app
 */

const pages = _.mapValues(
  {
    index,
    about,
    "items/show": itemsShow,
  },
  (mod) => ({
    comp: mod.default,
    ssp: !!mod.__N_SSP,
  })
);

const HOST = process.env.MOBILE_SERVER_HOST;
const DEPLOYMENT_ID = process.env.MOBILE_DEPLOYMENT_ID;

const NotFoundPage = (props) => <ErrorPage {...props} code={404} />;

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
      pageComp: NotFoundPage,
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

const AppRouter = () => {
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

const AppRoot = () => {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
};

export default AppRoot;
