function AlertsGroupListController($scope, $location) {
	$scope.alertsGroups = [];

    var socket = io.connect('http://127.0.0.1:8044');
    
    socket.on('alertsGroup_list_changed', function (newAlertsGroupList) {
        $scope.$apply(function () {
            $scope.alertsGroups = newAlertsGroupList;
        });
    });
    
    $scope.$on('$routeChangeSuccess',function(){
        socket.emit('refresh', {});
        console.info('Refresh data...');
    });

    // default sort
    $scope.alertsGroupSortPredicate = 'priority'; // magic alphabetic sort ! ;)
    
    $scope.convertPriorityToClass = function(priority) {
        if (priority === 'BLOCKER') {
            return "danger";
        }
        else if (priority === 'CRITICAL') {
            return "warning";
        }
        else if (priority === 'MAJOR') {
            return "info";
        }
        else if (priority === 'WARNING') {
            return "";
        }
        return "success";
    }
    
};
