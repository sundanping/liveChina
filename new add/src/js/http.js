liveChinaApp.factory('httpServer', ['$http','API_URL_ROOT', function ($http, API_URL_ROOT) {
    //参数转换 {a:1,b:2} -- a=1&b=2
    function _param(obj) {
        var query = '',
                name, value, fullSubName, subName, subValue, innerObj, i;
        for (name in obj) {
            value = obj[name];
            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += _param(innerObj) + '&';
                }
            } else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '.' + subName;
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += _param(innerObj) + '&';
                }
            } else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
        return query.length ? ('?callback=JSON_CALLBACK&'+query.substr(0, query.length - 1)) : query;
    };
    
    //请求数据
    return {
        param:_param,
        sendJsonPost: function (apiPrefix, path) {
            var httpRequest;
            httpRequest = $http({
                method: 'JSONP',
                url: apiPrefix + '?callback=JSON_CALLBACK&' + path,
                options: {headers: {'Content-Type': "application/json"}},
                headers: {'Content-Type': "application/json"}
            });
            
            httpRequest.success(function (response) {
                return response;
            });
            return httpRequest
        },
        //sendHttpJsonp2: function (obj) {
        //    var httpResult, httpRequest;
        //    httpRequest = $http.jsonp(API_URL_ROOT + '?callback=JSON_CALLBACK&' + obj);
        //    return httpRequest.success(function (data) {
        //        httpResult = data
        //        return httpResult
        //    });
        //},
        //
        sendHttpJsonp: function (obj) {
            return this.sendJsonPost(API_URL_ROOT, _param(obj))
        }
    }
}])

