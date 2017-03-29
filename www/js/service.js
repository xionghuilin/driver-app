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


(function () {
goodvan.module
  .factory('authCodeService', [
    'ENV',
    'httpRequest',
    '$q',
    function(ENV, httpRequest, $q) {
      var getConfig = ENV.authcode.get;
      /**
       * 请求服务器向用户手机发送验证码
       * @param {String|Number} mobileNum 手机号码
       * @param {String|Number} usertype 用户类型
       * @return {Promise}
       */
      return {
        get: function (mobileNum, usertype) {
          return httpRequest({
            url: getConfig.url,
            method: getConfig.method,
            params: {
              'mobile': mobileNum,
              'usertype': usertype
            }
          });
        }
      }
    }
  ]);
})();

(function () {
  goodvan.module
  .factory('brandService', [
    '$resource',
    '$http',
    '$q',
    'ENV',
    'httpRequest',
    function($resource, $http, $q, ENV,httpRequest) {
      var getConfig = ENV.firstCategory,
          brandPromotionListConfig = ENV.brand.brandPromotionList,
          brandPromotionProductPageListConfig = ENV.brand.brandPromotionProductPageList;
      return {
        search: function(searchParam) {
          /*return brands;*/
          return $resource(ENV.siteUrl + 'brand/list', {
            id: searchParam.id,
            keyword: searchParam.keyword,
            makeType: searchParam.makeType
          });
        },
        //筛选一级分类
        //getFristCategory: function(){
        //  return $resource(ENV.siteUrl + 'productcategory/parentlist');
        //}
        getFristCategory: function(){
          var deferred = $q.defer(),getFristCategory;
          $http({
            method: getConfig.method,
            url: getConfig.url
          })
            .then(function(rs){
              getFristCategory = rs.data;
            })
            .finally(function(){
              setTimeout(function () {
                deferred.resolve(getFristCategory);
              }, 1000)
            });
          return deferred.promise;
        },
        getBrandPromotionList: function(){
          return httpRequest({
            method:brandPromotionListConfig.method,
            url: brandPromotionListConfig.url
          });
        },
        getBrandPromotionProductPageList: function(params){
          return httpRequest({
            method:brandPromotionProductPageListConfig.method,
            url: brandPromotionProductPageListConfig.url,
            params: params
          });
        }

      }
    }
  ]);
})();

(function () {
  goodvan.module
  .factory('categoryService', [
    'ENV',
    'httpRequest',
    '$resource',
    function(ENV, httpRequest,$resource) {
      var firstCategoryConfig = ENV.category.firstCategory,
          secondCategoryConfig = ENV.category.secondCategory,
          productCategoryConfig = ENV.category.productCategory,
          allProductCategoryConfig =ENV.category.allProductCategory;
      return {
        getFirstCategory: function() {
          return httpRequest({
            method: firstCategoryConfig.method,
            url: firstCategoryConfig.url,
            success: function (data) {
              return data.list;
            }
          });
        },
        getSecondCategory: function (id) {
          return httpRequest({
            method: secondCategoryConfig.method,
            url: secondCategoryConfig.url,
            params: {'id': id}
          });
        },
        getAllHotCategory: function(params){
          return httpRequest({
            method: allProductCategoryConfig.method,
            url: allProductCategoryConfig.url,
            params: params,
            success: function (data) {
              return data.list;
            }
          })
        },
        //主要用在`productCategoryFilter`指令中
        getProductCategory: function (params) {
          return httpRequest({
            method: productCategoryConfig.method,
            url: productCategoryConfig .url,
            params: params
          });
        },

        //一级大类
        navCategory: function() {
          return $resource(ENV.siteUrl + 'productcategory/parentlist');
        },
        //二级图片类
        imgSecondCategory: function() {
          return $resource(ENV.siteUrl + 'productcategory/navi/productlist');
        },
        //二级分类名称
        secondCategoryName: function() {
          return $resource(ENV.siteUrl + 'productcategory/childrenlist');
        },
        //三级商品列表
        thirdCategoryList: function() {
          return $resource(ENV.siteUrl + 'productcategory/productlist');
        }

      }
    }
  ]);
})();

(function () {
  goodvan.module
  .factory('conponService', [
    'httpRequest',
    'ENV',
    '$httpParamSerializer',
    function(httpRequest, ENV, $httpParamSerializer) {
      var getProductsConfig = ENV.coupon.getProducts;
      var self = {
        getProducts: function (params) {
          return httpRequest({
            method: getProductsConfig.method,
            url: getProductsConfig.url,
            params: params
          });
        }
      };
      return self;
    }
  ]);
})();

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

(function () {
  goodvan.module
  .factory('favoriteService', [
    'httpRequest',
    'ENV',
    '$httpParamSerializer',
    function(httpRequest, ENV, $httpParamSerializer) {
      var getProductsConfig = ENV.favorite.getProducts,
          addProductsConfig = ENV.favorite.addProduct,
          removeProductConfig = ENV.favorite.removeProduct,
          clearConfig = ENV.favorite.clear;
      var self = {
        /**
         * @param {Object} params
         *   **pageNumber** - Number|String - 分页页码
         *   **pageSize** - Number|String - 分页大小
         * @return {Promise}
         */
        getProducts: function (params) {
          return httpRequest({
            method: getProductsConfig.method,
            url: getProductsConfig.url,
            params: params
          });
        },

        addProducts: function (products) {
          var ids;
          if (!angular.isArray(products)) {
            ids = [products.id];
          } else {
            ids = _.map(products, 'id');
          }
          return httpRequest({
            method: addProductsConfig.method,
            url: addProductsConfig.url,
            data: $httpParamSerializer({'id': ids.join(','),'source':products.source})
          });
        },

        addProduct: function (product) {
          return self.addProducts(product);
        },

        removeProduct: function (products) {
          var ids;
          if (!angular.isArray(products)) {
            ids = [products.id];
          } else {
            ids = _.map(products, 'id');
          }
          return httpRequest({
            method: removeProductConfig.method,
            url: removeProductConfig.url,
            data: $httpParamSerializer({'ids': ids.join(',')})
          });
        },

        clear: function () {
          return httpRequest({
            method: clearConfig.method,
            url: clearConfig.url
          });
        }
      };
      return self;
    }
  ]);
})();

