var mongo   = require('mongodb');
var logger  = require("./logger");

require('express-namespace');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

	
var mongodb_host = process.env.OPENSHIFT_MONGODB_DB_HOST || 'localhost';
var mongodb_port = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;
var mongodb_user = '';
var mongodb_pass = '';

var server = new Server(mongodb_host, mongodb_port, {auto_reconnect: true});
var db = new Db('appmonitoring', server, {safe:true});

db.open(function(err, db) {
    if(err) {
        logger.error("Failed to connect to mongo database : " + err);
    }
	else {
		logger.info("Connection to database is opened");
		
		if (mongodb_user !== '' && mongodb_pass !== '') {
			logger.info('Trying to auth on mongodb with user : ' + mongodb_user);
			db.authenticate('admin', 'c44kDgEpwE_l', function(err, result) {
				if(err) {
					logger.error("Failed to auth to mongo database : " + err);
				}
			});
		}
		else {
			logger.warn('No db authentification to do');
		}
	}
});

exports.db = db;
