var cMLGApp = angular.module('cMLGApp');

cMLGApp.factory('$users', ['$http', '$q', function($http, $q) {

  return {
    get: function(email, password, callback) {
      var deferred = $q.defer();

      var url = '/searchdatabase/' + email + '/' + password + JSONCALLBACK;

      $http.get(url).then(function(res) {
        // success.
        deferred.resolve(res)
      }).then(function(res) {
        // fail.

      }).finally(function() {
        // do this regardless of success/fail.
      })

      if (callback) {
        callback;
      }

      return deferred.promise.$$state;
    }
  };
}]);