(function () {
  goodvan.module
  .factory('filterProList', [
    '$resource',
    'ENV',
    'httpRequest',
    '$q',
    function($resource, ENV, httpRequest) {
      var getCategoryFilterConfig = ENV.product.getCategoryFilterList;

      var defaultOpt = {};
      var self = {
        getFilterList: function(opt){
          var _opt = _.assignIn({}, defaultOpt, opt);

          return httpRequest({
            method: getCategoryFilterConfig.method,
            url: getCategoryFilterConfig.url,
            params: {
              'salesDesc': _opt.salesDesc,
              'dateDesc': _opt.dateDesc,
              'priceOrder': _opt.priceOrder,
              'pageNumber': _opt.pageNumber,
              'pageSize': _opt.pageSize,
              'keyword': _opt.keyword,
              'makeType': _opt.makeType,
              'categoryIds': _opt.categoryIds,
              'brandIds':_opt.brandIds,
              'orderType':_opt.orderType,
              'orderDirection':_opt.orderDirection
            },
            success: function(data){
              return data;
            }
          })
        },

        filterProList: function() {
          return $resource(ENV.siteUrl + 'product/search/list', {
            categoryIds: '@categoryIds',
            keyword: '@keyword',
            salesDesc: '@salesDesc',
            dateDesc: '@dateDesc',
            priceOrder: '@priceOrder',
            pageNumber: '@pageNumber',
            pageSize: '@pageSize'
          });
        }
      };

      return self;
  }]);
})();

(function () {
  goodvan.module
  .factory('homeSearch', [
    '$resource',
    'ENV',
    '$httpParamSerializer',
    'httpRequest',
    function($resource, ENV, $httpParamSerializer, httpRequest) {
      var getfullsearchkeyConfig = ENV.membersearchkey.fullsearchkeylist,
          getHostorylistConfig = ENV.membersearchkey.hostorylist,
          getjumpHistoryConfig = ENV.product.search,
          getDelhostoryConfig = ENV.membersearchkey.delHostorylist;
      return {
        homeHotKeyworld: function() {
          return $resource(ENV.siteUrl + '/membersearchkey/fullsearchkeylist');
        },
        keyList: function() {
          return $resource(ENV.siteUrl + '/product/search', {
            keyword: '@keyword',
            pageNumber: '@pageNumber',
            pageSize: '@pageSize'
          });
        },
        //热门搜索列表
        fullsearchkeylist: function(params){
          return httpRequest({
            method: getfullsearchkeyConfig.method,
            url: getfullsearchkeyConfig.url,
            cancellable: true,
            // data: $httpParamSerializer(params)
            params: params,
            success: function(data){
              return data;
            }
          });
        },
        //商品搜索
        search: function(params) {
          return httpRequest({
            method: getjumpHistoryConfig.method,
            url: getjumpHistoryConfig.url,
            params: params
          });
        },
        //搜索记录
        hostorylist: function(params) {
          return httpRequest({
            method: getHostorylistConfig.method,
            url: getHostorylistConfig.url,
            params: params
          });
        },
        delHostorylist: function() {
          return httpRequest({
            method: getDelhostoryConfig.method,
            url: getDelhostoryConfig.url
          });
        }
      }
    }
  ]);
})();

(function () {
  goodvan.module
  .factory('index', [
    '$resource',
    'ENV',
    'httpRequest',
    '$httpParamSerializer',
    function($resource, ENV, httpRequest, $httpParamSerializer) {
      var getAdlistConfig = ENV.index.adlist,
           getBrandsConfig = ENV.index.brands,
           getHotProductsConfig = ENV.index.hotProducts;
      return {
        recommedproductlist: function() {
          return $resource(ENV.siteUrl + 'index/recommedproductlist');
        },
        floorproductlist: function() {
          return $resource(ENV.siteUrl + 'index/floorproductlist');
          //return $resource(ENV.index.floorproductlist);
        },

        purchaseCount: function() {
          return $resource(ENV.siteUrl + '/index/cart/cartquantity');
        },
        //首页猜你喜欢列表
        getrecommendproductc: function() {
          //return $resource(ENV.siteUrl + '/index/getrecommendproductc');
          return $resource(ENV.index.getrecommendproductc);
        },

        //轮播广告图
        getAdlist: function(params){
          return httpRequest({
            method: getAdlistConfig.method,
            url: getAdlistConfig.url,
            cancellable: true,
            params: params,
            success: function(ads){
              return ads;
            }
          })
        },
        getBrands: function(){
          return httpRequest({
            method:getBrandsConfig.method,
            url:getBrandsConfig.url
          })
        },
        getHotProducts: function (params) {
          return httpRequest({
            url: getHotProductsConfig.url,
            method:getHotProductsConfig.method,
            params: params
          })
        }
      }
    }
  ]);
})();

(function () {
  goodvan.module.factory('httpRequest', [
    '$http',
    '$q',
    '$rootScope',
    function ($http, $q,$rootScope) {
      var isObject = angular.isObject,
          isFunction = angular.isFunction,
          isUndefined = angular.isUndefined;


      /**
       * 该服务用于包装$http服务, 从后台返回的包装数据中提取所需的数据，简化其他基于http的服务逻辑
       *
       * @param {Object} config 该服务扩展了$http服务的config参数和返回的promise对象，下面是扩展参数
       *
       *    - **success** – `{Function}` – 请求成功时的回调函数, 返回一个值或Promise, 如果返回一个值, 则该值会被resolve,
       *      如果返回一个Promise, 则该promise的状态变化与该服务返回的promise状态变化保持一致, 并resolve或reject相同的信息
       *      该回调接受提取出的数据作为参数
       *
       *    - **error** – `{Function}` – 请求失败时的回调函数, 返回一个值或Promise, 注意如果该回调函数返回一个值, 该值不是
       *      错误信息, 而是会被resolve, 这相当于错误已经在该函数里正确的处理了, 如果返回promise, 则与success一致
       *      该回调接受一个参数
       *      {
       *        msg: String, 错误信息
       *        code: String|Number?, 错误代码
       *      }
       *
       *    - **cancellable** – `{Boolean}` – 是否可以中止请求, 例如在用户切换路由时中止在上一次路由中所发出但还未返回的http请求
       *
       * @return {Promise}
       *    - **abort** – `{Function}` – 取消状态为pending的请求
       */
      return function (config) {
        var deferred = $q.defer(),
            timeoutDeferred;

        deferred.promise.abort = angular.noop;
        if(config.cancellable) {
          timeoutDeferred = $q.defer();
          config.timeout = timeoutDeferred.promise;
          deferred.promise.abort = function () {
            timeoutDeferred.resolve();
          };
          delete config.cancellable;
        }

        var cbprocess = function (fn, arg) {
          var ret = fn.call(null, arg);
          if(isObject(ret) && isFunction(ret.then)) {
            ret.then(function (res) {
              deferred.resolve(res);
            }, function (err) {
              deferred.reject(err);
            });
          } else {
            deferred.resolve(ret);
          }
        };

        $http(config).then(function (resp) {
            var respJsonObj = resp.data,
                config = resp.config;
          /*TODO:前端有分页情况参数必须为 pageNumber:1 从1开始*/
            if(respJsonObj.data.page) {
              if(respJsonObj.data.page.lastPage && !isUndefined(config.params) && !isUndefined(config.params.pageNumber) &&  config.params.pageNumber != respJsonObj.data.page.pageNumber) {
                respJsonObj.data.list = [];
              }
            }

            if(respJsonObj.code != '1') {
              if(isFunction(config.error)) {
                cbprocess(config.error, {'msg': respJsonObj.msg, 'code': respJsonObj.code});
              } else {
                deferred.reject(respJsonObj.msg);
              }
            } else {
              if(isFunction(config.success)) {
                cbprocess(config.success, respJsonObj.data);
              } else {
                deferred.resolve(respJsonObj.data);
              }
            }
          }, function () {
            if(isFunction(config.error)) {
              cbprocess(config.error, {'msg': '网络错误'});
              $rootScope.errState = 500;
            } else {
              deferred.reject('网络错误');
              $rootScope.errState = 500;
            }
          })
          .finally(function () {
            deferred.promise.abort = angular.noop;
          });
        return deferred.promise;
      };
    }
  ]);
})();

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

