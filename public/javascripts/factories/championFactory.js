var cMLGApp = angular.module('cMLGApp');

cMLGApp.factory('$champions', ['$http', '$q', function($http, $q) {

  return {
    get: function(callback) {
      var deferred = $q.defer();

      var url = '/search/allchampions?callback=JSON_CALLBACK';

      $http.get(url).then(function(res) {
        // success.
        deferred.resolve(res);

      }).then(function(res) {
        // fail.
      }).finally(function() {
        // do this regardless of success/fail.
      })
      return deferred.promise.$$state;
    }
  };
}]);