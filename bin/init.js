var fs = require("fs")
var log = require("../util/log")
var packageJson = require("./config/package")

packageJson.thwip = {
  options: {
    nodemon: {},
    livereload: {},
    ports: {}
  },
  process: {
    less: [],
    stylus: [],
    browserify: []
  }
}
fs.writeFile("package.json", JSON.stringify(packageJson, null, "  "), "utf8", function( err ){
  if( err ) log.error(err.message)
  else log("initialized")
})