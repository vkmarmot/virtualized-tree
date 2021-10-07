const path = require("path");

module.exports = {
  target: "web",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "./dist"),
    libraryTarget: "umd",
    filename: "index.js"
  },
  mode: "development",
  devtool: "eval",
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /\.useable\.scss/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader?modules" },
          { loader: "sass-loader" }
        ]
      },
      {
        test: /\.(jsx|js|ts|tsx)?$/,
        exclude: /(node_modules)/,
        use: [{ loader: "babel-loader" }]
      }
    ]
  },
  externals: {
    "intersection-observer": { root: "intersection-observer", commonjs2: "intersection-observer", commonjs: "intersection-observer"  },
    "resize-observer-polyfill": { root: "resize-observer-polyfill", commonjs2: "resize-observer-polyfill", commonjs: "resize-observer-polyfill"  },
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react"
    }
  },
  resolve: {
    extensions: [".ts", ".tsx", "*", ".js", ".jsx"]
  }
};
