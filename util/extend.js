module.exports = function( obj, ext ){
  for( var prop in ext ){
    if( ext.hasOwnProperty(prop) ) {
      obj[prop] = ext[prop]
    }
  }
  return obj
}