(function () {

    exports.paging = function (data, count, pageIndex, pageSize) {
        var response = {};
        response.currentPage = parseInt(pageIndex);
        response.pageSize = parseInt(pageSize);
        if (count === 0) {
            response.totalPage = 0;
        }
        else {
            response.totalPage = (count % pageSize === 0) ?
                (count / pageSize) :
                ((count - count % pageSize) / pageSize + 1);
        }
        response.totalItems = count;
        response.items = [];

        for (var i in data) {
            if (i != null) {
                response.items.push(data[i]);
            }
        }

        return response;
    };

})();