import * as pathToRegexp from "path-to-regexp";

import { decodeQuery, encodeQuery } from "lib/utils";

// returns a path that starts with a slash but has no trailing slash
// TODO: remove /index ending?
const joinPaths = (...paths) => {
  const path = paths
    .filter(Boolean)
    .join("/")
    .replace(/\/{2,}/g, "/")
    .replace(/\/$/, "") // remove trailing slash
    .replace(/^([^\/])/, (r) => "/" + r); // add leading slash

  return path || "/";
};

const joinNames = (...names) => names.filter(Boolean).join(".");

class Route {
  constructor(parent, pattern, name, options) {
    this.parent = parent;
    this.routes = parent ? parent.routes : [];
    this.routeNameMap = parent ? parent.routeNameMap : {};

    options = options || {};

    this.redirect = options.redirect;

    this.name = joinNames(parent ? parent.name : null, name);

    if (this.name in this.routeNameMap)
      throw new Error(`Duplicate route name: ${this.name}`);

    if (options.as) {
      this.as = options.as;
      if (this.as in this.routeNameMap)
        throw new Error(`Duplicate route "as" name: ${this.as}`);
    }

    this.pattern = joinPaths(parent ? parent.pattern : "/", pattern);
    this.page = joinPaths(parent ? parent.page : "/", name.replace(/\./g, "/"));
    if (this.page === "/index") this.page = "/";

    const keys = [];
    this.regex = pathToRegexp.pathToRegexp(this.pattern, keys);
    this.keyNames = keys.map((key) => key.name);
    this.toPath = pathToRegexp.compile(this.pattern);

    // if (options.redirect && this.keyNames.length > 0) {
    //   throw new Error(`Redirects with dynamic params are currently unsupported`);
    // }

    if (!options.exclude) {
      this.routes.push(this);
      this.routeNameMap[this.name] = this;

      if (this.as) this.routeNameMap[this.as] = this;
    }
  }

  _newRoute(pattern, name, options, exclude = false) {
    if (typeof pattern === "object") {
      name = pattern.name;
      options = pattern.options;
      pattern = pattern.pattern;
    } else if (pattern[0] !== "/") {
      options = name;
      name = pattern;
      pattern = `/${name}`;
    }

    options = options || {};
    options.exclude = exclude;
    return new Route(this, pattern, name, options);
  }

  add(pattern, name, options) {
    this._newRoute(pattern, name, options);
    return this;
  }

  index(options = {}) {
    return this.add("/", this.parent ? "" : "index", options);
  }

  /**
   * @param {(route: Route) => void} factory
   */
  namespace(pattern, name, options, factory) {
    const newNamespace = this._newRoute(pattern, name, options, true);
    factory(newNamespace);
    return this;
  }

  match(path) {
    const values = path.match(this.regex);
    if (values) {
      return this.valuesToParams(values);
    }
    return null;
  }

  valuesToParams(values) {
    const params = {};
    for (let i = 0; i < this.keyNames.length; i++) {
      const val = values[i + 1];
      if (val !== undefined) {
        params[this.keyNames[i]] = decodeURIComponent(val);
      }
    }
    return params;
  }

  getHref(params = {}) {
    const anchor = params.anchor;
    if (anchor) delete params.anchor;

    return `${this.page}${encodeQuery(params, true)}${
      anchor ? `#${anchor}` : ""
    }`;
  }

  getAs(params = {}) {
    params = { ...params };

    const anchor = params.anchor;
    if (anchor != null) delete params.anchor;

    let as = this.toPath(params) || "/";
    const keys = Object.keys(params);
    const qsKeys = keys.filter((key) => this.keyNames.indexOf(key) === -1);

    if (qsKeys.length) {
      const qsParams = {};
      for (const key of qsKeys) qsParams[key] = params[key];

      as += encodeQuery(qsParams, true);
    }

    if (anchor != null) {
      as += `#${anchor}`;
    }

    return as;
  }
}

const parseUrl = (url) => {
  const parsedUrl = new URL(url, "http://dne.com");
  if (!parsedUrl.pathname) return {};

  return {
    hash: parsedUrl.hash,
    pathname: parsedUrl.pathname,
    query: decodeQuery(parsedUrl.search),
  };
};

class Routes extends Route {
  constructor(_options) {
    super(null, "/", "", { exclude: true });

    // TODO
    // this.delimiter = options.delimiter || '.';
  }

