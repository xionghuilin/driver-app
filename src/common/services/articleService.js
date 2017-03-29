/**
 * Created by chh on 2016/12/27.
 */
(function () {
  goodvan.module
    .factory('articleService', [
      '$resource',
      'ENV',
      'httpRequest',
      function($resource, ENV,httpRequest) {
        var articleConfig = ENV.article.get;
        return {
          get: function(params){
            return httpRequest({
              method:articleConfig.method,
              url: articleConfig.url,
              params: params
            });
          }
        }
      }
    ]);
})();

