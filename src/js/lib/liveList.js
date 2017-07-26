
liveChinaApp.controller('liveList', ['$scope' ,'$http','API_URL_ROOT','$routeParams',function($scope,$http,API_URL_ROOT,$routeParams){

    $scope.id=$routeParams.id;
    $scope.changeIntroduce=function(){
        console.log(111111111111111111)
        angular.element(document).find('#introduce').addClass('.haha')
    }
    $http({
        method:'JSONP',
        // url:API_URL_ROOT+"?callback=JSON_CALLBACK"+'&m=Apituwenol&c=tuwenol&a=show&custom_appkey=da1c994019b00a760a68e735db9dc281&custom_appid=197',

        url:API_URL_ROOT+"?callback=JSON_CALLBACK"+'&m=Apituwenol&c=tuwenol&a=detail&custom_appkey=da1c994019b00a760a68e735db9dc281&custom_appid=197&id'+$scope.id

    }).success(function(res){
        console.log(res)
    })

}])