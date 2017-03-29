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
