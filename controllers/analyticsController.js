var analyticsService = require('../services/analyticsService');

var sendJSONResponse = function(res, responseObj) {
    res.status(responseObj.status);
    res.json(responseObj.jsonResult);
},

getTotalExpensesForAllMonths = function(req, res) {
  var userId = req.params.id;

  analyticsService.getTotalExpensesForAllMonths(userId)
  .then(function(responseObj) {
      console.log('responseObj', responseObj);
      sendJSONResponse(res, responseObj);
  })
  .catch(function(responseObj) {
      sendJSONResponse(res, responseObj);
  });
},

getCategoryWiseExpensesForAMonth = function(req, res) {
  var userId = req.params.id,
      month = req.params.month;

  analyticsService.getCategoryWiseExpensesForAMonth(userId, month)
  .then(function(responseObj) {
      console.log('responseObj', responseObj);
      sendJSONResponse(res, responseObj);
  })
  .catch(function(responseObj) {
      sendJSONResponse(res, responseObj);
  });
},

getCategoryWiseExpensesForAllMonths = function(req, res) {
  var userId = req.params.id;

  analyticsService.getCategoryWiseExpensesForAllMonths(userId)
  .then(function(responseObj) {
      console.log('responseObj', responseObj);
      sendJSONResponse(res, responseObj);
  })
  .catch(function(responseObj) {
      sendJSONResponse(res, responseObj);
  });
}

exports.getTotalExpensesForAllMonths = getTotalExpensesForAllMonths;
exports.getCategoryWiseExpensesForAMonth = getCategoryWiseExpensesForAMonth;
exports.getCategoryWiseExpensesForAllMonths = getCategoryWiseExpensesForAllMonths;
