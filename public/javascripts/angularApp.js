var cMLGApp = angular.module('cMLGApp', ['ngRoute']);

cMLGApp.config(function($routeProvider){
  $routeProvider
  //Homepage
  .when('/', {
    templateUrl : 'home.ejs',
    controller  : 'mainController'
  })
  .when('/signup', {
    templateUrl : 'signup.ejs',
    controller  : 'signupController'
  })
  .when('/login', {
    templateUrl : 'login.ejs',
    controller  : 'loginController'
  });
});