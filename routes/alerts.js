var mongo 		= require('mongodb');
var BSON 		= mongo.BSONPure;
var alertsGroup = require('./alertsGroup');
var alert_db 	= require('../utils/mongo-connection');

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
    console.log('Retrieving ' + collection + ' : ' + id);
    alert_db.db.collection(collection, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findByGroupId = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving ' + collection + ' for group id : ' + id);
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
    console.log('Adding ' + collection + ' : ' + JSON.stringify(alert));
    alert_db.db.collection(collection, function(err, collection) {
        collection.insert(alert, {safe:true}, function(err, result) {
            if (err) {
                callback({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                triggerOnChangeHook();
                callback(result[0]);
            }
        });
    });
};

exports.add = function(req, res) {
	console.log(req.body);
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

/**
	Update
*/
exports.update = function(req, res) {
    var id = req.params.id;
    var alert = req.body;
    alert.date = new Date();
    console.log('Updating ' + collection + ' : ' + id);
    console.log(JSON.stringify(alert));
    alert_db.db.collection(collection, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, alert, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating ' + collection + ' : ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                triggerOnChangeHook();
                res.send(alert);
            }
        });
    });
}

/**
	Delete
*/
exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting ' + collection + ' : ' + id);
    alert_db.db.collection(collection, function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                triggerOnChangeHook();
                res.send(req.body);
            }
        });
    });
}

/**
	Hooks
*/
var onChangeHookAction = null;

exports.setOnChangeHook = function(action) {
    console.log("Callback onChange is set for collection " + collection);
    onChangeHookAction = action;
}

function triggerOnChangeHook() {
    if (onChangeHookAction !== null) {
        exports.findAllAndTrigger(function(newAlertList) {
            onChangeHookAction(newAlertList);
        });
    }
}
