var mongo = require('mongodb');

require('express-namespace');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
    
var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db("alerts", server, {safe:true});

db.open(function(err, db) {
    if(!err) {
        console.info("Connection to database is opened");
    } else {
        console.error("Failed to connect to mongo database : " + err);
    }
});

exports.db = db;
