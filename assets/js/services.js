// define rest services

angular.module('alertsGroupService', ['ngResource']).factory('AlertsGroup', function($resource) {
  return $resource('alertsGroup/:id', {}, {
    update: {
      method: 'PUT'
    }
  });
});

angular.module('actionService', ['ngResource']).factory('Action', function($resource) {
  return $resource('action/:id', {}, {});
});