(function () {
  goodvan.module
  .factory('logisticService', [
    'ENV',
    'httpRequest',
    function(ENV, httpRequest) {
      var getOneConfig = ENV.logistic.get,
          getAllConfig = ENV.logistic.mylogistics;
      return {
        getAll: function(param){
          return httpRequest({
            url: getAllConfig.url,
            method: getAllConfig.method
          });
        },
        get: function(sn) {
          return httpRequest({
            method: getOneConfig.method,
            url: getOneConfig.url,
            params: {'sn': sn}
          });
        }
      }
    }
  ]);
})();

(function () {
  goodvan.module
  .factory('moreMR', ['$resource', 'ENV', function($resource, ENV) {
    return {
      recommendMoreList: function() {
        return $resource(ENV.siteUrl + 'index/recommedproductlist').get();
      }
    }
  }]);
})();

(function () {
  goodvan.module
  .factory('orderSearch', [
    '$resource',
    'ENV',
    '$httpParamSerializer',
    'httpRequest',
    function($resource, ENV, $httpParamSerializer, httpRequest) {
      var getOrderConfig = ENV.order.list,
          getHistoryConfig = ENV.orderSearchkey.search,
          getDeleteConfig = ENV.orderSearchkey.delete;
      return {
        //订单搜索
        list: function(params){
          return httpRequest({
            method: getOrderConfig.method,
            url: getOrderConfig.url,
            params: params,
            success: function (data) {
              _.each(data.list, function (order) {
                order.orderStatusDesc = ENV.orderStatusMap[order.orderStatus];
                order.shippingStatusDesc = ENV.shippingStatusMap[order.shippingStatus];
                order.paymentStatusDesc = ENV.paymentStatusMap[order.paymentStatus];
                order.createDateStr = order.createDate.substr(0,10);
                /*订单列表右上角状态显示*/
                if (order.isExpire){
                  _.assignIn(order,{orderDesc:"已过期"});
                }else if(data.isMonthly && order.orderStatus == 4){
                  _.assignIn(order,{orderDesc:"待月结"})
                }else if(order.orderStatus == 2 || order.orderStatus == 3){
                  order.orderStatus == 2 ? _.assignIn(order,{orderDesc:"已完成"}) : _.assignIn(order,{orderDesc:"已取消"});
                }else if(order.paymentStatus == 0 || order.paymentStatus == 1){
                  _.assignIn(order,{orderDesc:"等待付款"});
                  if(order.shippingStatus != 0){
                    order.orderDesc += "," + ENV.shippingStatusMap[order.shippingStatus];
                  }
                }else if(order.paymentStatus == 0 && order.shippingStatus == 2){
                  _.assignIn(order,{orderDesc:"等待付款,已发货"});
                }else {
                  _.assignIn(order,{orderDesc:ENV.paymentStatusMap[order.paymentStatus]});
                  if(order.paymentStatus == 2 && order.shippingStatus == 0){
                    order.orderDesc += ",等待发货";
                  }else{
                    order.orderDesc += ","+ ENV.shippingStatusMap[order.shippingStatus];
                  }
                }

                if (order.orderStatus == 4 && !data.isMonthly){
                  _.assignIn(order,{orderDesc:"月结"})
                } else if(order.orderStatus == 5){
                  _.assignIn(order,{orderDesc:"货到付款"});
                }

                /*按钮功能是否显示(我的物流,确认收货,取消订单,立即付款,立即评价)*/
                _.assignIn(order,{mylogBtn:false,confirmBtn:false,cancelBtn:false,payBtn:false,reviewBtn:false});
                if(order.shippingStatus == 1 || order.shippingStatus == 2 || order.orderStatus == 2 || order.shippingStatus == 5 || order.shippingStatus == 6){
                  order.mylogBtn = true;
                }
                if(((order.orderStatus == 1 && order.paymentStatus == 2) || order.paymentStatus == 0 || order.orderStatus == 2) && order.shippingStatus == 2){
                  order.confirmBtn = true;
                }
                if(!order.isExpire && !data.isMonthly && order.orderStatus != '4' && (order.paymentStatus == 0 || order.paymentStatus == 1) && order.orderStatus != 3 && order.orderStatus != 5){
                  order.cancelBtn = true;
                }
                if(!order.isExpire && order.orderStatus != 3 && order.orderStatus != 2 && (order.paymentStatus == 0 || order.paymentStatus == 1)  && order.orderStatus != 5){
                  order.payBtn = true;
                }
                if(((order.orderStatus != 2 &&  order.shippingStatus == 6) ||
                  (order.shippingStatus == 5 && order.orderStatus != 2) ||
                  (order.shippingStatus == 6 && order.orderStatus != 2) ||
                  (order.orderStatus == 1 && order.paymentStatus == 2 && (order.shippingStatus == 5 || order.shippingStatus == 6))) && !order.isExpire){
                  order.reviewBtn = true;
                }
              });
              return data;
            }
          });
        },
        //订单搜索记录
        search: function(params) {
          return httpRequest({
            method: getHistoryConfig.method,
            url: getHistoryConfig.url,
            params: params
          });
        },
        //删除订单搜索记录
        delete: function() {
          return httpRequest({
            method: getDeleteConfig.method,
            url: getDeleteConfig.url
          });
        }
      }
    }
  ]);
})();

