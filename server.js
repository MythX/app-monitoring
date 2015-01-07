// App entry point
// ===============

'use strict';

var express	       = require('express');
var http	       = require('http');
var path	       = require('path');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

var alert        = require('./routes/alerts');
var alertsGroup  = require('./routes/alertsGroup');
var socket       = require('./routes/socket');
var logger       = require("./utils/logger");

require('express-namespace');

// Create the core web app container (`app`), bind and HTTP server to it
// (`server`) and determine the full path for public assets.
var app    = express();
var server = http.createServer(app);
var io     = require('socket.io')(server);

var publicPath = path.join(__dirname) + '/assets/';


// Rest webservice 
// ---------------
var jsonParser = bodyParser.json();

app.get('/alertsGroup', alertsGroup.findAll);		// only opened alerts
app.get('/alertsGroup/:id', alertsGroup.findById);
app.get('/alertsInGroup/:id', alert.findByGroupId);	// that's not an error ! ;)
app.post('/alertsGroup', jsonParser, alertsGroup.add);
app.put('/alertsGroup', jsonParser, alertsGroup.update);
app.delete('/alertsGroup/:id', alertsGroup.delete);

app.get('/alert', alert.findAll);
app.get('/alert/:id', alert.findById);
app.post('/alert', jsonParser, alert.add);
app.put('/alert/:id', jsonParser, alert.update);
app.delete('/alert/:id', alert.delete);


// Configuration
// -------------

// Configuration and middleware for all environments (dev, prod, etc.)
app.set('port', process.env.PORT || 8080);
app.use(methodOverride());
// Static file serving
app.use(express.static(publicPath));


server.listen(app.get('port'), function(){
  logger.info('Express server listening on port ' + app.get('port'));
});


// socket listening
// ----------------
io.sockets.on('connection', function(s) {
    alertsGroup.findAllAndTrigger(function(alertsGroupList) {
        alert.findAllAndTrigger(function(alertList) {
            socket.onConnection(s, alertsGroupList, alertList);
        });
    });
    
    s.on('refresh', function() {
        logger.verbose('client want fresh data');
        alert.findAllAndTrigger(function(alertList) {
            alertsGroup.findAllAndTrigger(function(alertsGroupList) {
                socket.onConnection(s, alertsGroupList, alertList);
            });
        });
    });
});

alert.setOnChangeHook(function(newAlertList) {
    alertsGroup.findAllAndTrigger(function(alertsGroupList) {
        socket.broadcast_alert_list_changed(io.sockets, alertsGroupList, newAlertList);
    });
});

