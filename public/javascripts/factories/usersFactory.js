var cMLGApp = angular.module('cMLGApp');

const JSONCALLBACK = '?callback=JSON_CALLBACK';

cMLGApp.factory('$user', ['$http', '$q', function($http, $q) {

  return {
    get: function(username, region, callback) {
      var deferred = $q.defer();
      var username = 'zelthrox';
      var password = 'password';
      var url = '/searchdatabase/' + username + '/' + password + JSONCALLBACK;
      var user = {};
      console.log('in factory');
      $http.get(url)
      .then(function(res) {
        
        if (res.status == 200) {
          console.log('status 200 in factory');
        }
      });

      return deferred.promise.$$state;
    }
  };
}]);