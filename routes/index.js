var express = require('express'),
    router = express.Router(),
    expensesController = require('../controllers/expensesController'),
    analyticsController = require('../controllers/analyticsController');

// Get expense for a specific month
router.get('/expenses/:id/:month', expensesController.getExpensesForSpecificMonth);

// Add new expense to the given month
router.post('/expenses', expensesController.addExpense);

// Update an expense
router.put('/expenses', expensesController.updateExpense);

// Delete an expense
router.delete('/expenses/:id/:month/:expenseId', expensesController.deleteExpense);

// Analytics routes

// Get total expenses for all the months
router.get('/analytics/expenses/:id', analyticsController.getTotalExpensesForAllMonths);

// Get category wise expense for a month
router.get('/analytics/expenses/category/:id/:month', analyticsController.getCategoryWiseExpensesForAMonth);

// Get category wise expense for all months
router.get('/analytics/expenses/category/:id', analyticsController.getCategoryWiseExpensesForAllMonths);


module.exports = router;
