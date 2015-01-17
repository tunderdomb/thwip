var express = require("express")
var app = express()

if( process.env.LIVE_RELOAD_PORT || process.env.WEINRE_PORT ){
  var thwip = require("thwip")
  app.use(thwip.inject())
}

app.listen(process.env.PORT)