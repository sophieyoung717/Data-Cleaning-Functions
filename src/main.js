var SchemaInference = require("./DataGuide.js");
var SI = new SchemaInference();
var data = require("../data/consumercomplaint.json");
var dataIter = data.entries();
var current = dataIter.next();
while (!current.done) {
    SI.iterate(current.value[1], 20);
    current = dataIter.next();
}
console.log(JSON.stringify(SI.terminate(), null, 4));
console.log("=======================SchemaInference");


var stat = require("./Statistics.js");
var DataGuide = require("./DataGuide.js");
var DG = new DataGuide();
var data = require("../data/Product.json");
var dataIter = data.entries();
var current = dataIter.next();

var statistics = {
    "addAnalysisForNumber": stat.addAnalysisForNumber, "updateAnalysisForNumber": stat.updateAnalysisForNumber,
    "addAnalysisForString": stat.addAnalysisForString, "updateAnalysisForString": stat.updateAnalysisForString,
    "addAnalysisForBoolean": stat.addAnalysisForBoolean, "updateAnalysisForBoolean": stat.updateAnalysisForBoolean,
    "addAnalysisForArray": stat.addAnalysisForArray
};
while (!current.done) {
    DG.iterate(current.value[1], 20, statistics);
    current = dataIter.next();
}
console.log(JSON.stringify(DG.terminate(), null, 4));
console.log("=======================DataGuide");


var DataGuide = require("./DataGuide.js");
var DG=new DataGuide();
var data = require("../data/consumercomplaint.json");
var dataIter=data.entries();
var current=dataIter.next();
while(!current.done) {
    DG.iterate(current.value[1], 20);
    current=dataIter.next();
}
var schema = DG.terminate();
var sd=require('./SchemaValidation.js');
var data2 = require("../data/consumercomplaint.json");
var dataIter2=data2.entries();
var current=dataIter2.next();
while(!current.done) {
    console.log(JSON.stringify(sd.SchemaValidation(schema,current.value[1]),null,4));
    current=dataIter2.next();
}
console.log("=======================SchemaValidation");



var DomainConstraintRepair = require('./DomainConstraintRepair.js');
var data = require("../data/Product13.json");
var dataIter=data.entries();
var result=DomainConstraintRepair(dataIter,[{"column": [5,6]}]);
var test=[];
var next = result.next();
while (!(next.done)) {
    test.push(next.value);
    next = result.next();
}
console.log(JSON.stringify(test,null,4));
console.log("=======================DomainConstraintRepair");


var SchemaInference = require("./SchemaInference.js");
var SI = new SchemaInference();
var data1 = require("../data/Rating1.json");
var dataIter1 = data1.entries();
var current1 = dataIter1.next();
while (!current1.done) {
    SI.iterate(current1.value[1]);
    current1 = dataIter1.next();
}
var schema1 = SI.terminate();

var SchemaInference = require("./SchemaInference.js");
var SI = new SchemaInference();
var data2 = require("../data/Rating2.json");
var dataIter2 = data2.entries();
var current2 = dataIter2.next();
while (!current2.done) {
    SI.iterate(current2.value[1]);
    current2 = dataIter2.next();
}
var schema2 = SI.terminate();


var rating2 = require("../data/Rating2.json");
var dataIter4 = rating2.entries();

var SchemaMatching = require("./SchemaMatching.js");
var result = SchemaMatching(schema1, schema2, dataIter4);
var test = [];
var next = result.next();
while (!(next.done)) {
    test.push(next.value);
    next = result.next();
}
console.log(JSON.stringify(test, null, 4));
console.log("=======================SchemaMatching");



// var DomainConstraintRepair = require('./DomainConstraintRepair.js');
// var data = require("../test/Files/Product13.json");
// var dataIter=data.entries();
// var dcrResult=DomainConstraintRepair(dataIter,[{"column": [5,6]}]);
//
// var BestGuess=require('./BestGuess.js');
// var result=BestGuess(dcrResult,[{"column": [5,6]}]);
// var test=[];
// console.log(result);
// var next = result.next();
// while (!(next.done)) {
// 	test.push(next.value);
// 	next = result.next();
// }
// console.log(JSON.stringify(test,null,4));
// console.log("=======================BestGuess");


// var DomainConstraintRepair = require('./DomainConstraintRepair.js');
// var data = require("../test/Files/Product13.json");
// var dataIter=data.entries();
// var dcrResult=DomainConstraintRepair(dataIter,[{"column": [5,6]}]);
//
// var WeightedAverage=require('./WeightedAverage.js');
// var result=WeightedAverage(dcrResult,[{"column": [5,6]}]);
// var test=[];
// var next = result.next();
// while (!(next.done)) {
//     test.push(next.value);
//     next = result.next();
// }
// console.log(JSON.stringify(test,null,4));
// console.log("=======================WeightedAverage");

