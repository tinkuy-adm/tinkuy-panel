const { resolve } = require("path");

module.exports = {
  plugins: [
    require("postcss-import")({
      path: [resolve("src")],
    }),
    require("tailwindcss"),
  ],
};
