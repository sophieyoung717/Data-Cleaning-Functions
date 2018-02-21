var DataGuide = require("./DataGuideHelp.js");
function DG() {
    this.schema = {};
}

DG.prototype.iterate = function (value, enumLimit, statistics) {
    this.schema = new DataGuide.DataGuide(this.schema, value, enumLimit, statistics);
};

DG.prototype.terminate = function (flags) {
    return this.schema;
};

DG.prototype.merge = function (other) {
    this.iterate(other);
};

module.exports = DG;
