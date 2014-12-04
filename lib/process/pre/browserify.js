var browserify = require("browserify")
var path = require("path")
var PreProcessor = require("../PreProcessor")
var inherits = require("util").inherits

var defaultOptions = {}

module.exports = BrowserifyProcessor

function BrowserifyProcessor( uglify ){
  PreProcessor.call(this, defaultOptions)
  this.uglify = uglify
}

BrowserifyProcessor.create = function( autoPrefixer ){
  return PreProcessor.create(new BrowserifyProcessor(autoPrefixer), function( options ){
    options.ext = options.ext || "css"
  })
}

inherits(BrowserifyProcessor, PreProcessor)

BrowserifyProcessor.prototype.postProcess = function( content ){
  if( !this._options.uglify ) {
    return content
  }
  return this.uglify.render(content)
}
BrowserifyProcessor.prototype.preProcess = function render( file, options, cb ){
  try{
    var b = browserify(options)
    b.add(path.resolve(file))
    b.bundle(function( err, src ){
      src = src.toString()
      cb(err, src)
    })
  }
  catch( e ){
    cb(e)
  }
}
