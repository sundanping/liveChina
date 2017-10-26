liveChinaApp.controller('liveList', ['$scope', '$http', 'API_URL_ROOT', '$routeParams', '$location', '$timeout', '$interval', '$window',
    function ($scope, $http, API_URL_ROOT, $routeParams, $location, $timeout, $interval, $window) {
        //获取城市具体信息BEGIN
        var wifi = navigator.userAgent;
        var wifiPosition = wifi.lastIndexOf('_');
        
        var wifiCity = wifi.substr(wifiPosition+1,6);
        if( wifiCity.toLocaleLowerCase().substr(0,3) !='wif' ){
            wifiCity = 'not find wifiCity'
        }
        //获取城市具体信息END
        var docHeight = document.documentElement.clientHeight;
        var clientWidth = document.body.clientWidth;
        var videoheight = Math.ceil(clientWidth * 0.75);
        var videoinfoheight = videoheight;
        $('.live-video-info').css('height', videoinfoheight);
        $('.live-video').css('height', videoheight);
        var timer1;
        $scope.id = $routeParams.id;
        $scope.time_status = 1;
        $scope.time_status = $routeParams.time_status;
        $scope.tag = 'interaction';
        $scope.offset = 0;
        $scope.count = 6;
        $scope.loading = false;
        $scope.commit = '';
        $scope.imgUrl='';
        $scope.scroll = true;
        $scope.showTotalMessage = false;//直播结束弹框限时汇总信息
        $scope.touched = false;
        $scope.share_url = '';//分享的路径/**/
        $scope.color = true;
        $scope.loadCommit = true;
        $scope.IOSHide=false;
        $scope.showDownLoad = false;
        //显示下载
        if( (window.document.URL).indexOf('style')>0){
            $scope.showDownLoad=true
        }
        $scope.changeIntroduce = function (status) {
            $scope.tag = status;
            
            if (status === 'introduce') {
                angular.element(document.querySelector('#underLine')).addClass('toLeft').removeClass('toRight').removeClass('underLine');
            } else {
                angular.element(document.querySelector('#underLine')).removeClass('toLeft').addClass('toRight').removeClass('underLine');
            }
        };
        //简介互动切换 END
        //返回按钮 BEGIN
        //ajax  请求页面
        $http({
            method: 'JSONP',
            url: 'http://operate.tw.live.hoge.cn' + "?callback=JSON_CALLBACK&m=Apituwenol&c=tuwenol&a=detail&custom_appkey=G8FHXedPgl4i7sA2rfUISxfaB0NB5WJC&custom_appid=83&id=" + $scope.id+'&type='+wifiCity
        }).success(function (res) {
            $scope.imgUrl=(res[0].sort_pic.host+res[0].sort_pic.dir+res[0].sort_pic.filepath+res[0].sort_pic.filename)
            $scope.share_url = res.share_url;//分享路径
            $scope.videoUrl = res[0].live_info[0].url;
            window.sessionStorage.setItem('videoUrl', $scope.videoUrl)
            $scope.loading = false;
            $scope.dataList = res;
            $scope.sort_pic = $scope.dataList[0].sort_pic;
            $scope.sort_name = $scope.dataList[0].sort_name;
            //视频时长
            $scope.timeLong = parseInt((res[0].end_time * 1 - res[0].start_time * 1) / 60 / 60 % 24) + '小时'
                    + parseInt((res[0].end_time * 1 - res[0].start_time * 1) / 60 % 60) + '分' + parseInt((res[0].end_time * 1 - res[0].start_time * 1) % 60) + '秒'
            
            $scope.getComment()
            
        })
        
        //  angular video  不支持 ng-src  点击事件解决报错
        $scope.addSrc=function(e){
            e.target.src=$scope.videoUrl;
        }
        
        //直播结束  弹框显示汇总信息
        $scope.totalMessage = function () {
            if ($scope.time_status == 1) {
                var nowData = (new Date()).getTime();
                // console.log(nowData);
                if (nowData > $scope.dataList[0].end_time * 1000 && nowData < $scope.dataList[0].end_time * 1000 + 3000) {
                    // 直播结束  汇总信息
                    $scope.showTotalMessage = true;
                }
            }
        }
        $scope.load = false;
        
        //刷新页面  到播放页
        // $scope.locationToLive=function(){
        //     // if($scope.dataList[0].end_time*1> new Date() && $scope.dataList[0].end_time*1< (new Date())+1100 ){
        //     //     $location.path('/liveList/'+$scope.id+'/2');
        //     // }
        //     // $scope.$on('destroy',function(){
        //     //     $interval.cancel($scope.timer);
        //     // })
        // }
        
        //轮询   获取评论
        $scope.commitArr = [];
        $scope.cleartimer = true;
        var animateOnce = 1;
        $scope.getComment = function () {
            animateOnce++;
            $scope.loading = true;
            // $scope.offset+=3;
            $scope.commentNum = 0;
            $http({
                method: 'JSONP',
                //评论列表接口 排序 顺序 order=asc 倒序 order=desc
                url: API_URL_ROOT + '?m=Apituwenol&c=thread&a=show_comment&callback=JSON_CALLBACK' +
                '&custom_appkey=G8FHXedPgl4i7sA2rfUISxfaB0NB5WJC&custom_appid=83&order=desc&count=6&offset=0&topic_id=' + $scope.id
            }).success(function (comment) {
                $scope.loading = false;
                
                // 过滤太长的用户名  成为'ab...cd' 形式
                if (comment.length > 0) {
                    comment.filter(function (item, index, arr) {
                        if (item.user_name.length > 4) {
                            item.user_name = item.user_name.slice(0, 2) + '...' + item.user_name.slice(item.user_name.length - 2)
                        }
                    })
                }
                // comment=comment.reverse();
                //获取最新的6条评论  不同就塞进去
                if ($scope.commitArr.length == 0) {
                    $scope.commitArr = comment.reverse();
                    // Array.prototype.unshift.apply($scope.commitArr,comment)
                } else if ($scope.commitArr.length > 0 && comment.length > 0) {
                    const yid = [];
                    const xid = [];
                    for (var j = 0; j < comment.length; j++) {
                        yid.push(comment[j].id)
                    }
                    for (var i = 0; i < $scope.commitArr.length; i++) {
                        xid.push($scope.commitArr[i].id)
                    }
                    for (var i = 0; i < comment.length; i++) {
                        if (xid.indexOf(yid[i]) < 0) {
                            //有新评论就塞到$scope.commitArr
                            $scope.commentNum++;
                            $scope.commitArr.push(comment[i]);
                        }
                        
                    }
                    setTimeout(watch, 1)
                }
                
            })
        }
        
        function watch() {
            if((window.document.URL).indexOf('liveList')== -1){
                window.clearInterval(timer1)
            }
            var currentHeight = document.getElementById('interaction').clientHeight || 0;
            var innerHeight = document.getElementById('listsbox').scrollHeight || 0;
            $scope.moved = innerHeight - currentHeight + 15;
            if (animateOnce == 2) {
                $('#interaction').animate({scrollTop: $scope.moved});
            }
            $('#interaction').animate({scrollTop: $scope.moved});
            
            $scope.$watch('moved', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.scrollDiv()
                }
            })
            
        }
        
        $scope.scrollDiv = function () {
            if ($location.$$absUrl.indexOf('liveList') > 0 && $scope.loadcommit && $scope.tag === 'interaction') {
                $('#interaction').animate({scrollTop: $scope.moved});
            }
        }


//  评论时间
        $scope.changeTime = function (t) {
            var ua = navigator.userAgent.toLowerCase();
            if (/iphone|ipad|ipod/.test(ua)) {
                t = t.replace(/-/g, '/');
            }
            var oldTime = (new Date(t).getTime());
            var newTime = new Date().getTime();
            var timeType = parseInt((newTime - oldTime) / 1000 / 60);//计算分钟
            if ((newTime - oldTime) / 1000 > 0 && (newTime - oldTime) / 1000 < 60) {
                return '刚刚'
            } else if (timeType > 0 && timeType < 60) {
                return parseInt(timeType) + '分钟前'
            } else if (timeType / 60 > 0 && timeType / 60 < 23) {
                return parseInt(timeType / 60) + '小时前'
            } else {
                return t.substr(0, 10);
            }
        }
        
        //定时器
        $scope.see = function () {
            $scope.totalMessage();
            // //3秒轮询一次
            if ($scope.tag == 'interaction' && $scope.time_status != 0 && $scope.loadCommit === true) {
                $scope.getComment();
                // console.log('监听3秒轮训')
            }
        }
         timer1 = setInterval($scope.see, 3000)

//发送评论
        
        $scope.sendMessage = function (e) {
            if ($scope.loadCommit == false) {
                $scope.loadCommit = true
            }
            $scope.content = e.target.name;
            if ($scope.content == '' || $scope.content == undefined || $scope.content == null) {
                
                return false;
            } else {
                if (!$scope.scroll) {
                    $scope.scroll
                }
                // SmartCity.getUserInfo(function( res ){	//获取用户信息:
                //     //	res为用户信息
                //     if( res && res.userinfo.userTokenKey ){
                //         //  即用户已登录
                //
                //         e.target.value='发表...'
                //         $http({
                //             method:'JSONP',
                //        url: API_URL_ROOT+"?&callback=JSON_CALLBACK&m=Apituwenol&c=interact&a=show&type=comment&custom_appkey=G8FHXedPgl4i7sA2rfUISxfaB0NB5WJC&custom_appid=83&content="+$scope.content+'&topic_id='+$scope.id
                //     }
                // ).success(function (comment) {
                // $scope.comment=comment;
                //     console.log(comment)
                //     //取消正在加载图片
                //     e.target.innerHTML = '发表'
                //     angular.element(document.querySelector('#input')).val('');
                //     e.target.name = ''
                // }）
                //     }else{
                //         //  即用户未登录  跳登录页登录
                //         SmartCity.goLogin();
                
                //     }
                // });
                
                e.target.innerHTML = '发表'
                // console.log($scope.id)
                $http({
                    method: 'JSONP',
                    
                    // url: API_URL_ROOT+"?&callback=JSON_CALLBACK&m=Apituwenol&c=interact&a=show&type=comment&custom_appkey=A3O8gmwJURFi8d74nuKxRpczjoAydHSE&custom_appid=137&topic_id=596&type=comment&content="+$scope.content
                    url: API_URL_ROOT + "?&callback=JSON_CALLBACK&m=Apituwenol&c=interact&a=show&type=comment&custom_appkey=G8FHXedPgl4i7sA2rfUISxfaB0NB5WJC&custom_appid=83&content=" + $scope.content + '&topic_id=' + $scope.id
                }).success(function (comment) {
                    // $scope.comment=comment;
                    //取消正在加载图片
                    e.target.innerHTML = '发表'
                    angular.element(document.querySelector('#input')).val('');
                    e.target.name = ''
                })
            }
        }

//分享
        $scope.share = function () {
            // alert('分享')
            SmartCity.shareTo({
                title: $scope.dataList[0].title,
                brief: $scope.dataList[0].brief,
                contentURL: window.document.URL+"?style=true",
                //contentURL: $scope.share_url,
                imageLink: $scope.dataList[0].sort_pic
            });
        }
        
        $scope.cancelModal = function () {
            $scope.showTotalMessage = false;
        }
        
        $scope.goBack3 = function (e) {
            window.history.back()
            clearInterval(timer1)
        }
        
        $scope.startTimer = function () {
            $scope.cleartimer = true;
            // var curHeight=document.documentElement.clientHeight;
            var u = navigator.userAgent;
            var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            console.dir(document.getElementById('interaction'));
            if (isIOS) {
                $(document).on("focus", "input", function () {
                    $('#sendMsg').addClass("fixfixed");
                }).on("focusout", "input", function () {
                    $("#sendMsg").removeClass("fixfixed");
                });
            }
        }
//自动播放
        $scope.onTouchstart = function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            window.event.cancelBubble = false;
            $scope.loadCommit = false;
            document.getElementById('input').blur()
            $scope.startY = ev.touches[0].clientY;
            // console.log('scrollTop==' + $('#listbox').scrollTop())
            if ($('#listbox').scrollTop() == 0) {
                //   请求数据  上拉加载
            }
        }
        
        
        var scrollTop;
        $scope.touchend = function (e) {
            e.stopPropagation();
            e.preventDefault()
            window.event.cancelBubble = false;
            $scope.endY = e.changedTouches[0].clientY;
            $scope.movelen = $scope.startY - $scope.endY;
            $scope.loading = true;
            if (Math.abs($scope.movelen) > 10) {
                $('#interaction').animate({scrollTop: $scope.movelen * 15});
                if ($scope.movelen > 0) {
                    // 监听到达底部
                    $timeout(
                            function () {
                                scrollTop = $('#interaction').scrollTop()
                            }, 1)
                    
                    if ($scope.movelen > scrollTop - 30) {
                        $scope.loadCommit = true;
                    }
                    
                }
            }
            
            
            // AlloyLever.config({
            //     cdn:'//s.url.cn/qqun/qun/qqweb/m/qun/confession/js/vconsole.min.js',
            //     reportUrl: "//a.qq.com",
            //     reportPrefix: 'abc',
            //     reportKey: 'msg',
            //     otherReport: {
            //         uin: 100000
            //     },
            //     entry:"#interaction"
            // })
            
            
            $scope.cleartimer = false;
            
            if ($scope.movelen < 0 && $('#interaction').scrollTop() === 0) {
                // console.log($scope.moved)
                // $scope.load=true;
                // ajax
                $http({
                    method: 'JSONP',
                    //评论列表接口 排序参 顺序 order=asc 倒序 order=desc
                    url: API_URL_ROOT + '?m=Apituwenol&c=thread&a=show_comment&callback=JSON_CALLBACK&' +
                    'custom_appkey=G8FHXedPgl4i7sA2rfUISxfaB0NB5WJC&custom_appid=83&order=sc&offset=' + $scope.commitArr.length + '&count=' + $scope.count + '&topic_id=' + $scope.id
                    
                    // url:API_URL_ROOT+"?callback=JSON_CALLBACK&m=Apituwenol&c=thread&a=show_comment&custom_appkey=da1c994019b00a760a68e735db9dc281&custom_appid=197&offset="+$scope.offset+'&&count='+$scope.count
                }).success(function (comment) {
                    // $scope.load=false;
                    Array.prototype.unshift.apply($scope.commitArr, comment);
                    $scope.loading = false;
                    
                })
            }
        }
        $scope.cancelModal = function(){
            $scope.showTotalMessage = false
        }
        
        //setTimeout(function(){
        //    document.getElementById('my-video').play()
        //},100)
        setTimeout(loadVideo,100)
        function loadVideo(){
            var myPlayer = videojs('my-video');
            videojs("my-video").ready(function(){
                var myPlayer = this;
                myPlayer.play();
            });
        }
    }])
;
//touch 事件
//
// var ua = navigator.userAgent;
// document.addEventListener("WeixinJSBridgeReady", function onBridgeReady() {
//     if (ua.indexOf("iPhone") > 0) {
//         setTimeout(function(){
//             $("#")[0].play();
//         },1000);
//     }
//     else if (ua.indexOf("Android") > 0) {
//         var vi =  $("#my-video");
//         vi[0].play();
//         if ( vi[0].currentTime){
//             vi[0].pause();
//             //这里的定时器你可以不需要，也可以变成你需要的事件，而且也不一定在这个位置，主要是里面的play
//             setTimeout(function(){
//                 vi[0].play();
//             },1000)
//         }
//     }
// });

liveChinaApp.filter("trustUrl", ['$sce', function ($sce) {
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
    
    
}]);

//setTimeout(vide,1)
//function vide(){
//    var myPlayer = videojs('my-video');
//    videojs("my-video").ready(function(){
//        var myPlayer = this;
//        myPlayer.play();
//    });
//}



