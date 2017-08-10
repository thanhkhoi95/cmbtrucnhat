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
    vm.numOfComposers = '';
    vm.currentMusicianIndex = -1;
    vm.composersList = [];
    vm.changeCurrentArtistIndex = changeCurrentArtistIndex;
    vm.changeCurrentMusicianIndex = changeCurrentMusicianIndex;

    function changeMenu(state) {
        vm.menu = state;
    }

    function changeCurrentArtistIndex(index) {
        vm.currentArtistIndex = index;
    }

    function changeCurrentMusicianIndex(index) {
        vm.currentMusicianIndex = index;
    }

}
