(function () {
  goodvan.module
  .factory('reviewService', [
    'ENV',
    'httpRequest',
    'Upload',
    '$cookies',
    function(ENV, httpRequest, Upload, $cookies) {
      var saveConfig = ENV.review.save;
      return {
        save: function(params) {
          return Upload.upload({
            url:saveConfig.url,      //图片上传路径
            file:params.reviewImages,
            data :{
              sn:params.sn,
              score:params.score,
              content:params.content,
              isAnonymous:params.isAnonymous,
              token:$cookies.get(ENV.token_id)
            }
          });
        }
      }
    }
  ]);
})();
