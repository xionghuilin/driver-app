(function () {
  goodvan.module.controller('registerController', [
  '$scope',
  'StringUtil',
  'CommonUtil',
  function($scope,StringUtil,CommonUtil){
    var user = {
      userName:'',
      englishName:'',
      IDCard:'',
      birth:'',
      homePhone:'',
      telPhone:'',
      drivingAge:'',
      addr:'',
      plate:'',
      middleNetwork:'',
      goodsVan:''
    };
    $scope.user = user;
    $scope.register = function () {
      }
  }]);
})();
