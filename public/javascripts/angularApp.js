var cMLGApp = angular.module('cMLGApp', ['ngRoute', 'ngAnimate']);

cMLGApp.config(function($routeProvider){
  $routeProvider
  //Homepage
  .when('/', {
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
  })
  .when('/createMatch', {
    resolve: {
      "check": function($location, $rootScope){
        if (localStorage['username'] === 'undefined'){
          $location.path('/login');
        }
      }
    },
    templateUrl : 'createMatch.ejs',
    controller  : 'createMatchController'
  })
  .when('/myMatch', {
    resolve: {
      "check": function($location, $rootScope){
        if (localStorage['username'] === 'undefined'){
          $location.path('/login');
        }
      }
    },
    templateUrl : 'myMatch.ejs',
    controller  : 'myMatchController'
  });
}]);
});