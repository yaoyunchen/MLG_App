angular.module('cMLGApp').controller('loginController', ['$scope', '$location', '$rootScope', 'users', function($scope, $location, $rootScope, users) {

  $scope.pageClass = "page-login";

  $scope.login = function(){
    console.log("submitted");
    if($scope.loginForm.$valid && $scope.username == "admin" && $scope.password == "admin"){
      $location.path('/');
      $rootScope.loggedIn = $scope.username;
      localStorage['username'] = $scope.username;
      console.log("Logged in as " + $rootScope.loggedIn);
    } else {
      alert('Wrong Stuff');
      $scope.loginForm.submitted = true;
      localStorage['username'] = undefined;
      $scope.username = "";
      $scope.password = "";
    }
  }
}]);
