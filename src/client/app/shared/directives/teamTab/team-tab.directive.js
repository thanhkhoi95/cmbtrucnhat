(function () {

  angular.module('app.team')
    .directive('teamTab', teamTab);

  /* @ngInject */
  function teamTab() {
    var directive = {
      controller: teamTabController,
      controllerAs: 'vm',
      restrict: 'EA',
      scope: {
        type: '@',
        team: '=',
        changeMenu: '&'
      },
      template: '<div ng-include="vm.contentUrl"></div>'
    };
    teamTabController.$inject = ['$scope'];

    function teamTabController($scope) {
      var vm = this;
      vm.contentUrl = 'app/shared/directives/teamTab/';
      vm.team = $scope.team;
      if ($scope.type === 'away') {
        vm.contentUrl += 'awayTeam.html';
      } else if ($scope.type === 'home') {
        vm.contentUrl += 'homeTeam.html';
      } else {
        vm.contentUrl += 'member.html';
      }

    }
    return directive;
  }
})();