(function () {
  goodvan.module
  .factory('orderService', [
    'ENV',
    'httpRequest',
    '$httpParamSerializer',
    '$cookies',
    'StringUtil',
    'Util',
    function(ENV, httpRequest, $httpParamSerializer,$cookies,StringUtil, Util) {
      var orderProList = {};//订单商品清单
      var getListConfig = ENV.order.getList,
          getOneConfig = ENV.order.get,
          createConfig = ENV.order.create,
          getCountConfig = ENV.order.getCount,
          cancelConfig = ENV.order.delete,
          cancelOrderConfig = ENV.order.cancel,
          confirmOrderConfig = ENV.order.confirmOrder,
          alipayparamConfig = ENV.order.alipayparam,
          alipayConfig = ENV.order.alipay,
          directInfoConfig = ENV.order.directInfo,
          couponInfoConfig = ENV.order.couponInfo,
          directBuyPrecheckConfig = ENV.order.directBuyPrecheck,
          payInfoConfig = ENV.order.payInfo,
          infoConfig = ENV.order.info,
          token_id = ENV.token_id,
          buyAgainConfig = ENV.order.buyAgain,
          getSearchConfig = ENV.order.search;
      var defaultOpt = {};
      return {

        getToken: function () {
          return $cookies.get(token_id);
        },

        getTokenOne : $cookies.get(token_id),

        get: function(sn) {
          return httpRequest({
            method: getOneConfig.method,
            url: getOneConfig.url,
            params: {'sn': sn},
            success: function (order) {
              order.orderStatusDesc = ENV.orderStatusMap[order.orderStatus];
              order.paymentStatusDesc = ENV.paymentStatusMap[order.paymentStatus];
              if (order.isExpire){
                _.assignIn(order,{orderDesc:"已过期"});
              }else if(order.isMonthly && order.orderStatus == 4){
                _.assignIn(order,{orderDesc:"待月结"})
              }else if(order.orderStatus == 2 || order.orderStatus == 3){
                order.orderStatus == 2 ? _.assignIn(order,{orderDesc:"已完成"}) : _.assignIn(order,{orderDesc:"已取消"});
              }else if(order.paymentStatus == 0 || order.paymentStatus == 1){
                _.assignIn(order,{orderDesc:"等待付款"});
                if(order.shippingStatus != 0){
                  order.orderDesc += "," + ENV.shippingStatusMap[order.shippingStatus];
                }
              }else if(order.paymentStatus == 0 && order.shippingStatus == 2){
                _.assignIn(order,{orderDesc:"等待付款,已发货"});
              }else {
                _.assignIn(order,{orderDesc:ENV.paymentStatusMap[order.paymentStatus]});
                if(order.paymentStatus == 2 && order.shippingStatus == 0){
                  order.orderDesc += ",等待发货";
                }else{
                  order.orderDesc += ","+ ENV.shippingStatusMap[order.shippingStatus];
                }
              }

              if (order.orderStatus == 4 && !order.isMonthly){
                _.assignIn(order,{orderDesc:"月结"})
              } else if(order.orderStatus == 5){
                _.assignIn(order,{orderDesc:"货到付款"});
              }
              /*按钮功能是否显示(我的物流,确认收货,取消订单,立即付款,立即评价)*/
              _.assignIn(order,{mylogBtn:false,confirmBtn:false,cancelBtn:false,payBtn:false,reviewBtn:false});
              if(order.shippingStatus == 1 || order.shippingStatus == 2 || order.orderStatus == 2 || order.shippingStatus == 5 || order.shippingStatus == 6){
                order.mylogBtn = true;
              }
              if(((order.orderStatus == 1 && order.paymentStatus == 2) || order.paymentStatus == 0 || order.orderStatus == 2) && order.shippingStatus == 2){
                order.confirmBtn = true;
              }
              if(!order.isExpire && order.orderStatus != 4 && (order.paymentStatus == 0 || order.paymentStatus == 1) && order.orderStatus != 3 && order.orderStatus != 5 && order.orderStatus != 2){
                order.cancelBtn = true;
              }
              if(!order.isExpire && order.orderStatus != 3 && order.orderStatus != 2 && order.orderStatus != 5 && (order.paymentStatus == 0 || order.paymentStatus == 1)){
                order.payBtn = true;
              }
              if(((order.orderStatus != 2 &&  order.shippingStatus == 6) ||
                (order.shippingStatus == 5 && order.orderStatus != 2) ||
                (order.shippingStatus == 6 && order.orderStatus != 2) ||
                (order.orderStatus == 1 && order.paymentStatus == 2 && (order.shippingStatus == 5 || order.shippingStatus == 6))) && !order.isExpire && !order.isReviewed){
                order.reviewBtn = true;
              }
              return order;
            }
          });
        },

        getList: function(pageNumber, pageSize, opt) {
          var _opt = _.assignIn({}, defaultOpt, opt);
          return httpRequest({
            method: getListConfig.method,
            url: getListConfig.url,
            params: {
              'type': _opt.type || undefined,
              'pageNumber': pageNumber,
              'pageSize': pageSize
            },
            success: function (data) {
              _.each(data.list, function (order) {
                order.orderStatusDesc = ENV.orderStatusMap[order.orderStatus];
                order.shippingStatusDesc = ENV.shippingStatusMap[order.shippingStatus];
                order.paymentStatusDesc = ENV.paymentStatusMap[order.paymentStatus];
                order.createDateStr = order.createDate.substr(0,10);
                /*订单列表右上角状态显示*/
                if (order.isExpire){
                  _.assignIn(order,{orderDesc:"已过期"});
                }else if(data.isMonthly && order.orderStatus == 4){
                  _.assignIn(order,{orderDesc:"待月结"})
                }else if(order.orderStatus == 2 || order.orderStatus == 3){
                  order.orderStatus == 2 ? _.assignIn(order,{orderDesc:"已完成"}) : _.assignIn(order,{orderDesc:"已取消"});
                }else if(order.paymentStatus == 0 || order.paymentStatus == 1){
                  _.assignIn(order,{orderDesc:"等待付款"});
                  if(order.shippingStatus != 0){
                    order.orderDesc += "," + ENV.shippingStatusMap[order.shippingStatus];
                  }
                }else if(order.paymentStatus == 0 && order.shippingStatus == 2){
                  _.assignIn(order,{orderDesc:"等待付款,已发货"});
                }else {
                  _.assignIn(order,{orderDesc:ENV.paymentStatusMap[order.paymentStatus]});
                  if(order.paymentStatus == 2 && order.shippingStatus == 0){
                    order.orderDesc += ",等待发货";
                  }else{
                    order.orderDesc += ","+ ENV.shippingStatusMap[order.shippingStatus];
                  }
                }

                if (order.orderStatus == 4 && !data.isMonthly){
                  _.assignIn(order,{orderDesc:"月结"})
                } else if(order.orderStatus == 5){
                  _.assignIn(order,{orderDesc:"货到付款"});
                }

                /*按钮功能是否显示(我的物流,确认收货,取消订单,立即付款,立即评价)*/
                _.assignIn(order,{mylogBtn:false,confirmBtn:false,cancelBtn:false,payBtn:false,reviewBtn:false});
                if(order.shippingStatus == 1 || order.shippingStatus == 2 || order.shippingStatus == 7 || order.orderStatus == 2 || order.shippingStatus == 5 || order.shippingStatus == 6){
                  order.mylogBtn = true;
                }
                if(((order.orderStatus == 1 && order.paymentStatus == 2) || order.paymentStatus == 0 || order.orderStatus == 2) && order.shippingStatus == 2 || order.shippingStatus == 7){
                  order.confirmBtn = true;
                }
                if(!order.isExpire && order.orderStatus != '4' && (order.paymentStatus == 0 || order.paymentStatus == 1) && order.orderStatus != 3 && order.orderStatus != 5 && order.orderStatus != 2){
                  order.cancelBtn = true;
                }
                if(!order.isExpire && order.orderStatus != 3 && order.orderStatus != 2 && (order.paymentStatus == 0 || order.paymentStatus == 1)  && order.orderStatus != 5){
                  order.payBtn = true;
                }
                if(((order.orderStatus != 2 &&  order.shippingStatus == 6) ||
                   (order.shippingStatus == 5 && order.orderStatus != 2) ||
                   (order.shippingStatus == 6 && order.orderStatus != 2) ||
                   (order.orderStatus == 1 && order.paymentStatus == 2 && (order.shippingStatus == 5 || order.shippingStatus == 6))) && !order.isExpire && !order.isReviewed){
                     order.reviewBtn = true;
                }
              });
              return data;
            }
          });
        },

        getCount: function(params){
          return httpRequest({
            method: getCountConfig.method,
            url: getCountConfig.url,
            headers:{'Content-Type':'application/json'},
            data:params
          })
        },

        create: function(params) {
          return httpRequest({
            method: createConfig.method,
            url: createConfig.url,
            data:params,
            headers:{'Content-Type':'application/json'}
          });
        },

        cancel: function(sn) {
          return httpRequest({
            method: cancelConfig.method,
            url: cancelConfig.url,
            data: $httpParamSerializer({'sn': sn})
          });
        },

        cancelOrder: function(sn) {
          return httpRequest({
            method: cancelOrderConfig.method,
            url: cancelOrderConfig.url,
            data: $httpParamSerializer({'sn': sn})
          });
        },

        confirmOrder: function(sn) {
          return httpRequest({
            method: confirmOrderConfig.method,
            url: confirmOrderConfig.url,
            data: $httpParamSerializer({'sn': sn})
          });
        },

        payparam: function(params, payType) {
          var payparamConfig;
          switch (payType) {
            case 0: payparamConfig = alipayparamConfig;break;
            case 1: payparamConfig = wexinparamConfig;break;
          }
          return httpRequest({
            method: payConfig.method,
            url: payConfig.url,
            data: $httpParamSerializer(params)
          });
        },

        evaluate: function () {

        },
        directInfo: function(){
          return httpRequest({
            method: directInfoConfig.method,
            url: directInfoConfig.url,
            data:$httpParamSerializer(orderProList),
            success:function(data){
              _.chain(data.products)
                .forEach(function (p,index) {
                  p.image = StringUtil.isEmpty(p.image) ? ENV.defaultImg : Util.getFullImg(p.image);
                  p.truePrice = p.price;
            }).value();
              _.chain(data.notMonthlyProducts)
                .forEach(function (p,index) {
                  p.image = StringUtil.isEmpty(p.image) ? ENV.defaultImg : Util.getFullImg(p.image);
                  p.truePrice = p.price;
                }).value();
              return data;
            }
          });
        },
        couponInfo: function(params){
          return httpRequest({
            method: couponInfoConfig.method,
            url: couponInfoConfig.url,
            data:$httpParamSerializer(params)
          });
        },
        directBuyPrecheck: function(params){
          return httpRequest({
            method:directBuyPrecheckConfig.method,
            url:directBuyPrecheckConfig.url,
            data:$httpParamSerializer(params)
          });
        },
        payInfo:function(params){
          return httpRequest({
            method:payInfoConfig.method,
            url:payInfoConfig.url,
            data:$httpParamSerializer(params)
          });
        },
        /*支付成功回调信息*/
        info:function(params){
          return httpRequest({
            method:infoConfig.method,
            url:infoConfig.url,
            params:params
          });
        },
        /*再次购买*/
        buyAgain:function(params){
          return httpRequest({
            method:buyAgainConfig.method,
            url:buyAgainConfig.url,
            params:params
          });
        },
        getSearchResult:function(params){
          return httpRequest({
            method:getSearchConfig.method,
            url:getSearchConfig.url,
            params:params
          });
        },

        //获取订单商品清单
        getOrderProList: function () {
          return orderProList;
        },
        //设置购物车内容----购物车页调用
        setOrderProList: function (tmpCartList) {
          orderProList = tmpCartList;
          return true;
        }
      }
    }
  ]);
})();

