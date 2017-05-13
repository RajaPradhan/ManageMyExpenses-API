var mongoose = require('mongoose'),
    Expenses = mongoose.model('Expenses'),
    q = require('q'),
    _ = require('lodash');

var getTotalExpensesForAllMonths = function(userId) {
  var deferred = q.defer();
  Expenses.aggregate([
    {$match: {_id: mongoose.Types.ObjectId(userId)}},
    {$unwind: "$expenses"},
    {$unwind: "$expenses.expenditure"},
    {$group: {_id: "$expenses.month", total: {$sum: "$expenses.expenditure.amount"}}}
  ], function(err, result) {
    if(err) {
      deferred.reject({"status": 500, "jsonResult": {"result": err}});
    } else if(!result) {
      deferred.reject({"status": 404, "jsonResult": {"result": "Could not find the expenses"}});
    } else {
      console.log('result =', result);
      deferred.resolve({"status": 200, "jsonResult": {"result": result}});
    }
  });
  return deferred.promise;
},

getCategoryWiseExpensesForAMonth = function(userId, month) {
  var deferred = q.defer();
  Expenses.aggregate([
    {$match: {_id: mongoose.Types.ObjectId(userId)}},
    {$unwind: "$expenses"},
    {$match: {"expenses.month": month}},
    {$unwind: "$expenses.expenditure"},
    {$group: {_id: "$expenses.expenditure.category", total: {$sum: "$expenses.expenditure.amount"}}},
    {$sort: {total: -1}}
  ], function(err, result) {
    if(err) {
      deferred.reject({"status": 500, "jsonResult": {"result": err}});
    } else if(!result) {
      deferred.reject({"status": 404, "jsonResult": {"result": "Could not find the expenses"}});
    } else {
      console.log('result =', result);
      deferred.resolve({"status": 200, "jsonResult": {"result": result}});
    }
  });
  return deferred.promise;
},

getCategoryWiseExpensesForAllMonths = function(userId) {
  var deferred = q.defer();
  Expenses.aggregate([
    {$match: {_id: mongoose.Types.ObjectId(userId)}},
    {$unwind: "$expenses"},
    {$unwind: "$expenses.expenditure"},
    {$group: {_id: "$expenses.expenditure.category", total: {$sum: "$expenses.expenditure.amount"}}},
    {$sort: {total: -1}}
  ], function(err, result) {
    if(err) {
      deferred.reject({"status": 500, "jsonResult": {"result": err}});
    } else if(!result) {
      deferred.reject({"status": 404, "jsonResult": {"result": "Could not find the expenses"}});
    } else {
      console.log('result =', result);
      deferred.resolve({"status": 200, "jsonResult": {"result": result}});
    }
  });
  return deferred.promise;
}


exports.getTotalExpensesForAllMonths = getTotalExpensesForAllMonths;
exports.getCategoryWiseExpensesForAMonth = getCategoryWiseExpensesForAMonth;
exports.getCategoryWiseExpensesForAllMonths = getCategoryWiseExpensesForAllMonths;
