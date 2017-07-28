
liveChinaApp.controller('liveList', ['$scope' ,'$http','API_URL_ROOT','$routeParams',function($scope,$http,API_URL_ROOT,$routeParams){

    $scope.id=$routeParams.id;
    $scope.time_status=$routeParams.time_status;
    $scope.tag='interaction';

    console.log('id='+ $scope.id+'~~~~~~time_status='+$scope.time_status)
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
    // url:API_URL_ROOT+"?callback=JSON_CALLBACK"+'&m=Apituwenol&c=tuwenol&a=detail&custom_appkey=da1c994019b00a760a68e735db9dc281&custom_appid=197&id'+$scope.id
    }).success(function(res){
        console.log(res)
        $scope.dataList=res;

    })
    if($scope.time_status!=1){
        //获取评论
        $http({
            method:'JSONP',
            //http://twapi.live.hoge.cn/index.php?m=Apituwenol&c=thread&a=show_comment
            url:API_URL_ROOT+'?m=Apituwenol&c=thread&a=show_comment&callback=JSON_CALLBACK&custom_appkey=da1c994019b00a760a68e735db9dc281&custom_appid=197'
            // url:API_URL_ROOT+"?callback=JSON_CALLBACK"+'&m=Apituwenol&c=tuwenol&a=show_comment&custom_appkey=da1c994019b00a760a68e735db9dc281&custom_appid=197'
        }).success(function(comment){
            console.log(comment)
            $scope.comment=comment;
        })
    }

}])