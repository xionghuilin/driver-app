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

(function(window){
  window.angular.module('aiyakuAppDev', ['aiyakuApp', 'ngMockE2E'])
  .run(['$httpBackend', function($httpBackend) {
    var whiteList = ['/member/', '/productcategory/','/brand/','/purchase/', '/favorite', '/index/', '/navilist/', '/membersearchkey/', '/product/', '/order/', 'memberYcInquiry'];

    $httpBackend.whenGET(/.*\.html$/).passThrough();

    $httpBackend.whenGET(new RegExp('.*' + whiteList.join('|') + '.*')).passThrough();
    $httpBackend.whenPOST(new RegExp('.*' + whiteList.join('|') + '.*')).passThrough();

    //unique id
    var _uniqueId = 0;
    var getUniqueId = function() {
      return ++_uniqueId;
    };

    function bundle(origin, number, primaryKey, uniqueIdFn) {
      var ret = [], init = primaryKey ? parseInt(origin[primaryKey]) : 0;
      uniqueIdFn = uniqueIdFn ? uniqueIdFn : function () { return ++init; };
      primaryKey = primaryKey ? primaryKey : 'id';
      for (var i = 0; i < number; i++) {
        var copy = _.cloneDeep(origin);
        copy[primaryKey] = uniqueIdFn();
        copy.name += ' ['+ primaryKey +': ' + copy[primaryKey] + '] ';
        ret.push(copy);
      }
      return ret;
    }

    function responseWrapper(data) {
      return ['200', data, {}, ''];
    }

    function log(method, url, params) {
      console.log('http' + method + ': --' + url + '; --params: ' + JSON.stringify(params));
    }

    var responseModel = {
      "code": 1,
      "msg": "成功",
      "data": {
        "list": [],
        "page": {
          "pageNumber": '',
          "pageSize": '',
          "totalCount": '',
          "offset": '',
          "lastPage": '',
          "prePage": '',
          "firstPage": '',
          "hasPrePage": '',
          "hasNextPage": '',
          "slider": [],
          "startRow": '',
          "endRow": '',
          "totalPages": '',
          "nextPage": ''
        }
      }
    };

    //我的采购单
    (function() {
      var myPurchaseOrderList;
      var product = {
        "id": 1, //商品编号
        "name": "HAGER咬合垫/咬颌块1111", //商品名称
        "fullName": "", //商品全称
        "specificationName": "规格型号", //规格名称
        "specificationValue": "#11", //规格名称值
        "price": "39.00", //价格
        "unit": "盒", //单位
        "quantity": 8, //采购数量
        "isLimit": true, //是否限购
        "continueDay": 8, //限购天数
        "limitNo": 8, //限购个数
        "stock": 8, //库存
        "allocatedStock": 5, //已分配库存
        "image": "/upload/image/201506/57c5a94d-f6fd-4389-9e11-1434be6cd712-medium.jpg" //商品图片
      };

      myPurchaseOrderList = bundle(product, 30);
      //查询采购商品
      $httpBackend.whenGET(/.*\/purchase\/list.*/).respond(function(method, url, data, headers, params) {
        log(method, url, params);
        var keyword = params.keyword,
          pageNumber = parseInt(params.pageNumber) || 0,
          pageSize = parseInt(params.pageSize) || myPurchaseOrderList.length;
        var response = _.cloneDeep(responseModel);
        response.data.list = myPurchaseOrderList.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
        response.data.page.pageNumber = pageNumber;
        response.data.page.pageSize = pageSize;
        return responseWrapper(response);
      });

      //增加采购商品
      $httpBackend.whenPOST(/.*\/purchase\/choiceproduct.*/).respond(function(method, url, data, headers, params) {
        log(method, url, params);
        var response = _.cloneDeep(responseModel);
        productList = JSON.parse(params.productList);
        if (!_.isArray(productList)) {
          var a = [];
          a.push(productList);
          productList = a;
        }
        _.each(productList, function(p) {
          _.find(myPurchaseOrderList, {
            id: p.productId
          }).quantity = p.quantity;
        });
        return responseWrapper(response);
      });

      //删除采购商品
      $httpBackend.whenPOST(/.*\/purchase\/delete.*/).respond(function(method, url, data, headers, params) {
        log(method, url, params);
        var response = _.cloneDeep(responseModel);
        var ids = params.ids.split(',');
        _.pullAllWith(myPurchaseOrderList, ids, function(p, n) {
          return p.id == n;
        });
        return responseWrapper(response);
      });
    }());

    //订单
    (function() {
      var myOrders;
      var order = {
          "id": 1, //编号
          "sn": "2016022410", //订单号
          "createDate": "2016-02-24", //订单创建时间
          "orderStatus": "等待买家付款", // 订单状态
          "productNumber": 10, //购买商品数量
          "totalPrice": "1000.00", //实付
          "freight": "12.00", //运费
          "productList": [{
            "id": 1,
            "sn": "2016022410", //编号
            "name": "测试商品", //商品名称
            "fullName": "柳苑吸潮纸尖1[0.02/15#]", //商品全称
            "isSectionPrice": true, //是否设置区间价格
            "price": "19.00", //销售价
            "price1": "15.00", //区间价格一
            "quantity1": 50, //区间价格一数量
            "price2": "10.00", //区间价格二
            "quantity2": 100, //区间价格二数量
            "marketPrice": "50.00", //市场价
            "image": "/upload/image/201506/57c5a94d-f6fd-4389-9e11-1434be6cd712-medium.jpg" //商品图片
          }]
        },
        orderDetail = {
          "id":1,//编号
          "sn":"2016022410",//订单号
          "createDate":"2016-02-24",//订单创建时间
          "orderStatus":"等待买家付款",// 订单状态
          "productNumber":10,//购买商品数量
          "totalPrice":"1000.00",//实付
          "freight":"12.00",//运费
          "consignee":"张三",//收货人
          "address":"广东省深圳市南山区深圳市南山区深圳市南山区深圳市南山区深圳市南山区2003",//收货人地址
          "phone":"13660490329",//收货人电话
          "paymentMethodName":"网上支付",//支付方式
          "shippingMethodName":"顺丰快递",//配送方式
          "memo":"",//附言
          "expire":"2016-04-28 11:25:30",//订单到期时间
          "productList":[
            {
              "id":1,
              "sn":"201504013232",//编号
              "name":"测试商品",//商品名称
              "fullName":"柳苑吸潮纸尖1[0.02/15#]",//商品全称
              "isSectionPrice":true,//是否设置区间价格
              "price":"19.00",//销售价
              "price1":"15.00",//区间价格一
              "quantity1":50, //区间价格一数量
              "price2":"10.00",//区间价格二
              "quantity2":100, //区间价格二数量
              "marketPrice":"50.00", //市场价
              "image":"/upload/image/201506/57c5a94d-f6fd-4389-9e11-1434be6cd712-medium.jpg" //商品图片
            }
          ]
        };
      order.productList = bundle(order.productList[0], 5, 'id');
      myOrders = bundle(order, 10, 'sn');
      //获取订单列表
      $httpBackend.whenGET(/.*\/order\/list.*/).respond(function(method, url, data, headers, params) {
        log(method, url, params);
        var type = params.type,
          pageNumber = parseInt(params.pageNumber) || 0,
          pageSize = parseInt(params.pageSize) || myPurchaseOrderList.length;

        var response = _.cloneDeep(responseModel);
        response.data.list = myOrders.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
        response.data.page.pageNumber = pageNumber;
        response.data.page.pageSize = pageSize;
        return responseWrapper(response);
      });

      //获取订单详情
      $httpBackend.whenGET(/.*\/order\/info.*/).respond(function(method, url, data, headers, params) {
        log(method, url, params);
        var response = _.cloneDeep(responseModel);
        response.data = _.cloneDeep(orderDetail);
        response.data.id = params.id;
        return responseWrapper(response);
      });

      //删除订单
      $httpBackend.whenGET(/.*\/order\/cancel.*/).respond(function(method, url, data, headers, params) {
        log(method, url, params);
        var sn = params.sn,
            response = _.cloneDeep(responseModel);

        _.remove(myOrders, {'sn': sn});
        response.data = {};
        return responseWrapper(response);
      });

      //支付订单
      $httpBackend.whenGET(/.*\/order\/payment.*/).respond(function(method, url, data, headers, params) {
        log(method, url, params);
        var sn = params.sn,
          response = _.cloneDeep(responseModel);

        _.find(myOrders, {'sn': sn}).orderStatus = '买家已付款，等待商家发货';
        response.data = {};
        return responseWrapper(response);
      });

      //订单评价
    }());

    //物流
    (function () {
      var logistic = {
        "shippingStatus": 0 ,// 物流状态 0-- 部分发货 1- -已发货 2-- 部分退货 3-- 已退货 4--用户收货 5-- 已收货(已签收)
        "shippingMethodName": "顺丰快递" ,//配送方式
        "sn":"2016022410",//订单号
        "expresssn":"A565645545",//快递单号
        "logisticsList":[
          {
            "desc": "深圳南光站 派件已经签收",//
            "createDate":"2016-02-24 10:11:00"//操作时间
          }
        ]
      };
      //获取订单物流信息
      $httpBackend.whenGET(/.*\/order\/mylogistics.*/).respond(function(method, url, data, headers, params) {
        log(method, url, params);
        var response = _.cloneDeep(responseModel);
        response.data = _.cloneDeep(logistic);
        response.data.sn = params.sn;
        return responseWrapper(response);
      });
    }());

    //用户
    (function () {
      var user = {
        "member": {
          "id":1,
          "username":"测试用户",//用户名
          "email":"aa@183.com",//邮箱
          "point":1000,//积分
          "balance":"500.00",//余额
          "isAuthoriz":false,//是否可查看义齿价格
          "isVip":false,//是否为VIP用户
          "isMonthly":false,//是否为月结用户
          "photo":"",//头像
          "name":"",//牙科名
          "address":"",//地址
          "gender":0,//0--男  1--女
          "mobile":"13660490329",//手机
          "phone":"556569999",//电话
          "birth":"1981-01-14"//出生日期
        }
      };

      //获取用户信息
      $httpBackend.whenGET(/.*\/profile\/info.*/).respond(function(method, url, data, headers, params) {
        log(method, url, params);
        var response = _.cloneDeep(responseModel);
        response.data = _.cloneDeep(user);
        return responseWrapper(response);
      });

      //验证码服务
        //获取验证码
      $httpBackend.whenGET(/.*\/member\/captchacode.*/).respond(function (method, url, data, headers, params) {
        log(method, url, params);
        var AuthCodeGenerator = function () {
          var num = '';
          num += Math.floor(Math.random()*10);
          return parseInt(num);
        };
        var response = _.cloneDeep(responseModel);
        response.data = {};
        return responseWrapper(response);
      });
    }());

    //分类信息
    (function () {
      var categoryModel = {id: 0, name: '义齿类'},
          firstCategory = bundle(categoryModel, 8, 'id', getUniqueId),
          secondCategory = {};
      _.each(firstCategory, function (c) {
        secondCategory[c.id + ''] = bundle(categoryModel, 10, 'id', getUniqueId);
      });
      //一级分类
      $httpBackend.whenGET(/.*\/productcategory\/parentlist.*/).respond(function(method, url, data, headers, params) {
        log(method, url, params);
        var response = _.cloneDeep(responseModel);
        response.data = { 'list': firstCategory };
        return responseWrapper(response);
      });
      //二级分类
      $httpBackend.whenGET(/.*\/productcategory\/childrenlist.*/).respond(function(method, url, data, headers, params) {
        log(method, url, params);
        var firstCategoryId = params.id,
            response = _.cloneDeep(responseModel);
        response.data = {'list': secondCategory[firstCategoryId]};
        return responseWrapper(response);
      });
    }());
  }]);

})(window);

