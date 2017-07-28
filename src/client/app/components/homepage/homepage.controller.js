/*jshint esversion: 6*/

(function () {
    angular.module('app.homepage')
        .controller('HomePageController', ['$q', '$http', '$state', 'authService', HomepageController]);

    function HomepageController($q, $http, $state, authService) {
        var currentPage = 1;
        var pageSize = 6;
        var vm = this;
        vm.sw = 1;
        vm.accept = accept;
        vm.backgrounColor = ['#504F4F', '#484747', '#414040', '#3C3A3A', '#373636'];
        vm.rankSwitch = rankSwitch;
        vm.currentTeam = 0;
        vm.teams = [];
        vm.loadMore = loadMore;
        vm.isBusy = false;

        function getSuggestedMatchList(pageIndex) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: '/api/match/getPagination/' + authService.getToken()._id + '/' + pageIndex + '/' + pageSize
            }).then(function successCallback(response) {
                deferred.resolve(response.data);
            }, function () {
                deferred.reject(null);
            });
            return deferred.promise;
        }

        function loadMore() {
            // currentPage++;
            if (!vm.isBusy) {
                // console.log(currentPage);
                vm.isBusy = true;
                var more = getSuggestedMatchList(currentPage);
                more.then(
                    (res) => {
                        for (var i in res.items) {
                            if (res.items[i]) {
                                res.items[i].date = moment(res.items[i].time).format('DD-MM-YYYY');
                                res.items[i].time = moment(res.items[i].time).format('hh:mm');
                                res.items[i].dayOfWeek = moment(res.items[i].date, 'DD-MM-YYYY').weekday();
                                vm.teams.push(res.items[i]);
                            }
                        }

                        if (currentPage < res.totalPage) {
                            currentPage++;
                            vm.isBusy = false;
                        }
                    }
                );
            }

        }

        var teamRank = [{
            name: 'Bi Team',
            score: 10000
        }, {
            name: 'Bi Team',
            score: 10000
        },
        {
            name: 'Bi Team',
            score: 10000
        },
        {
            name: 'Bi Team',
            score: 10000
        },
        {
            name: 'Bi Team',
            score: 10000
        }];
        var personRank = [{
            name: 'Bi',
            score: 10000
        }, {
            name: 'Bi',
            score: 10000
        },
        {
            name: 'Bi',
            score: 10000
        },
        {
            name: 'Bi',
            score: 10000
        },
        {
            name: 'Bi',
            score: 10000
        }];
        vm.ranks = teamRank;

        vm.upcomingMatch = {
            homeTeam: 'BI AI TEAM',
            awayTeam: 'LEO TEAM',
            time: '15:00',
            type: '10',
            date: '26-05-2017',
            dayOfWeek: moment('26-05-2017", "DD-MM-YYYY').weekday()
        };
        function rankSwitch(sw) {
            vm.sw = sw;
            vm.ranks = vm.sw === 1 ? teamRank : personRank;
        }

        function accept(teamName) {
            vm.currentTeam = teamName;
        }
    }
})();