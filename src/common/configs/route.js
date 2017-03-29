/**
 * 路由设置
 */
(function(window){
  window.goodvan.module.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      //默认路由
      $urlRouterProvider.otherwise('/login');
      $stateProvider
        //登陆页面ss
        .state('login', {
          url: '/login',
          templateUrl: 'templates/user/login.html',
          controller: 'loginController'
        })
        //注册
        .state('register', {
          url: '/register',
          templateUrl: 'templates/user/register.html',
          controller: 'registerController'
        })
        //找回密码
        .state('resetPwd', {
          url: '/resetPwd',
          templateUrl: 'templates/user/resetPwd.html',
          controller: 'resetPwdController'
        })
        //404
        .state('network', {
          url: '/network',
          templateUrl: 'templates/error/network.html',
          controller: 'networkCtrl'
        });

    }
  ]);
})(window);
