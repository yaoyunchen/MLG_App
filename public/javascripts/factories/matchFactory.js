var cMLGApp = angular.module('cMLGApp');

cMLGApp.factory('$matchFactory', ['$http', '$q', function($http, $q) {

  return {
    //create match request
    post: function(user_id, match_id, champion_id, champion_key, bet, betType, matchType, status) {
      var url = '/db/post/match_request/'+user_id+'/'+match_id+'/'+champion_id+'/'+champion_key+'/'+bet+'/'+betType+'/'+matchType+'/'+status;
      $http.post(url).then(function(res) {
        //success
      }).then(function(res) {
        // fail.
        deferred.resolve(res);
      }).finally(function() {
        // do this regardless of success/fail.
      })
    },
    //create match
    createMatch: function(data_str, callback) {
      var deferred = $q.defer();
      var url = '/db/post/match/' + data_str;
      $http.post(url).then(function(res) {
        //success
        if(callback){
          callback(res);
        }
        deferred.resolve(res);
      })
      return deferred.promise.$$state;
    },

    //get all active match requests
    get: function(user_id, callback) {
      var deferred = $q.defer();
      var url = '/db/get/match_request/active/' + user_id + '?callback=JSON_CALLBACK';
      $http.get(url).then(function(res) {
        //success
        var data = {};
        var result = res.data.rows;
        for (var key in result) {
          if (!result.hasOwnProperty(key)) continue;
          var obj = result[key];
          //getting champion image url
          obj.image = 'http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion/'+obj.champion_key+'.png'
          //converting status int into str
          if(obj.status === 1){
            obj.status_str = 'Pending';
          } else if(obj.status === 2){
            obj.status_str = 'Waiting for Other Player';
          }
          //converting bet type int into str
          if(obj.bettype === 0){
            obj.bettype_str = 'Close Match';
          } else if(obj.bettype === 1){
            obj.bettype_str = 'Big Win';
          }
        };
        deferred.resolve(res);

        if (callback) {
          callback();
        }
      })
      return deferred.promise.$$state;
    },

    // All current matches for a user.
    getActiveMatches: function(user_id, callback) {
      var deferred = $q.defer();
      var url = '/db/get/match/current/' + user_id + '?callback=JSON_CALLBACK';
      $http.get(url).then(function(res) {
        //success
        var data = {};
        var result = res.data.rows;
        for (var key in result) {

          if (!result.hasOwnProperty(key)) continue;
          var obj = result[key];
          //getting champion image url
          obj.image = 'http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion/'+obj.champion_key+'.png'
          //converting bet type int into str
          if(obj.bettype === 0){
            obj.bettype_str = 'Close Match';
          } else if(obj.bettype === 1){
            obj.bettype_str = 'Big Win';
          }
        };
        deferred.resolve(res);

        if (callback) {
          callback();
        }
      })
      return deferred.promise.$$state;
    },

    getMatchRequests: function(match_id, callback) {
      var deferred = $q.defer();

      var url = '/db/matchrequests/'+ match_id;

      $http.get(url).then(function(res) {
        deferred.resolve(res);
        if (callback) {
          callback();
        }
      });
      return deferred.promise.$$state;
    },

    // Accept Match
    acceptMatch: function(match_id, request_id, user_id, mlg_points) {
      var deferred = $q.defer();

      var url = '/db/matches/accept/' + match_id + '/' + request_id + '/' + user_id + '/' + mlg_points;
      console.log(url)
      $http.post(url).then(function(res) {
        deferred.resolve(res);
      });
      return deferred.promise.$$state;
    }

  };
}]);