var mongo 		= require('mongodb');
var BSON 		= mongo.BSONPure;
var alert_db 	= require('../utils/mongo-connection');

require('express-namespace');

var collection = 'alertsGroup';


/**
	Find all
*/
exports.findAllAndTrigger = function(callback) {
    alert_db.db.collection(collection, function(err, collection) {
        collection.find({'state':'OPEN'}).toArray(function(err, items) {
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
exports.findByIdAndTrigger = function(id, callback) {
    console.log('Retrieving ' + collection + ' : ' + id);
    alert_db.db.collection(collection, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            callback(item);
        });
    });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    exports.findByIdAndTrigger(id, function(item) {
        res.send(item);
    });
};

/**
	Create
*/
exports.add = function(alert, callback) {
    var alertsGroup = {
        action         : alert.action,
        criticity      : alert.criticity,
        topic          : alert.topic,
		subtopic       : alert.subtopic,
        message        : alert.message,
        beginDate      : alert.date,
        endDate        : alert.date,
        occurenceCount : 1,
        state          : 'OPEN'
    };

    console.log('Adding ' + collection + ' : ' + JSON.stringify(alertsGroup));
    alert_db.db.collection(collection, function(err, collection) {
        collection.insert(alertsGroup, {safe:true}, function(err, result) {
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

/**
	Update
*/
exports.$update = function(id, alertsGroup, callback) {
    console.log('Updating ' + collection + ' : ' + id);
    delete alertsGroup._id;
    console.log(JSON.stringify(alertsGroup));
    alert_db.db.collection(collection, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, alertsGroup, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating ' + collection + ' : ' + err);
                callback({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                triggerOnChangeHook();
                callback(alertsGroup);
            }
        });
    });
}

exports.update = function(req, res) {
    var alertsGroup = req.body;
    var id = alertsGroup._id;
    console.log('Updating ' + collection + ' : ' + id);
    
    exports.$update(id, alertsGroup, function(result) {
        res.send(result);
    });
}

exports.addAlertInGroup = function(alert, callback) {
    exports.findByIdAndTrigger(alert.alertsGroupId, function(alertsGroup) {
        alertsGroup.endDate = alert.date;
        alertsGroup.occurenceCount += 1;
        exports.$update(alertsGroup._id, alertsGroup, callback);   
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
	Others
*/
// max result size = 1
exports.getOpenGroupAndTrigger = function(alert, callback) {
    alert_db.db.collection(collection, function(err, collection) {
        collection.findOne({'action'    : alert.action, 
                            'criticity' : alert.criticity,
                            'topic'     : alert.topic,
							'subtopic'  : alert.subtopic,
                            'message'   : alert.message,
                            'state'     : 'OPEN'
                            }, function(err, item) {
            callback(item);
        });
    });
};

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
        exports.findAllAndTrigger(function(newAlertsGroupList) {
            onChangeHookAction(newAlertsGroupList);
        });
    }
}
