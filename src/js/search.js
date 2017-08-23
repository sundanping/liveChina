
liveChinaApp.controller('search', ['$scope' ,'$http','API_URL_ROOT',function($scope,$http,API_URL_ROOT){
    $scope.historyArr=null;
    $scope.showHistory= 1;
    $scope.search = true;
    $scope.searchResult=[];
    if(window.localStorage.searchHistory !=undefined && window.localStorage.searchHistory.length>0){
        $scope.temp = window.localStorage.searchHistory.substr(window.localStorage.searchHistory.indexOf(',') + 1)
        // console.log($scope.temp)
        $scope.historyArr = $scope.temp.split(",").reverse();
        var newArr2=[$scope.historyArr[0]];
        angular.forEach($scope.historyArr,function(item,index){
            console.log(item)
            if(newArr2.indexOf(item)== -1){
                newArr2.push(item)
            }
        })
        $scope.historyArr=newArr2;
    // console.log($scope.historyArr)
    }

// 取消
    $scope.toCancel=function(){
        $scope.showHistory= 0;

    }
    //清除历史
    $scope.clearHistory=function(){
        window.localStorage.searchHistory='';
        $scope.showHistory= 0;
        $scope.historyArr.length=0
        // alert('ok')

    }
    //选择历史
    $scope.choice=function(ev){
        $scope.text=ev.target.innerText;
        // $scope.toAjax($scope.text);
        $scope.searchRes($scope.text)

        $scope.showHistory= 0;
        $scope.search=false;
    }

    $scope.filterData= JSON.parse(window.sessionStorage.getItem('filterData'));
    // console.log($scope.filterData);

    //键盘输入事件
    $scope.focus=function(){
        $scope.showHistory= 1;
    }

    $scope.searching=function(){
        if($scope.text !='' && $scope.text !=undefined && $scope.text !=null){

            window.localStorage.searchHistory += ',' + $scope.text;
            $scope.temp = window.localStorage.searchHistory.slice(window.localStorage.searchHistory.indexOf(',') + 1)
            $scope.historyArr = $scope.temp.split(",").reverse();

            //去重
                var newArrr=[$scope.historyArr[0]];
                angular.forEach($scope.historyArr,function(item,index){
                    console.log(item)
                    if(newArrr.indexOf(item)== -1){
                        newArrr.push(item)
                    }
                })
            // var newArrr=$scope.historyArr.filter(function(item,index,array){
            //     return array.indexOf(item)===index
            //      })
            $scope.historyArr=newArrr;
            if($scope.historyArr.length>10){
                $scope.historyArr.length=10
            }
        }



         $scope.showHistory= 0;//状态判断
        $scope.searchRes($scope.text)
        $scope.text=''

    }

        //搜索事件
        $scope.searchRes=function(value){
            angular.forEach($scope.filterData,function(item,index){
                if(item.title.indexOf(value)>0 ){
                    //(item.sort_name).indexOf(value)>0 ||
                    $scope.searchResult.push(item)
                }
            })

        }
        $scope.goBack2=function(){
            history.back()
        }





    // 搜索
    // $scope.toAjax=function(v){
    //
    //     $http({
    //         method: 'JSONP',
    //         //&custom_appkey=A3O8gmwJURFi8d74nuKxRpczjoAydHSE&custom_appid=137
    //         // url: API_URL_ROOT + '?callback=JSON_CALLBACK&m=Apituwenol&c=tuwenol&a=show&custom_appkey=G8FHXedPgl4i7sA2rfUISxfaB0NB5WJC&custom_appid=83&title='+v
    //        url: 'http://operate.tw.live.hoge.cn/index.php?callback=JSON_CALLBACK&m=Apituwenol&c=tuwenol&a=show&custom_appkey=A3O8gmwJURFi8d74nuKxRpczjoAydHSE&custom_appid=137&title='+v
    //
    //     }).then(function successCallback(response) {
    //         // console.log('请求成功')
    //         $scope.text=''; //清空输入栏
    //         $scope.search = false;
    //             $scope.result=response;
    //     }, function errorCallback(response) {
    //     });
    // }
}])