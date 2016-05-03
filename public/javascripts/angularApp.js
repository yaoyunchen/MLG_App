var cMLGApp = angular.module('cMLGApp', ['ngRoute']);

cMLGApp.config(function($routeProvider){
  $routeProvider
  //Homepage
  .when('/', {
    resolve: {
      "check": function($location, $rootScope){
        if (!$rootScope.loggedIn){
          $location.path('/login');
        }
      }
    },
    templateUrl   : 'home.ejs',
    controller    : 'mainController'
  })
  .when('/signup', {
    templateUrl   : 'signup.ejs',
    controller    : 'signupController'
  })
  .when('/login', {
    templateUrl : 'login.ejs',
    controller  : 'loginController'
  });
});