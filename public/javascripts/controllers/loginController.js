angular.module('cMLGApp').controller('loginController', ['$scope', '$location', '$users', function($scope, $location, $users) {

  $scope.pageClass = "page-login";

  $scope.user = {};
  $scope.email = 'kwan.andy@hotmail.com';
  $scope.password = "password";

  $scope.validLogin = function() {
    $scope.user = $users.get($scope.email, $scope.password, $scope.displayUser());
  };

  $scope.displayUser = function() {
  }

  // $scope.login = function(){
   




  //   // if($scope.loginForm.$valid && $scope.username == "admin" && $scope.password == "admin"){
  //   //   $location.path('/');
  //   //   $scope.loggedIn = $scope.username;
  //   //   localStorage['username'] = $scope.username;
  //   //   console.log("Logged in as " + $scope.loggedIn);
  //   // } else {
  //   //   alert('Wrong Stuff');
  //   //   $scope.loginForm.submitted = true;
  //   //   localStorage['username'] = undefined;
  //   //   $scope.username = "";
  //   //   $scope.password = "";
  //   // }
  // }
}]);
