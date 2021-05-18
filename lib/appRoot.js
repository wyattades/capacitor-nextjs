const pages = {};
const pagesCtx = require.context("../pages/", true, /\.js$/);
pagesCtx.keys().forEach((key) => {
  pages[key] = pagesCtx(key);
});
