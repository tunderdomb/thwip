//var path = require("path")

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
  if( lessProcessor ) processors.less.start()
  if( stylusProcessor ) processors.stylus.start()
}

var autoPrefixerProcessor
Object.defineProperty(processors, "autoprefixer", {
  get: function(  ){
    if( !AutoPrefixer ) {
      console.log("Initialize autiprefixer")
    }
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
    if( !lessProcessor ) {
      console.log("Initialize less")
    }
    processors.autoprefixer;
    lessProcessor = lessProcessor || require("./pre/less").create(autoPrefixer)
    return lessProcessor
  }
})

var stylusProcessor
Object.defineProperty(processors, "stylus", {
  get: function(  ){
    if( !stylusProcessor ) {
      console.log("Initialize stylus")
    }
    processors.autoprefixer;
    stylusProcessor = stylusProcessor || require("./pre/stylus").create(autoPrefixer)
    return stylusProcessor
  }
})