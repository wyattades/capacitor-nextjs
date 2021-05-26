const path = require("path");
const fs = require("fs");
// const dotenv = require("dotenv");
const _ = require("lodash");
const webpack = require("webpack");
const { TsconfigPathsPlugin } = require("tsconfig-paths-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const mode = process.env.NODE_ENV;
if (!["development", "test", "production"].includes(mode))
  throw "Must provide valid NODE_ENV";

const tsconfigFile = path.resolve(__dirname, "tsconfig.json");
const extensions = [".ts", ".js", ".tsx", ".jsx"];

const DEPLOY_ENV =
  mode === "production" && !!process.env.IS_STAGING_ENV ? "staging" : mode;

const isDev = DEPLOY_ENV === "development";

// const HOST_URL =
//   DEPLOY_ENV === "production"
//     ? "https://vanly.app"
//     : DEPLOY_ENV === "staging"
//     ? "https://staging.vanly.app"
//     : "http://localhost:3000";

// const IS_DEPLOYED =
//   !isBinTs && (DEPLOY_ENV === "production" || DEPLOY_ENV === "staging");

// const loadEnvs = (filename, shouldLoad) => {
//   if (!shouldLoad) return {};
//   try {
//     return dotenv.parse(
//       fs.readFileSync(path.resolve(__dirname, "..", filename), "utf8")
//     );
//   } catch (_err) {
//     return {};
//   }
// };

/** @type {webpack.Configuration} */
module.exports = {
  entry: "./lib/mobile/main",
  mode,
  target: "web",
  output: {
    // libraryTarget: "commonjs2",
    filename: "index.js",
    path: path.join(__dirname, "www"),
    publicPath: "/",
  },
  optimization: {
    minimize: false,
  },

  devServer: {
    contentBase: path.resolve(__dirname, "public"),
    historyApiFallback: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "lib/mobile/template.ejs"),
      inject: "body",
    }),

    new webpack.EnvironmentPlugin({
      NODE_ENV: mode,
      __NEXT_ROUTER_BASEPATH: "",
      __NEXT_TRAILING_SLASH: false,
      __NEXT_CROSS_ORIGIN: false,
      __NEXT_SCROLL_RESTORATION: false,
      __NEXT_HAS_REWRITES: false,
      __NEXT_I18N_SUPPORT: false,
    }),

    // new webpack.DefinePlugin({
    //   "typeof window": JSON.stringify("undefined"),
    //   ..._.transform(
    //     {
    //       // ...loadEnvs('.env.local', !IS_DEPLOYED),
    //       // ...loadEnvs('.env.production.local', !IS_DEPLOYED && DEPLOY_ENV === 'production'),
    //       NODE_ENV: mode,
    //       // USE_LOCAL_DB: !IS_DEPLOYED && isDev,
    //       // IS_DEPLOYED,
    //       // DEPLOY_ENV,
    //       // HOST_URL,
    //       // IS_FUNCTIONS: true,
    //     },
    //     (m, v, k) => {
    //       m[`process.env.${k}`] = JSON.stringify(v);
    //     }
    //   ),
    // }),
    // IS_DEPLOYED &&
    //   new ForkTsCheckerWebpackPlugin({
    //     typescript: {
    //       configFile: tsconfigFile,
    //     },
    //   }),
  ].filter(Boolean),

  resolve: {
    alias: {
      ...["lib", "components", "pages", "config"].reduce((m, k) => {
        m[k] = path.resolve(__dirname, k);
        return m;
      }, {}),

      next: path.resolve(__dirname, "lib/mobile/next-alias"),
    },
    extensions,

    // TODO: this overwrites the resolve.alias['next'] above...
    // plugins: [
    //   new TsconfigPathsPlugin({ configFile: tsconfigFile, extensions }),
    // ],
  },

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: "babel-loader",
        options: {
          caller: { pagesDir: path.resolve(__dirname, "pages") },
        },
        exclude: /node_modules/,
      },
    ],
  },
};