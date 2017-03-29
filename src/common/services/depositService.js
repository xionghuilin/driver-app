(function () {
  goodvan.module
  .factory('depositService', [
    'httpRequest',
    'ENV',
    '$httpParamSerializer',
    function(httpRequest, ENV, $httpParamSerializer) {
      var recordConfig = ENV.deposit.record;
      var self = {
        record: function (params) {
          return httpRequest({
            method: recordConfig.method,
            url: recordConfig.url,
            params: params,
            success: function (data) {
              //类型判断
              return data;
            }
          });
        }
      };
      return self;
    }
  ]);
})();
