(function () {
    var moment = require('moment');
    var router = require('express').Router();
    var lastUpdateDate = '2019-03-17T17:00:00.000Z';
    lastUpdateDate = new Date(lastUpdateDate);
    // var now = new Date();
    // console.log(bornDate);
    // console.log(now);
    // console.log(dateSubtract(now, bornDate));
    // lastUpdateDate.setDate((new Date(lastUpdateDate.valueOf())).getDate() + 7);
    var danhsach = ['Hồng', 'Hân', 'Ánh', 'Ngọc', 'Duy', 'Vũ', 'Trường', 'Long', 'Khôi'];
    var thutu = ['Hồng', 'Duy', 'Ánh', 'Khôi', 'Long', 'Ngọc', 'Trường', 'Hân', 'Vũ'];

    var state = [
        [0, 5, 5, 4, 2, 3, 4, 1, 5],
        [-1, -1, -1, -1, 0, -1, -1, 1, 1],
        [1, 1, 0, 1, -1, -1, -1, 1, -1],
        [-1, -1, -1, -1, 1, 1, 1, -1, 0],
        [1, 1, 1, 1, -1, -1, -1, 0, -1],
        [1, 1, 1, 0, -1, 1, 1, -1, -1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1],

        [3, 3, 1, 2, 1, 0, 2, 3, 3]
    ];

    // var state = [ [ 3, 2, 1, 7, 5, 6, 7, 4, 0 ],
    // [ -1, -1, -1, -1, 0, -1, -1, 2, 1 ],
    // [ 1, 0, 3, 2, -1, -1, -1, 4, -1 ],
    // [ -1, -1, -1, -1, 2, 1, 0, -1, 3 ],
    // [ 0, 4, 2, 1, -1, -1, -1, 3, -1 ],
    // [ 4, 4, 0, 3, -1, 2, 1, -1, -1 ],
    // [ 4, 4, 4, 0, 1, 4, 3, 4, 2 ],
    // [ 4, 3, 4, 4, 4, 0, 2, 1, 4 ],
    // [ 2, 1, 4, 5, 4, 3, 5, 0, 6 ] ];

    function dateSubtract(date1, date2) {
        //Get 1 day in milliseconds
        var oneDay = 1000 * 60 * 60 * 24;

        // Convert both dates to milliseconds
        var date1Ms = date1.getTime();
        var date2Ms = date2.getTime();

        // Calculate the difference in milliseconds
        var differenceMs = date1Ms - date2Ms;

        // Convert back to days and return
        return (differenceMs / oneDay);
    }

    module.exports = function () {

        router.get('/', getTrucnhatList);

        function getTrucnhatList(req, res, next) {
            var endDate = new Date(lastUpdateDate.getTime());
            endDate.setDate((new Date(lastUpdateDate.valueOf())).getDate() + 5);
            res.send({
                'thutu': thutu,
                'from': lastUpdateDate.toLocaleString('vi', {timeZone: 'Asia/Bangkok'}).split(',')[0],
                'to': endDate.toLocaleString('vi', {timeZone: 'Asia/Bangkok'}).split(',')[0],
            });
        }

        return router;
    };

    // var date = new Date();
    // date.setDate((new Date(lastUpdateDate.valueOf())).getDate() + 6);
    // console.log(date.toLocaleString('vi', {timeZone: 'Asia/Bangkok'}));
    // console.log(dateSubtract(date, lastUpdateDate));
    setInterval(function() {
        var now = new Date();
        var flag = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        // var now = '2019-03-30T17:00:00.000Z';
        // now = new Date(now);
        var days = dateSubtract(now, lastUpdateDate);
        console.log(days);
        // console.log(days);
        var max = 0;
        var x = 0;
        var i = 0;
        var j = 0;
        if (days >= 6) {
            lastUpdateDate.setDate((new Date(lastUpdateDate.valueOf())).getDate() + 7);
            for (j = 0; j < 9; j++) {
                state[0][j]++;
                if (state[0][j] > max) {
                    max = state[0][j];
                    x = j;
                }
            }
            thutu[0] = danhsach[x];
            state[0][x] = 0;
            flag[x] = 1;

            max = 0;
            for (j = 0; j < 9; j++) {
                state[8][j]++;
                if (flag[j] === 0 && state[8][j] > max) {
                    max = state[8][j];
                    x = j;
                }
            }
            thutu[8] = danhsach[x];
            state[8][x] = 0;
            flag[x] = 1;

            for (i = 1; i < 8; i++) {
                max = 0;
                // console.log('----i= ', i);
                for (j = 0; j < 9; j++) {
                    if (state[i][j] > -1) {
                        state[i][j]++;
                        if (flag[j] === 0 && state[i][j] > max) {
                            // console.log('j= ',j);
                            max = state[i][j];
                            x = j;
                        }
                    }
                }
                thutu[i] = danhsach[x];
                state[i][x] = 0;
                // console.log('x = ', x);
                flag[x] = 1;
            }
        }
        // console.log(state);
        // console.log(thutu);
    }, 60000);

})();