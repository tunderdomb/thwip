var inject = require("connect-inject")

module.exports = function(  ){
  var liveReload = process.env.LIVE_RELOAD
  var weinreSrc = process.env.WEINRE

  if( !liveReload && !weinreSrc ){
    return function( req, res, next ){next()}
  }

  var snippet = ""
   //inject weinre script to pages
  if( weinreSrc ){
    snippet += '<script async src="' + weinreSrc + '"></script>'
  }
   //inject browser-sync script to pages
  if( liveReload ){
    snippet += '<script async src="' + liveReload + '"></script>'
  }

  var injector = inject({snippet: snippet})

  return function( req, res, next ){
    injector.apply(this, arguments)
  }
}