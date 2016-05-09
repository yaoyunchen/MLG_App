angular.module('cMLGApp').controller('loginController', ['$scope', '$rootScope', '$location', '$users', '$q', function($scope, $rootScope, $location, $users, $q) {

  $scope.pageClass = "page-login";
  
  $scope.data = {
    value : {
      username : "",
      email : "" ,
      password : "" 
    }
  };
  $scope.errorMsg;

  $scope.updateUser = function() {
    $rootScope.$watch('loggedIn', function() {
      $scope.username = $rootScope.username;
      $scope.user_id = $rootScope.user_id;
      $scope.loggedIn = $rootScope.loggedIn;
    }) 
  }
 
  $scope.validLogin = function() {
    $scope.data = $users.get($scope.email.toLowerCase(), $scope.password, function() {
      $scope.$watch('data', function() {
        if ($scope.data.hasOwnProperty('value') ) {
          if ($scope.data.value.hasOwnProperty('error')) {
            $scope.errorMsg = $scope.data.value.error;
          } else {
            localStorage['username'] = $scope.data.value.username;
            localStorage['user_id'] = $scope.data.value.user_id;
            localStorage['mlg_points'] = $scope.data.value.mlg_points;
            $rootScope.updateUser();
            $location.path('/');
          }
        }
      }, true);
    })
  };
}]);
