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
