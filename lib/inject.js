var inject = require("connect-inject")

module.exports = function( app ){
  var liveReload = process.env.LIVE_RELOAD
  var weinreSrc = process.env.WEINRE
  var snippet = ""
   //inject weinre script to pages
  if( weinreSrc ){
    snippet += '<script async src="' + weinreSrc + '"></script>'
  }
   //inject browser-sync script to pages
  if( liveReload ){
    snippet += '<script async src="' + liveReload + '"></script>'
  }
  if( snippet ){
    app.use(inject({snippet: snippet}))
  }
}