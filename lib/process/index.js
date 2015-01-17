//var path = require("path")
var log = require("../../util/log")
var async = require("async")
var processors = module.exports

//processors.browserify = createProcessor(browserifyProcessor)
var AutoPrefixer
var autoPrefixer

//processors.autoprefixer = function( options ){
//  autoPrefixer.options(options)
//}
//processors.less = require("./pre/less").create(autoPrefixer)
//processors.stylus = require("./pre/stylus").create(autoPrefixer)
processors.start = function(  ){
  var processorArray = []
  if( lessProcessor ) processorArray.push(processors.less)
  if( stylusProcessor ) processorArray.push(processors.stylus)
  if( browserifyProcessor ) processorArray.push(processors.browserify)
  async.each(processorArray, function( processor, next ){
    processor.start(next)
  }, function(  ){
    log.info("Processors ready")
  })
}

var autoPrefixerProcessor
Object.defineProperty(processors, "autoprefixer", {
  get: function(  ){
    //if( !AutoPrefixer ) {
    //  log("Initialize autiprefixer")
    //}
    AutoPrefixer = AutoPrefixer || require("./post/autoprefixer")
    autoPrefixer = autoPrefixer || new AutoPrefixer()
    autoPrefixerProcessor = autoPrefixerProcessor || function( options ){
      autoPrefixer.options(options)
    }
    return autoPrefixerProcessor
  }
})

var lessProcessor
Object.defineProperty(processors, "less", {
  get: function(  ){
    //if( !lessProcessor ) {
    //  log("Initialize less")
    //}
    processors.autoprefixer;
    lessProcessor = lessProcessor || require("./pre/less").create(autoPrefixer)
    return lessProcessor
  }
})

var stylusProcessor
Object.defineProperty(processors, "stylus", {
  get: function(  ){
    //if( !stylusProcessor ) {
    //  console.log("Initialize stylus")
    //}
    processors.autoprefixer;
    stylusProcessor = stylusProcessor || require("./pre/stylus").create(autoPrefixer)
    return stylusProcessor
  }
})

var browserifyProcessor
Object.defineProperty(processors, "browserify", {
  get: function(  ){
    browserifyProcessor = browserifyProcessor || require("./pre/browserify").create()
    return browserifyProcessor
  }
})