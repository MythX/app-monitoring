var mongo 		= require('mongodb');
var BSON 		= mongo.BSONPure;
var alertsGroup = require('./alertsGroup');
var alert_db 	= require('../utils/mongo-connection');
var logger      = require("../utils/logger");

require('express-namespace');

var collection = 'alert';

/**
	Find all
*/
exports.findAllAndTrigger = function(callback) {
    alert_db.db.collection(collection, function(err, collection) {
        collection.find().toArray(function(err, items) {
            callback(items);
        });
    });
};

exports.findAll = function(req, res) {
    exports.findAllAndTrigger(function(items) {
        res.send(items);
    });
};

/**
	Find one
*/
exports.findById = function(req, res) {
    var id = req.params.id;
    logger.verbose('Retrieving ' + collection + ' : ' + id);
    alert_db.db.collection(collection, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findByGroupId = function(req, res) {
    var id = req.params.id;
    logger.verbose('Retrieving ' + collection + ' for group id : ' + id);
    alert_db.db.collection(collection, function(err, collection) {
        collection.find({'alertsGroup._id':new BSON.ObjectID(id)}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

/**
	Create
*/
exports.$add = function(alert, callback) {
    logger.verbose('Adding ' + collection + ' : ' + JSON.stringify(alert));
    alert_db.db.collection(collection, function(err, collection) {
        collection.insert(alert, {safe:true}, function(err, result) {
            if (err) {
				logger.error('Failed to add ' + collection + ' - ' + err);
                callback({'error':'An error has occurred'});
            } else {
                logger.verbose('Success: ' + JSON.stringify(result[0]));
                triggerOnChangeHook();
                callback(result[0]);
            }
        });
    });
};

exports.add = function(req, res) {
	logger.verbose(req.body);
    var alert = req.body;
    alert.date = new Date();

    alertsGroup.getOpenGroupAndTrigger(alert, function(group) {
        if (group == null) {
            alertsGroup.add(alert, function(newGroup) {
                alert.alertsGroupId = newGroup._id;
                exports.$add(alert, function(newAlert) {
                    res.send(newAlert);
                });
            });
        }
        else { // group is not null
            alert.alertsGroupId = group._id;
            alertsGroup.addAlertInGroup(alert, function() {
                exports.$add(alert, function(newAlert) {
                    res.send(newAlert);
                });
            });
        }
    });
}
