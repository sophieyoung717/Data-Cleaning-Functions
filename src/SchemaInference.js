var SchemaInference = require("./DataGuideHelp.js");
function SI() {
    this.schema = {};
}

SI.prototype.iterate = function (value) {
    this.schema = new SchemaInference.DataGuide(this.schema, value);
}

SI.prototype.terminate = function (flags) {
    this.schema.$schema = "http://json-schema.org/draft-04/schema#";
    return this.schema;
}

SI.prototype.merge = function (other) {
    this.iterate(other);
}


module.exports = SI;
