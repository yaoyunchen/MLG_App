var cMLGApp = angular.module('cMLGApp');

cMLGApp.controller('mainController', ['$scope', '$location', function($scope, $location){
  $scope.pageClass = "page-home";

  $scope.$location = $location;

  //checks local storage for logged in
  var username = localStorage['username'];
  console.log("you are currently logged in as: " + username);
  if (username !== undefined){
    console.log("will set log in here");
  }

}]);