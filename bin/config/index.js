var path = require("path")
module.exports.CONFIG_FILE_NAME = "manifest.js"
module.exports.CONFIG_FILE = path.join(process.cwd(), module.exports.CONFIG_FILE_NAME)
module.exports.nodemon = require("./nodemon")
module.exports.livereload = require("./livereload")
module.exports.ports = require("./ports")