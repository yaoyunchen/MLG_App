var cMLGApp = angular.module('cMLGApp');

cMLGApp.factory('$matchFactory', ['$http', '$q', function($http, $q) {

  return {
    post: function(username, champion, bet, betType, matchType) {
      var url = '/db/post/match_request/'+username+'/'+champion+'/'+bet+'/'+betType+'/'+matchType;
      $http.post(url).then(function(res) {
        //success
      }).then(function(res) {
        // fail.
        deferred.resolve(res);
      }).finally(function() {
        // do this regardless of success/fail.
      })
    }
  };
}]);