var transactionRoutes = require("./transaction");
var publicRoutes = require("./public");
var reportRoutes = require("./report");

export default [].concat(transactionRoutes,publicRoutes,reportRoutes);