angular.module('app.admin')
  .component('songList', {
    templateUrl: 'app/components/admin/songList/song-list.html',
    controller: songListController,
    controllerAs: 'vm',
    bindings: {
      menu: '='
    }
  });

function songListController() {
  var vm = this;
  vm.changeMenu = changeMenu;

  function changeMenu(state) {
    vm.menu = state;
  }


  vm.teams = [{
    name: 'Bi Ai',
    quanlity: 12,
    _id: 1

  }, {
    name: 'Leo',
    quanlity: 10,
    _id: 2

  }, {
    name: 'Khoi',
    quanlity: 9,
    _id: 3

  }, {
    name: 'Phuong',
    quanlity: 8,
    _id: 4

  }, {
    name: 'Bi Ai',
    quanlity: 11,
    _id: 5

  }, {
    name: 'Bi Ai',
    quanlity: 13,
    _id: 6

  }];
  vm.homeTeams = [{
      name: 'BI AI TEAM',
      date: '26-05-2016',
      score: 1000,
      members: [{
          userId: 1,
          role: "Leader",
          position: "Goal Keeper",
          number: '01254684848'
        },
        {
          userId: 2,
          role: "Member",
          position: "Goal Keeper",
          number: '01254684848'
        },
        {
          userId: 3,
          role: "Member",
          position: "Goal Keeper",
          number: '01254684848'
        },
        {
          userId: 4,
          role: "Member",
          position: "Goal Keeper",
          number: '01254684848'
        },
        {
          userId: 5,
          role: "Member",
          position: "Goal Keeper",
          number: '01254684848'
        }
      ],
      location: 'Binh Thanh, TpHCM'
    },
    {
      name: 'KHOI TEAM',
      date: '26-05-2016',
      score: 1300,

      members: [{
          userId: 1,
          role: "Leader",
          position: "Goal Keeper",
          number: '01254684848'
        },
        {
          userId: 2,
          role: "Member",
          position: "Goal Keeper",
          number: '01254684848'
        },
        {
          userId: 3,
          role: "Member",
          position: "Goal Keeper",
          number: '01254684848'
        },
        {
          userId: 4,
          role: "Member",
          position: "Goal Keeper",
          number: '01254684848'
        },
        {
          userId: 5,
          role: "Member",
          position: "Goal Keeper",
          number: '01254684848'
        }
      ],
      location: 'Binh Thanh, TpHCM'
    },
    {
      name: 'LEO BI AI TEAM',
      date: '26-05-2016',
      score: 2000,
      members: [{
          userId: 1,
          role: "Leader",
          position: "Goal Keeper",
          number: '01254684848'
        },
        {
          userId: 2,
          role: "Member",
          position: "Goal Keeper",
          number: '01254684848'
        },
        {
          userId: 3,
          role: "Member",
          position: "Goal Keeper",
          number: '01254684848'
        },
        {
          userId: 4,
          role: "Member",
          position: "Goal Keeper",
          number: '01254684848'
        },
        {
          userId: 5,
          role: "Member",
          position: "Goal Keeper",
          number: '01254684848'
        }
      ],
      location: 'Binh Thanh, TpHCM'
    }
  ];
}
