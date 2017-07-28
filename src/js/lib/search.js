
liveChinaApp.controller('search', ['$scope' ,'$http','API_URL_ROOT','$routeParams',function($scope,$http,API_URL_ROOT,$routeParams){

    $scope.keyUp = function(e){

console.log($scope.text)
        if(e.keyCode===13){
            $http({
                // http://operate.tw.live.hoge.cn/?m=Apituwenol&c=tuwenol&a=detail&id=2263
                method:'JSONP',
                url:API_URL_ROOT+'?m=Apituwenol&c=tuwenol&a=show&custom_appkey=da1c994019b00a760a68e735db9dc281&custom_appid=197'
            // }).success(function(data){
            //
            //    console.log(data);
            // }).error(function(r){
            //     console.log(r)
            }).then(function successCallback(response) {
                // 请求成功执行代码
                console.log(response)
            }, function errorCallback(response) {
                // 请求失败执行代码
                console.log(response)

            });
        }
    };

    $scope.goBack=function(){
        history.back()
    }

}])