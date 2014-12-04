var inherits = require("util").inherits
var Processor = require("./Processor")
var path = require("path")
var log = require("../../util/log")
var fs = require("fs")
var mkdirp = require("mkdirp")
var async = require("async")
var glob = require("glob")
var gaze = require('gaze')

module.exports = PreProcessor

function PreProcessor( defaultOptions ){
  this._options = defaultOptions
  this.tasks = []
}

inherits(PreProcessor, Processor)

PreProcessor.create = function( processor, setDefaults ){
  function addTask( options ){
    setDefaults && setDefaults(options)
    processor.addTask(options.root, options.src, options.dest, options.ext, options.watch)
  }
  addTask.options = function( options ){
    processor.options(options)
  }
  addTask.start = function( options ){
    processor.start(options)
  }
  return addTask
}

PreProcessor.prototype.preProcess = null

PreProcessor.prototype.postProcess = null

PreProcessor.prototype.addTask = function( root, src, dest, ext, watch ){
  this.tasks.push(new ProcessorTask(root, src, dest, ext, watch))
}

PreProcessor.prototype.start = function(  ){
  var processor = this
  //var preProcess = this.preProcess
  //var postProcess = this._post ? this.postProcess : null
  this.tasks.forEach(function( task ){
    var rendering = false
    function finish(  ){
      // re-allow rendering when everything is finished
      rendering = false
    }
    gaze(task.watch||task.src, function( err, watcher ){
      if( err ){
        log.error("File watcher failed for preprocessing", err)
        return
      }
      watcher.on('added', function( filePath ){
        log.info("added", log.color.magenta(filePath))
        watcher.add(filePath)
      })
      watcher.on('changed', function( filePath ){
        log.info("changed", log.color.magenta(filePath))
        if( rendering ) {
          console.log("busy")
          return
        }
        rendering = true
        // TODO: trigger rendering only if file hasn't changed (stat cache)
        if( task.watch ){
          // when multiple files would trigger rendering
          // this prevents the glob to run more than once
          glob(task.src, function( err, files ){
            if( err ) {
              return log.error("Glob matching failed", err)
            }
            async.each(files, function( filePath, next ){
              task.render(processor, filePath, next)
            }, finish)
          })
        }
        else {
          task.render(processor, filePath, finish)
        }
      })
    })
  })
}


function ProcessorTask( root, src, dest, ext, watch ){
  this.root = (root ? path.resolve(root) : process.cwd()).replace(/\\/g, "/")
  this.src = src
  this.dest = dest
  this.ext = ext
  this.watch = null
  if( watch ){
    if( !Array.isArray(watch) ) watch = [watch]
    this.watch = watch.map(function( pattern ){
      if( !pattern ) log.warn("Watch condition is missing pattern")
      return path.resolve(pattern)
    })
  }
}

ProcessorTask.prototype.render = function( processor, filePath, done ){
  var task = this
  processor.preProcess(filePath, processor.options(), function( err, contents ){
    if( err ) {
      log.error("Error during preprocessing '"+filePath+"'", err)
      // that didn't go well, but at least call back so rendering won't halt
      return done()
    }
    if( processor.postProcess ){
      try{
        contents = processor.postProcess(contents)
      }
      catch( e ){
        // post processing is sync so don't let it make the rendering queue stuck
        log.error("Error during postprocessing '"+filePath+"'", e)
        return done()
      }
    }
    task.writeDest(filePath, contents, done)
  })
}

ProcessorTask.prototype.writeDest = function( src, content, cb ){
  var root = this.root
  var ext = "."+(this.ext || path.extname(src)).replace(/^\./, "")
  var file = path.resolve(src).replace(/\\/g, "/").replace(root, "")
  file = path.join(this.dest, file)
  file = path.join(path.dirname(file), path.basename(file, path.extname(file)))+ext
  var dest = path.resolve(file)
  mkdirp(path.dirname(dest), function (err) {
    if( err ) return cb(err)
    fs.writeFile(dest, content, cb)
  })
}
