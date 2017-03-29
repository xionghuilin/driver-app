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
