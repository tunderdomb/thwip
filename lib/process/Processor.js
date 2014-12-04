var extend = require("../../util/extend")

module.exports = Processor

function Processor(  ){
  this._options = {}
}
Processor.prototype.options = function( options, prop ){
  if( options == undefined ){
    return extend({}, this._options)
  }
  if( typeof options == "string" ){
    if( prop == undefined ){
      return this._options[options]
    }
    return this._options[options] = prop
  }
  for( var prop in options ){
    if( options.hasOwnProperty(prop) ){
      this._options[prop] = options[prop]
    }
  }
  return null
}