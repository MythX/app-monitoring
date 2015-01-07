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
    $scope.alertsGroupSortPredicate = 'criticity'; // magic alphabetic sort ! ;)
    
    $scope.convertCriticityToClass = function(criticity) {
        if (criticity === 'BLOCKER') {
            return "danger";
        }
        else if (criticity === 'CRITICAL') {
            return "warning";
        }
        else if (criticity === 'MAJOR') {
            return "info";
        }
        else if (criticity === 'WARNING') {
            return "";
        }
        return "success";
    }
    
};
