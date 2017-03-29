(function () {
  goodvan.module
  .factory('conponService', [
    'httpRequest',
    'ENV',
    '$httpParamSerializer',
    function(httpRequest, ENV, $httpParamSerializer) {
      var getProductsConfig = ENV.coupon.getProducts;
      var self = {
        getProducts: function (params) {
          return httpRequest({
            method: getProductsConfig.method,
            url: getProductsConfig.url,
            params: params
          });
        }
      };
      return self;
    }
  ]);
})();
