var cMLGApp = angular.module('cMLGApp');

cMLGApp.factory('$users', ['$http', '$q', function($http, $q) {

  return {
    get: function(email, password, callback) {
      var deferred = $q.defer();

      var url = '/db/search/users/login/' + email + '/' + password + JSONCALLBACK;

      $http.get(url).then(function(res) {
        // success.
        console.log(res.data);
        if(res.data.hasOwnProperty('username') === true){
          if(password === res.data.password){
            deferred.resolve(res.data);
          }
        } else {
          deferred.resolve('error');
        }

        if (callback) {
          callback;
        }
        
      }).then(function(res) {
        // fail.
        deferred.resolve(res);
      }).finally(function() {
        // do this regardless of success/fail.
      })
      return deferred.promise.$$state;
    },

    checkUsername: function(username) {
      var deferred = $q.defer();

      var url = '/db/search/users/' + username + JSONCALLBACK;
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

    saveUser: function(data) {
      var url = '/db/post/user/' + data + JSONCALLBACK;
      $http.post(url).then(function(res) {
        // success
        return res;
      })
    }
  };
}]);