const pages = {};
const pagesCtx = require.context("../pages/", true, /^(?!_).*\.js$/);
pagesCtx.keys().forEach((key) => {
  pages[key] = pagesCtx(key);
});