  findByName(name) {
    if (name[0] === "/") return null;
    if (name) return this.routeNameMap[name] || null;
    return null;
  }

  matchRoute(url) {
    const { pathname, query } = parseUrl(url);
    if (!pathname) return {};

    for (const route of this.routes) {
      const params = route.match(pathname);
      if (params) return { route, params: { ...query, ...params } };
    }

    return {};
  }

  // e.g. /chats/show?chat_id=123 -> /chats/123
  nonDynamicToDynamic(nonDynamicUrl) {
    const { pathname, query, hash } = parseUrl(nonDynamicUrl);
    if (!pathname) return {};

    let anchor;
    if (hash && hash.length > 1) anchor = hash.substring(1);

    for (const route of this.routes) {
      if (route.page === pathname) {
        try {
          return route.getAs({ ...query, anchor });
        } catch {
          return nonDynamicUrl;
        }
      }
    }

    return nonDynamicUrl;
  }

  findAndGetUrls(nameOrUrl, params) {
    const route = this.findByName(nameOrUrl);

    if (route) {
      return {
        route,
        urls: { as: route.getAs(params), href: route.getHref(params) },
        byName: true,
      };
    } else {
      const { route: parsedRoute, params: parsedParams } =
        this.matchRoute(nameOrUrl);
      const href = parsedRoute ? parsedRoute.getHref(parsedParams) : nameOrUrl;
      return { route: parsedRoute, urls: { href, as: nameOrUrl } };
    }
  }

  getRequestHandler(render, handler) {
    return (req, res) => {
      const { route, params, parsedUrl } = this.matchRoute(req.url);

      let redirectUrls;

      if (route) {
        if (
          route.redirect &&
          (redirectUrls = this.findAndGetUrls(
            route.redirect,
            route.redirectParams
              ? Object.assign(params, route.redirectParams)
              : params
          )).route
        ) {
          res.writeHead(301, {
            Location: redirectUrls.urls.as,
          });
          res.end();
        } else {
          render(req, res, route.page, params);
        }
      } else {
        handler(req, res, parsedUrl);
      }
    };
  }

  getLink(React, NextLink) {
    const self = this;
    const Link = (props) => {
      const { route, params, to, ...newProps } = props;
      const nameOrUrl = route || to;

      if (nameOrUrl) {
        Object.assign(newProps, self.findAndGetUrls(nameOrUrl, params).urls);
      }

      return React.createElement(NextLink, newProps);
    };
    return Link;
  }

  /**
   * @param {import('next/router').NextRouter} NextRouter
   * @returns {import('next/router').NextRouter & { pushRoute: (route: string, params?: any) => void, replaceRoute: (route: string, params?: any) => void }}
   */
  getRouter(NextRouter) {
    const wrap = (method) => (route, params, options) => {
      const {
        byName,
        urls: { as, href },
      } = this.findAndGetUrls(route, params);
      // if `byName === false`, `route` will be a url e.g. `/foo/bar`
      // and `params` will actually be the `options`
      if (!byName) options = params;

      // if (options && typeof options.onComplete === 'function') {
      //   const onComplete = () => {
      //     NextRouter.events.off('routeChangeComplete', onComplete);
      //     NextRouter.events.off('routeChangeError', onComplete);

      //     options.onComplete();
      //   };
      //   NextRouter.events.on('routeChangeComplete', onComplete);
      //   NextRouter.events.on('routeChangeError', onComplete);
      // }

      return NextRouter[method](href, as, options);
    };

    if (NextRouter && NextRouter.push) {
      NextRouter.pushRoute = wrap("push");
      NextRouter.replaceRoute = wrap("replace");
      NextRouter.prefetchRoute = wrap("prefetch");
    }

    return NextRouter;
  }

  getAllRoutes() {
    return this.routes.map((r) => {
      const redirectRoute = r.redirect && this.findByName(r.redirect);

      return {
        name: r.name,
        pattern: r.pattern,
        page: r.page,
        keyNames: r.keyNames,
        redirectPage: redirectRoute && redirectRoute.page,
        redirectPath: redirectRoute && redirectRoute.pattern,
      };
    });
  }

  getPath(name, params = {}) {
    const routeUrls = this.findAndGetUrls(name, params);
    if (!routeUrls.route) throw new Error(`Route not found: ${name}`);

    return routeUrls.urls.as;
  }
}

const createRoutes = (options) => new Routes(options);

export default createRoutes;
