(function () {
  goodvan.module
  .factory('promotionService', [
    'ENV',
    'httpRequest',
    function(ENV, httpRequest) {
      var promotionConfig = ENV.promotion.getList,
          getAreaListConfig = ENV.promotion.getAreaList,
          getInfo = ENV.promotion.getInfo,
          getRootCategory = ENV.promotion.rootCategory;
      return {
        getList: function(params){
        return httpRequest({
          method:promotionConfig.method,
          url: promotionConfig.url,
          params: params
        });
      },
        getAreaList: function(params){
          return httpRequest({
            method:getAreaListConfig.method,
            url: getAreaListConfig.url,
            params: params
          });
        },
        getInfo: function (params) {
          return httpRequest({
            method:getInfo.method,
            url: getInfo.url,
            async: false,
            params: params
          });
        },
        getRootCategory: function (params) {
          return httpRequest({
            method:getRootCategory.method,
            url: getRootCategory.url,
            params:params
          });
        }

      }
    }
  ]);
})();
