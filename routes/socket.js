var logger = require("../utils/logger");

exports.onConnection = function(socket, alertsGroupList, alertList) {
    logger.info('New user connected, sending alert list');
    socket.emit('alertsGroup_list_changed', alertsGroupList);
    socket.emit('alert_list_changed', alertList);
};

exports.broadcast_alert_list_changed = function(sockets, alertsGroupList, newAlertList) {
    logger.info('Broadcasting new alert list');
    sockets.emit('alertsGroup_list_changed', alertsGroupList);
    sockets.emit("alert_list_changed", newAlertList);
};