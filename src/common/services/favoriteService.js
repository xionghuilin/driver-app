(function () {
  goodvan.module
  .factory('favoriteService', [
    'httpRequest',
    'ENV',
    '$httpParamSerializer',
    function(httpRequest, ENV, $httpParamSerializer) {
      var getProductsConfig = ENV.favorite.getProducts,
          addProductsConfig = ENV.favorite.addProduct,
          removeProductConfig = ENV.favorite.removeProduct,
          clearConfig = ENV.favorite.clear;
      var self = {
        /**
         * @param {Object} params
         *   **pageNumber** - Number|String - 分页页码
         *   **pageSize** - Number|String - 分页大小
         * @return {Promise}
         */
        getProducts: function (params) {
          return httpRequest({
            method: getProductsConfig.method,
            url: getProductsConfig.url,
            params: params
          });
        },

        addProducts: function (products) {
          var ids;
          if (!angular.isArray(products)) {
            ids = [products.id];
          } else {
            ids = _.map(products, 'id');
          }
          return httpRequest({
            method: addProductsConfig.method,
            url: addProductsConfig.url,
            data: $httpParamSerializer({'id': ids.join(','),'source':products.source})
          });
        },

        addProduct: function (product) {
          return self.addProducts(product);
        },

        removeProduct: function (products) {
          var ids;
          if (!angular.isArray(products)) {
            ids = [products.id];
          } else {
            ids = _.map(products, 'id');
          }
          return httpRequest({
            method: removeProductConfig.method,
            url: removeProductConfig.url,
            data: $httpParamSerializer({'ids': ids.join(',')})
          });
        },

        clear: function () {
          return httpRequest({
            method: clearConfig.method,
            url: clearConfig.url
          });
        }
      };
      return self;
    }
  ]);
})();
