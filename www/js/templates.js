(function(module) {
try {
  module = angular.module('starter.templates');
} catch (e) {
  module = angular.module('starter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/tabs.html',
    '<div class="tabs-icon-top tabs-bottom tabs-standard tabs-color-positive ">\n' +
    '  <div class="tabs tab-nav">\n' +
    '    <a class="tab-item" ng-class="{true:\'tab-item-active\', false: \'\'}[tabNav.curNav==\'home\']" ui-sref="home" nav-transition="none">\n' +
    '      <i class="icon ion-aiya icon-home"></i>\n' +
    '      <span  class="tab-title ">首页</span>\n' +
    '    </a>\n' +
    '    <a class="tab-item"  ng-class="{true:\'tab-item-active\', false: \'\'}[tabNav.curNav==\'category\']"  ui-sref="mainCategory" nav-transition="none">\n' +
    '      <i class="icon ion-aiya icon-cf-c25"></i>\n' +
    '      <span  class="tab-title ">分类</span>\n' +
    '    </a>\n' +
    '      <a src="javascript:;" class="tab-item activityBtn activityBtnColor"  ui-sref="article({id:117})">\n' +
    '          <i class="icon ion-aiya icon-xiaoshoucuxiao"></i>\n' +
    '          <span  class="tab-title ">促销活动</span>\n' +
    '      </a>\n' +
    '    <a class="tab-item"  ng-class="{true:\'tab-item-active\', false: \'\'}[tabNav.curNav==\'brand\']"  ui-sref="brand" nav-transition="none">\n' +
    '      <i class="icon ion-aiya icon-icon4"></i>\n' +
    '      <span  class="tab-title ">品牌库</span>\n' +
    '    </a>\n' +
    '\n' +
    '\n' +
    '\n' +
    '    <!--<a class="tab-item"  ng-class="{true:\'tab-item-active\', false: \'\'}[tabNav.curNav==\'toothOp\']" ui-sref="toothOp" nav-transition="none">-->\n' +
    '      <!--<i class="icon ion-aiya icon-tooth"></i>-->\n' +
    '      <!--<span  class="tab-title ">齿研社</span>-->\n' +
    '    <!--</a>-->\n' +
    '<!--\n' +
    '    <a class="tab-item" ng-class="{true:\'tab-item-active\', false: \'\'}[tabNav.curNav==\'findAssistant\']"  ui-sref="findAssistant" nav-transition="none">\n' +
    '      <i class="icon" ng-class="{true: \'ion-ios-search-strong\', false: \'ion-ios-search\'}[tabNav.curNav==\'findAssistant\']"></i>\n' +
    '      <span  class="tab-title ">找货助手</span>\n' +
    '    </a>-->\n' +
    '\n' +
    '    <a class="tab-item" ng-class="{true:\'tab-item-active\', false: \'\'}[tabNav.curNav==\'user\']"  ui-sref="user" nav-transition="none">\n' +
    '      <i class="icon ion-aiya icon-wo"></i>\n' +
    '      <span  class="tab-title ">我的</span>\n' +
    '    </a>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('starter.templates');
} catch (e) {
  module = angular.module('starter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/user/login.html',
    '<ion-view hide-nav-bar="true" class="login">\n' +
    '  <div class="bar bar-header bar-stable">\n' +
    '    <div class="title">司機登入</div>\n' +
    '    <div class="buttons buttons-right">\n' +
    '      <span class="right-buttons">\n' +
    '        <button class="button button-dark button-clear ion-ios-more icon-right" nav-button></button>\n' +
    '      </span>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '  <ion-content scrollbar-y="false" class="has-header">\n' +
    '    <div class="list">\n' +
    '      <label class="item item-input">\n' +
    '        <input type="text" placeholder="電話" ng-model="user.username">\n' +
    '      </label>\n' +
    '      <label class="item item-input">\n' +
    '        <input type="text" placeholder="電郵" ng-model="user.email">\n' +
    '      </label>\n' +
    '    </div>\n' +
    '    <button class="button button-block button-assertive">\n' +
    '      登入\n' +
    '    </button>\n' +
    '  </ion-content>\n' +
    '</ion-view>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('starter.templates');
} catch (e) {
  module = angular.module('starter.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/user/register.html',
    '<ion-view hide-nav-bar="true" class="register">\n' +
    '  <div class="bar bar-header bar-stable">\n' +
    '    <div class="title">註冊資料</div>\n' +
    '    <div class="buttons buttons-right">\n' +
    '      <span class="right-buttons">\n' +
    '        <button class="button button-dark button-clear ion-ios-more icon-right" nav-button></button>\n' +
    '      </span>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '  <ion-content scrollbar-y="false" class="has-header">\n' +
    '    <div class="list">\n' +
    '      <label class="item item-input">\n' +
    '        <input type="text" placeholder="電話" ng-model="user.username">\n' +
    '      </label>\n' +
    '      <label class="item item-input">\n' +
    '        <input type="text" placeholder="電郵" ng-model="user.englishName">\n' +
    '      </label>\n' +
    '      <label class="item item-input">\n' +
    '        <input type="text" placeholder="香港身分證號碼" ng-model="user.IDCard">\n' +
    '      </label>\n' +
    '      <label class="item item-input">\n' +
    '        <input type="text" placeholder="出生日期" ng-model="user.birth">\n' +
    '      </label>\n' +
    '      <label class="item item-input">\n' +
    '        <input type="text" placeholder="住宅電話" ng-model="user.homePhone">\n' +
    '      </label>\n' +
    '      <label class="item item-input">\n' +
    '        <input type="text" placeholder="手提電話" ng-model="user.telPhone">\n' +
    '      </label>\n' +
    '      <label class="item item-input">\n' +
    '        <input type="text" placeholder="駕駛經驗(年牌)" ng-model="user.drivingAge">\n' +
    '      </label>\n' +
    '      <label class="item item-input">\n' +
    '        <input type="text" placeholder="住址" ng-model="user.addr">\n' +
    '      </label>\n' +
    '      <label class="item item-input">\n' +
    '        <input type="text" placeholder="車牌" ng-model="user.plate">\n' +
    '      </label>\n' +
    '      <label class="item item-input">\n' +
    '        <input type="text" placeholder="中間封網(有/否/半)" ng-model="user.middleNetwork">\n' +
    '      </label>\n' +
    '    </div>\n' +
    '    <div class="row">\n' +
    '      <label for="van">Van仔</label>\n' +
    '      <input type="radio" name="goodsVan" id="van" value="van" ng-model="user.goodsVan"/>\n' +
    '      <label for="goods">貨車</label>\n' +
    '      <input type="radio" name="goodsVan" id="goods" value="goods" ng-model="user.goodsVan"/>\n' +
    '    </div>\n' +
    '    <button class="button button-block button-assertive">\n' +
    '      立即註冊\n' +
    '    </button>\n' +
    '  </ion-content>\n' +
    '</ion-view>\n' +
    '');
}]);
})();
