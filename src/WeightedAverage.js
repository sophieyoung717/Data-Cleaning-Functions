var WeightedAverage = function * (dataIter,keys) {
    var current = dataIter.next();
    while (!current.done) {
        var data = current.value[1];
        for (var j = 0; j < keys[0].column.length; j++) {
            var index = keys[0].column[j];
            var tarKey = Object.keys(data)[index];
            if (typeof data[tarKey] === "object" && 'SYS_Value' in data[tarKey][0]) {
                var avg = 0;
                for (var k = 0; k < data[tarKey].length; k++) {
                    var v = data[tarKey][k].SYS_Value;
                    var p = data[tarKey][k].SYS_Prob;
                    avg = avg + v * p;
                }
                data[tarKey] = Math.round(avg);
            }
        }
        yield data;
        current = dataIter.next();
    }
}

module.exports = WeightedAverage;
