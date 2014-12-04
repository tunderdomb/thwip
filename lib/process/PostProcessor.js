var inherits = require("util").inherits
var Processor = require("./Processor")

module.exports = PostProcessor

function PostProcessor( defaultOptions ){
  this._options = defaultOptions
}

inherits(PostProcessor, Processor)

PostProcessor.prototype.render = function( content ){}