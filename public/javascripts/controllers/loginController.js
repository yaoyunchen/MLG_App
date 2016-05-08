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
            console.log('Login error');
            $scope.errorMsg = $scope.data.value.error;
          } else {
            console.log('Successful');
            localStorage['username'] = $scope.data.value.username;
            localStorage['user_id'] = $scope.data.value.user_id;
            $rootScope.updateUser();
            $location.path('/#/');
          }
        }

      }, true);
    })
  };

  $scope.displayUser = function() {
    
    $scope.$watch(function(oldV, newV) {
      if ($scope.data.hasOwnProperty('status') && $scope.data.status == 1) {
        if ($scope.data.value === undefined) {
          console.log('Incorrect login.');
        } else if ($scope.data.value.hasOwnProperty('username')) {
          localStorage['username'] = $scope.data.value.username;
          localStorage['user_id'] = $scope.data.value.user_id;
          // $scope.updateUser();
          $rootScope.updateUser();
          $location.path('/#/')
        }
      }
    }, true)
  }
}]);
