(function () {
  goodvan.module
  .factory('secondsService', [
    'ENV',
    'httpRequest',
    function(ENV, httpRequest) {
      var promotionConfig = ENV.promotion.robList,
        getInfo = ENV.promotion.getInfo,
        productsConfig=ENV.promotion.products;
      return {
        getList: function(params){
          return httpRequest({
            method:promotionConfig.method,
            url: promotionConfig.url,
            params: params
          })
        },
        getProducts: function(params){
          return httpRequest({
            method:productsConfig.method,
            url: productsConfig.url,
            params: params
          })
        },
        getInfo: function (params) {
          return httpRequest({
            method: getInfo.method,
            url: getInfo.url,
            async: false,
            params: params
          })
        },
        getProduct: function (params) {
          return httpRequest({
            method:productsConfig.method,
            url: productsConfig.url,
            async: false,
            params: params
          });
        }

      }
    }
  ]);
})();
