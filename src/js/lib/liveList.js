
liveChinaApp.controller('liveList', ['$scope' ,'$http','API_URL_ROOT','$routeParams',function($scope,$http,API_URL_ROOT,$routeParams){

    $scope.id=$routeParams.id;
    $scope.time_status=$routeParams.time_status;
    $scope.tag='interaction';
    $scope.count=20;
    $scope.loading=true;

    $scope.changeIntroduce=function(status){
        $scope.tag=status;
        if(status==='introduce'){

            angular.element(document.querySelector('#underLine')).addClass('toLeft').removeClass('toRight').removeClass('underLine');
        }else{
            angular.element(document.querySelector('#underLine')).removeClass('toLeft').addClass('toRight').removeClass('underLine');

        }
    };
    //ajax
    $http({
        method:'JSONP',
        url:'http://operate.tw.live.hoge.cn/'+"?callback=JSON_CALLBACK"+'&m=Apituwenol&c=tuwenol&a=detail&custom_appkey=A3O8gmwJURFi8d74nuKxRpczjoAydHSE&custom_appid=137&id=2263'
    }).success(function(res){
        $scope.loading=false;
            console.log(JSON.stringify(res[0]))
        if($scope.time_status!=1) {
            $scope.getComment();
        }
            $scope.dataList=res;
    })

    $scope.getComment= function (){
        $scope.loading=true;
        $http({
            method:'JSONP',
            //http://twapi.live.hoge.cn/index.php?m=Apituwenol&c=thread&a=show_comment
            url:API_URL_ROOT+'?m=Apituwenol&c=thread&a=show_comment&callback=JSON_CALLBACK&custom_appkey=da1c994019b00a760a68e735db9dc281&custom_appid=197&&count='+$scope.count
            // url:API_URL_ROOT+"?callback=JSON_CALLBACK"+'&m=Apituwenol&c=tuwenol&a=show_comment&custom_appkey=da1c994019b00a760a68e735db9dc281&custom_appid=197'
        }).success(function(comment){
            $scope.comment=comment;
            //取消正在加载图片
            console.log(comment)
            $scope.loading=false;
        })
    }
// 下拉加载评论

    window.onscroll = function(){
        if($scope.time_status!=1) {
            if(document.body.scrollTop+window.screen.availHeight>document.body.offsetHeight*0.9){
                $scope.count+=10;
                //加正在加载
                $scope.loading=true;

                // console.log( $scope.count);
                    $scope.getComment();
                }
            }
        };
//  时间转换
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
        $scope.$apply()
    }
    setInterval($scope.see,60000)
    // $scope.changeTime('2012-12-11 12:12:12')
}])