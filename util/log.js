var chalk = require("chalk")

module.exports = log
log.color = chalk
log.timeStamp = true

function log(  ){
  console.log.apply(console, args("log", arguments))
}
log.warn = function(  ){
  console.log.apply(console, args("warn", arguments))
}
log.error = function(  ){
  console.log.apply(console, args("error", arguments))
}
log.info = function(  ){
  console.log.apply(console, args("info", arguments))
}

function args( level, args ){
  args = [].slice.call(args)
  var msg = []
  switch( level ){
    case "error":
      msg.push(chalk.red("Thwip!"))
      break
    case "warn":
      msg.push(chalk.yellow("Thwip!"))
      break
    case "info":
      msg.push(chalk.cyan("Thwip!"))
      break
    case "log":
    default:
      msg.push(chalk.blue("Thwip!"))
  }
  if( log.timeStamp ){
    msg.push(getTime())
  }
  return msg.concat(args)
}

function getTime(  ){
  var time = new Date(Date.now())
  var seconds = time.getSeconds()
  seconds = seconds < 10 ? "0"+seconds : seconds
  time = time.getHours()+":"+seconds
  return chalk.gray(time)
}