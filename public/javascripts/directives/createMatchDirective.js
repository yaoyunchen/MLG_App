angular.module('cMLGApp').directive('createMatch', function($timeout, $q, $http) {
  return {
    retrict: 'AE',
    require: 'ngModel',
    link: function(scope, elm, attr, model) {
      model.$asyncValidators.summonerRegistered = function() {
        scope.loading = true;
      return $http.get('/db/search/users/' + scope.matchInviteForm.summonerName.$$rawModelValue + JSONCALLBACK, {timeout: 5000})
        .then(function(res) {
          if (res.status == 200) {
            if (res.data.rowCount != 0) {
              // Summoner registered in our database.
              scope.userExists = true;
              // scope.user_id = res.data.rows[0].id;
            } else {
              // Summoner is not registered, check if the name entered is actual summoner name.
              scope.userExists = false;
              alert('User not registered!');
            }
          }
        }, function(res){
          // Unable to connect to users database to verify summoner name.
          model.$setValidity('connection', false);
        }).finally(function() {
          scope.loading = false;
        });
      };
    }
  };
});