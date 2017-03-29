(function () {
  goodvan.module.controller('loginController', [
  '$scope',
  'StringUtil',
  'userService',
  'index',
  'CommonUtil',
  function($scope,StringUtil, userService,index,CommonUtil){
    var user = {
      'username':'',
      'email':''
    };
    $scope.user = user;
    $scope.login = function () {
        if(StringUtil.isEmpty($scope.user.username)){
          CommonUtil.tip("请输入手机号");
          return;
        }
        if(StringUtil.isEmpty($scope.user.email)){
          CommonUtil.tip("请输入电邮");
          return;
        }
        var opt = {
          username: $scope.user.username,
          email: $scope.user.email
        };
        $ionicLoading.show({template: '<div>登录中<ion-spinner icon="dots" style="vertical-align: middle;display:inline-block;height: 28px;width: 28px;fill: #fff"></ion-spinner></div>'});
        $scope.$on('$destroy', function () {
          $ionicLoading.hide();
        });
        userService.login(opt).then(function () {
            $ionicLoading.hide();
            CommonUtil.tip('登录成功');
            setTimeout(function () {
              $scope.back();
            }, 1000);
          }, function (errorMsg) {
            $ionicLoading.hide();
            CommonUtil.tip(errorMsg);
          });
      }
  }]);
})();
