var path = require("path")
var fs = require("fs")
var argv = require("minimist")(process.argv.slice(2))
var reserve = require("portreserver")
var browserSync = require("browser-sync")
var nodemon = require("nodemon")
var log = require("../util/log")
var config = require("./config")
var options = {}

options.nodemon = config.nodemon()
options.livereload = config.livereload()
options.ports = config.ports()
options.process = require("../lib/process")

fs.exists(config.CONFIG_FILE, function( exists ){
  if( exists ){
    try{
      var configFile = require(config.CONFIG_FILE)
      if( !configFile ) {
        log.warn("Invalid config export")
        return
      }
      if( typeof configFile.process == "function" ){
        configFile.process(options.process)
      }
      if( typeof configFile == "function" ){
        if( configFile.length > 1 ){
          configFile(options, start)
        }
        else{
          configFile(options)
          start()
        }
      }
      else {
        log.warn("Config script should export a function")
      }
    }
    catch( e ){
      log.error("Error executing config: ")
      console.log(log.color.red(e.stack))
    }
  }
  else{
    //log.error("Config file not found: ", config.CONFIG_FILE)
    start()
  }
})

function start(){
  if( !options.nodemon.script ){
    log.warn("No entry script is defined: 'options.nodemon.script'")
    return
  }
  //log("start")
  reservePorts(options, function( serverPort, liveReloadPort ){
    if( options.livereload ){
      startLiveReload(options, serverPort, liveReloadPort, function(  ){
        startNodeMon(options, serverPort)
      })
    }
    else {
      startNodeMon(options, serverPort)
    }
    options.process.start()
  })
}

function reservePorts( options, cb ){
  if( options.livereload ){
    reserve(options.ports.start, 2, function( serverPort, liveReloadPort ){
      log.info("reserved ports", log.color.gray(serverPort), log.color.gray(liveReloadPort))
      cb(serverPort, liveReloadPort)
    })
  }
  else{
    reserve(options.ports.start, 1, function( serverPort ){
      log.info("reserved port", log.color.gray(serverPort))
      cb(serverPort)
    })
  }
}

function startLiveReload( options, serverPort, livereloadPort, cb ){
  options.nodemon.env.LIVE_RELOAD_PORT = livereloadPort
  browserSync({
    'timestamps': false,
    'scriptPath': function( path ){
      return options.nodemon.env.LIVE_RELOAD = "//"+reserve.IP+":"+livereloadPort+path
    },
    'minify': true,
    'injectChanges': true,
    'open': false,
    'online': false,
    'logConnections': false,
    'logFileChanges': false,
    'logSnippet': false,
    'logPrefix': "",
    'logLevel': "silent",
    'files': options.livereload.watch,
    'watchOptions': {
      debounceDelay: 1000
    },
    'notify': false,
    'port': livereloadPort,
    'proxy': {
      'host': reserve.IP,
      'port': serverPort
    }
  }, function( err ){
    if( err ){
      delete options.nodemon.env.LIVE_RELOAD
      log.error("Livereload failed to start")
    }
    else{
      log.info("livereload started", log.color.gray(options.nodemon.env.LIVE_RELOAD))
    }
    cb()
  })
  if( options.livereload.watch && options.livereload.watch.length ){
    //gaze(options.livereload.watch, function( err, watcher ){
    //  if( err ){
    //    log.error("File watching failed during livereload init")
    //    return
    //  }
    //  watcher.on('changed', function( filepath ){
    //    browserSync.reload(filepath)
    //  })
    //})
  }
}

function startNodeMon( options, serverPort ){
  var started = false
  options.nodemon.env.PORT = serverPort
  return nodemon(options.nodemon).on("start", function(){
    if( !started ){
      log.info("App has started", log.color.magenta(options.nodemon.script))
      started = true
    }
  }).on("quit", function(){
    log.info("App has quit")
    process.exit(0)
  }).on("restart", function( files ){
    files = files.map(function( file ){
      file = path.relative(process.cwd(), file)
      return log.color.magenta(file.replace(/\\/g, "/"))
    })
    if( files.length > 2 ){
      files = files.slice(0, 2)
      files.push(log.color.magenta("..."))
    }
    log.info("App restarted", files.join(", "))
  })
}
