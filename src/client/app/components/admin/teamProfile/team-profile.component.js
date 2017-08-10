angular.module('app.admin')
  .component('teamProfile', {
    templateUrl: 'app/components/admin/teamProfile/team-profile.html',
    controller: teamProfileController,
    controllerAs: 'vm',
    bindings: {
      menu: '='
    }
  });
teamProfileController.inject = [];

function teamProfileController() {
  var vm = this;
}
