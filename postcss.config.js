const pxtorem = require("postcss-pxtorem");
const pxtoremConfig = require("./pxtorem.config.js");

module.exports = {
    plugins: [pxtorem(pxtoremConfig)],
};
