/* Copyright (c) 2016, Oracle and/or its affiliates. All rights reserved. */
var jsf = require('json-schema-faker');
var fs = require('fs');
var util = require('util');
const f1 = "../performance/Product100.json";
const f2 = "./test/Files/Rating1.json";
const f3 = "./test/Files/Rating2.json";
const f4 = "../data/moreProduct.json";

function Schema(items) {
    var result = {
        "id": "http://some.site.somewhere/entry-schema#",
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "array",
        "minItems": items, "maxItems": items,
        "items": {
            "properties": {
                "id": {
                    "type": "string",
                    "pattern": "pid[0-9]{3}"
                },
                "brand": {
                    "type": "string",
                    "enum": ['Apple', 'Samsung', 'Sony']
                },
                "name": {
                    "type": "string"

                    //"$ref": "#/items/properties/brand"  only this format works.
                },
                "category": {
                    "type": "string",
                    "enum": ['laptop', 'phone', 'TV']
                },
                "price": {
                    "type": "integer",
                    "minimum": 300,
                    "maximum": 3000
                },
                "amount": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 100
                },
                "discount": {
                    "type": "integer",
                    "enum": [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
                }
            },
            "required": ["id", "name", "brand", "category", "price", "amount", "discount"]
        }
    };
    return result;
}


/*var schema = {
    "id": "http://some.site.somewhere/entry-schema#",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "array",
    "minItems": 515000,
    "maxItems": 515000,
    "items": {
        "properties": {
            "id": {"type": "string",
                "pattern": "pid[0-9]{3}"},
            "brand": {
                "type": "string",
                "enum": ['Apple', 'Samsung', 'Sony']
            },
            "name": {
                "type": "string",

                //"$ref": "#/items/properties/brand"  only this format works.
            },
            "category": {
                "type": "string",
                "enum": ['laptop', 'phone', 'TV']
            },
            "price": {
                "type": "integer",
                "minimum": 300,
                "maximum": 3000
            },
            "amount": {
                "type": "integer",
                "minimum": 0,
                "maximum": 100
            },
            "discount": {
                "type": "integer",
                "enum": [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
            }
        },
        "required": ["id", "name", "brand", "category", "price", "amount", "discount"]
    }
};*/
var base = 515000;
var pathBase = "../performance/Product";
for (var i = 3; i <= 3; i++) {
    var sample = jsf(Schema(base * i));
    var data = "";
    for (var j = 1; j <= i; j++) {
        var partSample = sample.slice(base * (j - 1), base * j + 1);
        data += JSON.stringify(partSample, null, 4);
    }
    fs.writeFile(pathBase + (100 * i) + ".json", data, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("JSON saved to " + pathBase + (100 * i) + ".json");
        }
    });
}

// var schema = {
//     "id": "http://some.site.somewhere/entry-schema#",
//     "$schema": "http://json-schema.org/draft-04/schema#",
//     "type": "array",
//     "minItems": 7,
//     "maxItems": 7,
//     "items": {
//         "properties": {
//             "id": {"type": "string",
//                 "pattern": "pid[0-9]{3}"},
//             "rating": {
//                 "type": "integer",
//                 "minimum": 0,
//                 "maximum": 5
//             },
//             "rating_num": {
//                 "minimum": 0,
//                 "maximum": 300
//             }
//         },
//         "required": ["id", "rating", "rating_num"]
//     }
// };
// var sample = jsf(schema);
// fs.writeFile(f2, JSON.stringify(sample, null, 4), function (err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("JSON saved to " + f2);
//     }
// });
//
// var schema = {
//     "id": "http://some.site.somewhere/entry-schema#",
//     "$schema": "http://json-schema.org/draft-04/schema#",
//     "type": "array",
//     "minItems": 8,
//     "maxItems": 8,
//     "items": {
//         "properties": {
//             "id": {"type": "string",
//                 "pattern": "pid[0-9]{3}"},
//             "rate": {
//                 "type": "integer",
//                 "minimum": 0,
//                 "maximum": 5
//             },
//             "num_rate": {
//                 "minimum": 0,
//                 "maximum": 300
//             }
//         },
//         "required": ["id", "rate", "num_rate"]
//     }
// };
// var sample = jsf(schema);
// fs.writeFile(f3, JSON.stringify(sample, null, 4), function (err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("JSON saved to " + f3);
//     }
// });
//
// var schema = {
//     "id": "http://some.site.somewhere/entry-schema#",
//     "$schema": "http://json-schema.org/draft-04/schema#",
//     "type": "array",
//     "minItems": 4,
//     "maxItems": 4,
//     "items": {
//         "properties": {
//             "id": {"type": "string",
//                 "pattern": "pid[0-9]{3}"},
//             "brand": {
//                 "type": "string",
//                 "enum": ['Apple', 'Samsung', 'Sony']
//             },
//             "name": {
//                 "type": "string",
//
//                 //"$ref": "#/items/properties/brand"  only this format works.
//             },
//             "cate": {
//                 "type": "string",
//                 "enum": ['laptop', 'phone', 'TV']
//             },
//             "price": {
//                 "type": "integer",
//                 "minimum": 300,
//                 "maximum": 3000
//             },
//             "amount": {
//                 "type": "integer",
//                 "minimum": 0,
//                 "maximum": 100
//             },
//             "discount": {
//                 "type": "integer",
//                 "enum": [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
//             }
//         },
//         "required": ["id", "name", "brand", "cate", "price", "amount", "discount"]
//     }
// };
//
// var sample = jsf(schema);
// fs.writeFile(f4,JSON.stringify(sample,null,4),function(err){
//     if(err){
//         console.log(err);
//     }
//     else{console.log("JSON saved to "+f4);}
// });
