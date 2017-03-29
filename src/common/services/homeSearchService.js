(function () {
  goodvan.module
  .factory('homeSearch', [
    '$resource',
    'ENV',
    '$httpParamSerializer',
    'httpRequest',
    function($resource, ENV, $httpParamSerializer, httpRequest) {
      var getfullsearchkeyConfig = ENV.membersearchkey.fullsearchkeylist,
          getHostorylistConfig = ENV.membersearchkey.hostorylist,
          getjumpHistoryConfig = ENV.product.search,
          getDelhostoryConfig = ENV.membersearchkey.delHostorylist;
      return {
        homeHotKeyworld: function() {
          return $resource(ENV.siteUrl + '/membersearchkey/fullsearchkeylist');
        },
        keyList: function() {
          return $resource(ENV.siteUrl + '/product/search', {
            keyword: '@keyword',
            pageNumber: '@pageNumber',
            pageSize: '@pageSize'
          });
        },
        //热门搜索列表
        fullsearchkeylist: function(params){
          return httpRequest({
            method: getfullsearchkeyConfig.method,
            url: getfullsearchkeyConfig.url,
            cancellable: true,
            // data: $httpParamSerializer(params)
            params: params,
            success: function(data){
              return data;
            }
          });
        },
        //商品搜索
        search: function(params) {
          return httpRequest({
            method: getjumpHistoryConfig.method,
            url: getjumpHistoryConfig.url,
            params: params
          });
        },
        //搜索记录
        hostorylist: function(params) {
          return httpRequest({
            method: getHostorylistConfig.method,
            url: getHostorylistConfig.url,
            params: params
          });
        },
        delHostorylist: function() {
          return httpRequest({
            method: getDelhostoryConfig.method,
            url: getDelhostoryConfig.url
          });
        }
      }
    }
  ]);
})();
