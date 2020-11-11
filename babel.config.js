module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
  plugins: [
    "@babel/proposal-class-properties",
    "@babel/plugin-transform-runtime",
    ["react-css-modules", {
      "generateScopedName": process.env.NODE_ENV === 'test' ? "[local]" : "[local]___[hash:base64:5]",
      "filetypes": {
        ".less": {
          "syntax": "postcss-less"
        }
      }
    }]
  ]
}