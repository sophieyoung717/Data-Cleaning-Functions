var bayes = require('node-bayes');
//This function is to help move exchange items in array.
Array.prototype.move = function (old_index, new_index) {
    var arrayClone = this.slice();
    arrayClone.splice(new_index, 0, arrayClone.splice(old_index, 1)[0]);
    return arrayClone;
};

module.exports = function * (dataIter,keys) {
    //dataIter is the iterator of the input JSON instance. keys is the set of columns where null values exist.
    var rows = [];
    var key;
    var i;
    //read in JSON format training data.
    var current = dataIter.next();
    while (!current.done) {
        rows.push(current.value[1]);
        current = dataIter.next();
    }

    var TRAINING_DATA = [];
    var TRAINING_COLUMNS = [];

    for (key in rows[0]) {
        TRAINING_COLUMNS.push(key);//get training column names.
    }
    var lastColumnIndex = TRAINING_COLUMNS.length - 1;
    for (i = 0; i < rows.length; i++) {//change JSON format to training data format.
        var sample = [];
        for (key in rows[i]) {
            if (rows[i].hasOwnProperty(key)) {
                if (rows[i][key] === null) {//only use data does not contain null as training data.
                    sample = [];
                    break;
                } else {
                    sample.push(rows[i][key]);
                }
            }
        }
        if (sample.length !== 0) {
            TRAINING_DATA.push(sample);
        }
    }
    //train a set of classifiers for each column in columns.
    var classifiers = {};
    for (i = 0; i < keys[0].column.length; i++) {
        var col = keys[0].column[i];//classifier on col column,
        // move col to last column
        var TRAINING_DATA_moved = [];
        var TRAINING_COLUMNS_moved = [];
        if (col === lastColumnIndex) {
            TRAINING_DATA_moved = TRAINING_DATA;
            TRAINING_COLUMNS_moved = TRAINING_COLUMNS;
        }
        //temporarily move col to last column, this is a bug in node-bayes  package.
        else {
            for (var j = 0; j < TRAINING_DATA.length; j++) {
                TRAINING_DATA_moved.push(TRAINING_DATA[j].move(col, lastColumnIndex));
            }
            TRAINING_COLUMNS_moved = TRAINING_COLUMNS.move(col, lastColumnIndex);
        }
        //train the classifier
        var cls = new bayes.NaiveBayes({
            columns: TRAINING_COLUMNS_moved,
            data: TRAINING_DATA_moved,
            verbose: true
        });
        cls.train();
        classifiers[col] = cls;
    }
    //construct output result.
    for (i = 0; i < rows.length; i++) {
        var result = rows[i];
        for (var c = 0; c < keys[0].column.length; c++) {//iterate columns should be cleaned if null
            var ind = keys[0].column[c];
            key = TRAINING_COLUMNS[ind];
            if (rows[i][key] === null) {
                var predict = [];//construct predict values.
                for (var k in rows[i]) {
                    if (Array.isArray(rows[i][k]) && "SYS_Prob" in rows[i][k][0]) {
                        predict.push(null);
                    } else {
                        predict.push(rows[i][k]);
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
        //answer.push(result);
        yield result;
    }
    //return answer;
}
