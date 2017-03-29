//齿研社
(function () {
  goodvan.module
  .factory('toothOplist', [
    '$resource',
    'ENV',
    'httpRequest',
    '$httpParamSerializer',
    function($resource, ENV, httpRequest,$httpParamSerializer) {
      var getBannerConfig = ENV.navilist.bannerlist;
      var saveEnquiryConfig =ENV.memberYcInquiry.save;
      return {
        toothIMGlist: function() {
          return $resource(ENV.siteUrl + 'navilist/bannerlist')
        },
        toothList: function() {
          //ENV.siteUrl + 'navilist/productlist'齿研社商品列表的地址
          return $resource(ENV.siteUrl + 'navilist/productlist', {
            keyword: '@keyword',
            dateDesc: '@dateDesc',
            pageNumber: '@pageNumber',
            pageSize: '@pageSize',
            categoryIds: '@categoryIds'
          })
        },
        //获取图片广告列表
        getBannerlist: function(params){
          return httpRequest({
            method: getBannerConfig.method,
            url: getBannerConfig.url,
            params: params,
            success: function(bl){
              return bl;
            }
          })
        },
        ycSave: function(params){
          return httpRequest({
            method: saveEnquiryConfig.method,
            url: saveEnquiryConfig.url,
            data: $httpParamSerializer(params)
            //cancellable: true
            //success: function(data){
            //
            //}
          })
        }
      }
  }])

.factory('proCategory', ['$resource', 'ENV', function($resource, ENV) {
  return {
    allProductCategory: function() {
      return $resource(ENV.siteurl + '/productcategory/navilist').get();
    }
  }
}])

.factory('notepad', ['$resource', 'ENV', function($resource, ENV) {
  return $resource(ENV.siteurl + '/save');
}]);
})();
