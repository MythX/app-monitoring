function AlertListController($scope, $location, $routeParams, AlertsGroup, sharedProperties) {
    
    $scope.groupId = $routeParams.groupId;
    
    $scope.refreshAlertsGroup = function() {
        AlertsGroup.get({id:$scope.groupId}, function(alertsGroup) {
            $scope.alertsGroup = alertsGroup;
        });
    }

    function isInThisGroup(element) {
        return element.alertsGroupId == $scope.groupId;
    }
    
	$scope.alerts = [];

	var currentLocationRoot = $location.protocol() + '://' + $location.host() + ':' + $location.port();
    console.info('Websocket connection url : ' + currentLocationRoot);
	var socket = io.connect(currentLocationRoot);
    
    socket.on('alert_list_changed', function (newAlertList) {
        console.info("Updating alert list...");
        var filtered = newAlertList.filter(isInThisGroup);
        $scope.$apply(function () {
            $scope.alerts = filtered;
        });
        $scope.refreshAlertsGroup();
    });

    $scope.$on('$routeChangeSuccess',function(){
        socket.emit('refresh', {});
        console.info('Refresh data...');
    });

    $scope.isAssigned = function() {
        return $scope.alertsGroup != undefined && $scope.alertsGroup.assigned != undefined;
    }
    $scope.isOpened = function() {
        return $scope.alertsGroup != undefined && $scope.alertsGroup.state == 'OPEN';
    }
    
    
    // default sort
    $scope.alertSortPredicate = 'date';
    $scope.reverse = true;

    $scope.assignTo = function() {
        var assigned = sharedProperties.getCurrentUser().username;
		console.debug("The alert will be assigned to : " + assigned);
        $scope.alertsGroup.assigned = assigned;
        AlertsGroup.update({id: $scope.entryId}, $scope.alertsGroup, function(response) {
        });
    }
    
    $scope.closeAlertsGroup = function() {
        $scope.alertsGroup.state = 'CLOSED';
        AlertsGroup.update({id: $scope.entryId}, $scope.alertsGroup, function(response) {
        });
    }
};
