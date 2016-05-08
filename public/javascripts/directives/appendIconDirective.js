angular.module('cMLGApp').directive('appendIcon',function($timeout, $q, $http, $compile) {
  return {
    restrict: 'A',
    link: function(scope, elem, attr, createMatchController) {
      // Sets all tabs as inactive when they begin.
      $timeout(function() {
        scope.selectChamp;
        var ListOfChamp = scope.championData.value.data.data;
        for (var champ in ListOfChamp) {
          var url = 'http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion/' + ListOfChamp[champ].image.full;
          var thisDiv = angular.element(document).find('#appendIcon');
          var template = "<div class='selectChamp'><img class='img-signup-icon selectChampIcon' ng-src='"+url+"' ng-click=\"selectChamp('"+ListOfChamp[champ].key+"')\"/></div>";
          var linkFn = $compile(template);
          var content = linkFn(scope);

          thisDiv.append(content);
        }
      }, 1000);
    }
  }
});