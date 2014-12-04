var less = require("less")
var fs = require("fs")
var path = require("path")
var PreProcessor = require("../PreProcessor")
var inherits = require("util").inherits

var defaultOptions = {}

module.exports = LessProcessor

function LessProcessor( autoPrefixer ){
  PreProcessor.call(this, defaultOptions)
  this.autoPrefixer = autoPrefixer
}

LessProcessor.create = function( autoPrefixer ){
  return PreProcessor.create(new LessProcessor(autoPrefixer), function( options ){
    options.ext = options.ext || "css"
  })
}

inherits(LessProcessor, PreProcessor)

LessProcessor.prototype.postProcess = function( content ){
  return this.autoPrefixer.render(content)
}
LessProcessor.prototype.preProcess = function render( file, options, cb ){
  fs.readFile(file, "utf-8", function( err, contents ){
    if( err ) return cb(err)
    new less.Parser({
      paths: [
        process.cwd(),
        // adding the file dir to the include paths
        // so relative imports will work
        path.dirname(file)
      ]
    }).parse(contents, function( err, tree ){
        if( err ) return cb(err)
        var css = null
        try{
          css = tree.toCSS(options)
        }
        catch( e ){
          return cb(e)
        }
        cb(null, css)
      })
  })
}
