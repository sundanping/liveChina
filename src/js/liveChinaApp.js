var liveChinaApp=angular.module('liveChinaApp', ['ngRoute','ngTouch']);

//路由
liveChinaApp.config(['$routeProvider',
    function(rp) {
        rp.when('/liveList/:id/:time_status',{
            templateUrl:'src/template/liveList.html',

        }).when('/search',{
            templateUrl:'src/template/search.html',
        })
            .otherwise({templateUrl:'src/template/liveIndex.html'
            });
    }])

//URL
var API_URL_ROOT = 'http://operate.tw.live.hoge.cn/index.php';
liveChinaApp.constant('API_URL_ROOT', API_URL_ROOT);
// console.log(113434)

liveChinaApp.controller('live', ['$scope','$http' ,'$interval','$window',
    function($scope,$http,$interval,$window,filterServer){
    console.log(1111,'123')
    $scope.trailer=[];
    $scope.history=[];
    $scope.live=[];
    $scope.index=-1;
    $scope.timer=function(t){
        $scope.ts=(new Date(t.start_time_show ).getTime()-(new Date().getTime()))*1;

        $scope.dd = parseInt($scope.ts/ 1000 / 60 / 60 / 24, 10);//计算剩余的天数
        $scope.hh = parseInt($scope.ts / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
        $scope.mm = parseInt($scope.ts / 1000 / 60 % 60, 10);//计算剩余的分钟数
        $scope.ss = parseInt($scope.ts / 1000 % 60, 10);//计算剩余的秒数
        $scope.mmmm=parseInt($scope.ts / 1000 / 60 , 10);//计算剩余的全部分钟数

        $scope.dd = checkTime($scope.dd);
        $scope.hh = checkTime($scope.hh);
        $scope.ss = checkTime($scope.ss);
        $scope.mm = checkTime($scope.mm);

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
                // $window.location.reload();
                t.time_status=1;
                // $scope.trailer.filter(function(item,index,arr){
                //     if(item.id==t.id){
                //         $scope.index=index;
                //     }
                // })
                // $scope.trailer.splice($scope.index,1)
                // $scope.live.unshfit(t)
                return '直播开始'

            }else
            return $scope.mm+"分"+$scope.ss+'秒后';
        }
    }


    $interval($scope.timer,1000)
    $scope.goBack=function(){
        history.back()
    }
    $http({
        method: 'JSONP',
          url:API_URL_ROOT+'?callback=JSON_CALLBACK&custom_appkey=G8FHXedPgl4i7sA2rfUISxfaB0NB5WJC&custom_appid=83&m=Apituwenol&c=tuwenol&a=show'
        // url:API_URL_ROOT+'?callback=JSON_CALLBACK&custom_appkey=da1c994019b00a760a68e735db9dc281&custom_appid=197&m=Apituwenol&c=tuwenol&a=show'
    }).success(function (msg) {
         $scope.liveType=msg;
         console.log(msg)
        // (JSON.stringify($scope.liveType))
         window.sessionStorage.setItem('filterData',JSON.stringify($scope.liveType))
        angular.forEach($scope.liveType,function(data,index){
            if(data.time_status===0){
                $scope.trailer.push(data)
                //        t.replace(/-/g,'/')
                console.log(data)

                $scope.trailer.filter(function(item,index,arr){
                    //iPhone会NaN 2017-08-14 12:42:02 转 2017/08/14 12:42:10
                    item.start_time_show=item.start_time_show.replace(/-/g,'/')

                })
            }else if(data.time_status===1){
                $scope.live.push(data)

            }else if(data.time_status===2){
                $scope.history.push(data)
            }
           
        });
        // console.log($scope.trailer)
    });
}]);

