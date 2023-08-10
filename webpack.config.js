const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    board: path.resolve(__dirname, "src/board.ts")
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "scripts/[name].bundle.js",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, "assets"), to: path.resolve(__dirname, "dist") },
      ]
    })
  ],
  resolve: {
    extensions: [
      ".ts", ".js",
    ],
  },
};