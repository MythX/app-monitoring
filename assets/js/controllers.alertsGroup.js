function AlertsGroupListController($scope, $location) {
	$scope.alertsGroups = [];

    var socket = io.connect('http://127.0.0.1:8080');
    
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
};
