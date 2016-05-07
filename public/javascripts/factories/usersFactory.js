var cMLGApp = angular.module('cMLGApp');

cMLGApp.factory('$users', ['$http', '$q', function($http, $q) {

  return {
    get: function(email, password, callback) {
      var deferred = $q.defer();

      var url = '/db/search/users/login/' + email + '/' + password + JSONCALLBACK;

      $http.get(url).then(function(res) {
        // success.
        deferred.resolve(res)
        if (callback) {
          callback;
        }
      }).then(function(res) {
        // fail.

      }).finally(function() {
        // do this regardless of success/fail.
      })

      return deferred.promise.$$state;
    },

    checkUsername: function(username) {

      // console.log(username)
      var deferred = $q.defer();

      var url = '/db/search/users/' + username + JSONCALLBACK;

      $http.get(url).then(function(res) {
        // success.
        console.log(res)
        deferred.resolve(res)
        if (callback) {
          callback;
        }
      }).then(function(res) {
        // fail.

      }).finally(function() {
        // do this regardless of success/fail.
      })

      return deferred.promise.$$state;
    }
  };
}]);