var BestGuess = function * (dataIter,keys) {
    var current = dataIter.next();
    while (!current.done) {
        var data = current.value[1];
        for (var j = 0; j < keys[0].column.length; j++) {
            var index = keys[0].column[j];
            var tarKey = Object.keys(data)[index];
            if (typeof data[tarKey] === "object" && 'SYS_Value' in data[tarKey][0]) {
                var max = 0;
                var maxValue = null;
                for (var k = 0; k < data[tarKey].length; k++) {
                    if (data[tarKey][k].SYS_Prob > max) {
                        max = data[tarKey][k].SYS_Prob;
                        maxValue = data[tarKey][k].SYS_Value;
                    }
                }
                data[tarKey] = maxValue;
            }
        }
        yield data;
        current = dataIter.next();
    }
}

module.exports = BestGuess;
