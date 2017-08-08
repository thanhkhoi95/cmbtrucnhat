angular.module('app.admin')
  .controller('adminController', adminController);

function adminController() {
  var vm = this;

  var newMusician = {
    name: '',
    birthdate: undefined,
    detailInformation: undefined
  };

  vm.menu = 1;
  vm.subState = [0, 0, 0];
  vm.changeMenu = changeMenu;
  vm.numOfSingers = '';
  vm.currentArtistIndex = -1;
  vm.singersList = [];

  function changeMenu(state) {
    vm.menu = state;
  }

}