(function () {
  goodvan.module
  .factory('productService', [
    'ENV',
    'httpRequest',
    '$httpParamSerializer',
    function(ENV, httpRequest,$httpParamSerializer) {
      var getListConfig = ENV.product.getList,  //获取
          getInfoConfig = ENV.product.getInfo, //获取商品详情
          getRecommendProductcConfig = ENV.product.getRecommendProductc,//猜您喜欢
          isGoodsBuyUrl = ENV.isGoodsBuy;
          getRecommendProduct = ENV.product.getRecommend;//商品详情猜您喜欢
          getPurchaseCountConfig = ENV.product.getPurchaseCount;
          getArrivalConfig=ENV.product.getArrival;
          getPersonSaveConfig=ENV.product.save;
          getCategoryPromotionProductPageList = ENV.product.getCategoryPromotionProductPageList;
      return {
        getList: function(params) {
          return httpRequest({
            method:getListConfig.method,
            url: getListConfig.url,
            params:params
          });
        },
        getArrival: function(params) {
          return httpRequest({
            method:getArrivalConfig.method,
            url: getArrivalConfig.url,
            params:params
          });
        },
        getPersonSave: function(params) {
          return httpRequest({
            method:getPersonSaveConfig.method,
            url: getPersonSaveConfig.url,
            params:params
          });
        },
        getRecommendProductc: function(params){
          return httpRequest({
            method:getRecommendProductcConfig.method,
            url:getRecommendProductcConfig.url,
            params:params
          });
        },
        getRecommend: function(id){//商品详情推荐
          return httpRequest({
            method:getRecommendProduct.method,
            url:getRecommendProduct.url,
            params:{id:id}
          });
        },
        getListByRecommend: function () {

        },

        getListByFloor: function () {

        },

        getListByGuess: function () {

        },

        getListByCategory: function () {

        },

        getListByHot: function () {

        },

        getSpec: function() {

        },
        getInfo: function(id){
          return httpRequest({
            method:getInfoConfig.method,
            url: getInfoConfig.url,
            params:{id:id}
          });
        },
        //...
        purchaseCount: function() {
          return httpRequest({
            method:getPurchaseCountConfig.method,
            url:getPurchaseCountConfig.url
          })
        },
        // 商品促销没分区情况根据活动id跟分类id查询商品
        getCategoryPromotionProductPageList: function (params) {
          return httpRequest({
            method: getCategoryPromotionProductPageList.method,
            url: getCategoryPromotionProductPageList.url,
            params: params
          });
        },
        //查询该商品 在某地区是否能购买
        isGoodsBuy:function(params){
            return httpRequest({
                method: isGoodsBuyUrl.method,
                url: isGoodsBuyUrl.url,
                params: params
        });
        }
      }
    }
  ]);
})();

