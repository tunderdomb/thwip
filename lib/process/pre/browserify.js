var browserify = require("browserify")
var path = require("path")
var PreProcessor = require("../PreProcessor")
var inherits = require("util").inherits

var defaultOptions = {}

module.exports = BrowserifyProcessor

function BrowserifyProcessor(  ){
  PreProcessor.call(this, defaultOptions)
}

BrowserifyProcessor.create = function(  ){
  return PreProcessor.create(new BrowserifyProcessor(), function( options ){
    options.ext = options.ext || "js"
  })
}

inherits(BrowserifyProcessor, PreProcessor)

BrowserifyProcessor.prototype.postProcess = function( content ){
  return content
}
BrowserifyProcessor.prototype.preProcess = function render( file, options, cb ){
  // browserify calls the callback with each error it finds
  var callbackCalled = false
  try{
    var b = browserify(options)
    b.add(path.resolve(file))
    b.bundle(function( err, src ){
      if( callbackCalled ) return
      callbackCalled = true
      if( err ){
        cb(err)
        return
      }
      src = src.toString()
      cb(err, src)
    })
  }
  catch( e ){
    if( callbackCalled ) return
    callbackCalled = false
    cb(e)
  }
}
