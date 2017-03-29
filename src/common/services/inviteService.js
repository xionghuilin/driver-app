(function () {
  goodvan.module
  .factory('inviteService', [
    'ENV',
    'httpRequest',
    function(ENV, httpRequest) {
      var listConfig = ENV.invite.list,
           getInviter = ENV.invite.getInviter,
           getInviteCode = ENV.invite.getInviteCode;
      return {
        list: function() {
          return httpRequest({
            url: listConfig.url,
            method: listConfig.method
          });
        },
        getInviter: function (params) {
          return httpRequest({
            url:getInviter.url,
            method:getInviter.method,
            params:params
          })
        },
        getInviteCode: function () {
          return httpRequest({
            url:getInviteCode.url,
            method:getInviteCode.method
          })
        }
      }
    }
  ]);
})();
