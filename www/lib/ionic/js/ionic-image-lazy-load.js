angular.module('ionicLazyLoad', []);
angular.module('ionicLazyLoad').directive('lazyScroll', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    return {
        restrict: 'A',
        link: function ($scope, $element) {
            var scrollTimeoutId = 0;
            $scope.invoke = function () {
                $rootScope.$broadcast('lazyScrollEvent');
            };
            $element.bind('scroll', function () {
                $timeout.cancel(scrollTimeoutId);
                scrollTimeoutId = $timeout($scope.invoke, 0);
            });
        }
    };
}]).directive('imageLazySrc', ['$document', '$timeout', '$ionicScrollDelegate', '$compile', function ($document, $timeout, $ionicScrollDelegate, $compile) {
    return {
        restrict: 'A',
        scope: {
            lazyScrollResize: "@lazyScrollResize",
            imageLazyBackgroundImage: "@imageLazyBackgroundImage"
        },
        link: function ($scope, $element, $attributes) {
            if (!$attributes.imageLazyDistanceFromBottomToLoad) {
                $attributes.imageLazyDistanceFromBottomToLoad = 0;
            }
            if (!$attributes.imageLazyDistanceFromRightToLoad) {
                $attributes.imageLazyDistanceFromRightToLoad = 0;
            }
            if ($attributes.imageLazyLoader) {
                var loader = $compile('<div class="image-loader-container"><ion-spinner class="image-loader" icon="' + $attributes.imageLazyLoader + '"></ion-spinner></div>')($scope);
                $element.after(loader);
            }
            var deregistration = $scope.$on('lazyScrollEvent', function () {
                if (isInView()) {
                    loadImage();
                    deregistration();
                }
            });

            function loadImage() {
                $element.bind("load", function (e) {
                    if ($attributes.imageLazyLoader) {
                        loader.remove();
                    }
                    if ($scope.lazyScrollResize == "true") {
                        $ionicScrollDelegate.resize();
                    }
                });
                if ($scope.imageLazyBackgroundImage == "true") {
                    var bgImg = new Image();
                    bgImg.onload = function () {
                        if ($attributes.imageLazyLoader) {
                            loader.remove();
                        }
                        $element[0].style.backgroundImage = 'url(' + $attributes.imageLazySrc + ')';
                        if ($scope.lazyScrollResize == "true") {
                            $ionicScrollDelegate.resize();
                        }
                    };
                    bgImg.src = $attributes.imageLazySrc;
                } else {
                    
                    $element[0].src = $attributes.imageLazySrc;

                }
            }

            function isInView() {
                var clientHeight = $document[0].documentElement.clientHeight;
                var clientWidth = $document[0].documentElement.clientWidth;
                var imageRect = $element[0].getBoundingClientRect();
                return (imageRect.top >= 0 && imageRect.top <= clientHeight + parseInt($attributes.imageLazyDistanceFromBottomToLoad)) && (imageRect.left >= 0 && imageRect.left <= clientWidth + parseInt($attributes.imageLazyDistanceFromRightToLoad));
            }
            $element.on('$destroy', function () {
                deregistration();
            });
            $timeout(function () {
                if (isInView()) {
                    loadImage();
                    deregistration();
                }
            }, 500);
        }
    };
}]);