(function(window) {
  var config = {
    // 图片获取路径前缀
    IMG_GET_PREFIX : [
      'http://wwwtest.51aiyaku.com/',       //dev
      'http://wwwtest.51aiyaku.com/',       //test
      'http://uat.51aiyaku.com/',       //uat
      'http://www.51aiyaku.com/'        //porduct
    ],

    // 服务端接口前缀
    SERVER_IF_PREFIX : [
      'http://192.168.3.185:8003/',
      //'http://192.168.3.152:8001/',          //dev
      'http://192.168.1.53:7000/',          //test
      'http://muat.51aiyaku.com/',          //uat
      'http://mapi.51aiyaku.com/'           //product
    ],

    // 支付接口
    PAY_CHANNEL : [
      'http://localhost:8000',
      'http://testm.51aiyaku.com',
      'http://mweb.51aiyaku.com',
      'http://m.51aiyaku.com'
    ]
  };

  expose();

  function expose(){
    var goodvan = window.goodvan;

    Extends(goodvan, {
      getImgGetPrefix : function() {
        return config['IMG_GET_PREFIX'][goodvan.env];
      },

      getWapPrefix : function() {
        return config['SERVER_IF_PREFIX'][goodvan.env];
      },

      getPayChannel : function() {
        return config['PAY_CHANNEL'][goodvan.env];
      }
    });
  }

  function Extends(so,po)
  {
    for (var i in po)
    {
      if (so[i])//如果so也具有这个成员
        continue;
      so[i] = po[i];
    }
  }

})(window);
