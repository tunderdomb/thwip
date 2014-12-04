module.exports = function( options ){
  options.nodemon.script = "app/index.js"
  //options.livereload = false
  options.livereload.watch.push("static/css/*.css")
}

module.exports.process = function( process ){
  process.css({
    browsers: "last 3 version",
    options: {},
    root: "style/",
    src: "style/*.styl",
    dest: "static/css",
    watch: "style/**/*.styl"
  })
  process.browserify({
    browserify: {},
    root: "",
    src: "",
    dest: "",
    watch: []
  })
}