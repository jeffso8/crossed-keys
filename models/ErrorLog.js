const mongoose = require("../database");

const ErrorLogSchema = new mongoose.Schema({
    foundErr: String, 
    time: String 
});

const ErrorLog = mongoose.model('Errors', ErrorLogSchema);
module.exports = ErrorLog;