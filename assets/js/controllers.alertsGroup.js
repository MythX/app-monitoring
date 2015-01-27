function AlertsGroupListController($scope, $location) {
	$scope.alertsGroups = [];

	var currentLocationRoot = $location.protocol() + '://' + $location.host() + ':' + $location.port();
    console.info('Websocket connection url : ' + currentLocationRoot);
	var socket = io.connect(currentLocationRoot);
    
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