(function () {
  goodvan.module
  .factory('productSpecService', [function() {

  }]);
})();

(function () {
  goodvan.module
  .factory('promotionService', [
    'ENV',
    'httpRequest',
    function(ENV, httpRequest) {
      var promotionConfig = ENV.promotion.getList,
          getAreaListConfig = ENV.promotion.getAreaList,
          getInfo = ENV.promotion.getInfo,
          getRootCategory = ENV.promotion.rootCategory;
      return {
        getList: function(params){
        return httpRequest({
          method:promotionConfig.method,
          url: promotionConfig.url,
          params: params
        });
      },
        getAreaList: function(params){
          return httpRequest({
            method:getAreaListConfig.method,
            url: getAreaListConfig.url,
            params: params
          });
        },
        getInfo: function (params) {
          return httpRequest({
            method:getInfo.method,
            url: getInfo.url,
            async: false,
            params: params
          });
        },
        getRootCategory: function (params) {
          return httpRequest({
            method:getRootCategory.method,
            url: getRootCategory.url,
            params:params
          });
        }

      }
    }
  ]);
})();

(function () {
  goodvan.module
  .factory('purchaseOrderService', [
    'ENV',
    'httpRequest',
    '$q',
    '$httpParamSerializer',
    'StringUtil',
    'Util',
    function(ENV, httpRequest, $q, $httpParamSerializer,StringUtil,Util) {
      var getProductsConfig = ENV.purchaseOrder.getProducts,
          addProductConfig = ENV.purchaseOrder.addProduct,
          removeProductConfig = ENV.purchaseOrder.removeProduct,
          editQuantityConfig = ENV.purchase.choiceproduct,
          directInfoConfig = ENV.order.directInfo;

      var state = {
          selected: [],
          sumPrice: 0
        },
        defaultOpt = {};
      var editPageFlag = false;
      var self = {
        /**
         * 获取采购单的商品列表
         * @param  {String} pageNumber 分页页码
         * @param  {String} pageSize 分页大小
         * @param  {String} opt 选项
         *  {
         *    keyword: String?, 关键字
         *    isOutStock: Boolean?, 是否缺货
         *  }
         * @return {Promise}
         */
        getProducts: function (opt) {
          var _opt = _.assignIn({}, defaultOpt, opt);

          return httpRequest({
            method: getProductsConfig.method,
            url: getProductsConfig.url,
            params: {
              'keyword': _opt.keyword,
              'isOutStock': _opt.isOutStock,
              'makeType': _opt.makeType,
              'categoryIds': _opt.categoryIds,
              'brandIds':_opt.brandIds
            },
            success: function (data) {
              var products = data.list;
              _.chain(products)
                .each(function (p) {
                  p.price = parseFloat(p.price);
                  p.isSelected = false;
                  if(p.specificationValuesName == ''){
                    p.isHasSpecification = false;
                  }else{
                    p.isHasSpecification = true;
                  }
                  if(StringUtil.isEmpty(p.image)){
                    p.image = ENV.defaultImg;
                  }else {
                    p.image = Util.getFullImg(p.image);
                  }

                  /*判断单个商品是否能够选择，msg*/
                  p=self.isSelectProduct(p);
                })
                .value();
              return products;
            }
          });
        },
        /**
         * 添加多个商品到采购单中
         * @param  {Array<Object>} params
         * {
         *  id: String|Number, 商品编号
         *  quantity: String|Number,  商品购买数量
         * }
         * @return {Promise}
         */
        addProducts: function(params) {
          return httpRequest({
            method: addProductConfig.method,
            url: addProductConfig.url,
            data: $httpParamSerializer({'list': JSON.stringify(params)})
          });
        },

        addProduct: function(param) {
          return httpRequest({
            method: addProductConfig.method,
            url: addProductConfig.url,
            data: $httpParamSerializer(param)
          });
        },

        /**
         *采购单删除单条记录
         * */
        removeSingle: function(id){
          return httpRequest({
            method: removeProductConfig.method,
            url: removeProductConfig.url,
            data:$httpParamSerializer({ids: id})
            //success: function(rs){
            //  return rs;
            //}
          })
        },

        /**
         * 从采购单中删除商品
         * @param {Object|Array<Object>} products 商品或商品列表
         * @return {Promise}
         */
        removeProduct: function(products) {
          var ids;
          if (!angular.isArray(products)) {
            ids = [products.id];
          } else {
            ids = _.map(products, 'id');
          }
          return httpRequest({
            method: removeProductConfig.method,
            url: removeProductConfig.url,
            data: $httpParamSerializer({'ids': ids.join(',')})
          });
        },

        /**
         * 结算采购单列表商品
         *
        * */
        buyNow: function(products){
          var ids, quantitys;
          if(!angular.isArray(products)){
            ids = [products.id];
          }else {
            ids  = _.map(products, 'id');
            quantitys = _.map(products, 'quantity');
          }
          return httpRequest({
            method: directInfoConfig.method,
            url: directInfoConfig.url,
            data: $httpParamSerializer({'ids': ids.join(','),'quantitys': quantitys.join(',')}),
            success: function(data){}
          });
        },

        /**
         * 选择商品
         * @param {Object|Array<Object>} products 商品或商品列表
         * @return this
           */
        select: function(products) {
          products = _.isArray(products) ? products : [products];
          _.each(products, function (product) {
            if(_.indexOf(state.selected, product.id) === -1 && product.isSelected) {
              state.sumPrice += product.price * product.quantity;
              state.selected.push(product.id);
            }
          });
          return self;
        },
        /**
         * 取消选择商品
         * @param {Object|Array<Object>} products 商品或商品列表
         * @return this
           */
        unselect: function(products) {
          if (!products) {
            state.selected = [];
            state.sumPrice = 0;
            return;
          }
          products = _.isArray(products) ? products : [products];
          var ids = _.map(products, 'id');
          _.each(products, function (product) {
            if(_.indexOf(state.selected, product.id) !== -1) {
              state.sumPrice -= product.price * product.quantity;
            }
            if(state.sumPrice < 0) {
              state.sumPrice = 0;
              return false;
            }
          });
          _.pullAll(state.selected, ids);
          return self;
        },
        /**
         * 设置购买商品数量
         * @param product
         * @returns {Promise}
           */
        //setQuantity: function(product) {
        //  return self.addProduct({
        //    id: product.id,
        //    quantity: product.quantity
        //  });
        //},
        setQuantity: function(params) {

          return httpRequest({
            method: editQuantityConfig.method,
            url: editQuantityConfig.url,
            headers: {
              'Content-Type': 'application/json'
            },
            data:params
            //params: {
            //  productId: product.id,
            //  quantity: product.quantity
            //}
          });
        },
        /**
         * 获取当前采购单的状态
         * @returns {{selected: Array, sumPrice: number}}
         *   - **selected** – `{Array}` – 已选择的商品id
         *   - **selected** – `{number}` – 结算总价
         */
        getState: function () {
          return state;
        },

        /*清空state*/
        clearState: function(){
          state.selected = [];
          state.sumPrice = 0;
        },

        changeEditStatus:function(flag){
          if(flag!=null){
            editPageFlag = flag;
            return;
          }
          editPageFlag = !editPageFlag;
        }
        ,
        /*判断单个商品是否能够选择，msg*/
        isSelectProduct:function(p)
        {
          if(!p.isMarketable || p.availableStock == 0 || p.quantity > p.availableStock || p.isDiscuss ||(p.isLimit ? 　p.quantity > p.limitNo : false)){
            p.hasErr = true;
            if(!p.isMarketable && !p.isBuyNotPutaway){
              p.isSelected = false;
              p.canClick = editPageFlag;
              p.errMsg = '商品已下架';
              p.isShowPrice = true;
            } else if(p.availableStock == 0){
              p.isSelected = false;
              p.canClick = editPageFlag;
              p.errMsg = '库存不足';
              p.isShowPrice = true;
            } else if(p.quantity > p.availableStock){
              p.isSelected = false;
              p.canClick = editPageFlag;
              p.errMsg = '超过库存数';
              p.isShowPrice = true;
            } else if(p.isDiscuss && !p.isBuyNotPutaway){
              p.isSelected = false;
              p.canClick = editPageFlag;
              p.errMsg = '面议';
              p.isShowPrice = false;
            }
            else {
              p.isSelected = false;
              p.canClick = editPageFlag;
              p.errMsg = '限购' + p.limitNo + p.unit;
              p.isShowPrice = true;
            }
          } else {
            if(p.isLimit){
              p.errMsg = '限购' + p.limitNo + p.unit;
            }
            p.isShowPrice = true;
            p.canClick = true;
            p.isSelected = !editPageFlag;
            p.hasErr = false;
          }
          return p;
        }
      };
      return self;
    }
  ]);
})();

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

