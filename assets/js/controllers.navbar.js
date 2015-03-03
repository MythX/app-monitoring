angular.module('appMonitoring').controller('NavbarController', function($scope, sharedProperties) {

  // initialize user
  $scope.user = sharedProperties.getCurrentUser();

  $scope.updateSharedPropertiesValues = function() {
    var newCurrentUser = {
      username: $scope.user.username
    };
    console.debug('Updating shared propertie current user : ');
    console.debug(newCurrentUser);
    sharedProperties.setCurrentUser(newCurrentUser);
  }

});
