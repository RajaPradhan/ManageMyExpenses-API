var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors');

require('./models/db');

var router = require('./routes/index'),
app = express();

// Parse the incoming request's body as JSON
app.use(bodyParser.json());
// Parse the incoming request's body as URL encoded data
app.use(bodyParser.urlencoded({extended: false}));
// Use the cors middleware to add necessary response headers to allow CORS
app.use(cors());

// Use the express router to decide the controllers that will handle the incoming URL
app.use('/api', router);

// Start the server by listening on a specific port (3000 here)
app.listen(3000, function() {
    console.log('==================SERVER LISTENING ON PORT 3000=======================');
});
