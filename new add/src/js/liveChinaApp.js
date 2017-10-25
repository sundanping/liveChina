var liveChinaApp = angular.module('liveChinaApp', ['ngRoute', 'ngTouch', 'duScroll']);
//URL
var API_URL_ROOT = 'http://operate.tw.live.hoge.cn/index.php';
//var API_URL_ROOT = 'http://tuwenolsc.cloud.hoge.cn/views/live-china/dist/liveChina.html';
liveChinaApp.constant('API_URL_ROOT', API_URL_ROOT);
liveChinaApp.controller('live', ['$scope', '$http', '$interval', '$window', '$document',
    function ($scope, $http, $interval, $window, filterServer, $document) {
        
        $scope.loadMoreMsg = '加载更多';
        $scope.searchWords = '';
        $scope.trailer = [];
        $scope.history = [];
        $scope.live = [];
        $scope.searchType = true;
        $scope.recommendList = [];
        $scope.searchIsEmpty = false;
        $scope.recommend = false;
        $scope.index = -1;
        $scope.count = 10; //初始加载数量
        $scope.offset = 0;
        $scope.noWet=false;
        $scope.searchText= false;
    
        $scope.loadtuwenol = true;
        $scope.loadlength = 0;
        $scope.searchNumber = 0;
        //判断网络
        if(!navigator.onLine){
            $scope.noWet= true
            
        }else{
            $scope.noWet= false
        }
    
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
                $scope.noMsg = false;//暂无数据
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
        var liveType = true;//加载时存储 推荐内容
        function http(count, offset, tailer, title) {
            if (count == undefined) {
                count = 10
            }
            if (offset == undefined) {
                offset = 0
            }
            if (tailer == undefined) {
                tailer = 1
            }
            //$scope.recommendList.length = 0;
            $http({
                method: 'JSONP',
                url: API_URL_ROOT + '?callback=JSON_CALLBACK&custom_appkey=G8FHXedPgl4i7sA2rfUISxfaB0NB5WJC&custom_appid=83' +
                '&m=Apituwenol&c=tuwenol&a=show&count=' + count + '&offset=' + offset + '&title=' + title
            }).success(function (msg) {
                console.log(msg)
                if(liveType && msg.length === 0){
                    $scope.noMsg = true;
                }
                $scope.liveType = msg;
                $scope.loadlength += msg.length
                if ($scope.searchWords.length > 0 && msg.length > 0) {
                    $scope.searchType = false
                }
                if (msg.length ===0) {
                    $scope.loadMoreMsg = '到底了，没有更多数据'
                }
                if (title != undefined && title.length > 0 && msg.length <3 && !liveType) {
                    if( msg.length ===0){
                    // 隐藏没有搜索结果字段
                        $scope.searchText= true;
                    }else{
                        $scope.searchText= false;
                    }
                    $scope.recommend = true
                } else {
                    $scope.recommend = false
                }
                angular.forEach($scope.liveType, function (data, index) {
                    if (data.time_status === 0) {
                        $scope.trailer.push(data)
                        $scope.trailer.filter(function (item, index, arr) {
                            //iPhone会NaN 2017-08-14 12:42:02 转 2017/08/14 12:42:10
                            item.start_time_show = item.start_time_show.replace(/-/g, '/')
                        })
                    } else if (data.time_status === 1) {
                        $scope.live.push(data)
                            if(liveType){
                            
                                $scope.recommendList.push(data)
    
                            }
                        
                    } else if (data.time_status === 2) {
                        $scope.history.push(data)
                    }
                });
                liveType= false;
               
                if ($scope.recommendList.length > 3) {
                    $scope.recommendList.length = 3
                }
                console.log($scope.recommendList)
            });
            console.log($scope.searchNumber)
        }
        
        http($scope.count, $scope.offset, $scope.show_tailer, $scope.searchWords)//mounted
        $scope.loadMore = function () {
            $scope.loadlength = 0;
            $scope.offset += $scope.count
            $scope.count = 10
            $scope.searchWords = ''
            http($scope.count, $scope.offset, $scope.show_tailer, $scope.searchWords)
        }
      
        $scope.search = function () {
            if ($scope.searchWords.length === 0) {
                return false
            }
            $scope.searchType = false;
            $scope.searchNumber++;
            
            if ($scope.searchWords.length > 0) {
                $scope.live.length = 0;
                console.log($scope.live)
                $scope.history.length = 0;
                $scope.trailer.length = 0;
                http(50, 0, '', $scope.searchWords)
            }
            
        }
       
        $scope.cancelSearch = function () {
            $scope.searchWords = '';
            $scope.loadMoreMsg = '加载更多';
            $scope.trailer.length = 0;
            $scope.history.length = 0;
            $scope.live.length = 0;
            $scope.searchNumber = 0;
            $scope.searchType = true;
            http($scope.count, $scope.offset, $scope.show_tailer, $scope.searchWords)
        }
        $scope.dofocus = function () {
            $scope.searchType = true;
        }
    
    
    
        //
        //function _param(obj) {
        //
        //    var query = '',
        //            name, value, fullSubName, subName, subValue, innerObj, i;
        //
        //    for (name in obj) {
        //        value = obj[name];
        //
        //        if (value instanceof Array) {
        //            for (i = 0; i < value.length; ++i) {
        //                subValue = value[i];
        //                fullSubName = name + '[' + i + ']';
        //                innerObj = {};
        //                innerObj[fullSubName] = subValue;
        //                query += _param(innerObj) + '&';
        //            }
        //        } else if (value instanceof Object) {
        //            for (subName in value) {
        //                subValue = value[subName];
        //                fullSubName = name + '.' + subName;
        //                innerObj = {};
        //                innerObj[fullSubName] = subValue;
        //                query += _param(innerObj) + '&';
        //            }
        //        } else if (value !== undefined && value !== null)
        //            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        //    }
        //
        //    return query.length ? query.substr(0, query.length - 1) : query;
        //};
        //
        //
        //
        //var re = _param({name:12,age:23})
       //console.log(re)
    }]);

    

    //var userAgentInfo = navigator.userAgent;
    //var Agents = ["Android", "iPhone",
    //    "SymbianOS", "Windows Phone",
    //    "iPad", "iPod"];
    //var flag = true;
    //for (var v = 0; v < Agents.length; v++) {
    //    if (userAgentInfo.indexOf(Agents[v]) > 0) {
    //        flag = false;
    //        break;
    //    }
    //}
