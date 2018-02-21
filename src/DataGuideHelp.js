const _ = require('lodash');
var DataGuide = function (schema, data, enumLimit, statistics) {
    var types;
    var found;
    var arrObj;
    var newType;
    var addAnalysisForArray = (typeof statistics === 'undefined') ? undefined : statistics.addAnalysisForArray;
    var addAnalysisForNumber = (typeof statistics === 'undefined') ? undefined : statistics.addAnalysisForNumber;
    var updateAnalysisForNumber = (typeof statistics === 'undefined') ? undefined : statistics.updateAnalysisForNumber;
    var updateAnalysisForString = (typeof statistics === 'undefined') ? undefined : statistics.updateAnalysisForString;
    var addAnalysisForString = (typeof statistics === 'undefined') ? undefined : statistics.addAnalysisForString;
    var updateAnalysisForBoolean = (typeof statistics === 'undefined') ? undefined : statistics.updateAnalysisForBoolean;
    var addAnalysisForBoolean = (typeof statistics === 'undefined') ? undefined : statistics.addAnalysisForBoolean;

    //object
    if (_.isPlainObject(data)) {
        //if there already exists a type but not object, e.g. "test":2,  "test":{"test1": ["1","1","1",2],"test2":"test2"}
        if (!(_.isEmpty(schema)) && (schema.type !== 'object')) {
            if ('anyOf' in schema) {
                var isIn = false;
                for (var ind = 0; ind < schema.anyOf.length; ind++) {
                    if (schema.anyOf[ind].type === 'object') {
                        isIn = true;
                        newType = DataGuide(schema.anyOf[ind], data, enumLimit, statistics);
                    }
                }

                if (!isIn) {
                    newType = DataGuide({}, data, enumLimit, statistics);
                    schema.anyOf.push(newType);
                }
            } else if ('type' in schema) {
                arrObj = schema;
                schema = {};
                schema.anyOf = [];
                schema.anyOf.push(arrObj);
                newType = DataGuide({}, data, enumLimit, statistics);
                schema.anyOf.push(newType);
            }
        }
        //if the data is the first one from iterator, create schema or schema exists, check if it needs to be more general.
        else {
            schema.type = 'object';
            //check "required" constraint.
            if (!(_.isEmpty(schema)) && 'required' in schema) {
                var requiredProps = schema.required;
                var newRequiredProps = [];
                for (var k = 0; k < requiredProps.length; k++) {
                    if (requiredProps[k] in data) {
                        newRequiredProps.push(requiredProps[k]);
                    }
                }
                schema.required = newRequiredProps;
            }
            //no required constraint, create one.
            else {
                schema.required = _.keys(data);
            }
            //no properties constraint, create one.
            if (_.isEmpty(schema) || !('properties' in schema)) {
                var prop = {};
                for (var key in data) {
                    prop[key] = DataGuide({}, data[key], enumLimit, statistics);
                }

                schema.properties = prop;
            }

            //check properties constraint.
            else {
                var props = schema.properties;
                for (var dataKey in data) {
                    props[dataKey] = DataGuide((dataKey in props) ? props[dataKey] : {}, data[dataKey], enumLimit, statistics);
                }
            }
        }
    }
    //number
    else if (_.isNumber(data)) {
        //schema already has multiple types of value, check if number is in, if not add it.
        if ('anyOf' in schema) {
            types = schema.anyOf;
            found = false;
            for (var j = 0; j < types.length; j++) {
                if ('type' in types[j] && types[j].type === 'number') {
                    found = true;
                    if (updateAnalysisForNumber !== undefined) {
                        types[j] = updateAnalysisForNumber(data, types[j]);
                    }
                }
            }

            if (!found) {
                newType = {};
                newType.type = 'number';
                if (addAnalysisForNumber !== undefined) {
                    newType = addAnalysisForNumber(data, newType);
                }

                types.push(newType);
            }
        }
        //schema has one type, check if is the same , if not change to a anyOf constraint.
        else if ('type' in schema) {
            arrObj = schema;
            if (arrObj.type !== 'number') {
                schema = {};
                schema.anyOf = [];
                schema.anyOf.push(arrObj);
                //statistic analysis
                newType = {};
                newType.type = 'number';
                if (addAnalysisForNumber !== undefined) {
                    newType = addAnalysisForNumber(data, newType);
                }

                schema.anyOf.push(newType);
            } else {
                if (updateAnalysisForNumber !== undefined) {
                    schema = updateAnalysisForNumber(data, schema);
                }
            }
        }
        //else schema do not have type infor, add current one.
        else {
            schema.type = 'number';
            if (addAnalysisForNumber !== undefined) {
                schema = addAnalysisForNumber(data, schema);
            }
        }
    }
    //string
    //same idea as number
    else if (_.isString(data)) {
        if ('anyOf' in schema) {
            types = schema.anyOf;
            found = false;
            for (var j = 0; j < types.length; j++) {
                if ('type' in types[j] && types[j].type === 'string') {
                    found = true;
                    if (updateAnalysisForString !== undefined) {
                        types[j] = updateAnalysisForString(data, types[j], enumLimit);
                        types[j].STRING_COUNT++;
                    }
                }
            }

            if (!found) {
                newType = {};
                newType.type = 'string';
                if (addAnalysisForString !== undefined) {
                    newType = addAnalysisForString(data, newType);
                }

                schema.anyOf.push(newType);
            }
        } else if ('type' in schema) {
            arrObj = schema;
            if (arrObj.type !== 'string') {
                schema = {};
                schema.anyOf = [];
                schema.anyOf.push(arrObj);
                newType = {};
                newType.type = 'string';
                if (addAnalysisForString !== undefined) {
                    newType = addAnalysisForString(data, newType);
                }

                schema.anyOf.push(newType);
            } else {
                if (updateAnalysisForString !== undefined) {
                    schema = updateAnalysisForString(data, schema, enumLimit);
                    schema.STRING_COUNT++;
                }
            }
        } else {
            schema.type = 'string';
            if (addAnalysisForString !== undefined) {
                schema = addAnalysisForString(data, schema);
            }
        }
    }
    //boolean
    //same idea as number
    else if (_.isBoolean(data)) {
        if ('anyOf' in schema) {
            types = schema.anyOf;
            found = false;
            for (var j = 0; j < types.length; j++) {
                if ('type' in types[j] && types[j].type === 'boolean') {
                    found = true;
                    if (updateAnalysisForBoolean !== undefined) {
                        types[j] = updateAnalysisForBoolean(data, types[j]);
                    }
                }
            }

            if (!found) {
                newType = {};
                newType.type = 'boolean';
                if (addAnalysisForBoolean !== undefined) {
                    newType = addAnalysisForBoolean(data, newType);
                }

                types.push(newType);
            }
        } else if ('type' in schema) {
            arrObj = schema;
            if (arrObj.type !== 'boolean') {
                schema = {};
                schema.anyOf = [];
                schema.anyOf.push(arrObj);
                newType = {};
                newType.type = 'boolean';
                if (addAnalysisForBoolean !== undefined) {
                    newType = addAnalysisForBoolean(data, newType);
                }

                schema.anyOf.push(newType);
            } else {
                if (updateAnalysisForBoolean !== undefined) {
                    schema = updateAnalysisForBoolean(data, schema);
                }
            }
        } else {
            schema.type = 'boolean';
            if (addAnalysisForBoolean !== undefined) {
                schema = addAnalysisForBoolean(data, schema);
            }
        }
    }
    //null
    //same idea as number
    else if (_.isNull(data)) {
        if ('anyOf' in schema) {
            types = schema.anyOf;
            found = false;
            for (var j = 0; j < types.length; j++) {
                if ('type' in types[j] && types[j].type === 'null') {
                    found = true;
                    if (statistics !== undefined) {
                        types[j].NULL_COUNT += 1;
                    }
                }
            }

            if (!found) {
                newType = {};
                newType.type = 'null';
                if (statistics !== undefined) {
                    newType.NULL_COUNT = 1;
                }

                types.push(newType);
            }
        } else if ('type' in schema) {
            arrObj = schema;
            if (arrObj.type !== 'null') {
                schema = {};
                schema.anyOf = [];
                schema.anyOf.push(arrObj);

                newType = {};
                newType.type = 'null';
                if (statistics !== undefined) {
                    newType.NULL_COUNT = 1;
                }

                schema.anyOf.push(newType);
            } else {
                if (statistics !== undefined) {
                    schema.NULL_COUNT += 1;
                }
            }
        } else {
            schema.type = 'null';
            if (statistics !== undefined) {
                schema.NULL_COUNT = 1;
            }
        }
    }
    //array
    else if (_.isArray(data)) {
        //schema already has multiple types of value, check if array is in, if not add it.
        if ('anyOf' in schema) {
            types = schema.anyOf;
            found = false;
            for (var j = 0; j < types.length; j++) {
                if ('type' in types[j] && types[j].type === 'array') {
                    found = true;
                    if (addAnalysisForArray !== undefined) {
                        types[j].NUMBER_ARRAY += 1;
                    }
                }
            }

            if (!found) {
                arrObj = dataGuideForArray({}, data, enumLimit, statistics);
                types.push(arrObj);
            }
        }
        //schema has one type, check if is the same , if not change to a anyOf constraint.
        else if ('type' in schema) {
            var prevType = schema;
            if (prevType.type !== 'array') {
                schema = {};
                schema.anyOf = [];
                schema.anyOf.push(prevType);

                arrObj = dataGuideForArray({}, data, enumLimit, statistics);
                schema.anyOf.push(arrObj);
            } else {
                if (addAnalysisForArray !== undefined) {
                    schema.NUMBER_ARRAY += 1;
                }
            }
        }
        //else schema do not have type infor, add current one.
        else {
            schema = dataGuideForArray(schema, data, enumLimit, statistics);
        }
    }

    return schema;
};

function dataGuideForArray(schema, data, enumLimit, statistics) {
    var addAnalysisForArray = (typeof statistics === 'undefined') ? undefined : statistics.addAnalysisForArray;
    var arrObj = {};
    var mySet = new Set();
    arrObj.type = 'array';
    arrObj.items = {};
    //multiple types of value use array [] to represent them.
    // e.g. "discount": [1,"2",null,4]=> "type":"array", "items": {"type":["number","string","null"]}
    for (var i = 0; i < data.length; i++) {
        schema = DataGuide(schema, data[i], enumLimit, statistics);
        // if (addAnalysisForArray !== undefined) {
        //     arrObj = addAnalysisForArray(data, schema, arrObj);
        // }
    }
    arrObj.items = schema;
    mySet.add((schema.type == "undefined") ? schema.anyOf : schema.type);
    if (addAnalysisForArray != "undefined") {
        arrObj.NUMBER_ARRAY = 1;
    }
    var array = Array.from(mySet);
    if (array.length === 1) {
        arrObj.items.type = array[0];
    } else {
        arrObj.items.type = array;
    }
    return arrObj;
}

module.exports = {
    DataGuide: DataGuide
};
