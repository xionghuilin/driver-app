(function () {
  goodvan.module
  .factory('videoService', [
    '$resource',
    'ENV',
    'httpRequest',
    '$httpParamSerializer',
    function($resource, ENV, httpRequest, $httpParamSerializer) {
      var getIndexVideo = ENV.video.index;
      var getSearchVideo = ENV.video.search;
      var getVideoPlay = ENV.video.play;
      var getVideoTag = ENV.video.tag;
      var getAllVideo = ENV.video.all;
      var getAdlistConfig = ENV.index.adlist;
      return {
        // 首页所有视频
        getIndexVideoList:function(params){
          return httpRequest({
            method:getIndexVideo.method,
            url:getIndexVideo.url,
            params:params,
            success:function(rs)
            {
              return rs;
            }
          })
        },
        // 取得所有视频
        getAllVideoList:function(params){
          return httpRequest({
            method:getAllVideo.method,
            url:getAllVideo.url,
            params:params,
            success:function(rs)
            {
              return rs;
            }
          })
        },
        // 查询视频
        getSearchVideoList:function(params)
        {
          return httpRequest({
            method:getSearchVideo.method,
            url:getSearchVideo.url,
            params:params,
            success:function(rs)
            {
              return rs;
            }
          })
        },
        // 取得视频详情
        getVideoInfo:function(params)
        {
          return httpRequest({
            method:getVideoPlay.method,
            url:getVideoPlay.url,
            params:params,
            success:function(rs)
            {
              return rs;
            }
          })
        },
        // 取得优酷视频id
        getYoukuVideoId:function(url)
        {
          var text = /id_([^\"]*)\.html/.exec(url);
          var reText="";
          if(text!=null)
          {
            reText = text[1];
          }
          else{
            text = /\/([^\/]*)\/v\.swf/.exec(url);
            if(text!=null)
            {
              reText = text[1];
            }
          }
          return reText;
        },
        // 获取视频相关广告
        getAdList:function(params)
        {
          return httpRequest({
            method: getAdlistConfig.method,
            url: getAdlistConfig.url,
            cancellable: true,
            params: params,
            success: function(ads){
              return ads;
            }
          })
        }
      }
    }
  ]);
})();
