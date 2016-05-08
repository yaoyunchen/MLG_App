var cMLGApp = angular.module('cMLGApp');

cMLGApp.controller('mainController', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  $scope.pageClass = "page-home";

  $scope.$location = $location;

  $scope.updateUser = function() {
    // $rootScope.updateUser();
    $rootScope.$watch('loggedIn', function() {
      $scope.username = $rootScope.username;
      $scope.user_id = $rootScope.user_id;
      $scope.loggedIn = $rootScope.loggedIn;
    }) 
  }
  $scope.updateUser();

  $scope.userLoggedIn = function() {
    var status = true;
    if ($rootScope.username === undefined || $rootScope.username == '') {
      status = false;
    }
    return status;
  }
  $scope.userLoggedIn();

  $scope.logout = function() {
    localStorage['username'] = undefined;
    localStorage['user_id'] = undefined;
    $rootScope.updateUser();
    // $scope.updateUser();
    $location.path('/');
  }


}]);