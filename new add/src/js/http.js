liveChinaApp.factory('httpServer',['$http,$q',function($http,$q){
    var service = {};

    //请求数据
    service.getData = function(){
        var d = $q.defer();

        $http({
            method: 'JSONP',
            url: API_URL_ROOT + '&custom_appkey=G8FHXedPgl4i7sA2rfUISxfaB0NB5WJC&custom_appid=83&m=Apituwenol&c=tuwenol&a=show&count='+count+'&offset='+offset
        })
            .success(function(response) {
                d.resolve(response);
            })
            .error(function(){
                d.reject("error");
            });
        return d.promise;
    }


    return service;

}])