(function () {
  goodvan.module
  .factory('secondsService', [
    'ENV',
    'httpRequest',
    function(ENV, httpRequest) {
      var promotionConfig = ENV.promotion.robList,
        getInfo = ENV.promotion.getInfo,
        productsConfig=ENV.promotion.products;
      return {
        getList: function(params){
          return httpRequest({
            method:promotionConfig.method,
            url: promotionConfig.url,
            params: params
          })
        },
        getProducts: function(params){
          return httpRequest({
            method:productsConfig.method,
            url: productsConfig.url,
            params: params
          })
        },
        getInfo: function (params) {
          return httpRequest({
            method: getInfo.method,
            url: getInfo.url,
            async: false,
            params: params
          })
        },
        getProduct: function (params) {
          return httpRequest({
            method:productsConfig.method,
            url: productsConfig.url,
            async: false,
            params: params
          });
        }

      }
    }
  ]);
})();

//齿研社
(function () {
  goodvan.module
  .factory('toothOplist', [
    '$resource',
    'ENV',
    'httpRequest',
    '$httpParamSerializer',
    function($resource, ENV, httpRequest,$httpParamSerializer) {
      var getBannerConfig = ENV.navilist.bannerlist;
      var saveEnquiryConfig =ENV.memberYcInquiry.save;
      return {
        toothIMGlist: function() {
          return $resource(ENV.siteUrl + 'navilist/bannerlist')
        },
        toothList: function() {
          //ENV.siteUrl + 'navilist/productlist'齿研社商品列表的地址
          return $resource(ENV.siteUrl + 'navilist/productlist', {
            keyword: '@keyword',
            dateDesc: '@dateDesc',
            pageNumber: '@pageNumber',
            pageSize: '@pageSize',
            categoryIds: '@categoryIds'
          })
        },
        //获取图片广告列表
        getBannerlist: function(params){
          return httpRequest({
            method: getBannerConfig.method,
            url: getBannerConfig.url,
            params: params,
            success: function(bl){
              return bl;
            }
          })
        },
        ycSave: function(params){
          return httpRequest({
            method: saveEnquiryConfig.method,
            url: saveEnquiryConfig.url,
            data: $httpParamSerializer(params)
            //cancellable: true
            //success: function(data){
            //
            //}
          })
        }
      }
  }])

.factory('proCategory', ['$resource', 'ENV', function($resource, ENV) {
  return {
    allProductCategory: function() {
      return $resource(ENV.siteurl + '/productcategory/navilist').get();
    }
  }
}])

.factory('notepad', ['$resource', 'ENV', function($resource, ENV) {
  return $resource(ENV.siteurl + '/save');
}]);
})();

