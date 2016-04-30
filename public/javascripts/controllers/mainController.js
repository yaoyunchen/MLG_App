var cMLGApp = angular.module('cMLGApp');

cMLGApp.controller('mainController', ['$scope', '$location', function($scope, $location){

  $scope.pageClass="page-home";

  console.log('Hi there.')
}]);