/**
 * 全局唯一变量定义
 */
(function(window){
window.goodvan.module.constant("ENV", (function () {
  var goodvan = window.goodvan;
  var siteUrlPrefix = goodvan.getWapPrefix(),
      imgUrlPrefix = goodvan.getImgGetPrefix();

  var siteUrl = function (rpath, prefix) {
      return prefix ? prefix + rpath : siteUrlPrefix + rpath;
    },
    imgUrl = function (rpath, prefix) {
      return prefix ? prefix + rpath : imgUrlPrefix + rpath;
    };

  return {
    "debug": false,
    "api": "",
    "token_id": "AIYATOKEN",
    'currentUser': 'AIYACURRENTUSER',
    'siteUrl': siteUrlPrefix,
    'imgUrl': imgUrlPrefix,
    'defaultImg': './img/productInfo/default.jpg',
    'videoImg':'./img/productInfo/wap_video.png',
    'consumableImg': './img/productInfo/consumableImg.jpg',        //商品详情耗材类物流图片
    'ycImg': './img/productInfo/ycImg.png',                        //商品详情义齿物流图片
    'loginUrl': "http://192.168.1.34:8080/member/login",
    'version': '1.0.1',
    'consumableTel': '400-688-8643', //耗材客服电话
    'toothTel': '400-688-8469', //义齿加工客服电话

    index: {
      floorproductlist: "./data/index/floorproductlist.json",
      //首页，商品详情 猜你喜欢
      getrecommendproductc: "./data/index/getrecommendproductc.json",
      adlist: {
        url: siteUrl('index/adlist'),
        method: 'GET'
      },
      brands: {
        url: siteUrl('brand/index/brands'),
        method: 'GET'
      },
      hotProducts: {
        url:siteUrl('index/tagProduct'),
        method: 'GET'
      }
    },

    //用户接口
    user: {
      login: {
        url: siteUrl('member/login'),
        method: 'POST'
      },
      logout: {
        url: siteUrl('member/logout'),
        method: 'GET'
      },
      resetPwd: {
        url: siteUrl('member/resetpass'),
        method: 'POST'
      },
      modifyPwd: {
        url: siteUrl('member/editpass'),
        method: 'POST'
      },
      register: {
        url: siteUrl('member/register'),
        method: 'POST'
      },
      getInfo: {
        url: siteUrl('member/getcurrent'),
        method: 'POST'
      },
      update: {
        url: siteUrl('member/edit'),
        method: 'POST'
      }
    },
    //首页搜索
    membersearchkey: {
      //热门搜索
      fullsearchkeylist: {
        url: siteUrl('membersearchkey/fullsearchkeylist'),
        method: 'GET'
      },
      //会员搜索
      hostorylist: {
        url: siteUrl('membersearchkey/hostorylist'),
        method: 'GET'
      },
      delHostorylist: {
        url: siteUrl('membersearchkey/delHostorylist'),
        method: 'GET'
      }
    },
    //验证码接口
    authcode: {
      get: {
        url: siteUrl('member/captchacode'),
        method: 'GET'
      }
    },
    //订单接口
    order: {
      get: {
        url: siteUrl('order/info'),
        method: 'GET'
      },
      getList: {
        url: siteUrl('order/list'),
        method: 'GET'
      },
      create: {
        url: siteUrl('order/create'),
        method: 'POST'
      },
      cancel: {
        url: siteUrl('order/cancel'),
        method: 'POST'
      },
      confirmOrder: {
        url: siteUrl('order/confirm'),
        method: 'POST'
      },
      evaluate: [
        {
          url: siteUrl('review/savebyorderonce'),
          method: 'POST',
          type: 0
        },
        {
          url: siteUrl('review/saveimage'),
          method: 'POST',
          type: 1
        },
      ],
      directInfo: {
        url: siteUrl('order/direct_info'),
        method: 'POST'
      },
      couponInfo: {
        url: siteUrl('order/coupon_info'),
        method: 'POST'
      },
      directBuyPrecheck: {
        url: siteUrl('order/direct_buy_precheck'),
        method: 'POST'
      },
      payInfo: {
        url: siteUrl('order/payInfo'),
        method: 'POST'
      },
      info: {
        url: siteUrl('order/info'),
        method: 'GET'
      },
      buyAgain: {
        url: siteUrl('order/buyagain'),
        method: 'GET'
      },
      list: {
        url: siteUrl('order/list'),
        method: 'GET'
      },
      getCount: {
        url: siteUrl('order/listCount'),
        method:'GET'
      }
    },
    //订单历史纪录
    orderSearchkey: {
      search: {
        url: siteUrl('orderSearchkey/search'),
        method: 'GET'
      },
      delete: {
        url: siteUrl('orderSearchkey/delete'),
        method: 'POST'
      }
    },
    //分类信息接口
    //分类信息接口可合并成一个，根据上级分类id查询下级分类列表
    category: {
      firstCategory: {
        url: siteUrl('productcategory/parentlist'),
        method: 'GET'
      },
      secondCategory: {
        url: siteUrl('productcategory/childrenlist'),
        method: 'GET'
      },
      //--
      productCategory: {
        url: siteUrl('productcategory/categorynavilist'),
        method: 'GET'
      },
      //商品大类，全部（热门产品）
      allProductCategory: {
        url: siteUrl('productcategory/hotproductlist'),
        method: 'GET'
      }
    },
    //物流接口
    logistic: {
      get: {
        url: siteUrl('order/logistics'),
        method: 'GET'
      },
      mylogistics: {
        url: siteUrl('order/mylogistics'),
        method: 'GET'
      }/*,
       mylogistics: {
       logisticsList: {
       url: siteUrl('order/mylogistics'),
       method: 'GET'
       }
       }*/
    },
    //齿研社
    navilist: {
      productlist: "./data/navilist/productlist.json",
      bannerlist: {
        method: 'GET',
        url: siteUrl('index/adlist')
      }
    },
    //询价
    memberYcInquiry: {
      save: {
        method: 'POST',
        url: siteUrl('memberYcInquiry/save')
      }
    },

    //商品接口
    product: {
      getInfo: {
        url: siteUrl('product/info'),
        method: 'GET'
      },
      getCategoryFilterList: {
        // list: "./data/product/search/list.json"
        method: 'GET',
        url: siteUrl('product/search/list')
      },
      search: {
        url: siteUrl('product/search'),
        method: 'GET'
      },
      getList: {
        method: 'GET',
        url: siteUrl('product/search/list')
      },
      getRecommendProductc: {
        url: siteUrl('index/getrecommendproductc'),
        method: 'GET'
      },
      getPurchaseCount: {
        url: siteUrl('index/cart/cartquantity'),
        method: 'GET'
      },
      getArrival: {
        url: siteUrl('product/arrival'),
        method: 'POST'
      },
      save: {
        url: siteUrl('product/save'),
        method: 'POST'
      },
      getCategoryPromotionProductPageList: {
        url:siteUrl('product/categoryPromotionProductPageList'),
        method:'GET'
      },
      getRecommend: {
        url:siteUrl('product/recommend'),
        method:'GET'
      }
    },
    receiver: {
      list: "./data/receiver/list.json"
    },
    //商品评价
    reviewlist: {
      getList: {
        method: 'GET',
        url: siteUrl('product/reviewlist')
      }
    },
    //商品详情--活动促销
    promotion: {
      getList: {
        method: 'GET',
        url: siteUrl('product/subAreaProductList')
      },
      getAreaList:{
        method:'GET',
        url: siteUrl('subArea/list')
      },
      getInfo:{
        method:'GET',
        url:siteUrl('promotion/info')
      },
      rootCategory:{
        method:'GET',
        url:siteUrl('promotion/root_category')
      },
      robList:{
        method:'GET',
        url:siteUrl('promotion/rob_buy/list')
      },
      products:{
        method:'GET',
        url:siteUrl('promotion/rob_buy/products')
      }
    },
    //商品品牌接口
    brand: {
      get: {
        method: 'GET',
        url: ''
      },
      getList: {
        method: 'GET',
        url: siteUrl('brand/list')
      },
      brandPromotionProductPageList:{
        method: 'GET',
        url: siteUrl('product/brandPromotionProductPageList')
      },
      brandPromotionList:{
        method:'GET',
        url:siteUrl('promotion/brandPromotionList')
      }
    },
    //查询当前商品地区是否能购买
    isGoodsBuy:{
      url:siteUrl('isAddressBuy'),
      method:'GET',
    },

    //收藏夹接口
    favorite: {
      getProducts: {
        url: siteUrl('favorite/list'),
        method: 'GET'
      },
      addProduct: {
        url: siteUrl('favorite/add'),
        method: 'POST'
      },
      removeProduct: {
        url: siteUrl('favorite/delete'),
        method: 'POST'
      },
      clear: {
        url: siteUrl('favorite/deleteAll'),
        method: 'GET'
      }
    },

    //我的现金劵
    coupon:{
    	 getProducts: {
        url: siteUrl('couponCode/list'),
        method: 'GET'
      }
    },

    //商品规格接口
    productSpec: {
      get: {
        url: '/product/specificationValues',
        method: 'GET'
      }
    },
    //商品评论接口
    productComment: {
      get: {
        url: siteUrl('product/reviewlist'),
        method: 'GET'
      }
    },
    //采购单接口
    purchaseOrder: {
      getProducts: {
        url: siteUrl('purchase/list'),
        method: 'GET'
      },
      addProduct: {
        url: siteUrl('purchase/add'),
        method: 'POST'
      },
      removeProduct: {
        url: siteUrl('purchase/delete'),
        method: 'POST'
      }
    },
    //修改采购单（编辑）
    purchase: {
      choiceproduct: {
        url: siteUrl('purchase/choiceproduct'),
        method: 'POST'
      }
    },

    //收货地址
    userAddress: {
      get: {
        url: siteUrl('receiver/list'),
        method: 'GET'
      },
      getList: {
        url: siteUrl('receiver/list'),
        method: 'POST'
      },
      getDetail: {
        url: siteUrl('receiver/info'),
        method: 'GET'
      },
      save: {
        url: siteUrl('receiver/save'),
        method: 'POST'
      },
      delete: {
        url: siteUrl('receiver/delete'),
        method: 'POST'
      },
      getParent: {
        url: siteUrl('area/getParent'),
        method: 'GET'
      },
      getCity: {
        url: siteUrl('area/getByParent'),
        method: 'GET'
      },
      setDefault: {
        url: siteUrl('receiver/defaultReceiver'),
        method: 'POST'
      },
      getCalculate:{
        url:siteUrl('order/calculate'),
        method:'POST'
      }
    },
    review: {
      save: {
        url: siteUrl('review/save'),
        method: 'POST'
      }
    },
    invite: {
      list: {
        url: siteUrl('inviteUser/list'),
        method: 'POST'
      },

      createSign:{
        url: siteUrl('inviteUser/createSign'),
        method:'GET'
      },
      getInviter:{
        url:siteUrl('inviteUser/getInviter'),
        method:'GET'
      },
      getInviteCode:{
        url:siteUrl('inviteUser/getInviteCode'),
        method:'POST'
      }
    },
    //零钱
    deposit:{
      record:{
        url:siteUrl('deposit/record'),
        method:'GET'
      }
    },
    //支付接口
    pay:{
      aliPay:{
        url:siteUrl('order/alipay'),
        method:'POST'
      },
      wxPay:{
        url:siteUrl('order/wxpay'),
        method:'POST'
      }
    },
    //文章
    article:{
      get:{
        url:siteUrl('article/get'),
        method:'GET'
      }
    },
    // 视频
    video:{
      index:{
        url:siteUrl('video/index'),
        method:'GET'
      },
      all:{
        url:siteUrl('video/all'),
        method:'GET'
      },
      play:{
        url:siteUrl('video/play'),
        method:'GET'
      },
      tag:{
        url:siteUrl('video/tag'),
        method:'GET'
      },
      search:{
        url:siteUrl('video/all'),
        method:'GET'
      }
    },

    //map
    //orderStatusMap 0 未确认
    orderStatusMap: {
      0: '待付款',
      1: '已确认',
      2: '已完成',
      3: '已取消',
      4: '待月结',
      5: '货到付款'
    },
    paymentStatusMap: {
      0: '待付款',
      1: '部分支付',
      2: '已支付',
      3: '部分退款',
      4: '已退款'
    },
    //已发货显示待收货
    //未发货显示待发货
    shippingStatusMap: {
      0: '待发货',
      1: '部分发货',
      2: '待收货',
      3: '部分退货',
      4: '已退货',
      5: '用户收货',
      6: '已收货',
      7: '已签收'
    },
    genderMap: {
      0: '男',
      1: '女'
    },
    stockStatusMap: {
      0: '库存不足',
      1: '库存紧张',
      2: '库存充足'
    }
  };
}()));

})(window);

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
