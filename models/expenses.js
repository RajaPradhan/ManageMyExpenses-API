var mongoose = require('mongoose');

var expensesSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    expenses: {
      type: Array,
      default: []
    }
});

mongoose.model('Expenses', expensesSchema);
