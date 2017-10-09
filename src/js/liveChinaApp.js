var liveChinaApp = angular.module('liveChinaApp', ['ngRoute', 'ngTouch','duScroll']);



//URL
var API_URL_ROOT = 'http://operate.tw.live.hoge.cn/index.php';
liveChinaApp.constant('API_URL_ROOT', API_URL_ROOT);

liveChinaApp.controller('live', ['$scope', '$http', '$interval', '$window','$document',
    function ($scope, $http, $interval, $window, filterServer, $document) {

        $scope.searchWords= '';
        $scope.trailer = [];
        $scope.history = [];
        $scope.recommendLive = [];
        $scope.live = [];
        $scope.searchType = true;
        $scope.recommendList = [];
        $scope.searchIsEmpty = false;
        $scope.recommend = false;
        $scope.index = -1;
        $scope.timer = function (t) {
            $scope.ts = (new Date(t.start_time_show).getTime() - (new Date().getTime())) * 1;

            $scope.dd = parseInt($scope.ts / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
            $scope.hh = parseInt($scope.ts / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
            $scope.mm = parseInt($scope.ts / 1000 / 60 % 60, 10);//计算剩余的分钟数
            $scope.ss = parseInt($scope.ts / 1000 % 60, 10);//计算剩余的秒数
            $scope.mmmm = parseInt($scope.ts / 1000 / 60, 10);//计算剩余的全部分钟数

            $scope.dd = checkTime($scope.dd);
            $scope.hh = checkTime($scope.hh);
            $scope.ss = checkTime($scope.ss);
            $scope.mm = checkTime($scope.mm);

            $scope.mmmm = checkTime($scope.mmmm);

            function checkTime(t) {
                if (t < 10) {
                    t = '0' + t
                }
                return t;
            }

            if ($scope.ts <= 0) {
                $scope.dd = 0;
                $scope.hh = 0;
                $scope.mm = 0;
                $scope.ss = 0;
                $scope.mmmm = 0
            }
            if ($scope.dd * 1 > 0) {
                return $scope.dd + '天' + $scope.hh + '小时后'
            } else if ($scope.dd * 1 == 0 && $scope.hh < 24 && $scope.hh > 0) {
                return $scope.hh + '小时后'

            } else {
                if ($scope.ts <= 0) {
                    $scope.dd = 0;
                    $scope.hh = 0;
                    $scope.mm = 0;
                    $scope.ss = 0;
                    $scope.mmmm = 0;
                    // $window.location.reload();
                    t.time_status = 1;
                    // $scope.trailer.filter(function(item,index,arr){
                    //     if(item.id==t.id){
                    //         $scope.index=index;
                    //     }
                    // })
                    // $scope.trailer.splice($scope.index,1)
                    // $scope.live.unshfit(t)
                    return '直播开始'

                } else
                    return $scope.mm + "分" + $scope.ss + '秒后';
            }
        }

        $interval($scope.timer, 1000)
        $scope.goBack = function () {
            history.back()
        }
        $http({
            method: 'JSONP',
            url: API_URL_ROOT + '?callback=JSON_CALLBACK&custom_appkey=G8FHXedPgl4i7sA2rfUISxfaB0NB5WJC&custom_appid=83&m=Apituwenol&c=tuwenol&a=show'
            // url:API_URL_ROOT+'?callback=JSON_CALLBACK&custom_appkey=da1c994019b00a760a68e735db9dc281&custom_appid=197&m=Apituwenol&c=tuwenol&a=show'
        }).success(function (msg) {
            $scope.liveType = msg;
            window.sessionStorage.setItem('filterData', JSON.stringify($scope.liveType))
            angular.forEach($scope.liveType, function (data, index) {
                if (data.time_status === 0) {
                    $scope.trailer.push(data)
                    $scope.trailer.filter(function (item, index, arr) {
                        //iPhone会NaN 2017-08-14 12:42:02 转 2017/08/14 12:42:10
                        item.start_time_show = item.start_time_show.replace(/-/g, '/')
                    })
                } else if (data.time_status === 1) {
                    $scope.live.push(data)
                    $scope.recommendLive.push(data)
                    $scope.recommendList.push(data)
                } else if (data.time_status === 2) {
                    $scope.history.push(data)
                }

            });
            // console.log($scope.trailer)
        });

        $scope.$watch('searchWords',function(newVal,oldVal){
            if(newVal.length === 0){
                $scope.searchType = true;

            }
        })
    // 搜索功能实现
    //  点击搜索按钮 先刷算结果 再清空原有数据展示当下数据；推荐为搜索的结果低于三个；且有直播的情况下推荐直播；如果没有直播就推荐回看
        $scope.search = function(){
            $scope.searchWords.length>0 ? $scope.searchType = false :$scope.searchType = true;
            $scope.trailer.length=0;
            $scope.history.length = 0;
            $scope.live.length = 0 ;
            $scope.searchIsEmpty = false;//搜索内容为空
            $scope.recommend = false; //不推荐

            $scope.recommendList = [];
            console.log($scope.liveType)
            $scope.newHistory= $scope.liveType.filter(function(item){
                return item.title.indexOf($scope.searchWords)> -1
            })
            console.log($scope.newHistory)
            if($scope.newHistory.length > 3 ){
                $scope.recommend = false
            }
            angular.forEach($scope.newHistory, function (data, index) {
                if (data.time_status === 0) {
                    $scope.trailer.push(data)
                    $scope.trailer.filter(function (item, index, arr) {
                       //iPhone会NaN 2017-08-14 12:42:02 转 2017/08/14 12:42:10
                       item.start_time_show = item.start_time_show.replace(/-/g, '/')
                    })
                } else if (data.time_status === 1 ) {
                    $scope.live.push(data)
                    // $scope.recommendList.push(data)
                } else if (data.time_status === 2) {
                    $scope.history.push(data)
                }
            });
            //去除重复数据 搜过结果和推荐数据相同的则过滤掉
            $scope.recommendList= $scope.recommendLive.filter(function(item ,index){
                return item.title.indexOf($scope.searchWords) === -1
            })
            console.log($scope.recommendList)
            if( ($scope.trailer.length + $scope.history.length + $scope.live.length) <3 && $scope.recommendList.length > 0){
                $scope.recommend = true
            }else if(($scope.trailer.length + $scope.history.length + $scope.live.length) === 0 && $scope.recommendList.length === 0){
                $scope.searchIsEmpty = true
            }

        };
        $scope.cancelSearch = function(){
            $scope.searchWords= '';
            $scope.searchType = true;
            $scope.trailer.length=0;
            $scope.history.length = 0;
            $scope.live.length = 0 ;
            angular.forEach($scope.liveType, function (data, index) {
                if (data.time_status === 0) {
                    $scope.trailer.push(data)
                    $scope.trailer.filter(function (item, index, arr) {
                        //iPhone会NaN 2017-08-14 12:42:02 转 2017/08/14 12:42:10
                        item.start_time_show = item.start_time_show.replace(/-/g, '/')
                    })
                } else if (data.time_status === 1) {
                    $scope.live.push(data)
                    // $scope.recommendList.push(data)
                } else if (data.time_status === 2) {
                    $scope.history.push(data)
                }

            });

        }
        $scope.ask = function(){

            console.dir(document.getElementById('empty'))
        }

    }]);



