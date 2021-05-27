import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useRouter } from "next/router";
import _ from "lodash";

import routeResolver from "config/routes";
import { encodeQuery } from "lib/utils";

import AppWrapper from "pages/_app";
import ErrorPage from "pages/_error";

// Load all the pages we want:

import InitialLoading from "./InitialLoading";
import { pages } from "./pages";

/**
 * Entrypoint for the mobile app
 */

const HOST = process.env.MOBILE_SERVER_HOST;
const DEPLOYMENT_ID = process.env.MOBILE_DEPLOYMENT_ID;

const NotFoundPage = (props) => <ErrorPage {...props} code={404} />;

const pagesMap = _.transform(pages, (m, mod, path) => {
  const name = path.replace(/\//g, ".");
  const route = routeResolver.routeNameMap[name];
  if (!name)
    throw new Error(
      `Invalid page path: ${path} (with computed route name=${name})`
    );

  m[name] = {
    route,
    comp: mod.default,
    ssp: !!mod.__N_SSP || !!mod.__N_SSG,
  };
});

const getPageMatch = (pathname) => {
  const { route, params } = routeResolver.matchRoute(pathname);

  const pageData = route ? pagesMap[route.name] : null;

  if (pageData) {
    return {
      pageRoute: pageData.route,
      pageComp: pageData.comp,
      ssp: pageData.ssp,
      params: params || {},
    };
  } else
    return {
      pageKey: "404",
      pageComp: NotFoundPage,
      params: {},
    };
};

class SspError extends Error {
  constructor(res, json) {
    super(res.statusText);
    this.code = this.status = res.status;
    this.json = json;
  }
}

const fetchSspProps = async (pageRoute, query) => {
  try {
    const pagePath = pageRoute[
      // TODO: this is a bit dirty
      pageRoute.name.includes("[") ? "getAs" : "getHref"
    ]({ ...query, __format: "json" });

    console.log("Fetching Next.js page data:", pagePath);

    const res = await fetch(`${HOST}/_next/data/${DEPLOYMENT_ID}${pagePath}`);
    const json = await res.json().catch(() => undefined);
    if (!res.ok) throw new SspError(res, json);
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
    const { pageRoute, pageComp, params, ssp } = pageMatch;

    let canceled = false;

    if (ssp) {
      fetchSspProps(pageRoute, params).then(({ pageProps, error }) => {
        if (canceled) return;
        if (pageProps) setPageData({ pageComp, pageProps });
        else if (error?.status === 404)
          setPageData({ pageComp: NotFoundPage, pageProps: {} });
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
