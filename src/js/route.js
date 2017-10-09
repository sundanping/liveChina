//路由
liveChinaApp.config(['$routeProvider',
    function (rp) {
        rp.when('/liveList/:id/:time_status', {
            templateUrl: 'src/template/liveList.html',

        }).when('/search', {
            templateUrl: 'src/template/search.html',
        })
            .otherwise({
                templateUrl: 'src/template/liveIndex.html'
            });
    }])