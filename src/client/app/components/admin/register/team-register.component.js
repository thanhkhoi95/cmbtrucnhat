angular.module('app.admin')
  .component('teamRegister', {
    templateUrl: 'app/components/admin/register/team-register.html',
    controller: teamRegisterController,
    controllerAs: 'vm',
    bindings: {
      menu: '='
    }
  });
teamRegisterController.inject = ['authService'];

function teamRegisterController(authService) {
  var vm = this;
  vm.teamRegister = teamRegister;

  function teamRegister() {
    var newTeam = {
      name: vm.name,
      date: moment(),
      location: vm.location
    }
    return authService.teamRegister(newTeam).then(
      function (res) {
        toastr.success(res);
        vm.menu = 'exploreTeam';
      },
      function (err) {
        toastr.error(err);
      }
    );
  }

}
