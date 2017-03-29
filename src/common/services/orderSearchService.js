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
