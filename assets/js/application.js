angular.module('appMonitoring', ['ngRoute', 'alertsGroupService']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when('/alertsGroup-list',	
        			{
        				templateUrl:'/html/alertsGroup-list.html',   
        				controller:AlertsGroupListController
        			}
        	).
        	when('/alert-list/:groupId',	
        			{
        				templateUrl:'/html/alert-list.html',   
        				controller:AlertListController
        			}
        	).
            otherwise(
            		{
            			redirectTo:'alertsGroup-list'
            		}
            );
}]);
