var cMLGApp=angular.module("cMLGApp",["ngRoute"]);cMLGApp.config(["$routeProvider",function(e){e.when("/",{templateUrl:"home.ejs",controller:"mainController"})}]);var cMLGApp=angular.module("cMLGApp");cMLGApp.controller("mainController",["$scope","$location",function(e,r){e.pageClass="page-home"}]);var cMLGApp=angular.module("cMLGApp");cMLGApp.directive("homepage",["$location",function(e){return{restrict:"E",transclude:!0,templateUrl:"home.ejs"}}]);var cMLGApp=angular.module("cMLGApp");cMLGApp.directive("navbar",function(){return{restrict:"E",transclude:!0,scope:{},templateUrl:"navbar.ejs"}});