
liveChinaApp.controller('liveList', ['$scope' ,'$http','API_URL_ROOT','$routeParams','$location','$timeout','$interval','$window',
    function ($scope,$http,API_URL_ROOT,$routeParams,$location,$timeout,$interval,$window){
        console.log(2222222)
        var docHeight=document.documentElement.clientHeight;
        var clientWidth = document.body.clientWidth;
        var videoheight = Math.ceil(clientWidth*0.75);
        var videoinfoheight = videoheight;
        $('.live-video-info').css('height' , videoinfoheight);
        $('.live-video').css('height' , videoheight);
        $scope.id=$routeParams.id;
        $scope.time_status=1;
        $scope.time_status=$routeParams.time_status;
        $scope.tag='interaction';
        $scope.offset=0;
        $scope.count=6;
        $scope.loading=true;
        $scope.commit='';
        $scope.scroll=true;
        $scope.showTotalMessage=false;//直播结束弹框限时汇总信息
        $scope.touched = false;
        $scope.share_url='';//分享的路径
        $scope.color=true;
        $scope.loadCommit=true;
        // setTimeout(function(){
        //     document.getElementById('my-video').play()
        // },100)

        var u = navigator.userAgent;
        // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        // if(isiOS){
        //     $('body').wrap("<main></main>main>")
        // }

        //简介互动切换 BEGIN
        $scope.changeIntroduce=function(status){
            $scope.tag=status;

            if(status==='introduce'){
                angular.element(document.querySelector('#underLine')).addClass('toLeft').removeClass('toRight').removeClass('underLine');
            }else{
                angular.element(document.querySelector('#underLine')).removeClass('toLeft').addClass('toRight').removeClass('underLine');

            }


        };
        //简介互动切换 END

        //返回按钮 BEGIN

        //ajax  请求页面
        $http({
            method:'JSONP',
            url:'http://operate.tw.live.hoge.cn'+"?callback=JSON_CALLBACK&m=Apituwenol&c=tuwenol&a=detail&custom_appkey=G8FHXedPgl4i7sA2rfUISxfaB0NB5WJC&custom_appid=83&id="+$scope.id
        }).success(function(res){
            $scope.share_url=res.share_url;//分享路径
            $scope.videoUrl=res[0].live_info[0].url;
            console.log(res)
            window.sessionStorage.setItem('videoUrl',$scope.videoUrl)
            $scope.loading=false;
            $scope.dataList=res;
            $scope.sort_name=$scope.dataList[0].sort_name;
            //视频时长
            $scope.timeLong= parseInt((res[0].end_time*1-res[0].start_time*1)/60/60%24)+'小时'
                +parseInt((res[0].end_time*1-res[0].start_time*1)/60%60)+'分'+parseInt((res[0].end_time*1-res[0].start_time*1)%60)+'秒'

            $scope.getComment()

        })

        //  angular video  不支持 ng-src  点击事件解决报错
        // $scope.addSrc=function(e){
        //     e.target.src=$scope.videoUrl;
        //     console.log(e)
        // }

         //直播结束  弹框显示汇总信息
         $scope.totalMessage=function(){
            if($scope.time_status ==1){
                var nowData=(new Date()).getTime();
                // console.log(nowData);
                if(nowData>$scope.dataList[0].end_time*1000 && nowData<$scope.dataList[0].end_time*1000+3000){
                    // 直播结束  汇总信息
                    $scope.showTotalMessage=true;
                }
            }
        }
        $scope.load=false;

        //刷新页面  到播放页
        // $scope.locationToLive=function(){
        //     // console.log('刷新')
        //     // if($scope.dataList[0].end_time*1> new Date() && $scope.dataList[0].end_time*1< (new Date())+1100 ){
        //     //     $location.path('/liveList/'+$scope.id+'/2');
        //     // }
        //     // $scope.$on('destroy',function(){
        //     //     $interval.cancel($scope.timer);
        //     // })
        // }

        //轮询   获取评论
        $scope.commitArr=[];
        $scope.cleartimer=true;
        var aaa=1;
        $scope.getComment= function (){
            aaa++;
            $scope.loading=true;
            // $scope.offset+=3;
            $scope.commentNum=0;
            $http({
                method:'JSONP',
                //评论列表接口 排序 顺序 order=asc 倒序 order=desc
                url:API_URL_ROOT+'?m=Apituwenol&c=thread&a=show_comment&callback=JSON_CALLBACK' +
                '&custom_appkey=G8FHXedPgl4i7sA2rfUISxfaB0NB5WJC&custom_appid=83&order=desc&count=6&offset=0&topic_id='+$scope.id
            }).success(function(comment){
                // console.log(comment)

                // 过滤太长的用户名  成为'ab...cd' 形式
                if(comment.length>0) {
                    comment.filter(function (item, index, arr) {
                        if (item.user_name.length > 4) {
                            item.user_name = item.user_name.slice(0, 2) + '...' + item.user_name.slice(item.user_name.length - 2)
                        }
                    })
                }
                    // comment=comment.reverse();
                    //获取最新的6条评论  不同就塞进去
                   if($scope.commitArr.length==0 ){
                       $scope.commitArr=comment.reverse();
                       // Array.prototype.unshift.apply($scope.commitArr,comment)
                   }else if($scope.commitArr.length>0 && comment.length>0 ){
                       const yid = [];
                       const xid = [];
                       for(var j=0; j<comment.length; j++) {
                           yid.push(comment[j].id)
                       }
                       for (var i=0; i<$scope.commitArr.length; i++){
                           xid.push($scope.commitArr[i].id)
                       }
                       for (var i=0; i<comment.length; i++){
                           if(xid.indexOf(yid[i]) < 0){
                               //有新评论就塞到$scope.commitArr
                               $scope.commentNum++;
                               $scope.commitArr.push(comment[i]);
                           }

                       }

                   }
                if(window.location.href.indexOf('liveList')>0){
                    var currentHeight= document.getElementById('interaction').clientHeight;
                    var innerHeight=document.getElementById('listsbox').scrollHeight;

                }
                // console.dir(document.getElementById('interaction'))
                $scope.moved = innerHeight-currentHeight + 15;
                if(aaa==2){
                    $('#interaction').animate({scrollTop: $scope.moved});
                }
                $scope.$watch('moved',function(newValue,oldValue){
                    if(newValue != oldValue  ){
                        $scope.scrollDiv()
                        $('#interaction').animate({scrollTop: $scope.moved});
                    }
                })
                $scope.loading=false;
            })
        }
        $scope.scrollDiv=function() {
            if($location.$$absUrl.indexOf('liveList')>0 && $scope.loadcommit && $scope.tag==='interaction'){
                $('#interaction').animate({scrollTop: $scope.moved});
                console.log('监听更多')
            }
        }


//  评论时间
        $scope.changeTime=function(t){
            var oldTime= (new Date(t).getTime());
            var newTime=new Date().getTime();
            // console.log(newTime)
            var timeType=parseInt((newTime-oldTime)/1000/60);//计算分钟
            if((newTime-oldTime)/1000>0 &&(newTime-oldTime)/1000<60){
                return '一分钟内'
            } else if( timeType>0 &&timeType<60){
                return parseInt(timeType)+'分钟前'
            }else if(timeType/60>0 && timeType/60<23){
                return parseInt(timeType/60) +'小时前'
            }else{
                return  t.substr(0,10);
            }
        }

        //定时器
        $scope.see=function(){
            console.log(111111)
            // $scope.totalMessage();
            // //3秒轮询一次
             if( $scope.tag=='interaction' && $scope.time_status !=0 && $scope.loadCommit==true){
                $scope.getComment();
                console.log('监听3秒轮训')
            }
        }
        var timer1 = setInterval($scope.see, 3000)

//发送评论

        $scope.sendMessage=function(e){
            // console.log(e)
            if($scope.loadCommit==false){
                $scope.loadCommit=true
            }
            $scope.content= e.target.name ;
            if($scope.content=='' ||$scope.content==undefined || $scope.content==null){

                return false;
            }else{
                    if(!$scope.scroll){
                        $scope.scroll

                    }
                // SmartCity.getUserInfo(function( res ){												//获取用户信息:
                //     //	res为用户信息
                //     if( res && res.userinfo.userTokenKey ){
                //         //  即用户已登录
                //
                //         e.target.value='发表...'
                //         $http({
                //             method:'JSONP',
                //       url: API_URL_ROOT+"?&callback=JSON_CALLBACK&m=Apituwenol&c=interact&a=show&type=comment&custom_appkey=G8FHXedPgl4i7sA2rfUISxfaB0NB5WJC&custom_appid=83&content="+$scope.content+'&topic_id='+$scope.id

                //         }).success(function(comment){
                //             // $scope.comment=comment;
                //             //取消正在加载图片
                //             e.target.value='发表'
                //
                //             console.log(comment)
                //             $scope.getComment()
                //         })
                //     }else{
                //         //  即用户未登录  跳登录页登录
                //         SmartCity.goLogin();

                //     }
                // });

                e.target.innerHTML='发表...'
                console.log($scope.id)
                $http({
                    method:'JSONP',

                    // url: API_URL_ROOT+"?&callback=JSON_CALLBACK&m=Apituwenol&c=interact&a=show&type=comment&custom_appkey=A3O8gmwJURFi8d74nuKxRpczjoAydHSE&custom_appid=137&topic_id=596&type=comment&content="+$scope.content
                    url: API_URL_ROOT+"?&callback=JSON_CALLBACK&m=Apituwenol&c=interact&a=show&type=comment&custom_appkey=G8FHXedPgl4i7sA2rfUISxfaB0NB5WJC&custom_appid=83&content="+$scope.content+'&topic_id='+$scope.id
                }).success(function(comment){
                    // $scope.comment=comment;
                    console.log(comment)
                    //取消正在加载图片
                    e.target.innerHTML='发表'
                    angular.element(document.querySelector('#input')).val('');
                    e.target.name=''

                })
            }

        }



        //分享
        $scope.share=function(){
            // console.log(window.document.URL)
            SmartCity.shareTo({
                title: '标题',
                brief: '描述',
                // contentURL: window.document.URL,
                contentURL: $scope.share_url,
                imageLink: 'http://img1.bdstatic.com/img/image/shitu/feimg/uploading.gif'
            });
        }

        // $scope.touchStart=function(){
        //     $scope.touched = !$scope.touched;
        // }
        $scope.cancelModal=function(){
            $scope.showTotalMessage=false;
        }

        // $scope.changeShare = function() {
        //     $scope.touched = !$scope.touched;
        // }

        $scope.goBack3=function(e){
            window.history.back()
            clearInterval(timer1)
        }
        $scope.startTimer=function () {
            $scope.cleartimer=true;
            // var curHeight=document.documentElement.clientHeight;
            var u = navigator.userAgent;
            var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

            if (isIOS) {
                $(document).on("focus", "input", function () {
                    $('#sendMsg').addClass("fixfixed");
                }).on("focusout", "input", function () {
                    $("#sendMsg").removeClass("fixfixed");
                });
            }

        }
        //自动播放


        $scope.onTouchstart=function(ev){
            $scope.loadCommit=false;
            document.getElementById('input').blur()
            $scope.startY=ev.touches[0].clientY;
            console.log('scrollTop=='+ $('#listbox').scrollTop())

            if($('#listbox').scrollTop()==0){
            //   请求数据  上拉加载
            }
        }


        var scrollTop;
        $scope.touchend=function(e){
            $scope.endY=e.changedTouches[0].clientY;
            $scope.movelen=$scope.startY-$scope.endY;

                if( Math.abs($scope.movelen)>30) {
                    console.log(2017)
                    $('#interaction').animate({scrollTop: $scope.movelen*15});
                    console.log($scope.moved)
                    if($scope.movelen>0){
                        // 监听到达底部
                        console.log("ssss"+$('#interaction').scrollTop())
                        $timeout(
                            function(){
                                scrollTop=$('#interaction').scrollTop()
                            },1)

                        if($scope.movelen>scrollTop-50){
                            $scope.loadCommit=true;
                            console.log($scope.movelen+'监听到达底部成功'+scrollTop)
                        }

                    }
                }
                console.log('scrollTop--end=='+ $('#interaction').scrollTop())


            // $scope.endtouch = e.touches[0].clientY;
            // if ($scope.endtouch - $scope.startouch) {

            // }
            // $scope.loadCommit=true;

            $scope.cleartimer=false;

            if($scope.movelen<0 && $('#interaction').scrollTop()===0){


                  // console.log($scope.moved)

                      // $scope.load=true;
                     // ajax
                      $http({
                          method:'JSONP',
                                    //评论列表接口 排序参 顺序 order=asc 倒序 order=desc
                          url:API_URL_ROOT+'?m=Apituwenol&c=thread&a=show_comment&callback=JSON_CALLBACK&' +
                          'custom_appkey=G8FHXedPgl4i7sA2rfUISxfaB0NB5WJC&custom_appid=83&order=sc&offset='+$scope.commitArr.length+'&count='+$scope.count+'&topic_id='+$scope.id

                          // url:API_URL_ROOT+"?callback=JSON_CALLBACK&m=Apituwenol&c=thread&a=show_comment&custom_appkey=da1c994019b00a760a68e735db9dc281&custom_appid=197&offset="+$scope.offset+'&&count='+$scope.count
                      }).success(function(comment) {
                          // $scope.load=false;
                          Array.prototype.unshift.apply($scope.commitArr,comment);
                          console.log(comment);
                      })
                      console.log($scope.commitArr)
              }
        }


    }]);




//touch 事件


liveChinaApp.filter("trustUrl", ['$sce', function ($sce) {
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]);




