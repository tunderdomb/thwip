var stylus = require("stylus")
var fs = require("fs")
var path = require("path")
var PreProcessor = require("../PreProcessor")
var inherits = require("util").inherits

var defaultOptions = {}

module.exports = StylusProcessor

function StylusProcessor( autoPrefixer ){
  PreProcessor.call(this, defaultOptions)
  this.autoPrefixer = autoPrefixer
}

StylusProcessor.create = function( autoPrefixer ){
  return PreProcessor.create(new StylusProcessor(autoPrefixer), function( options ){
    options.ext = options.ext || "css"
  })
}

inherits(StylusProcessor, PreProcessor)

StylusProcessor.prototype.postProcess = function( content ){
  return this.autoPrefixer.render(content)
}
StylusProcessor.prototype.preProcess = function render( file, options, cb ){
  fs.readFile(file, "utf-8", function( err, contents ){
    if( err ) return cb(err)
    file = path.resolve(process.cwd(), file)
    var renderer = stylus(contents)
    for( var prop in options ){
      if( options.hasOwnProperty(prop) ) {
        renderer.set(prop, options[prop])
      }
    }
    renderer
      .set('filename', file)
      .set('paths', [
        process.cwd(),
        // adding the file dir to the include paths
        // so relative imports will work
        path.dirname(file)
      ])
      .render(function( err, css ){
        if( err ) return cb(err)
        cb(null, css)
      })
  })
}