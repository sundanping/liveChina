
liveChinaApp.controller('search', ['$scope' ,'$http','API_URL_ROOT','$routeParams',function($scope,$http,API_URL_ROOT,$routeParams){
    $scope.historyArr=null;
    // window.localStorage.searchHistory=1;
    //清除历史
    $scope.clearHistory=function(){
        window.localStorage.searchHistory='';
        $scope.showHistory= 0;

    }
    //选择历史
    $scope.choice=function(ev){
        $scope.text=ev.target.innerText
    }
    //键盘输入事件
    $scope.keyUp = function(e){
        $scope.showHistory= 1;
        $scope.temp = window.localStorage.searchHistory.slice(window.localStorage.searchHistory.indexOf(',') + 1).split(",").reverse();
        $scope.historyArr = $scope.temp;
        // $scope.historyArr=[1,2,34,5]
;
        if($scope.historyArr.length>10){
            $scope.historyArr.length=10
        }
        // console.log($scope.historyArr);

        if(e.keyCode===13) {
            $scope.showHistory= 0;

                if ($scope.text != null && $scope.text != undefined  && $scope.text != '' ) {
                    stroage = $scope.text;
                    window.localStorage.searchHistory += ',' + stroage;
                    $scope.temp = window.localStorage.searchHistory.slice(window.localStorage.searchHistory.indexOf(',') + 1)
                    $scope.historyArr = $scope.temp.split(",").reverse();
                    $scope.text='';

                    // $scope.showHistory=0;
                }else{
                    angular.element(document.querySelector('#alert')).addClass('alert');
                    setTimeout(remove,2000)
                    function remove(){
                        angular.element(document.querySelector('#alert')).removeClass('alert');
                    }
                    return false;
                }
                    $http({
                        method: 'JSONP',
                        url: API_URL_ROOT + '?m=Apituwenol&c=tuwenol&a=show&custom_appkey=da1c994019b00a760a68e735db9dc281&custom_appid=197'
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