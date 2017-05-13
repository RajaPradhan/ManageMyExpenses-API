var mongoose = require('mongoose'),
    Expenses = mongoose.model('Expenses'),
    q = require('q'),
    _ = require('lodash');

var getExpensesForSpecificMonth = function(userId, month) {
  var deferred = q.defer();
  Expenses.aggregate([
    {$match: {_id: mongoose.Types.ObjectId(userId)}},
    {$unwind: "$expenses"},
    {$match: {"expenses.month": month}},
    {$project: {expenses: 1}}
  ], function(err, result) {
    if(err) {
      deferred.reject({"status": 500, "jsonResult": {"result": err}});
    } else if(!result) {
      deferred.reject({"status": 404, "jsonResult": {"result": "Could not find the expenses"}});
    } else {
      deferred.resolve({"status": 200, "jsonResult": {"result": result}});
    }
  });
  return deferred.promise;
},

addExpense = function(expenseDetails) {
  var deferred = q.defer();
  var userId = expenseDetails.userId;
  let newExpense = {
    expenseId: expenseDetails.expenseId,
    category: expenseDetails.category,
    details: expenseDetails.details,
    currency: expenseDetails.currency,
    amount: expenseDetails.amount
  };

  Expenses.findById(userId).exec(function(err, user) {
    if(err) {
        deferred.reject({"status": 500, "jsonResult": {"result": err}});
    } else if(!user) {
        deferred.reject({"status": 404, "jsonResult": {"result": "User not found"}});
    } else {
        let expensesForTheMonth = _.find(user.expenses, {month: expenseDetails.month});
        if(expensesForTheMonth) {
          // If expense for the month is present
          Expenses.update(
            {_id: mongoose.Types.ObjectId(userId), "expenses.month": expenseDetails.month},
            {$push: {"expenses.$.expenditure": newExpense}},
            function(err, result) {
              if(err) {
                deferred.reject({"status": 500, "jsonResult": {"result": err}});
              } else if(!result) {
                deferred.reject({"status": 404, "jsonResult": {"result": "Could not find the expenses"}});
              } else {
                deferred.resolve({"status": 200, "jsonResult": {"result": result}});
              }
            }
          );
        } else {
          // If expense for the month is not present
          Expenses.update(
            {_id: mongoose.Types.ObjectId(userId)},
            {$addToSet: {expenses: {month: expenseDetails.month, expenditure: [newExpense]}}},
            function(err, result) {
              if(err) {
                deferred.reject({"status": 500, "jsonResult": {"result": err}});
              } else if(!result) {
                deferred.reject({"status": 404, "jsonResult": {"result": "Could not find the expenses"}});
              } else {
                deferred.resolve({"status": 200, "jsonResult": {"result": result}});
              }
            }
          );
        }
    }
  });
  return deferred.promise;
},

updateExpense = function(expenseDetails) {
  var deferred = q.defer(),
      userId = expenseDetails.userId,
      expenseId = expenseDetails.expenseId;

  Expenses.findById(userId).exec(function(err, user) {
    if(err) {
        deferred.reject({"status": 500, "jsonResult": {"result": err}});
    } else if(!user) {
        deferred.reject({"status": 404, "jsonResult": {"result": "User not found"}});
    } else {
      var expense = _.find(user.expenses, {month: expenseDetails.month});
      var expenseIndex = _.findIndex(user.expenses, {month: expenseDetails.month});
      if(!expense) {
        deferred.reject({"status": 404, "jsonResult": {"result": "Could not find the expenses"}});
      } else {
        var expenditure = _.find(expense.expenditure, {expenseId: expenseDetails.expenseId});
        var expenditureIndex = _.findIndex(expense.expenditure, {expenseId: expenseDetails.expenseId});
        if(!expenditure) {
          deferred.reject({"status": 404, "jsonResult": {"result": "Could not find the expenses"}});
        } else {
          expenditure.expenseId = expenseDetails.expenseId;
          expenditure.category = expenseDetails.category;
          expenditure.details = expenseDetails.details;
          expenditure.currency = expenseDetails.currency;
          expenditure.amount = expenseDetails.amount;

          user.expenses[expenseIndex]['expenditure'][expenditureIndex] = expenditure;
          user.markModified("expenses");

          user.save(function(err, user) {
              if(err) {
                  deferred.reject({"status": 500, "jsonResult": {"result": err}});
              } else {
                  deferred.resolve({"status": 200, "jsonResult": {"result": user}});
              }
          });
        }
      }
    }
  });
  return deferred.promise;
},

deleteExpense = function(expenseDetails) {
  var deferred = q.defer(),
      userId = expenseDetails.userId,
      expenseId = expenseDetails.expenseId,
      month = expenseDetails.month;

  Expenses.findById(userId).exec(function(err, user) {
    if(err) {
        deferred.reject({"status": 500, "jsonResult": {"result": err}});
    } else if(!user) {
        deferred.reject({"status": 404, "jsonResult": {"result": "User not found"}});
    } else {
      var expense = _.find(user.expenses, {month: expenseDetails.month});
      var expenseIndex = _.findIndex(user.expenses, {month: expenseDetails.month});
      if(!expense) {
        deferred.reject({"status": 404, "jsonResult": {"result": "Could not find the expenses"}});
      } else {
        var expenditure = _.find(expense.expenditure, {expenseId: expenseDetails.expenseId});
        var expenditureIndex = _.findIndex(expense.expenditure, {expenseId: expenseDetails.expenseId});
        if(!expenditure) {
          deferred.reject({"status": 404, "jsonResult": {"result": "Could not find the expenses"}});
        } else {
          _.remove(expense.expenditure, {expenseId: expenseDetails.expenseId});
          user.expenses[expenseIndex]['expenditure'] = expense.expenditure;
          user.markModified("expenses");

          user.save(function(err, user) {
              if(err) {
                  deferred.reject({"status": 500, "jsonResult": {"result": err}});
              } else {
                  deferred.resolve({"status": 200, "jsonResult": {"result": user}});
              }
          });
        }
      }
    }
  });
  return deferred.promise;
}

exports.getExpensesForSpecificMonth = getExpensesForSpecificMonth;
exports.addExpense = addExpense;
exports.updateExpense = updateExpense;
exports.deleteExpense = deleteExpense;
