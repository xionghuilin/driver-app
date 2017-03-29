(function () {
  goodvan.module
  .factory('productService', [
    'ENV',
    'httpRequest',
    '$httpParamSerializer',
    function(ENV, httpRequest,$httpParamSerializer) {
      var getListConfig = ENV.product.getList,  //获取
          getInfoConfig = ENV.product.getInfo, //获取商品详情
          getRecommendProductcConfig = ENV.product.getRecommendProductc,//猜您喜欢
          isGoodsBuyUrl = ENV.isGoodsBuy;
          getRecommendProduct = ENV.product.getRecommend;//商品详情猜您喜欢
          getPurchaseCountConfig = ENV.product.getPurchaseCount;
          getArrivalConfig=ENV.product.getArrival;
          getPersonSaveConfig=ENV.product.save;
          getCategoryPromotionProductPageList = ENV.product.getCategoryPromotionProductPageList;
      return {
        getList: function(params) {
          return httpRequest({
            method:getListConfig.method,
            url: getListConfig.url,
            params:params
          });
        },
        getArrival: function(params) {
          return httpRequest({
            method:getArrivalConfig.method,
            url: getArrivalConfig.url,
            params:params
          });
        },
        getPersonSave: function(params) {
          return httpRequest({
            method:getPersonSaveConfig.method,
            url: getPersonSaveConfig.url,
            params:params
          });
        },
        getRecommendProductc: function(params){
          return httpRequest({
            method:getRecommendProductcConfig.method,
            url:getRecommendProductcConfig.url,
            params:params
          });
        },
        getRecommend: function(id){//商品详情推荐
          return httpRequest({
            method:getRecommendProduct.method,
            url:getRecommendProduct.url,
            params:{id:id}
          });
        },
        getListByRecommend: function () {

        },

        getListByFloor: function () {

        },

        getListByGuess: function () {

        },

        getListByCategory: function () {

        },

        getListByHot: function () {

        },

        getSpec: function() {

        },
        getInfo: function(id){
          return httpRequest({
            method:getInfoConfig.method,
            url: getInfoConfig.url,
            params:{id:id}
          });
        },
        //...
        purchaseCount: function() {
          return httpRequest({
            method:getPurchaseCountConfig.method,
            url:getPurchaseCountConfig.url
          })
        },
        // 商品促销没分区情况根据活动id跟分类id查询商品
        getCategoryPromotionProductPageList: function (params) {
          return httpRequest({
            method: getCategoryPromotionProductPageList.method,
            url: getCategoryPromotionProductPageList.url,
            params: params
          });
        },
        //查询该商品 在某地区是否能购买
        isGoodsBuy:function(params){
            return httpRequest({
                method: isGoodsBuyUrl.method,
                url: isGoodsBuyUrl.url,
                params: params
        });
        }
      }
    }
  ]);
})();
