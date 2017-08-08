angular.module('app.admin')
  .controller('adminController', adminController);

function adminController() {
  var vm = this;
  vm.menu = 'exploreTeam';
  vm.changeMenu = changeMenu;

  function changeMenu(state) {
    vm.menu = state;
  }

}
