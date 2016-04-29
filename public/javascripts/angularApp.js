var cMLGApp = angular.module('cMLGApp', ['ngRoute']);

cMLGApp.config(function($routeProvider){
  $routeProvider
  //Homepage
  .when('/', {
    templateUrl : 'home.ejs',
    controller  : 'mainController'
  })
});