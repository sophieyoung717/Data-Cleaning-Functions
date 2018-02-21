var validation = require('json-schema-validation');
function SchemaValidation(schema,data) {
    var FinalResult;
    validation(data, schema, function (err, result) {
        FinalResult = result;
    });
    return FinalResult;
}
module.exports.SchemaValidation = SchemaValidation;
