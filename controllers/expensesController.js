var expensesService = require('../services/expensesService');

var sendJSONResponse = function(res, responseObj) {
    res.status(responseObj.status);
    res.json(responseObj.jsonResult);
},

getExpensesForSpecificMonth = function(req, res) {
  var userId = req.params.id,
      month = req.params.month;
      console.log('id=', userId);
      console.log('month=', month);

  expensesService.getExpensesForSpecificMonth(userId, month)
  .then(function(responseObj) {
      console.log('responseObj', responseObj);
      sendJSONResponse(res, responseObj);
  })
  .catch(function(responseObj) {
      sendJSONResponse(res, responseObj);
  });
},

addExpense = function(req, res) {
  console.log('req =', req.body);
  var expenseDetails = {
    userId: req.body.id,
    month: req.body.month,
    expenseId: req.body.expenseId,
    category: req.body.category,
    details: req.body.details,
    currency: req.body.currency,
    amount: req.body.amount
  };

  expensesService.addExpense(expenseDetails)
  .then(function(responseObj) {
      console.log('responseObj', responseObj);
      sendJSONResponse(res, responseObj);
  })
  .catch(function(responseObj) {
      sendJSONResponse(res, responseObj);
  });
},

updateExpense = function(req, res) {
  var expenseDetails = {
    userId: req.body.id,
    month: req.body.month,
    expenseId: req.body.expenseId,
    category: req.body.category,
    details: req.body.details,
    currency: req.body.currency,
    amount: req.body.amount
  };

  expensesService.updateExpense(expenseDetails)
  .then(function(responseObj) {
      console.log('responseObj', responseObj);
      sendJSONResponse(res, responseObj);
  })
  .catch(function(responseObj) {
      sendJSONResponse(res, responseObj);
  });
},

deleteExpense = function(req, res) {
  console.log('deleteExpense=======================================');
  var expenseDetails = {
    userId: req.params.id,
    month: req.params.month,
    expenseId: req.params.expenseId
  };

  expensesService.deleteExpense(expenseDetails)
  .then(function(responseObj) {
      console.log('responseObj', responseObj);
      sendJSONResponse(res, responseObj);
  })
  .catch(function(responseObj) {
    console.log('responseObj', responseObj);
    sendJSONResponse(res, responseObj);
  });
}

exports.getExpensesForSpecificMonth = getExpensesForSpecificMonth;
exports.addExpense = addExpense;
exports.updateExpense = updateExpense;
exports.deleteExpense = deleteExpense;
