angular.module('cMLGApp').controller('loginController', ['$scope', '$location', '$users', function($scope, $location, $users) {

  $scope.pageClass = "page-login";
  
  $scope.data = {
    value : {
      username : "",
      email : "" ,
      password : "" 
    }
  };

  $scope.validLogin = function() {
    $scope.data = $users.get($scope.email.toLowerCase(), $scope.password, $scope.displayUser());
  };

  $scope.displayUser = function() {
    
    $scope.$watch(function(){
      console.log($scope.data.value);
      if($scope.data.value.hasOwnProperty('username') === true){
        $location.path('/');
        localStorage['username'] = $scope.data.value.username;
        localStorage['user_id'] = $scope.data.value.id;
        console.log("Logged in as " + $scope.loggedIn);
      } else if ($scope.data.value === 'error') {
        $scope.loginForm.submitted = true;
        localStorage['username'] = undefined;
        localStorage['user_id'] = undefined;

      }
    }, true);
  }
}]);
