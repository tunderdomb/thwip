var path = require("path")
var nodemon = require("nodemon")
var log = require("../util/log")
var config = require("./config")
var argv = require("minimist")(process.argv.slice(2))
var action = argv._[0]
console.log("arg", argv, action)
switch( action ){
  case "create":
    require("./create")
    break
  default:
    runStart()
    break
}

function runStart(  ){
  var started = false
  var startScript = path.join(__dirname, "start.js")
  return nodemon({
    "script": startScript,
    restartable: "rs",
    execMap: {"js": "node"},
    ignore: [
      ".git",
      "node_modules/**/node_modules",
      "bower_components",
      ".sass-cache",
      ".idea"
    ],
    watch: [config.CONFIG_FILE],
    stdin: true,
    verbose: false,
    stdout: true,
    "env": {
      "NODE_ENV": process.env.NODE_ENV
    },
    "ext": "js json"
  }).on("start", function(){
    if( !started ){
      log("start")
      started = true
    }
  }).on("quit", function(){
    log("Bye!")
  }).on("restart", function(  ){
    log("Settings changed, restarting")
  })
}