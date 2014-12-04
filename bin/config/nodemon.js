var path = require("path")

var nodemonSettings
var nodemonConfigFile = "nodemon.json"
var watch = [nodemonConfigFile]

module.exports = function(  ){
  try{
    nodemonSettings = require(path.resolve(nodemonConfigFile))
    nodemonSettings.watch = nodemonSettings.watch
      ? nodemonSettings.watch.concat(watch).map(function( file ){
      return path.resolve(file)
    })
      : null
  }
  catch( e ){
    nodemonSettings = {
      "script": "",
      restartable: "rs",
      execMap: {
        "js": "node",
        py: "python",
        rb: "ruby"
        // more can be added here such as ls: lsc - but please ensure it"s cross
        // compatible with linux, mac and windows, or make the default.js dynamically
        // append the `.cmd` for node based utilities
      },
      ignore: [
        ".git",
        "node_modules/**/node_modules",
        "bower_components",
        ".sass-cache",
        ".idea"
      ],
      watch: watch.map(function( file ){
        return path.resolve(file)
      }),
      stdin: true,
      verbose: false,
      // "stdout" refers to the default behaviour of a required nodemon"s child,
      // but also includes stderr. If this is false, data is still dispatched via
      // nodemon.on("stdout/stderr")
      stdout: true,
      "env": {
        "NODE_ENV": process.env.NODE_ENV
      },
      "ext": "js json",
      "nodeArgs": ["--debug"]
    }
  }
  return nodemonSettings
}