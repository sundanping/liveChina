
//路由
liveChinaApp.config(['$routeProvider',
    function(rp) {
        rp.when('/liveList/:id/:time_status',{templateUrl:'src/template/liveList.html',
            controller:'liveList' })
            .when('/search',{templateUrl:'src/template/search.html',
                controller:'search' }
            )
            .otherwise({templateUrl:'src/template/liveIndex.html'});
    }])
