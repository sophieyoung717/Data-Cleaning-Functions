function addAnalysisForArray(data, typeI, schema) {
    if (typeI.type === "number") {
        if ("NUMBER_COUNT" in schema.items) {
            schema.items.NUMBER_COUNT += 1;
        } else {
            schema.items.NUMBER_COUNT = 1;
        }
    } else if (typeI.type === "string") {
        if ("STRING_COUNT" in schema.items) {
            schema.items.STRING_COUNT += 1;
        } else {
            schema.items.STRING_COUNT = 1;
        }
    } else if (typeI.type === "null") {
        if ("NULL_COUNT" in schema.items) {
            schema.items.NULL_COUNT += 1;
        } else {
            schema.items.NULL_COUNT = 1;
        }
    } else if (typeI.type === "boolean") {
        if ("BOOLEAN_COUNT" in schema.items) {
            schema.items.BOOLEAN_COUNT += 1;
        } else {
            schema.items.BOOLEAN_COUNT = 1;
        }
    }else if (typeI.type === "object") {
        if ("OBJECT_COUNT" in schema.items) {
            schema.items.OBJECT_COUNT += 1;
        } else {
            schema.items.OBJECT_COUNT = 1;
        }
    }
    return schema;
}

function addAnalysisForNumber(data,newType) {
    newType.MIN_VALUE = data;
    newType.MAX_VALUE = data;
    newType.SUM = data;
    newType.NUMBER_COUNT = 1;
    return newType;
}

function updateAnalysisForNumber(data,schema) {
    //statistic analysis
    if (data < schema.MIN_VALUE) {
        schema.MIN_VALUE = data;
    }
    if (data > schema.MAX_VALUE) {
        schema.MAX_VALUE = data;
    }
    schema.SUM += data;
    schema.NUMBER_COUNT++;

    return schema;
}

function addAnalysisForString(data,newType) {
    newType.STRING_CATEGORIES = {};
    newType.STRING_CATEGORIES[data] = 1;
    newType.STRING_COUNT = 1;
    return newType;
}

function updateAnalysisForString(data,schema,enum_limit) {
    var StringMessages = "More Than User-Defined Number(" + enum_limit.enumLimit + ") of Categories";
    if (schema.STRING_CATEGORIES !== StringMessages) {
        if (data in schema.STRING_CATEGORIES) {
            schema.STRING_CATEGORIES[data] += 1;
        } else {
            schema.STRING_CATEGORIES[data] = 1;
            var len = Object.keys(schema.STRING_CATEGORIES).length;
            if (len > enum_limit.enumLimit) {
                schema.STRING_CATEGORIES = StringMessages;
            }
        }
    }
    return schema;
}

function addAnalysisForBoolean(data,newType) {
    //statistic analysis
    if (data) {
        newType.NUM_TRUE = 1;
        newType.NUM_FALSE = 0;
    } else {
        newType.NUM_TRUE = 0;
        newType.NUM_FALSE = 1;
    }
    newType.BOOLEAN_COUNT = 1;
    return newType;
}

function updateAnalysisForBoolean(data,schema) {
    if (data) {
        schema.NUM_TRUE += 1;
    } else {
        schema.NUM_FALSE += 1;
    }
    schema.BOOLEAN_COUNT++;
    return schema;
}


module.exports.addAnalysisForNumber = addAnalysisForNumber;
module.exports.updateAnalysisForNumber = updateAnalysisForNumber;
module.exports.addAnalysisForString = addAnalysisForString;
module.exports.updateAnalysisForString = updateAnalysisForString;
module.exports.addAnalysisForBoolean = addAnalysisForBoolean;
module.exports.updateAnalysisForBoolean = updateAnalysisForBoolean;
module.exports.addAnalysisForArray = addAnalysisForArray;
