var cMLGApp = angular.module('cMLGApp');

cMLGApp.factory('$users', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) {

  return {
    get: function(email, password, callback) {
      var deferred = $q.defer();

      var url = '/db/search/users/login/' + email + '/' + password + JSONCALLBACK;

      $http.get(url).then(function(res) {
        // success.
        if (res.data === undefined || res.data == '') {
          deferred.resolve({error: 'Email not registered.'});
        } else if (res.data != undefined && res.data != '') {
          if (password === res.data.password) {
            var user = {
              username: res.data.username, 
              user_id: res.data.id
            }
            deferred.resolve(user)
          } else {
            deferred.resolve({error: 'Incorrect password.'});
          }
        }
      })

      if (callback) {
        callback();
      }

      return deferred.promise.$$state;
    },

    checkUsername: function(username,callback) {
      var deferred = $q.defer();

      var url = '/db/search/users/' + username + JSONCALLBACK;
      $http.get(url).then(function(res) {
        deferred.resolve(res)
        if(callback){
          callback();
        }
      })

      return deferred.promise.$$state;
    }, 

    checkEmail: function(email, callback) {
      var deferred = $q.defer();
      var url = '/db/search/users/email/' + email + JSONCALLBACK;
      $http.get(url).then(function(res) {
        deferred.resolve(res)
        if (callback) {
          callback();
        }
      })

      return deferred.promise.$$state;
    },

    saveUser: function(data) {
      var url = '/db/post/user/' + data + JSONCALLBACK;
      $http.post(url).then(function(res) {
        // success
        if (res.data.hasOwnProperty('rows')) {
          localStorage['username'] = res.data.rows[0].username;
          localStorage['user_id'] = res.data.rows[0].id;
        }
      })
    }
  };
}]);