var liveChinaApp=angular.module('liveChinaApp', ['ngRoute']);
//URL
var API_URL_ROOT = 'http://twapi.live.hoge.cn/index.php';
    liveChinaApp.constant('API_URL_ROOT', API_URL_ROOT);

//剩余时间
// function countDown(time){
//     var remainingTime= Date.parse(new Date(time))-new Date();`
//     return remainingTime;
//     console.log(remainingTime)
// }
//
// countDown('2017-02-06 00:00')
//剩余时间

liveChinaApp.controller('live', ['$scope','$http' ,function($scope,$http){
setInterval(timer,1000)

    function timer(){
        $scope.time=new Date().getTime();

        console.log($scope.time)
    }
    $scope.goBack=function(){
        history.back()
    }
    $http({
        method: 'JSONP',
        url:API_URL_ROOT+"?callback=JSON_CALLBACK"+'&m=Apituwenol&c=tuwenol&a=show&custom_appkey=da1c994019b00a760a68e735db9dc281&custom_appid=197',

    }).success(function (msg) {
        console.log(msg)
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
//倒计时

// function timer()
// {
//     var ts = (new Date(2017, 07, 29, 9, 0, 0)) - (new Date());//计算剩余的毫秒数
//     $scope.dd = parseInt(ts / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
//     $scope.hh = parseInt(ts / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
//     $scope.mm = parseInt(ts / 1000 / 60 % 60, 10);//计算剩余的分钟数
//     $scope.ss = parseInt(ts / 1000 % 60, 10);//计算剩余的秒数
//     $scope.dd= checkTime($scope.dd);
//     $scope.hh = checkTime($scope.hh);
//     $scope.mm = checkTime($scope.mm);
//     $scope.ss = checkTime($scope.ss);
//     $scope.apply()
//     console.log($scope.dd+$scope.hh)
//     // document.getElementById("timer").innerHTML = dd + "天" + hh + "时" + mm + "分" + ss + "秒";
//     setInterval("timer()",1000);
// }
// function checkTime(i)
// {
//     if (i < 10) {
//         i = "0" + i;
//     }
//     return i;
// }
//
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