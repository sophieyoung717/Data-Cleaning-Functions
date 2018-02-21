var stringSimilarity = require('string-similarity');
var SchemaMatching = function * (schema1,schema2,dataIter) {//match type and schema-level similarity
    var sourceSM = schema1.required;
    var targetSM = schema2.required;
    var matches = {};
    //calculate match plans
    for (var i = 0; i < targetSM.length; i++) {
        var v = targetSM[i];
        var candidate = [];
        for (var j = 0; j < sourceSM.length; j++) {
            var w = sourceSM[j];
            var tarType = schema2.properties[v].type;
            var canType = schema1.properties[w].type;
            if (canType === tarType) {
                candidate.push(w);
            }
        }
        matches[v] = stringSimilarity.findBestMatch(v, candidate);
    }
    //add match plan to source data
    var current = dataIter.next();
    while (!current.done) {
        var source = current.value[1];
        var data = {};
        var condition = {};
        for (var key in matches) {
            var arr = matches[key].ratings;
            if (arr.length > 1) {
                var cons = [];
                for (var j = 0; j < arr.length; j++) {
                    var target = arr[j].target;
                    var rating = arr[j].rating;
                    var tmp = {};
                    tmp.SYS_Match = target;
                    tmp.value = source[key];
                    tmp.prob = rating;
                    cons.push(tmp);
                }
                condition[key] = cons;
            }
        }
        for (var k in source) {
            if (matches[k].ratings.length === 1 && matches[k].ratings[0].rating === 1) {
                data[k] = source[k];
            } else {
                data[k] = condition[k];
            }
        }
        yield data;
        current = dataIter.next();
    }
}

module.exports = SchemaMatching;