(function () {
  goodvan.module
  .factory('userAddressService', [
    'ENV',
    'httpRequest',
    '$httpParamSerializer',
    function(ENV, httpRequest, $httpParamSerializer) {
      var getListConfig = ENV.userAddress.getList,  //收货地址列表
          getConfig = ENV.userAddress.getDetail,     //收货地址详情
          saveConfig = ENV.userAddress.save,         //保存收货地址
          deleteConfig = ENV.userAddress.delete,     //删除收藏地址
          setDefaultConfig = ENV.userAddress.setDefault,//设为默认地址
          getParentConfig = ENV.userAddress.getParent,//省列表
          getCityConfig = ENV.userAddress.getCity; //市列表
          getCalculate = ENV.userAddress.getCalculate; //获取重新计算的运费
      return {
        /**
         * @param {Number|String} id 收货地址ID
         * @return {Promise}
           */
        get: function(id) {
          return httpRequest({
            method: getConfig.method,
            url: getConfig.url,
            params: {'id': id}
          });
        },

        getList: function() {
          return httpRequest({
            method: getListConfig.method,
            url: getListConfig.url
          });
        },
        /**
         * @param {Number|String} id? 默认返回省份
         * @return {Promise}
           */
        getArea: function (id) {
          return httpRequest({
            method: getAreaConfig.method,
            url: getAreaConfig.url,
            params: {'parentId': id},
            success: function (data) {
              return data.list;
            }
          });
        },

        save: function (address) {
          return httpRequest({
            method: saveConfig.method,
            url: saveConfig.url,
            data: $httpParamSerializer(address)
          })
        },

        delete: function (id) {
          return httpRequest({
            method: deleteConfig.method,
            url: deleteConfig.url,
            data: $httpParamSerializer({'id': id})
          });
        },
        /*获取省列表*/
        getProvinceList:function(){
          return httpRequest({
            method:getParentConfig.method,
            url:getParentConfig.url
          });
        },
        /*获取市列表*/
        getCityList:function(params){
          return httpRequest({
            method:getCityConfig.method,
            url:getCityConfig.url,
            params:params
          });
        },
        /*获取运费*/
        getCalculate:function(params)
        {
          return httpRequest({
            method:getCalculate.method,
            url:getCalculate.url,
            headers:{'Content-Type':'application/json'},
            data:params
          });
        },
        /*设为默认地址*/
        setDefault: function(id){
          return httpRequest({
            method:setDefaultConfig.method,
            url:setDefaultConfig.url,
            data: $httpParamSerializer({'id': id})
          });
        }
      }
    }
  ]);
})();

(function () {
  goodvan.module
  .factory('userService', [
    'ENV',
    'httpRequest',
    '$q',
    '$httpParamSerializer',
    '$cookies',
    'StringUtil',
    function(ENV, httpRequest, $q, $httpParamSerializer, $cookies,StringUtil) {
      var user, token_id = ENV.token_id, currentUser = ENV.currentUser;
      var getInfoConfig = ENV.user.getInfo,
          updateConfig = ENV.user.update,
          loginConfig = ENV.user.login,
          logoutConfig = ENV.user.logout,
          resetPwdConfig = ENV.user.resetPwd,
          modifyPwdConfig = ENV.user.modifyPwd,
          registerConfig = ENV.user.register;

      var self = {
        getToken: function () {
          return $cookies.get(token_id);
        },

        isLogin: function () {
          return !!$cookies.get(token_id);
        },

        login: function (params) {
          return httpRequest({
            method: loginConfig.method,
            url: loginConfig.url,
            data: $httpParamSerializer(params),
            cancellable: true,
            success: function (data) {
              $cookies.put(token_id, data.token ,{
                expires: new Date(Date.now() + 2 * 24 * 3600 * 1000)
              });
              $cookies.put(currentUser, JSON.stringify(data.member) ,{
                expires: new Date(Date.now() + 2 * 24 * 3600 * 1000)
              });
              data.member.genderDesc = StringUtil.isEmpty(data.member.gender) ? '请选择' : ENV.genderMap[data.member.gender];
              return user = data.member;
            }
          });
        },

        logout: function () {
          return httpRequest({
            method: logoutConfig.method,
            url: logoutConfig.url,
            params: {token_id: self.getToken()},
            success: function () {
              $cookies.remove(token_id);
              $cookies.remove(currentUser);
                $cookies.remove('address');
            }
          });
        },

        register: function (params) {
          return httpRequest({
            method: registerConfig.method,
            url: registerConfig.url,
            data: $httpParamSerializer(params),
            success: function (data) {
              $cookies.put(token_id, data.token, {
                expires: new Date(Date.now() + 2 * 24 * 3600 * 1000)
              });
              data.member.genderDesc = StringUtil.isEmpty(data.member.gender) ? '请选择' : ENV.genderMap[data.member.gender];
              return user = data.member;
            }
          });
        },

        resetPwd: function (params) {
          return httpRequest({
            method: resetPwdConfig.method,
            url: resetPwdConfig.url,
            data: $httpParamSerializer(params)
          });
        },

        modifyPwd: function(params){
          return httpRequest({
            method: modifyPwdConfig.method,
            url: modifyPwdConfig.url,
            data: $httpParamSerializer(params)
          });
        },

        getInfo: function() {
          if(user) return $q.resolve(user);
          return httpRequest({
            method: getInfoConfig.method,
            url: getInfoConfig.url,
            cancellable: true,
            success: function (data) {
              console.log( ENV.genderMap[data.member.gender]);
              data.member.genderDesc = StringUtil.isEmpty(data.member.gender) ? '请选择' : ENV.genderMap[data.member.gender];
              return data.member;
            },
            error: function (err) {
              if(err.code) {
                $cookies.remove(token_id);
              }
              return $q.reject(err.msg);
            }
          });
        },

        update: function (params) {
          return httpRequest({
            method: updateConfig.method,
            url: updateConfig.url,
            data: $httpParamSerializer(params),
            success: function (data) {
              return user = data.member;
            }
          })
        }
      };
      return self;
    }
  ]);
})();

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
