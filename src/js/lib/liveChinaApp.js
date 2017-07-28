var liveChinaApp=angular.module('liveChinaApp', ['ngRoute']);
//URL
var API_URL_ROOT = 'http://twapi.live.hoge.cn/index.php';
    liveChinaApp.constant('API_URL_ROOT', API_URL_ROOT);

//剩余时间
function countDown(time){
    var remainingTime= Date.parse(new Date(time))-new Date();
    return remainingTime;
    console.log(remainingTime)
}

countDown('2017-02-06 00:00')
//剩余时间

liveChinaApp.controller('live', ['$scope','$http' ,function($scope,$http){


    $http({
        method: 'JSONP',
        url:API_URL_ROOT+"?callback=JSON_CALLBACK"+'&m=Apituwenol&c=tuwenol&a=show&custom_appkey=da1c994019b00a760a68e735db9dc281&custom_appid=197',

    }).success(function (msg) {
        console.log(JSON.stringify(msg))
    $scope.liveType=msg;
        $scope.trailer=[];
        $scope.history=[];
        $scope.live=[];
        angular.forEach($scope.liveType,function(data,index){
            if(data.time_status===1){
                $scope.trailer.push(data)
            }else if(data.time_status===2){
                $scope.live.push(data)
            }else if(data.time_status===0){
                $scope.history.push(data)

            }
        });


    });
}]);
//
liveChinaApp.config(['$routeProvider',
    function(rp) {

        rp.when('/liveList/:id/:time_status',{templateUrl:'src/template/liveList.html',
            controller:'liveList' })
            .otherwise({templateUrl:'src/template/liveIndex.html'});
    }])