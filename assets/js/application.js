angular.module('appMonitoring', ['ngRoute', 'alertsGroupService']).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/alertsGroup-list', {
        templateUrl: '/html/alertsGroup-list.html',
        controller: AlertsGroupListController
    }).
    when('/alert-list/:groupId', {
        templateUrl: '/html/alert-list.html',
        controller: AlertListController
    }).
    otherwise({
        redirectTo: 'alertsGroup-list'
    });
}]);

angular.module('appMonitoring').filter('priorityToText', function() {
    return function(input, format) {
        var priority = input || 'UNDEFINED';
        if (priority === 'BLOCKER') {
            return "Bloquant";
        } else if (priority === 'CRITICAL') {
            return "Critique";
        } else if (priority === 'MAJOR') {
            return "Majeur";
        } else if (priority === 'WARNING') {
            return "Attention";
        }
        return "";
    }
});

angular.module('appMonitoring').filter('priorityToClass', function() {
    return function(input, format) {
        var priority = input || 'UNDEFINED';
        if (priority === 'BLOCKER') {
            return "danger";
        } else if (priority === 'CRITICAL') {
            return "warning";
        } else if (priority === 'MAJOR') {
            return "info";
        } else if (priority === 'WARNING') {
            return "";
        }
        return "success";
    }
});

angular.module('appMonitoring').service('sharedProperties', function() {
    var currentUser = localStorage.getItem('currentUser') !== null ? JSON.parse(localStorage.getItem('currentUser')) : {
        username: 'Unknown'
    };

    console.info(localStorage.getItem('currentUser'));

    return {
        getCurrentUser: function() {
            return currentUser;
        },
        setCurrentUser: function(newCurrentUser) {
            currentUser = newCurrentUser;
            console.debug('Store user in local storage');
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    }
});