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
    $scope.timer=function(t){
        console.log(1)

        $scope.ts=t-(new Date().getTime());

        $scope.dd = parseInt($scope.ts / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
        $scope.hh = parseInt($scope.ts / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
        $scope.mm = parseInt($scope.ts / 1000 / 60 % 60, 10)+1;//计算剩余的分钟数
        $scope.ss = parseInt($scope.ts / 1000 % 60, 10);//计算剩余的秒数
        $scope.mmmm=parseInt($scope.ts / 1000 / 60 , 10)+1;//计算剩余的全部分钟数

        $scope.dd = checkTime($scope.dd);
        $scope.hh = checkTime($scope.hh);
        $scope.mm = checkTime($scope.mm);
        $scope.ss = checkTime($scope.ss);
        $scope.mmmm = checkTime($scope.mmmm);

        function checkTime(t){
            if(t<10){
                t='0'+t
            }
            return t;
        }

        if ($scope.ts<=0) {
            $scope.dd=0; $scope.hh=0; $scope.mm=0; $scope.ss=0; $scope.mmmm=0
        }
        return $scope.mmmm+"分钟后";
        console.log(1)
        // $scope.$apply();

        // setTimeout(timer,1000)
        // return $scope.dd + "天" + $scope.hh + "时" + $scope.mm + "分" + $scope.ss + "秒"; ;
    }


    $scope.ask=function(){
        //
        $scope.$apply();

    }
    var cleartim=null;
    cleartim= setInterval($scope.ask,1000)


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