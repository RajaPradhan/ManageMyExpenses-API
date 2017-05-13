var mongoose = require('mongoose'),
    config = require('../config/config.json'),

    gracefulShutdown = function(message, callback) {
        mongoose.connection.close(function() {
            console.log(message);
            callback();
        });
    };

// Default 127.0.0.1:27017
mongoose.connect(config.dbURI);

// DB Connection Events
mongoose.connection.on('connected', function() {
    console.log('SUCCESSFULLY CONNECTED TO MONGODB');
});

mongoose.connection.on('disconnected', function() {
    console.log('DISCONNECTED FROM MONGODB');
});

mongoose.connection.on('error', function(err) {
    console.log('ERROR OCCURED WHILE CONNECTING TO MONGODB', err);
});

// On process shutdown
process.on('SIGINT', function() {
    gracefulShutdown('Node process shutdown', function() {
        process.exit(0);
    });
});

// On nodemon shutdown
process.once('SIGUSR2', function() {
    gracefulShutdown('Nodemon shutdown', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// Bring in the schemas and models
require('./expenses');
