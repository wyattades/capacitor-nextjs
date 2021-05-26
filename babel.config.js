module.exports = (api) => {
  const forServer = api.caller((caller) => caller && caller.target === "node");

  const buildApp = !!process.env.BUILD_APP;

  if (buildApp) {
    return {
      plugins: [require("./lib/mobile/babel-plugin"), "styled-jsx/babel"],
      presets: [
        [
          "@babel/preset-env",
          {
            targets: "> 0.25%, not dead", // TODO
            useBuiltIns: "usage",
            corejs: 3,
          },
        ],
        "@babel/preset-typescript",
        "@babel/preset-react",
      ],
    };
  }

  return {
    presets: ["next/babel"],
  };
};
