var bayes = require('node-bayes');

module.exports = function (current,keys,classifiers) {
    //dataIter is the iterator of the input JSON instance. keys is the set of columns where null values exist.
    var key;
    var tmpKey;
    var TRAINING_COLUMNS = [];
    for (tmpKey in current) {
        TRAINING_COLUMNS.push(tmpKey);//get training column names.
    }
    var result = current;
    for (var c = 0; c < keys[0].column.length; c++) {//iterate columns should be cleaned if null
        var ind = keys[0].column[c];
        key = TRAINING_COLUMNS[ind];
        if (result[key] === null) {
            var predict = [];//construct predict values.
            for (var k in result) {
                if (Array.isArray(result[k]) && "SYS_Prob" in result[k][0]) {
                    predict.push(null);
                } else {
                    predict.push(result[k]);
                }
            }
            predict.splice(ind, 1);
            var t1 = classifiers[ind];//classifier
            var t2 = predict;//predict values
            var unNormalized = t1.predict(t2);//predict result
            delete unNormalized.answer;
            for (var j in unNormalized) {
                if (isNaN(unNormalized[j])) {
                    unNormalized[j] = 0;
                }//repalce NaN value to 0
            }
            //normalize
            var sum = 0;
            for (var k in unNormalized) {
                sum += unNormalized[k];
            }
            var normalized = [];
            for (var k in unNormalized) {
                //normalized[k]=unNormalized[k]/sum;
                var obj = {};
                obj.SYS_Value = (!isNaN(k)) ? +k : k;
                obj.SYS_Prob = unNormalized[k] / sum;
                normalized.push(obj);
            }
            result[key] = normalized;
        }
    }
    return result;
}
