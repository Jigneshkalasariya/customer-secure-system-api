const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.customers = require("./customer.model.js")(mongoose);
db.customer_reports = require("./customer-report.model.js")(mongoose);

module.exports = db;