angular.module('cMLGApp').controller('loginController', ['$scope', function($scope, $location, $rootScope) {

  $scope.pageClass = "page-login";

  $scope.login = function(){
    console.log("submitted");
    if($scope.loginForm.$valid){
      console.log("Logged in as Admin");
    } else {
      $scope.loginForm.submitted = true;
    }
  }

  // $scope.submit = function () {
  //   if($scope.username == 'admin' && $scope.password == 'admin'){
  //     $rootScope.loggedIn = true;
  //     $location.path('/');
  //   } else {
  //     alert('Wrong Stuff');
  //   }
  };
}]);
