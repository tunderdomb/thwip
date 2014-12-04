var autoprefixer = require('autoprefixer-core')
var PostProcessor = require("../PostProcessor")
var inherits = require("util").inherits

module.exports = AutoPrefixer

var defaultOptions = {
  browsers: ["last 3 version"],
  cascade: false
}

function AutoPrefixer(  ){
  PostProcessor.call(this, defaultOptions)
}

inherits(AutoPrefixer, PostProcessor)

AutoPrefixer.prototype.render = function( contents ){
  var options = this.options()
  var browsers = options.browsers || ""
  if( typeof browsers == "string" ){
    browsers = browsers.split(/,\s*/)
  }
  var processor = autoprefixer({browsers: browsers, cascade: false})
  var prefixed = processor.process(contents)
  return prefixed.css
}