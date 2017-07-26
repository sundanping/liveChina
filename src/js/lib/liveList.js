
liveChinaApp.controller('liveList', ['$scope' ,'$http','API_URL_ROOT','$routeParams',function($scope,$http,API_URL_ROOT,$routeParams){
    console.log(API_URL_ROOT);
    $scope.id=$routeParams.id
    $http({
        method:'JSONP',
        // url:API_URL_ROOT+"?callback=JSON_CALLBACK"+'&m=Apituwenol&c=tuwenol&a=show&custom_appkey=da1c994019b00a760a68e735db9dc281&custom_appid=197',

        url:API_URL_ROOT+"?callback=JSON_CALLBACK"+'&m=Apituwenol&c=tuwenol&a=detail&custom_appkey=da1c994019b00a760a68e735db9dc281&custom_appid=197&id'+$scope.id

    }).success(function(res){
        console.log(res)
    })

}])