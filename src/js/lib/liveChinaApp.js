var liveChinaApp=angular.module('liveChinaApp', ['ngRoute']);
//URL
var API_URL_ROOT = 'http://twapi.live.hoge.cn/index.php';
    liveChinaApp.constant('API_URL_ROOT', API_URL_ROOT);

liveChinaApp.controller('live', ['$scope','$http' ,function($scope,$http){
    $scope.aa=0;
    $http({
        method: 'JSONP',
        url:API_URL_ROOT+"?callback=JSON_CALLBACK"+'&m=Apituwenol&c=tuwenol&a=show&custom_appkey=da1c994019b00a760a68e735db9dc281&custom_appid=197',

    }).success(function (msg) {
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

liveChinaApp.config(['$routeProvider',
    function(rp) {
        rp.when('/liveList/:id',{templateUrl:'../liveChina/src/template/liveList.html',
            controller:'liveList' })
            .otherwise({templateUrl:'../liveChina/src/template/liveIndex.html'});
    }])