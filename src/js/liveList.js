
liveChinaApp.controller('liveList', ['$scope' ,'$http','API_URL_ROOT','$routeParams','$location','$timeout','$interval','$window',
    function ($scope,$http,API_URL_ROOT,$routeParams,$location,$timeout,$interval,$window){

    $scope.id=$routeParams.id;
    $scope.time_status=$routeParams.time_status;
    $scope.tag='interaction';
    $scope.count=3;
    $scope.loading=true;
    $scope.commit='';
    $scope.showTotalMessage=false;


        $scope.changeIntroduce=function(status){
        $scope.tag=status;
        if(status==='introduce'){

            angular.element(document.querySelector('#underLine')).addClass('toLeft').removeClass('toRight').removeClass('underLine');
        }else{
            angular.element(document.querySelector('#underLine')).removeClass('toLeft').addClass('toRight').removeClass('underLine');

        }
    };
        $scope.goBack=function(){
            history.back()
        }
    //ajax
    $http({
        method:'JSONP',
        url:'http://operate.tw.live.hoge.cn/'+"?callback=JSON_CALLBACK"+'&m=Apituwenol&c=tuwenol&a=detail&custom_appkey=A3O8gmwJURFi8d74nuKxRpczjoAydHSE&custom_appid=137&id=2263'
    }).success(function(res){
        // aa= angular.element(document.querySelector('#interaction')).append('<div style="margin-bottom:140px"  id="scroll-bottom">---------已经最底部----------</div>');
        $scope.dataList=res;
        $scope.loading=false;
            // console.log(JSON.stringify(res[0]));

        if($scope.time_status!=1) {
            $scope.getComment();
        }else{
            //跳转到直播页面
            $interval( function(){
            $scope.timer=  $scope.locationToLive()
            }, 1000);
        }


        if($scope.time_status ==2){
           var nowData=(new Date()).getTime();
           // console.log(nowData);
           $scope.totalMessage=function(){

           if(nowData>res[0].end_time && nowData<res[0].end_time*1+1000){
              // 直播结束  汇总信息
               console.log(22222222)
              $scope.showTotalMessage=true;

            }
        }
        // $scope.totalMessage()
    }
            $scope.dataList=res;
    })



        //刷新页面  到播放页
        $scope.locationToLive=function(){
                console.log('刷新')
        if($scope.dataList[0].end_time*1> new Date() && $scope.dataList[0].end_time*1< (new Date())+1100 )
            $window.location.reload();
            $scope.$on('destroy',function(){
                $interval.cancel($scope.timer);
            })
        }
        //轮询   获取评论
        $scope.commitArr=[];
        $scope.offset=0;
    $scope.getComment= function (){

        $scope.loading=true;
        $http({
            method:'JSONP',
            url:API_URL_ROOT+'?m=Apituwenol&c=thread&a=show_comment&callback=JSON_CALLBACK&custom_appkey=da1c994019b00a760a68e735db9dc281&custom_appid=197&&offset='+$scope.offset+'&&count='+$scope.count
            // url:API_URL_ROOT+"?callback=JSON_CALLBACK"+'&m=Apituwenol&c=tuwenol&a=show_comment&custom_appkey=da1c994019b00a760a68e735db9dc281&custom_appid=197'
        }).success(function(comment){

            // 过滤太长的用户名  成为'ab...cd' 形式
            comment.filter(function(item,index,arr){
                if(item.user_name.length>4){
                    item.user_name=item.user_name.slice(0,2)+'...'+item.user_name.slice(item.user_name.length-2)
                }
            })
            comment=comment.reverse();
            //取消正在加载图片
            $scope.glued = true;

          // console.log($scope.offset)
            if(comment.length>0){
                // console.log('输出')
                $scope.offset +=$scope.count;
                Array.prototype.push.apply($scope.commitArr,comment)
                $('body').animate({scrollTop:$('#interaction').outerHeight()-window.innerHeight+500})
            }else{
                $scope.offset=$scope.commitArr.length-1;
            }

            // console.log($scope.commitArr)
            // console.log($scope.offset)
            // console.log($scope.commitArr)
            // console.log(comment)
            $scope.loading=false;
        })
    }
// 下拉加载评论
        $interval( $scope.getComment,2000)




//  评论时间转换
    $scope.changeTime=function(t){
        var oldTime= (new Date(t).getTime());
        var newTime=new Date().getTime();
        // console.log(newTime)
        var timeType=parseInt((newTime-oldTime)/1000/60);//计算分钟
            if((newTime-oldTime)/1000>0 &&(newTime-oldTime)/1000<60){
                return '一分钟内'
            } else if( timeType>0 &&timeType<60){
                return timeType+'分钟前'
            }else if(timeType/60>0 && timeType/60<23){
                return timeType/60 +'小时前'
            }else{
                return  t.substr(0,10);
            }
    }


    $scope.see=function(){
        if($scope.id==2) {
            $scope.totalMessage();

        }
        $scope.$apply()
    }
    setInterval($scope.see,1000)
    // $scope.changeTime('2012-12-11 12:12:12')


//发送评论

    $scope.sendMessage=function(e){

        console.log(e)
        $scope.content= e.target.name ;
        if($scope.content=='' ||$scope.content==undefined || $scope.content==null){

            return false;
        }else{

            // SmartCity.getUserInfo(function( res ){												//获取用户信息:
            //     //	res为用户信息
            //     if( res && res.userinfo.userTokenKey ){
            //         //  即用户已登录
            //
            //         e.target.value='发表...'
            //         $http({
            //             method:'JSONP',
            //             url: API_URL_ROOT+"?&callback=JSON_CALLBACK&m=Apituwenol&c=interact&a=show&type=comment&custom_appkey=A3O8gmwJURFi8d74nuKxRpczjoAydHSE&custom_appid=137&topic_id=596&type=comment&content="+$scope.content
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

            e.target.value='发表...'
                    $http({
                        method:'JSONP',
                        url: API_URL_ROOT+"?&callback=JSON_CALLBACK&m=Apituwenol&c=interact&a=show&type=comment&custom_appkey=A3O8gmwJURFi8d74nuKxRpczjoAydHSE&custom_appid=137&topic_id=596&type=comment&content="+$scope.content
                    }).success(function(comment){
                        // $scope.comment=comment;
                        //取消正在加载图片
                        e.target.value='发表'
                        angular.element(document.querySelector('#input')).val('');
                        e.target.name=''
                        console.log(comment)
                        $scope.getComment()
                    })
        }

    }

        //分享
    $scope.share=function(){
        console.log(window.document.URL)
        SmartCity.shareTo({
            title: '标题',
            brief: '描述',
            contentURL: window.document.URL,
            imageLink: 'http://img1.bdstatic.com/img/image/shitu/feimg/uploading.gif'
        });
    }


    $scope.cancelModal=function(){
        $scope.showTotalMessage=false;

    }
}])