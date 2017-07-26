
var liveChinaApp=angular.module('liveChinaApp', ['ngRoute']);
var API_URL_ROOT = 'http://twapi.live.hoge.cn/index.php';
liveChinaApp.constant('API_URL_ROOT', API_URL_ROOT);
//路由
liveChinaApp.config(['$routeProvider',
    function(rp) {
        rp.when('/live/:id',{templateUrl:'../liveChina/src/template/liveList.html'})
            .when('/bbb', {templateUrl:'../tmps/bbb.html',
                          controller: 'liveList'})
            .otherwise({templateUrl:'../liveChina/src/template/liveIndex.html'});
    }])
liveChinaApp.controller('live', ['$scope','$http' ,function($scope,$http){
    $scope.aa=0;
    $http({
        method: 'JSONP',
        // url: 'http://www.b.com/test.php?callback=JSON_CALLBACK',
        url:API_URL_ROOT+"?callback=JSON_CALLBACK"+'&m=Apituwenol&c=tuwenol&a=show&custom_appkey=da1c994019b00a760a68e735db9dc281&custom_appid=197',
        // data:{
        //     show_tailer:0,
        //     custom_appkey:'da1c994019b00a760a68e735db9dc281',
        //     custom_appid:197
        // },
    }).success(function (msg) {
    $scope.liveType=msg;
        $scope.trailer=[];
        $scope.history=[];
        $scope.live=[];
        // console.log(msg);
        angular.forEach($scope.liveType,function(data,index){
            // console.log(index)
            if(data.time_status===1){
                $scope.trailer.push(data)
            }else if(data.time_status===2){
                $scope.live.push(data)

            }else if(data.time_status===0){
                $scope.history.push(data)

            }
        });
        console.log('$scope.live');

        console.log($scope.live);
        console.log('$scope.history');

        console.log($scope.history);
        console.log('$scope.trailer');

        console.log($scope.trailer);


    });
}]);
liveChinaApp.controller('liveList',  function($scope,$http,API_URL_ROOT,$routeParams){
        console.log($routeParams.id); console.log(34)

    })
// liveChinaApp.config(['$routeProvider', function($routeProvider){
//     $routeProvider
//         .when('/',{template:'这是首页页面'})
//         .when('/computers',{template:'这是电脑分类页面'})
//         .when('/printers',{template:'这是打印机页面'})
//         .otherwise({redirectTo:'/'});
// }]);