/**
 * 应用配置
 */
(function(window) {
  var goodvan = window.goodvan,
    angular = window.angular;
  /**
   * 创建模块
   */
  var depends = ['ionic', 'ngCookies', 'ngCordova', 'starter.templates', 'CoderYuan',
    'ngIOS9UIWebViewPatch','ngFileUpload','ngResource','ionicLazyLoad'];

  var module = goodvan.module ||
    (goodvan.module = angular.module('goodvanApp', depends));

  module.config([
    '$locationProvider',
    '$ionicConfigProvider',
    '$httpProvider',
    '$sceDelegateProvider',
    'ENV',
    function($locationProvider, $ionicConfigProvider, $httpProvider,$sceDelegateProvider,ENV) {
      $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
      $ionicConfigProvider.platform.ios.tabs.style('standard');
      $ionicConfigProvider.platform.ios.tabs.position('bottom');
      $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
      $ionicConfigProvider.platform.ios.views.transition('ios');

      $ionicConfigProvider.platform.android.tabs.style('standard');
      $ionicConfigProvider.platform.android.tabs.position('standard');
      $ionicConfigProvider.platform.android.navBar.alignTitle('left');
      $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');
      $ionicConfigProvider.platform.android.views.transition('android');
      //是否使用JS或原生滚动 --> android滚动兼容
      $ionicConfigProvider.scrolling.jsScrolling(true);

      // 解决键盘弹出屏幕折叠问题
      ionic.Platform.isFullScreen = true;

      //设置http post请求的默认内容类型为form-urlencoded
      $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8;';
      //为$http请求添加token参数
      $httpProvider.interceptors.push([
        'ENV',
        '$cookies',
        function(ENV, $cookies) {
          return {
            request: function(config) {
              var noTokenList = [ENV.siteUrl+'index/getrecommendproductc',
                ENV.siteUrl+'member/resetpass',
                ENV.siteUrl + 'member/login',
                ENV.siteUrl + 'inviteUser/getInviter',
                ENV.siteUrl + 'promotion/root_category'];
              if((!/.*\.html$/.test(config.url) && /^\/.*/.test(config.url) || config.url.indexOf(ENV.siteUrl) !== -1) && _.indexOf(noTokenList,config.url) === -1) {
                if(config.method.toUpperCase() === 'GET') {
                  config.params = config.params || {};
                  config.params.token = $cookies.get(ENV.token_id);
                }
                if(config.method.toUpperCase() === 'POST' && config.headers['Content-Type'] !== null && config.headers['Content-Type'] !== 'undefined' && config.headers['Content-Type'] !== undefined) {
                  if(config.headers['Content-Type'].indexOf( 'application/x-www-form-urlencoded;') != -1) {
                    var prefix = '&';
                    if(!config.data) {
                      config.data = prefix = '';
                    }
                    config.data += prefix + 'token=' + encodeURIComponent($cookies.get(ENV.token_id));
                  }
                  if(config.headers['Content-Type'].indexOf('application/json') != -1){
                    if(config.data){
                      config.data.token = $cookies.get(ENV.token_id);
                      config.data = JSON.stringify(config.data);
                    }
                  }
                }
              }
              return config;
            }
          };
        }
      ]);
    }
  ]);
})(window);


(function(window) {
  var goodvan = window.goodvan, module = goodvan.module;
module.run([
  '$rootScope',
  '$state',
  '$stateParams',
  '$ionicPlatform',
  '$ionicScrollDelegate',
  '$ionicHistory',
  '$ionicActionSheet',
  '$ionicLoading',
  '$location',
  'userService',
  '$ionicModal',
  'ENV',
  'StringUtil',
  '$cookies',
  '$window',
  'index',
  '$timeout',
  'Util',
  'CommonUtil',
  function($rootScope, $state, $stateParams, $ionicPlatform, $ionicScrollDelegate, $ionicHistory ,$ionicActionSheet, $ionicLoading, $location, userService,$ionicModal,ENV,StringUtil,$cookies,$window,index,$timeout,Util,CommonUtil) {

    $ionicPlatform.ready(function() {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.deviceHeight = document.body.clientHeight;
      $rootScope.imgUrl = ENV.imgUrl;
    });
    //用户cookies
    var currentUser = $cookies.get(ENV.currentUser);
    if(StringUtil.isNotEmpty(currentUser)){
      $rootScope.currentUserObj = JSON.parse(currentUser);
    }
    /*回到顶部*/
    $rootScope.scrollTop = function() {
      $ionicScrollDelegate.scrollTop(true);
    };

    /*返回*/
    $rootScope.back = function() {
      if ($ionicHistory.backView()) {
        $ionicHistory.goBack();
      } else {
        $location.path('/home');
      }
    };

    $rootScope.$on('$stateChangeStart', (function () {
      var restrictedState = [
        'user', 'myOrders', 'orderDetail', 'orderOk', 'orderAddress', 'orderPay', 'mylog', 'purchaseOrderList',
        'purchaseOrderEdit', 'setting', 'favorite', 'purchaseOrderList','inviteLogin'];
      var isRestricted = function (stateName) {
        return _.indexOf(restrictedState, stateName) !== -1;
      };
      return function(e, toState, toParams, fromState, fromParams) {
        if(toState.name == 'home'){
          $rootScope.hasHeadAd = true;
        }else{
          $rootScope.hasHeadAd = false;
        }
        //hide loading
        $ionicLoading.hide();
        if(isRestricted(toState.name) && !userService.isLogin()) {
          e.preventDefault();
          $state.go('login');
        }
      };
    }()));

    //统一选择
    var scope = $rootScope.$new();
    $rootScope.commonSelect=function(o,state){
        if(state){
            $rootScope.isGoodsPro = true;
        }
      if(!$rootScope.modalSelect){
        $ionicModal.fromTemplateUrl('templates/common/select.html',{
          animation: 'none',
          scope:scope
        }).then(function(modal){
          $rootScope.modalSelect= modal;
          $rootScope.modalSelect.show();
          scope.$broadcast('commonSelect:show',o);
        });
      }else{
        $rootScope.modalSelect.show();
        scope.$broadcast('commonSelect:show',o);
      }
    };
    //关闭选择弹窗
    $rootScope.closeSelectModal=function(){
      $rootScope.modalSelect.hide();
    };
  }
]);
})(window);
