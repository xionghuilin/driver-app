'use strict';
(function(window){

  //返回顶部
  window.goodvan.module.directive('aiyaScrollTop', function() {
    return {
      restrict: "E",
      controller: function($scope) {
        $scope.kg = false;
      },
      link: function($scope, element, attr) {
        $(element).on("click", function() {
          $("body").animate({
            scrollTop: 0
          }, 1000, function() {
            $scope.$apply($scope.kg = false)
          })
          $scope.$apply($scope.kg = true)
        })
      }
    }
  })

  /*页面预加载动画*/
  .directive('aiyaLoading', function() {
    return {
      restrict: 'AE',
      /*E:元素 A:属性  C:样式类 M:注释*/
      template: '<div class="aiya-loading"><ion-spinner icon="ios"></ion-spinner></div></div>',
      replace: true
    }
  })

  /*星星评分*/
  .directive("ratingBar", function() {
    return {
      restrict: 'E',
      template: '<div>' +
      '<div class="remark-wrapper">'+
      '<a href="javascript:;" ng-class="{\'rating-light\':ratingValue>=1,\'rating-fade\':ratingValue<1}" ng-click="rating(1)"></a>' +
      '<a href="javascript:;" ng-class="{\'rating-light\':ratingValue>=2,\'rating-fade\': <2}" ng-click="rating(2)"></a>' +
      '<a href="javascript:;" ng-class="{\'rating-light\':ratingValue>=3,\'rating-fade\':ratingValue<3}" ng-click="rating(3)"></a>' +
      '<a href="javascript:;" ng-class="{\'rating-light\':ratingValue>=4,\'rating-fade\':ratingValue<4}" ng-click="rating(4)"></a>' +
      '<a href="javascript:;" ng-class="{\'rating-light\':ratingValue>=5,\'rating-fade\':ratingValue<5}" ng-click="rating(5)"></a>' +
      '</div>'+
      '<div  ng-class="{\'rating-desc-light\':ratingValue>=1,\'rating-desc-fade\':ratingValue<1}">' +
      '<span ng-bind="desc"></span>' +
      '</div>'+
      '</div>',
      replace: true,
      scope: {
        ratingValue: '=value'//绑定到value属性上
      },
      controller: ['$scope', function ($scope) {
        $scope.ratingValue = 5;
        $scope.desc = "5分 非常满意";
        $scope.rating = function (index) {
          $scope.ratingValue = index;
          switch(index){
            case 1:
                  $scope.desc = "1分 非常不满";
                  break;
            case 2:
                  $scope.desc = "2分 不满意";
                  break;
            case 3:
                  $scope.desc = "3分 一般";
                  break;
            case 4:
                  $scope.desc = "4分 满意";
                  break;
            case 5:
                  $scope.desc = "5分 非常满意";
                  break;
            default:
                  $scope.desc = "您还没有评分";
          }
        };
      }]
    }
  })

  /*星星评分,静态显示*/
  .directive('rating', function(){
    return {
      restrict: 'E',
      template:
      '<div class="rating-wrapper">' +
      '<i ng-class="{\'icon-like icon-pingxing01\':ratingValue>=1,\'icon-boring icon-pingxing01\':ratingValue<0.5, \'icon-like icon-pingxingbanke201\': ratingValue >= 0.5 && ratingValue < 1}" class="ion-aiya"></i>' +
      '<i ng-class="{\'icon-like icon-pingxing01\':ratingValue>=2,\'icon-boring icon-pingxing01\':ratingValue<1.5, \'icon-like icon-pingxingbanke201\': ratingValue >= 1.5 && ratingValue < 2}" class="ion-aiya"></i>' +
      '<i ng-class="{\'icon-like icon-pingxing01\':ratingValue>=3,\'icon-boring icon-pingxing01\':ratingValue<2.5, \'icon-like icon-pingxingbanke201\': ratingValue >= 2.5 && ratingValue < 3}" class="ion-aiya"></i>' +
      '<i ng-class="{\'icon-like icon-pingxing01\':ratingValue>=4,\'icon-boring icon-pingxing01\':ratingValue<3.5, \'icon-like icon-pingxingbanke201\': ratingValue >= 3.5 && ratingValue < 4}" class="ion-aiya"></i>' +
      '<i ng-class="{\'icon-like icon-pingxing01\':ratingValue>=5,\'icon-boring icon-pingxing01\':ratingValue<4.5, \'icon-like icon-pingxingbanke201\': ratingValue >= 4.5 && ratingValue < 5}" class="ion-aiya"></i>' +
      '</div>',
      replace: true,
      scope: {
        ratingValue: '=value'//绑定到value属性上
      }
    }
  })
  //表单数字控件
  .directive("number",function(CommonUtil,purchaseOrderService) {
    return {
      restrict: 'E',
      require: '?ngModel',
      scope: {
        onChange: '&',
        item:'='
      },
      template:'<div class="ctr-number ctr-number-new">' +
        '  <span class="minus">－</span><input type="number" pattern="[0-9]*" class="count" ng-model="item.quantity" ng-change="changeNumber()" ng-focus="focusNumber($event,$index)" ng-blur="blurNumber($event)" ng-value="item.quantity"/><span class=" plus">＋</span>' +
        '</div>',
      link: function(scope, element, attr, ngModel) {
        if (!ngModel) return;
        var minusEle = $(element).find('.minus'),
          plusEle = $(element).find('.plus'),
          CartCount = $(element).parent().parent().find('.ctr-number'),
          CartCountInput = $(element).parent().find('.count'),
          max = scope.item.availableStock,
          errMsg = $(element).find('.errMsg');

        if(scope.item.isLimit && scope.item.limitNo<scope.item.availableStock){
          max = scope.item.limitNo;
        }
        var count = parseInt(scope.value);
        if (isNaN(count)) {
          count = 1;
          scope.value = count;
        }
          $(element).click(function(){
              ionic.Platform.isFullScreen = true;
          });

        var onChange = function(){
          scope.onChange();
          var product = {'productList':[{'productId': scope.item.id,'quantity':scope.item.quantity }]};
          purchaseOrderService.setQuantity(product).then(function(data){
            if(data.errMsg!=null && data.errMsg!=""){
              scope.item.quantity = data.cartItem.quantity;
              scope.value = count;
              CommonUtil.tip(data.errMsg);
            }else{
              errMsg.html('');
            }
            //增加 数量 减少数量，不选中商品
            scope.item = purchaseOrderService.isSelectProduct(scope.item);
          });
        };

        var removeBorder = function() {
        	var ionitemlength = $('.list').find('ion-item').length;
        	for (var i = 0; i < ionitemlength; i++) {
        		$('.list').find('ion-item').eq(i).find('.plus').removeClass('cartNumOpt');
        		$('.list').find('ion-item').eq(i).find('.minus').removeClass('cartNumOpt');
        		$('.list').find('ion-item').eq(i).find('.count').removeClass('CartCountInput');
        	}
        }

        var plusViewValue = function () {
          if(parseInt(scope.item.quantity) >= max)
          {
            CommonUtil.tip("最多购买"+max+scope.item.unit);
            return;
          }
          scope.item.quantity ++;
          onChange();
        };
        var minusViewValue = function () {
          if (scope.item.quantity <= 1) return;
          scope.item.quantity --;
            //当用户 减少数量的时候 如果 当前数量 < 限购数量 那么 隐藏超出库存提示文字
            if(scope.item.quantity <= scope.item.availableStock && scope.item.limitNo == ''){
               $(this).parent().parent().parent().parent().find('.purchaseProductItem').find('.errMessage').hide();
           }
          onChange();
        };
        scope.changeNumber = function(){
          var quantity = parseInt(scope.item.quantity);
          if(isNaN(quantity)){
            quantity = 1;
          }
          if(quantity > max){
            scope.item.quantity = max;
          }
        }

        //获取焦点
        scope.focusNumber = function(event,index){
        	$(event.target).addClass('CartCountInput');
        	if(isMobileios())return;
        	var boxHg = 125;
        	var index = $(event.target).parent().parent().parent().attr('codeIndex');
        	var ofsetTop = index * boxHg;
        	$('.scroll').attr('style','transform: translate3d(0px, -'+ofsetTop+'px, 0px) scale(1);');
        }
          //输入框失去焦点
          scope.blurNumber =function(event){
          	$(event.target).removeClass('CartCountInput');
              if(scope.item.quantity == '' || scope.item.quantity == null || isNaN(scope.item.quantity) || scope.item.quantity == 0){
                  scope.item.quantity = 1;
              }
              onChange();//重新计算 合计价格
          }
        minusEle.on('click', minusViewValue);
        plusEle.on('click', plusViewValue);
      }
    }
  })

  //form表单验证
  .directive('errorMsg', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        ngModel.$errorMsg = scope.$eval(attrs.errorMsg);
      }
    };
  })
  .directive('formValidate', [
    '$ionicLoading',
    function ($ionicLoading) {
      return {
        restrict: 'A',
        require: '^form',
        compile: function (element, attrs) {
          var submitHandle = attrs.ngSubmit;
          var validateForm = function (form) {
            var pass = true;
            _.each(form.$error, function (modelCtrs, condition) {
              _.each(modelCtrs, function (modelCtr) {
                pass = false;
                var errorMsg = modelCtr.$errorMsg ? modelCtr.$errorMsg[condition] : '';
                if(errorMsg) {
                  $ionicLoading.show({
                    template: errorMsg,
                    noBackdrop: true,
                    duration: 2000
                  });
                }
              });
              return pass;
            });
            return pass;
          };

          attrs.ngSubmit = function (scope) {
            if(validateForm(scope.$form)) {
              submitHandle && scope.$eval(submitHandle);
            }
          };
          return function (scope, ele, attr, form) {
            scope.$form = form;
          }
        }
      }
    }
  ])
  //密码一致性校验
  .directive('passwordConsistency', function () {
    return {
      restrict: 'A',
      require: ['ngModel', '^?form'],
      link: function (scope, element, attrs, ctrls) {
        var modelCtrl = ctrls[0], formCtrl = ctrls[1] || modelCtrl.$$parentForm;
        scope.$passwordConsistency || (scope.$passwordConsistency = []);
        scope.$passwordConsistency.push(attrs.ngModel);
        scope.$watch(attrs.ngModel, function () {
          var initialValue, error;

          var $errorMsg;
          _.each(scope.$passwordConsistency, function (model) {
            initialValue = initialValue ? initialValue : scope.$eval(model);
            error = initialValue !== scope.$eval(model);
            return !error;
          });
          if(error) {
            if(!formCtrl.$error.passwordConsistency) {
              formCtrl.$error.passwordConsistency = [{}];
            }
            $errorMsg = formCtrl.$error.passwordConsistency[0].$errorMsg;
            if(!$errorMsg) {
              formCtrl.$error.passwordConsistency[0].$errorMsg = {'passwordConsistency': modelCtrl.$errorMsg.passwordConsistency};
            }
          } else {
            delete formCtrl.$error.passwordConsistency;
          }
        })
      }
    }
  })

  .directive('navButton', [
    '$ionicPopover',
    function ($ionicPopover) {
      return {
        restrict: 'A',
        scope: {},
        link: function (scope, element) {
          var template = '  <ion-popover-view class="nav-menu">'+
            '    <div class="nav-menu-nav topRight" ng-click="navpop.hide()">'+
            '      <ul class="list">'+
            '        <li class="item ion-aiya" ui-sref="home">'+
            '          <i class="icon icon-left">&#xe608;</i>'+
            '          <span>首页</span>'+
            '        </li>'+
            '        <li class="item ion-aiya" ui-sref="purchaseOrderList">'+
            '          <i>&#xe64f;</i>'+
            '          <span>购物车</span>'+
            '        </li>'+
            '        <li class="item ion-aiya" ui-sref="user">'+
            '          <i>&#xe629;</i>'+
            '          <span>我</span>'+
            '        </li>'+
            '      </ul>'+
            '    </div>'+
            '  </ion-popover-view>';
          scope.navpop = $ionicPopover.fromTemplate(template, {'scope': scope});
          element.on('click', function () {
            document.body.classList.remove('platform-ios');
            document.body.classList.remove('platform-android');
            //使用ios的样式
            document.body.classList.add('platform-ios');
            scope.navpop.show(element);
          });
        }
      }
    }
  ])
  //商品查询窗口
  .directive('searchProduct',[
    '$rootScope',
    '$ionicModal',
    '$timeout',
    '$state',
    '$ionicScrollDelegate',
    'userService',
    'homeSearch',
    '$compile',
    function($rootScope,$ionicModal,$timeout ,$state, $ionicScrollDelegate, userService, homeSearch,$compile){
      return {
        restrict:'A',
        scope:{},
        controller: [
          '$scope',
          function (scope) {
            $ionicModal.fromTemplateUrl('templates/home/searchModal.html', {
              scope: scope,
              focusFirstInput:true,
              animation: 'slide-in-up'
            }).then(function(modal) {
              scope.modal = modal;
            });
          }
        ],
        link:function(scope,element,attrs){

          var timeout;
          scope.isIphone = isIphone();
          /* $scope.keyword = ''; */
          scope.dataList = '';
          scope.noData = true;
          scope.data = {
            keyword:''
          };
          //搜索记录
          scope.searchParam = {
            keyword: scope.data.keyword,
            count: 10
          };
          scope.productParam = {
            keyword: scope.data.keyword,
            pageNumber: '1',
            pageSize: ''
          };
          //init();
          //scope.$apply(scope.keyword='xxx');
          scope.$watch('data.keyword', function(newVal,oldVal){
            var searchOpt = {
              keyword: scope.data.keyword,
              count: 10
            };
            scope.searchParam.keyword = scope.data.keyword;
            scope.productParam.keyword = scope.data.keyword;
            if(scope.data.keyword){
              if(timeout){
                $timeout.cancel(timeout);
              }
              timeout = $timeout(function(){
                  //热门搜索列表
                  homeSearch.fullsearchkeylist(searchOpt).then(function(rs){
                    if(rs.list.length > 0){
                      scope.dataList = rs.list;
                    }else {
                      scope.noData = false;
                      scope.dataList = '';
                    }
                  }, function(error){
                    CommonUtil.tip(error);
                  });
              }, 300);
            }
          });
          scope.jumpSearch = function(){
            homeSearch.search(scope.productParam).then(function(resp){
            },function(err){
            });
            homeSearch.hostorylist(scope.searchParam).then(function(resp){
              scope.hostorylist = resp.list;
            },function(err){
            });
            $('#keyword').blur();
            $state.go('filterList', {keyword:scope.data.keyword});
          };

          $rootScope.hideSearchForm=function()
          {

            scope.modal.hide();
          }

          scope.jumpHotSearch = function(key){
            //scope.modal.hide();
            $state.go('filterList', {keyword:key});
            //$window.location.href="#/product///"+scoped.data.keyword;
          };

          scope.junmpHotlistSearch = function(key){
            //scope.modal.hide();
            $state.go('filterList', {keyword:key});
            //$window.location.href="#/product///"+scope.data.keyword;
          };

          //搜索框内容清除
          scope.clearSearch = function(){
            scope.data.keyword = '';
          };

          scope.doHomeSearchRefresh = function(){
            init();
            scope.$broadcast('scroll.refreshComplete');
          };

          scope.init = init;
          function init(){
            homeSearch.homeHotKeyworld().get(null, function(rs){
              if(rs.code === 1){
                scope.homeHotKeyworld = rs.data.list;
              }else{
                $ionicLoading.show({
                  template: rs.msg,
                  duration: 1500
                });
              }
            });
            homeSearch.hostorylist(scope.searchParam).then(function(resp){
               scope.hostorylist = resp.list;
               //console.log("hostorylist:"+resp.list);
             },function(err){
             });
          };
          //清除历史记录
          scope.clearHistory = function(){
            homeSearch.delHostorylist().then(function(resp){
              init();
            },function(err){
            });
          };

          /* 判断手机是不是iPhone */
          function isIphone()
          {
            var agent = navigator.userAgent.toLowerCase();

            return /iphone/.test(agent);
          }
          /* 判断非android内核也非safari内核 */
          function isOther()
          {
            var agent = navigator.userAgent.toLowerCase();
            return agent.indexOf('iphone')==-1 && agent.indexOf('android')==-1
          }

          element.on("click",function($event)
          {
            var searchObj=$compile(angular.element('<input id="keyword" autofocus="autofocus" type="text" ng-model="data.keyword" placeholder="搜索你要的产品">'))(scope);
            angular.element("#searchForm").append(searchObj);
            scope.bpSearch=$(".top-input input").eq(0);
            scope.back=function()
            {
              scope.data.keyword='';
              scope.bpSearch.val('');
              scope.bpSearch.show();
              angular.element("#searchForm").empty();
              scope.modal.hide();
            }
            $('#keyword').val('');
            scope.modal.show();
            scope.bpSearch.hide();
            scope.init();
            var _wdith=scope.modal.el.offsetWidth;
            $(scope.modal.el).css({"width":_wdith+"px"});
            setTimeout(function(){
            if(!isIphone)
            {
              $('#keyword').trigger("click").focus();
              $('#keyword').click();
            }

            $('#keyword').attr("autofocus","autofocus");
            $('#keyword').focus();
            },1000);
          });
        }
      }
    }])
  //商品品牌筛选
  .directive('brandCategoryFilter', [
    '$ionicPopover',
    'categoryService',
    function ($ionicPopover, categoryService) {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          onFinish: '&',
          classifyName:'&'
        },
        controller: [
          '$scope',
          'brandService',
          function (scope) {
            var template = '  <ion-popover-view class="screening screening-cover" style="top: 1px; left: 162px; margin-left: 0px; opacity: 1;">'+
              '    <ion-content>'+
              '      <p ng-click="select()">全部分类 &gt;</p>'+
              '      <ion-list class="brandTypes">'+
              '        <ion-item class="brandType" ng-class="{active: bcf.currentValue() === item.id}" ng-click="select(item.id)" ng-repeat="item in firstCategory" >{{item.name}}</ion-item>'+
              '      </ion-list>'+
              '    </ion-content>'+
              '  </ion-popover-view>';
            this.filterpop = $ionicPopover.fromTemplate(template, {'scope': scope});
            this.currentValue = function () {
              return this.ngModel.$modelValue;
            };
            this.select = function (c) {
              this.ngModel.$setViewValue(c);
            };
          }
        ],
        controllerAs: 'bcf',
        link: function (scope, element, attrs, ngModel) {
          scope.bcf.ngModel = ngModel;
          scope.exit = function () {
            scope.bcf.filterpop.hide();
            scope.onFinish();
          };
          //init
          categoryService.getFirstCategory().then(function (firstCategory) {
            scope.firstCategory = firstCategory;
          });
          //
          scope.select = function(id){
            scope.bcf.select(id);
            scope.exit();
          }
          element.on('click', function () {
            scope.bcf.filterpop.show(element);
          });
        }
      }
    }
  ])
  .directive('productCategoryFilter', [
    '$ionicPopover',
    'categoryService',
    'StringUtil',
    function ($ionicPopover, categoryService, StringUtil) {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          onFinish: '&',
          filter:'='
        },
        controller: [
          '$scope',
          '$ionicScrollDelegate',
          function (scope,$ionicScrollDelegate) {
            // ng-if="bcf.category.first === undefined || bcf.category.first === item.id"
            var template = '  <ion-popover-view class="screening screening-cover" style="top: 1px; left: 162px; margin-left: 0px; opacity: 1;">'+
              '    <ion-content delegate-handle="purchaseOrderScreenHandle">'+

              /* '      <div ng-if="selectedArray.length" class="brandTypesWrapper">'+
              '        <span>您已选择: </span>'+
              '        <ion-list class="brandTypes">'+
              '          <ion-item class="brandType active" ng-repeat="item in selectedArray">{{item.name}} ' +
              '           <i ng-click="unselect(item)" class="ion-ios-close-empty unselect"></i>' +
              '          </ion-item>'+
              '        </ion-list>'+
              '      </div>'+*/
              '      <div class="brandTypesWrapper">'+
              '        <p>分类</p>'+
              '        <ion-list class="brandTypes">'+
              '          <ion-item class="brandType" ng-class="{active: bcf.category.first === item.id}" ng-repeat="item in firstCategory" ng-click="selectFirst(item)" ng-show="!(isNotEmpty(bcf.category.first) &&  bcf.category.first !== item.id)">{{item.name}}</ion-item>'+
              '        </ion-list>'+
              '      </div>'+
              '      <div ng-if="isNotEmpty(bcf.category.first)"  class="brandTypesWrapper">'+
              '        <p>二级分类</p>'+
              '        <ion-list class="brandTypes">'+
              '          <ion-item class="brandType" ng-class="{active: bcf.category.second === item.id}" ng-repeat="item in secondCategory" ng-click="selectSecond(item)">{{item.name}}</ion-item>'+
              '        </ion-list>'+
              '      </div>'+
              '      <div class="brandTypesWrapper" ng-hide="bcf.category.hidden.area">'+
              '        <p>产地</p>'+
              '        <ion-list class="brandTypes">'+
              '          <ion-item class="brandType" ng-class="{active: bcf.category.area === item.value}" ng-repeat="item in areas" ng-click="selectArea(item)">{{item.name}}</ion-item>'+
              '        </ion-list>'+
              '      </div>'+
              '      <div class="brandTypesWrapper" ng-hide="bcf.category.hidden.brands">'+
              '        <p>品牌<button class="float-right button button-dark button-clear brandMore" ng-click="displayMoreBrands()" ng-bind="brandButtonTxt">更多</button></p>'+
              '        <ion-list class="brandTypes">'+
              '          <ion-item class="brandType" ng-class="{active: contains(bcf.category.brands, item.id)}" ng-repeat="item in brands | limitTo:number" ng-click="selectBrand(item)">{{item.name}}</ion-item>'+
              '        </ion-list>'+
              '      </div>'+

              '    </ion-content>'+
              '    <ion-footer-bar class="brandFooter">'+
              '      <div class="filterBtnbox">'+
              '        <button class="button button-positive complete-button" ng-click="exit()">完成</button>'+
              '      </div>'+
              '    </ion-footer-bar>'+
              '  </ion-popover-view>';
            this.filterpop = $ionicPopover.fromTemplate(template, {'scope': scope});

            //查看更多按钮
            scope.brandButtonTxt = "更多";
            scope.number = 6;
            scope.displayMoreBrands = function () {
              if(scope.brandButtonTxt=="更多"){
                scope.brandButtonTxt = "收起";
                scope.number = ''
                $ionicScrollDelegate.$getByHandle("purchaseOrderScreenHandle").resize();
              }else{
                scope.number = 6;
                scope.brandButtonTxt = "更多";
                $ionicScrollDelegate.$getByHandle("purchaseOrderScreenHandle").resize();
              };
            };
          }
        ],
        controllerAs: 'bcf',
        link: function (scope, element, attrs, ngModel,$ionicScrollDelegate) {
          //init
          categoryService.getProductCategory({isShowAllBrand: true}).then(function (data) {
            scope.firstCategory = data.categoryList;
            scope.areas = data.makeTypes;
            scope.brands = data.brandList;
            //临时全部商品
            scope.tempBrands = data.brandList;
          });
          element.on('click', function () {
            scope.bcf.category = scope.filter;
            scope.bcf.category.brands = _.isArray(scope.bcf.category.brands) ? scope.bcf.category.brands : [scope.bcf.category.brands];
            if(StringUtil.isNotEmpty(scope.bcf.category.first)){
              categoryService.getSecondCategory(scope.bcf.category.first).then(function (data) {
                scope.secondCategory = data.list;
                scope.brands = data.brandList;
              });
            }
            scope.bcf.filterpop.show(element);
          });

          var select = function (item) {
            var idx;
            if(item.multi) {
              scope.selectedArray.push(item);
            } else {
              idx = _.findIndex(scope.selectedArray, {type: item.type});
              idx === -1 ? scope.selectedArray.push(item) : scope.selectedArray.splice(idx, 1, item);
            }
          };
          var unselect = scope.unselect = function (item) {
            _.pull(scope.selectedArray, item);
            var selection = scope.bcf.category[item.type];
            _.isArray(selection) ? _.pull(selection, item) : scope.bcf.category[item.type] = null;
          };
          scope.selectedArray = [];
          scope.selectFirst = function (item) {
            scope.bcf.category.brands = [];
            if(_.isEqual(scope.bcf.category.first, item.id)){
              scope.bcf.category.first = null;
              scope.bcf.category.second = null;
              scope.brands = scope.tempBrands;
            }else{
              scope.bcf.category.first = item.id;
              categoryService.getSecondCategory(item.id).then(function (data) {
                scope.secondCategory = data.list;
                scope.brands = data.brandList;
              });
            }
          };
          scope.selectSecond = function (item) {
            if(_.isEqual(scope.bcf.category.second,item.id)){
              scope.bcf.category.second = null;
            } else {
              scope.bcf.category.second = item.id;
            }
          };
          scope.selectArea = function (item) {
            if(_.isEqual(scope.bcf.category.area,item.value)){
              scope.bcf.category.area = null
            } else {
              scope.bcf.category.area = item.value;
            }
          };
          scope.selectBrand = function (item) {
            var brands = scope.bcf.category.brands ? scope.bcf.category.brands : scope.bcf.category.brands = [];
            if(scope.contains(brands, item.id)) {
              _.pull(brands,item.id);
            } else {
              brands.push(item.id);
            }
          };
          scope.contains = function (list, value) {
            list = list || [];
            return _.indexOf(list, value) !== -1;
          };

          scope.isNotEmpty = function(o){
            return StringUtil.isNotEmpty(o);
          };
          scope.exit = function () {
            scope.bcf.filterpop.hide();
            scope.onFinish();
            $(".scroll").attr("style",'');//点击确认分类之后返回最顶部
          };
        }
      }
    }
  ])
  //商品详情-促销
  .directive('promotionCategoryFilter', [
    '$ionicPopover',
    'categoryService',
    'StringUtil',
    function ($ionicPopover, categoryService, StringUtil) {
      return {
        restrict: 'A',
        scope: {
          onFinish: '&',
          filter:'='
        },
        controller: [
          '$scope',
          '$ionicScrollDelegate',
          function (scope,$ionicScrollDelegate) {
            var template = '  <ion-popover-view class="screening screening-cover" style="top: 1px; left: 162px; margin-left: 0px; opacity: 1;">'+
              '    <ion-content delegate-handle="purchaseOrderScreenHandle">'+

              '      <div class="brandTypesWrapper">'+
              '        <p>分类</p>'+
              '        <ion-list class="brandTypes">'+
              '          <ion-item class="brandType" ng-class="{active: bcf.category.first === item.id}" ng-repeat="item in firstCategory" ng-click="selectFirst(item)" ng-show="!(isNotEmpty(bcf.category.first) &&  bcf.category.first !== item.id)">{{item.name}}</ion-item>'+
              '        </ion-list>'+
              '      </div>'+
              '      <div ng-if="isNotEmpty(bcf.category.first)"  class="brandTypesWrapper">'+
              '        <p>二级分类</p>'+
              '        <ion-list class="brandTypes">'+
              '          <ion-item class="brandType" ng-class="{active: bcf.category.second === item.id}" ng-repeat="item in secondCategory" ng-click="selectSecond(item)">{{item.name}}</ion-item>'+
              '        </ion-list>'+
              '      </div>'+
              '      <div class="brandTypesWrapper" ng-hide="bcf.category.hidden.brands">'+
              '        <p>品牌<button class="float-right button button-dark button-clear brandMore" ng-click="displayMoreBrands()" ng-bind="brandButtonTxt">更多</button></p>'+
              '        <ion-list class="brandTypes">'+
              '          <ion-item class="brandType" ng-class="{active: contains(bcf.category.brands, item.id)}" ng-repeat="item in brands | limitTo:number" ng-click="selectBrand(item)">{{item.name}}</ion-item>'+
              '        </ion-list>'+
              '      </div>'+

              '    </ion-content>'+
              '    <ion-footer-bar class="brandFooter">'+
              '      <div class="row pad-0">'+
              '        <button class="col-25 col-offset-75 button button-positive complete-button" ng-click="exit()">完成</button>'+
              '      </div>'+
              '    </ion-footer-bar>'+
              '  </ion-popover-view>';
            this.filterpop = $ionicPopover.fromTemplate(template, {'scope': scope});

            //查看更多按钮
            scope.brandButtonTxt = "更多";
            scope.number = 6;
            scope.displayMoreBrands = function () {
              if(scope.brandButtonTxt=="更多"){
                scope.brandButtonTxt = "收起";
                scope.number = ''
                $ionicScrollDelegate.$getByHandle("purchaseOrderScreenHandle").resize();
              }else{
                scope.number = 6;
                scope.brandButtonTxt = "更多";
                $ionicScrollDelegate.$getByHandle("purchaseOrderScreenHandle").resize();
              };
            };
          }
        ],
        controllerAs: 'bcf',
        link: function (scope, element, attrs, ngModel,$ionicScrollDelegate) {
          //init
          categoryService.getProductCategory({isShowAllBrand: true}).then(function (data) {
            scope.firstCategory = data.categoryList;
            scope.brands = data.brandList;
            //临时全部商品
            scope.tempBrands = data.brandList;
          });
          element.on('click', function () {
            scope.bcf.category = scope.filter;
            scope.bcf.category.brands = _.isArray(scope.bcf.category.brands) ? scope.bcf.category.brands : [scope.bcf.category.brands];
            if(StringUtil.isNotEmpty(scope.bcf.category.first)){
              categoryService.getSecondCategory(scope.bcf.category.first).then(function (data) {
                scope.secondCategory = data.list;
                scope.brands = data.brandList;
              });
            }
            scope.bcf.filterpop.show(element);
          });

          var select = function (item) {
            var idx;
            if(item.multi) {
              scope.selectedArray.push(item);
            } else {
              idx = _.findIndex(scope.selectedArray, {type: item.type});
              idx === -1 ? scope.selectedArray.push(item) : scope.selectedArray.splice(idx, 1, item);
            }
          };
          var unselect = scope.unselect = function (item) {
            _.pull(scope.selectedArray, item);
            var selection = scope.bcf.category[item.type];
            _.isArray(selection) ? _.pull(selection, item) : scope.bcf.category[item.type] = null;
          };
          scope.selectedArray = [];
          scope.selectFirst = function (item) {
            scope.bcf.category.brands = [];
            if(_.isEqual(scope.bcf.category.first, item.id)){
              scope.bcf.category.first = null;
              scope.bcf.category.second = null;
              scope.brands = scope.tempBrands;
            }else{
              scope.bcf.category.first = item.id;
              categoryService.getSecondCategory(item.id).then(function (data) {
                scope.secondCategory = data.list;
                scope.brands = data.brandList;
              });
            }
          };
          scope.selectSecond = function (item) {
            if(_.isEqual(scope.bcf.category.second,item.id)){
              scope.bcf.category.second = null;
            } else {
              scope.bcf.category.second = item.id;
            }
          };
          scope.selectBrand = function (item) {
            var brands = scope.bcf.category.brands ? scope.bcf.category.brands : scope.bcf.category.brands = [];
            if(scope.contains(brands, item.id)) {
              _.pull(brands,item.id);
            } else {
              brands.push(item.id);
            }
          };
          scope.contains = function (list, value) {
            list = list || [];
            return _.indexOf(list, value) !== -1;
          };

          scope.isNotEmpty = function(o){
            return StringUtil.isNotEmpty(o);
          };
          scope.exit = function () {
            scope.bcf.filterpop.hide();
            scope.onFinish();
          };
        }
      }
    }
  ])

  //齿研社商品筛选
  .directive('toothCategoryFilter', [
    '$ionicPopover',
    'categoryService',
    function ($ionicPopover, categoryService) {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          onFinish: '&',
          classifyName:'&'
        },
        controller: [
          '$scope',
          'brandService',
          function (scope) {
            var template = '<ion-popover-view class="screening screening-cover" style="top: 1px; left: 162px; margin-left: 0px; opacity: 1;">'+
              '    <ion-content>'+
              '      <p ng-click="select(147)">全部分类 &gt;</p>'+
              '      <ion-list class="brandTypes">'+
              '        <ion-item class="brandType" ng-class="{active:bcf.currentValue() === item.id}" ng-click="select(item.id)" ng-repeat="item in toothCategory" >{{item.name}}</ion-item>'+
              '      </ion-list>'+
              '    </ion-content>'+
              '  </ion-popover-view>';
            this.filterpop = $ionicPopover.fromTemplate(template, {'scope': scope});
            this.currentValue = function () {
              return parseInt(this.ngModel.$modelValue);
            };
            this.select = function (c) {
              this.ngModel.$setViewValue(c);
            };
          }
        ],
        controllerAs: 'bcf',
        link: function (scope, element, attrs, ngModel) {
          scope.bcf.ngModel = ngModel;
          scope.exit = function () {
            scope.bcf.filterpop.hide();
            scope.onFinish();
          };
          //init
          var toothCategoryId = 147;
          categoryService.getSecondCategory(toothCategoryId).then(function (rs) {
            scope.toothCategory = rs.list;
          });
          //
          scope.select = function(id){
            scope.bcf.select(id);
            scope.exit();
          }
          element.on('click', function () {
            scope.bcf.filterpop.show(element);
          });
        }
      }
    }
  ])

  /*加入购物车and立即购买*/
  .directive('productSpecificationFilter',[
    '$rootScope',
    '$ionicModal',
    '$state',
    'index',
    'purchaseOrderService',
    '$ionicLoading',
    'productService',
    'orderService',
    'userService',
    'CommonUtil',
    'StringUtil',
    '$stateParams',
    'Util',
    'ENV',
    '$ionicPopover',
    '$timeout',
    function($rootScope,$ionicModal,$state,index,purchaseOrderService,$ionicLoading,productService,orderService,userService,CommonUtil,StringUtil,$stateParams,Util,ENV,$ionicPopover,$timeout){
      return{
        restrict:'A',
        controller: [
          '$scope',
          function (scope) {
            $ionicModal.fromTemplateUrl('templates/categoryList/specificationModal.html', {
              scope: scope,
              animation: 'slide-in-up'
            }).then(function(modal) {
              scope.modal = modal;
            });
          }
        ],
        scope:{optionType:"@optionType",productId:"@productId"},/*子controller跟父controller通信*/
        controllerAs: 'psf',
        link: function (scope, element, attrs) {
          scope.imgUrl = ENV.imgUrl;
          scope.product = {
            id:scope.productId,
            quantity:1,
            specification:'',
            tempSpecification:''
          };
          var showTip = function (obj){

            /*                  if(可用库存>0)
             if(限购)
             if(预警)
             if 限购 <= 预警
             show 限购
             else
             show 库存紧张
             else
             show 限购
             else
             if(预警)
             if(可用库存 < = 预警)
             show 紧张
             else
             show 充足
             else
             if(可用库存 <= 3)
             紧张
             else
             show 充足
             show
             不足*/
            if(!isNaN(obj.availableStock) && obj.availableStock > 0){
              if(StringUtil.isNotEmpty(obj.isLimit) && obj.isLimit){
                if(!isNaN(obj.stockAlertCount) && obj.stockAlertCount){
                  if(obj.limitNo <= obj.stockAlertCount){
                    _.assignIn(obj,{showColor : true,showTip : '限购' + obj.limitNo + ''+ obj.unit});
                  }else{
                    _.assignIn(obj,{showColor : false,showTip : '库存紧张'});
                  }
                }else{
                  _.assignIn(obj,{showColor : true,showTip : '限购' + obj.limitNo + ''+ obj.unit});
                }
              }else{
                if(!isNaN(obj.stockAlertCount) && obj.stockAlertCount){
                  if(obj.availableStock <= obj.stockAlertCount ){
                    _.assignIn(obj,{showColor : false,showTip : '库存紧张'});
                  }else{
                    _.assignIn(obj,{showColor : false,showTip : '库存充足'});
                  }
                }else{
                  if(obj.availableStock <= 3){
                    _.assignIn(obj,{showColor : false,showTip : '库存紧张'});
                  }else{
                    _.assignIn(obj,{showColor : false,showTip : '库存充足'});
                  }
                }
              }
            }
          }
          element.on('click', function ($event) {
            $event.stopPropagation();//防止冒泡事件
              if(!$rootScope.stock)
              {
                  scope.closeSpecificationModal();
                  console.log('已禁止加入购物车');
                  return;
              }
            //判断是否登录
            if(!isLogin()){
              return;
            }
            /*加载商品详情*/
            productService.getInfo(scope.product.id).then(function(data){
              scope.member = data.member;
              scope.currentDate=data.currentDate;
              scope.productInfo = data.product.productInfo;//商品详情
              scope.robBuyPromotion=scope.productInfo.robBuyPromotion;
              _.assignIn(scope.productInfo,{stockTip:Util.getStockTip(scope.productInfo.availableStock)});
              scope.specification = data.product.specification;//商品规格详细信息
              scope.product.specification = scope.specification.spvId;
              scope.product.tempSpecification = scope.specification.spvId;
              scope.memberPrice = data.product.memberPrice;
              scope.productInfo.image = StringUtil.isEmpty(scope.productInfo.image) ? ENV.defaultImg : Util.getFullImg(scope.productInfo.image);
              if(scope.specification != null && scope.specification.specificationValues != null  && scope.specification.specificationValues != ''){
                _.each(scope.specification.specificationValues,function(spec,index){
                  _.assignIn(spec,{quantity:0});
                  showTip(spec);
                });
              }else{
                showTip(scope.productInfo);
              }

          /*    //价格显示
              if(!!scope.productInfo.isDiscuss && !scope.isBuyNotPutaway){
                scope.priceShowType = 1;//面议商品
              }else if(!!scope.productInfo.showRobBuyPrice){
                scope.priceShowType = 2; //抢购价
              } else {
                scope.priceShowType = 0;//促销价
              }*/
              if(scope.productInfo.isDiscuss && !scope.isBuyNotPutaway){
		          		scope.priceShowType = 1;//面议商品
		          		scope.isshow = 0;
		          }else if(scope.member != null && scope.member != '' && !!scope.member.isMonthly && scope.productInfo.monthBalancePrice != null && scope.productInfo.monthBalancePrice != ''){
		          		scope.priceShowSubType = 0;//月结价
		            	scope.isshow = 0;
		            	scope.priceShowType = 0;
		          }else if(scope.member != null && scope.member != '' && scope.memberPrice != null && scope.memberPrice != ''){
		          		scope.priceShowSubType = 1;//月结价
		            	scope.isshow = 0;
		            	scope.priceShowType = 0;
		          }else if(scope.productInfo.robBuyPromotion != null){
		          	  scope.isshow = 1;
		          	  scope.priceShowSubType = 2;
		          }else{
		          	  scope.isshow = 0;
		          	  scope.priceShowSubType = 2;
		          }

              var nowDate = new Date(scope.currentDate).getTime();
              if(scope.robBuyPromotion.endDate!=null && scope.robBuyPromotion.endDate!='' && scope.robBuyPromotion.beginDate!=null && scope.robBuyPromotion.beginDate!=''){
                var endDate = new Date(scope.robBuyPromotion.endDate).getTime();
                var beginDate = new Date(scope.robBuyPromotion.beginDate).getTime();
                var diffEnd=nowDate- endDate;
                var diffBegin=nowDate-beginDate;
                if(diffEnd>0){
                  scope.timeDiff=0;//抢购结束
                }else if(diffBegin<0){
                  scope.timeDiff=1;//即将开始
                }else{
                  scope.timeDiff=2;//抢购中
                }
              }else{
                scope.timeDiff=3;//没有抢购时间
              }

             /* if(scope.member != null && scope.member != '' && !!scope.member.isMonthly && scope.productInfo.monthBalancePrice != null && scope.productInfo.monthBalancePrice != ''){
                scope.priceShowSubType = 0;//月结价
              }else if(scope.member != null && scope.member != '' && scope.memberPrice != null && scope.memberPrice != ''){
                scope.priceShowSubType = 1;//会员价
              }*/

            },function(err){
              console.log(err);
            });
            scope.modal.show();
          });
          //立即咨询
          scope.onOpenQQ=function()
          {
            $rootScope.openQQwindow();
          }
          scope.activateID = '';//商品id
          scope.activateState ='';//选中边框标识
          scope.addQuantity = function(specItem){
          scope.activateState ='';
            /*
            if(specItem==''|| specItem==null){
              if(((scope.productInfo.isLimit && scope.product.quantity >= scope.productInfo.limitNo) || scope.product.quantity >= scope.productInfo.availableStock) || scope.productInfo.availableStock==0){
                CommonUtil.tip('库存不足');
                return
              }
              scope.product.quantity ++;
            }else{
              if(((specItem.isLimit && specItem.quantity >= specItem.limitNo) || specItem.quantity >= specItem.availableStock) || specItem.availableStock==0){
                CommonUtil.tip('库存不足');
                return
              }
              specItem.quantity ++;
            }
            */

            //console.log(JSON.stringify(specItem));

            if(specItem=='' || specItem==null)
            {
              if(scope.productInfo.availableStock==0 || scope.product.quantity >= scope.productInfo.availableStock)
              {
                CommonUtil.tip('库存不足');
                return
              }
              if(scope.productInfo.isLimit && scope.product.quantity >= scope.productInfo.limitNo){
                CommonUtil.tip('已超出最大购买数量');
                return
              }
              scope.product.quantity ++;
            }else{

              if(specItem.availableStock==0 || specItem.quantity >= specItem.availableStock)
              {
                CommonUtil.tip('库存不足');
                return
              }
              if(specItem.isLimit && specItem.quantity >= specItem.limitNo){
                CommonUtil.tip('已超出最大购买数量');
                return
              }
              specItem.quantity ++;
            }
          }

          scope.cutQuantity = function(specItem) {
              scope.activateState = '';
            if (specItem == '' || specItem == null) {
              scope.product.quantity--;
              if (scope.product.quantity < 0 || scope.product.productInfo.availableStock==0) {
                scope.product.quantity = 0;
                return;
              }
            } else {
              specItem.quantity--;
              if (specItem.quantity < 0 || specItem.availableStock==0) {
                specItem.quantity = 0;
                return;
              }
            }
          }
          scope.changeStock = function(specItem){

            /* zhouwenqi注释掉了
            var availableStock = scope.productInfo.availableStock;
            var quantity = scope.product.quantity;

            scope.product.quantity = parseInt(quantity);
            if(!quantity && availableStock == 0){
              scope.product.quantity = 0;
              return;
            }
            //当前限购数
            var restrictionNumber = scope.productInfo.limitNo;
            var _min = restrictionNumber>0 && restrictionNumber< availableStock ? restrictionNumber : availableStock;

            if (quantity > _min) {
              scope.product.quantity = _min;
              if(restrictionNumber>0){
                CommonUtil.tip('限购'+restrictionNumber+'件');
              }
            }
            */
            /* zhouwenqi 添加的 */

            var availableStock = 0;
            var quantity = 0;
            if (specItem == '' || specItem == null) //判断商品是不是多规格
            {
              availableStock = scope.productInfo.availableStock;
              quantity = scope.product.quantity;



              scope.product.quantity = parseInt(quantity);
              if(!quantity && availableStock == 0){
                scope.product.quantity = 0;
                return;
              }
              //当前限购数
              var restrictionNumber = scope.productInfo.limitNo;
              var _min = restrictionNumber>0 && restrictionNumber< availableStock ? restrictionNumber : availableStock;

              if (quantity > _min) {
                scope.product.quantity = _min;
                if(restrictionNumber>0){
                  CommonUtil.tip('限购'+restrictionNumber+scope.productInfo.unit);
                }
              }
            }
            else
            {
              availableStock = specItem.availableStock;
              quantity = specItem.quantity;

              specItem.quantity = parseInt(quantity);
              if(!quantity && availableStock == 0){
                specItem.quantity = 0;
                return;
              }

              var restrictionNumber = specItem.limitNo;
              var _min = restrictionNumber>0 && restrictionNumber< availableStock ? restrictionNumber : availableStock;

              if (quantity > _min) {
                specItem.quantity = _min;
                if(restrictionNumber>0){
                  CommonUtil.tip('限购'+restrictionNumber+specItem.unit);
                }
              }
            }
          }
          scope.judgeStock = function(number){
            if (isNaN(number) || (number < 0 && scope.productInfo.availableStock > 0)) {
              scope.product.quantity = 0;
            }
          };
          /*修饰键盘被挡住样式*/
          scope.modifyStyle = function(specItem){
          	scope.activateID = '';
          	scope.activateID =specItem.id;
          	scope.activateState ='num';
            $('.specificationModal').addClass('popupFilex');
          };
          /*立即购买*/
          scope.buyNow = function(){
            if(!isLogin())
            {
              return;
            }
            else{
              var pending = true;
              if(pending){
                if(scope.specification=='' && scope.specification==null && scope.specification.specificationValues=='' && scope.specification.specificationValues==null){
                  if(scope.productInfo.availableStock <= 0){
                    CommonUtil.tip('您选购的商品库存不足');
                    return;
                  }
                }
                /*scope.judgeStock(scope.product.quantity);*/
                pending = false;
                var ids = new Array();
                var quantitys = new Array();
                if(scope.specification!=='' && scope.specification!==null && scope.specification.specificationValues!=='' && scope.specification.specificationValues!==null){
                  for(var i=0;i<scope.specification.specificationValues.length;i++){
                    var spe_item = scope.specification.specificationValues[i];
                    if(spe_item.quantity > 0){
                      ids.push(spe_item.productId);
                      quantitys.push(spe_item.quantity);
                    }
                  }
                  var product = {
                    ids: ids.join(),
                    directQuantitys: quantitys.join()
                  }
                }else{
                  var product = {
                    ids : scope.product.id,
                    directQuantitys : scope.product.quantity
                  }
                }
                  //判断商品数量 必选
                  if(!product.ids || !product.directQuantitys){
                      CommonUtil.tip('请输入数量');
                      return;
                  }

                orderService.directBuyPrecheck(product).then(function(data){
                  product = {
                    ids : product.ids,
                    quantitys : product.directQuantitys
                  }
                  if(product.quantitys==''){
                    CommonUtil.tip('请输入数量');
                  }else{
                    scope.closeSpecificationModal();
                    orderService.setOrderProList(product);
                    $state.go('orderOk');
                  }
                },function(err){
                  scope.closeSpecificationModal();
                  CommonUtil.tip(err);
                }).finally(function(){
                  pending = true;
                });
              }
            }
          }
          /*加入采购单*/
          scope.joinCart = function() {
            if (!isLogin()) {
              return;
            } else {
              //防止重复添加
              var pending = true;
              if (pending) {
                if(scope.specification=='' && scope.specification==null && scope.specification.specificationValues=='' && scope.specification.specificationValues==null){
                  CommonUtil.tip('您选购的商品库存不足');
                  return;
                }
                /*scope.judgeStock(scope.product.quantitys);*/
                pending = false;
                var ids = new Array();
                var quantitys = new Array();
                if(scope.specification!=='' && scope.specification!==null && scope.specification.specificationValues!=='' && scope.specification.specificationValues!==null){
                  for(var i=0;i<scope.specification.specificationValues.length;i++){
                    var spe_item = scope.specification.specificationValues[i];
                    if(spe_item.quantity > 0){
                      ids.push(spe_item.productId);
                      quantitys.push(spe_item.quantity);
                    }
                  }
                  var params = {
                    ids: ids.join(),
                    quantitys: quantitys.join()
                  }
                }else{
                  var params = {
                    ids : scope.product.id,
                    quantitys : scope.product.quantity
                  }
                }
                purchaseOrderService.addProduct(params).then(function () {
                  //广播 更新购物车数量
                  productService.purchaseCount().then(function(data){
                    scope.$emit('purchaseCounts',data != null ? data.cartquantity : '');
                    if(params.quantitys==''){
                      CommonUtil.tip('请输入数量');
                    }else{
                      scope.closeSpecificationModal();
                      CommonUtil.tip('<h4>成功添加到购物车</h4><h5>购物车共有'+ $rootScope.purchaseCounts+'件商品</h5>');
                    }
                  });
                }, function (err) {
                  scope.closeSpecificationModal();
                  CommonUtil.tip(err);
                }).finally(function () {
                  pending = true;
                });
              }
            }
          }
          /*确定按钮*/
          scope.goOrderProcess = function(){
            if('buyNow'== scope.optionType){
              scope.buyNow();
            }else{
              scope.joinCart();
            }
          }
          /*判断是否有选中规格*/
          var hasSpec = function(){
            if(scope.specification.specificationValues == null || scope.specification.specificationValues == '' || (scope.product.specification != '' && scope.product.specification != null)){
              return true;
            } else {
              CommonUtil.tip('请选择商品属性');
              return false;
            }
          }
          var directBuyPrecheck = function(){
            var params = {
              ids : scope.product.id,
              directQuantity : scope.product.quantity
            }
            return orderService.directBuyPrecheck(params);
          }
          var isLogin = function(){
            if(userService.isLogin()){
              return true;
            }else{
              scope.closeSpecificationModal();
              $state.go('login');
            }
          }
          scope.closeSpecificationModal = function(){
              $('.specificationModal').removeClass('popupFilex');
              scope.activateState ='';
              scope.modal.hide();
          }
          scope.$on('$destroy',function(){
            scope.modal.remove();
          });
        }
      }
    }])
  /*提交到货提醒*/
  .directive('arrivalPopover',[
    '$ionicPopover',
    'productService',
    'StringUtil',
    'CommonUtil',
    function($ionicPopover,productService,StringUtil,CommonUtil){
      return{
        restrict:'A',
        controller: [
          '$scope',
          function (scope) {
            $ionicPopover.fromTemplateUrl('templates/categoryList/arriveTip.html', {
              scope: scope,
              //animation: 'slide-in-up' 取消到货提醒 弹窗动画
            }).then(function(popover) {
              scope.popover = popover;
            });
          }
        ],
        scope:{productId:"@productId"},/*子controller跟父controller通信*/
        controllerAs: 'psf',
        link: function (scope, element, attrs) {
          $(element).on('click', function ($event) {
              $event.toElement['ofsetTop'] = 100;//自定义弹窗 位置 控件是通过绑定指令元素 元素计算出来的位置 位于下方显示
            var params = {
              productId : scope.productId
            }
            productService.getArrival(params).then(function(data){
              scope.notifyDate = data.notifyDate;
            }, function (err) {
              console.log(err);
            });
            scope.popover.show($event);
          });
          scope.arrive = {
            phone:'',
            quantity:1
          }
          scope.openPopover = function($event) {
            scope.popover.show();
          }
          scope.closePopover = function() {
            scope.popover.hide();
          }
          scope.submitArrive = function () {
             var isPass = true;
             var errorMsg = '';
             if (StringUtil.isEmpty(scope.arrive.phone)) {
                 CommonUtil.tip('请输入手机号码！');
               isPass = false;
             }  else if (!reg.test(scope.arrive.phone)) {
                 CommonUtil.tip('请输入有效的手机号码！');
               isPass = false;
             } else if (StringUtil.isEmpty(scope.arrive.quantity)) {
                 CommonUtil.tip('请输入数量！');
               isPass = false;
             }else if (parseInt(scope.arrive.quantity) < 1){
                 CommonUtil.tip('请输入数量！');
                 isPass = false;
             }
             if (isPass) {
             var arriveParams = {
               productId: scope.productId,
               phone: scope.arrive.phone,
               number: scope.arrive.quantity
             };
             productService.getPersonSave(arriveParams)
             .then(function () {
               CommonUtil.tip('订阅成功,到货后会第一时间通知您!');
               scope.closePopover();
             }, function (errorMsg) {
               CommonUtil.tip(errorMsg);
             });
             }else {
               scope.errorMsg=errorMsg;
             }
          }
          scope.cutQuantity = function () {
            if(scope.arrive.quantity != '' && scope.arrive.quantity != null){
              scope.arrive.quantity --;
              if(scope.arrive.quantity < 1){
                scope.arrive.quantity = 1;
                return;
              }
            }else{
              scope.arrive.quantity = 1;
            }
          }
          scope.addQuantity = function () {
              scope.activateState = '';
            if(scope.arrive.quantity != '' && scope.arrive.quantity != null){
              scope.arrive.quantity ++;
            } else {
              scope.arrive.quantity = 1;
            }
          }
          var reg = /^(?:13\d|15\d|18\d)\d{5}(\d{3}|\*{3})$/;
        }
      }
    }])
  .directive('focusMe',[
    '$timeout',
    '$parse',
    function($timeout,$parse){
      return {
        link: function (scope, element, attrs) {
          var model = $parse(attrs.focusMe);
          scope.$watch(model, function (value) {
            if (value === true) {
              $timeout(function () {
                scope.$apply(model.assign(scope, false));
                element[0].focus();
              }, 30);
            }
          });
        }
      }
    }]);
    //检测是不是ios 设备访问
    function isMobileios(){
        if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
                return true;
        }
        return false;
	}
})(window);

