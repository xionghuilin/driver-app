(function () {
  goodvan.module
  .factory('reviewListService', [
    'ENV',
    'httpRequest',
    function(ENV, httpRequest) {
      var reviewListConfig = ENV.reviewlist.getList;
      return {
        getList: function(params){
        return httpRequest({
          method:reviewListConfig.method,
          url: reviewListConfig.url,
          params: params
        });
      }

      }
    }
  ]);
})();
