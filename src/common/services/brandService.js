(function () {
  goodvan.module
  .factory('brandService', [
    '$resource',
    '$http',
    '$q',
    'ENV',
    'httpRequest',
    function($resource, $http, $q, ENV,httpRequest) {
      var getConfig = ENV.firstCategory,
          brandPromotionListConfig = ENV.brand.brandPromotionList,
          brandPromotionProductPageListConfig = ENV.brand.brandPromotionProductPageList;
      return {
        search: function(searchParam) {
          /*return brands;*/
          return $resource(ENV.siteUrl + 'brand/list', {
            id: searchParam.id,
            keyword: searchParam.keyword,
            makeType: searchParam.makeType
          });
        },
        //筛选一级分类
        //getFristCategory: function(){
        //  return $resource(ENV.siteUrl + 'productcategory/parentlist');
        //}
        getFristCategory: function(){
          var deferred = $q.defer(),getFristCategory;
          $http({
            method: getConfig.method,
            url: getConfig.url
          })
            .then(function(rs){
              getFristCategory = rs.data;
            })
            .finally(function(){
              setTimeout(function () {
                deferred.resolve(getFristCategory);
              }, 1000)
            });
          return deferred.promise;
        },
        getBrandPromotionList: function(){
          return httpRequest({
            method:brandPromotionListConfig.method,
            url: brandPromotionListConfig.url
          });
        },
        getBrandPromotionProductPageList: function(params){
          return httpRequest({
            method:brandPromotionProductPageListConfig.method,
            url: brandPromotionProductPageListConfig.url,
            params: params
          });
        }

      }
    }
  ]);
})();
