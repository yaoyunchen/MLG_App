angular.module('cMLGApp').directive('loginDirective', function($timeout, $q, $http) {
  return {
    retrict: 'AE',
    require: 'ngModel',
    link: function(scope, elm, attr, model) {
      userExists = function() {
        var username = scope.loginForm.username;
        var password = scope.loginForm.password;
        var url = '/db/search/users/login/' + email + '/' + password +'?callback=JSON_CALLBACK';

        return $http.get(url)
          .then(function(res) {
            // Connected to LoL API to confirm summoner actually exists.
            if (res.status == 200) {
              // Successful connection to routes and have data returned.  
              if (res != "") {
                // If returned data contains a summoner's information.
                console.log("success: " + res);
              } else if (res.data.hasOwnProperty('status') && res.data.status.status_code == 404) {
                // If returned data shows that the summoner is not found.
                console.log('failed');
              }
            }
          }, function(res) {
            // Unable to connect to LoL API to verify summoner name.
                console.log('failed');
          });
      };
    }
  };
});