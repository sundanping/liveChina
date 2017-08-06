var liveChinaApp=angular.module('liveChinaApp', ['ngRoute','luegg.directives']);
//URL
var API_URL_ROOT = 'http://operate.tw.live.hoge.cn/index.php';
    liveChinaApp.constant('API_URL_ROOT', API_URL_ROOT);
liveChinaApp.controller('live', ['$scope','$http' ,'$interval', function($scope,$http,$interval){
    // console.log(document.documentElement.style.fontSize)
    $scope.timer=function(t){
        $scope.ts=t-(new Date().getTime());

        $scope.dd = parseInt($scope.ts / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
        $scope.hh = parseInt($scope.ts / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
        $scope.mm = parseInt($scope.ts / 1000 / 60 % 60, 10);//计算剩余的分钟数
        $scope.ss = parseInt($scope.ts / 1000 % 60, 10);//计算剩余的秒数
        $scope.mmmm=parseInt($scope.ts / 1000 / 60 , 10);//计算剩余的全部分钟数

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
        if($scope.dd*1 >0){
            return $scope.dd+'天'+$scope.hh+'小时后'
        }else if($scope.dd*1 ==0 && $scope.hh<24 && $scope.hh>0 ){
            return $scope.hh+'小时后'

        }else {
            if ($scope.ts<=0) {
                $scope.dd=0; $scope.hh=0; $scope.mm=0; $scope.ss=0; $scope.mmmm=0;
                return '直播开始'
            }else
            return $scope.mm+"分"+$scope.ss+'秒后';
        }
    }
    // $scope.ask=function(){
    //     $scope.$apply();
    // }
    // var cleartim=null;
    // cleartim= setInterval($scope.ask,1000)

    $interval($scope.timer,1000)
    $scope.goBack=function(){
        history.back()
    }
    $http({
        method: 'JSONP',
        url:API_URL_ROOT+"?callback=JSON_CALLBACK"+'&m=Apituwenol&c=tuwenol&a=show&custom_appkey=da1c994019b00a760a68e735db9dc281&custom_appid=197',
    }).success(function (msg) {
    $scope.liveType=msg;
        // console.log(JSON.stringify(msg[0]))
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
        console.log($scope.trailer)
    });
}]);

