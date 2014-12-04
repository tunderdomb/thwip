var express = require("express")
var app = express()

if( process.env.LIVE_RELOAD_PORT || process.env.WEINRE_PORT ){
  var thwip = require("thwip")
  thwip.inject(app, {
    livereload: process.env.LIVE_RELOAD_PORT,
    weinre: process.env.WEINRE_PORT
  })
}

app.listen(process.env.PORT)