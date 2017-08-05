
liveChinaApp.controller('search', ['$scope' ,'$http','API_URL_ROOT','$routeParams',function($scope,$http,API_URL_ROOT,$routeParams){
    $scope.historyArr=null;
    $scope.showHistory= 0;

// 取消
    $scope.toCancel=function(){
        $scope.showHistory= 0;

    }
    //清除历史
    $scope.clearHistory=function(){
        window.localStorage.searchHistory='';
        $scope.showHistory= 0;

    }
    //选择历史
    $scope.choice=function(ev){
        $scope.text=ev.target.innerText;
        $scope.toAjax($scope.text);
        $scope.showHistory= 0;
    }
    //键盘输入事件
    $scope.keyUp = function(e){
        $scope.showHistory= 1;
        $scope.temp = window.localStorage.searchHistory.slice(window.localStorage.searchHistory.indexOf(',') + 1).split(",").reverse();
        $scope.historyArr = $scope.temp;
        // $scope.historyArr=[1,2,34,5]

        if($scope.historyArr.length>10){
            $scope.historyArr.length=10
        }
        // console.log($scope.historyArr);

        if(e.keyCode===13) {
            $scope.showHistory= 0;
                if ($scope.text != null && $scope.text != undefined  && $scope.text != '' ) {
                   var  stroage = $scope.text;
                    window.localStorage.searchHistory += ',' + stroage;
                    $scope.temp = window.localStorage.searchHistory.slice(window.localStorage.searchHistory.indexOf(',') + 1)
                    $scope.historyArr = $scope.temp.split(",").reverse();
                    $scope.toAjax($scope.text)
                    // $scope.showHistory=0;
                }else{
                    angular.element(document.querySelector('#alert')).addClass('alert');
                    setTimeout(remove,2000)
                    function remove(){
                        angular.element(document.querySelector('#alert')).removeClass('alert');
                    }
                    return false;
                }

                }

    };
        //
        $scope.goBack=function(){
            history.back()
        }


    // 搜索
    $scope.toAjax=function(v){

        $http({
            method: 'JSONP',
            url: API_URL_ROOT + '?callback=JSON_CALLBACK&m=Apituwenol&c=tuwenol&a=show&custom_appkey=A3O8gmwJURFi8d74nuKxRpczjoAydHSE&custom_appid=137&title='+v
           // url: 'http://operate.tw.live.hoge.cn/index.php?callback=JSON_CALLBACK&m=Apituwenol&c=tuwenol&a=show&custom_appkey=A3O8gmwJURFi8d74nuKxRpczjoAydHSE&custom_appid=137&title='+v

        }).then(function successCallback(response) {
            // console.log('请求成功')
            $scope.text=''; //清空输入栏

                $scope.result=response


        }, function errorCallback(response) {
        });
    }
}])