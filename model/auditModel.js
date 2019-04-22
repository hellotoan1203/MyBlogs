const database = require('../db');

var Schema = database.Schema;

var auditSchema = new Schema({
    action: String,
    ip: String,
    date: {type: Date, default: Date.now()}
})
var AuditModel =database.model('Audit', auditSchema,'AuditCollection');