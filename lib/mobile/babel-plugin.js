/**
 * Removes `export const getServerSideProps = ...;` from `pages/*.js` files
 */

const nextSsgTransform =
  require("next/dist/build/babel/plugins/next-ssg-transform").default;

const appBabelPlugin = (...args) => {
  const res = nextSsgTransform(...args);

  const programEnter = res.visitor.Program.enter;
  res.visitor.Program.enter = (path, state) => {
    const {
      caller: { pagesDir },
      sourceFileName,
    } = state.file.opts;

    if (sourceFileName.startsWith(pagesDir + "/")) {
      return programEnter(path, state);
    }
  };

  return res;
};

module.exports = appBabelPlugin;
