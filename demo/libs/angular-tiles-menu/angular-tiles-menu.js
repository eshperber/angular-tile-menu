var timemenu = angular.module('tile.menu', [])
timemenu.directive('tileMenu',['$http', '$timeout', '$window', '$q', '$rootScope', '$parse', function($http, $timeout, $window, $q, $rootScope, $parse) {
    
    return {
        priority: 0,
        scope: {
            template: '=',
            tiles: '='
        },
        templateUrl: '/views/directives/angularTileMenu.html',
        controller: function($scope, $element, $attrs) {
            var unwatch = $scope.$watch('tiles', function(newVal, oldVal){
                if(newVal !== oldVal){
                    this.tiles =  newVal;
                    this.template = $scope.template
                    unwatch();
                }
            })
        }
    }
}]);
timemenu.directive('tileMenuSlider',['$timeout', '$window', '$parse', '$q', function($timeout, $window, $parse, $q) {
    return {
        priority: 3,
        replace: true,
        require: '^tileMenu',
        link: function(scope, element, attrs, menuCtrl){
                scope.showfooter = false;
                scope.smallLinks = [];
                scope.midLinks = [];
                scope.largeLinks = [];
                scope.links = [];
                scope.current = 0;
                scope.panelWidth;
                scope.panelLeft;
                scope.panelscount = 0;
                scope.tiles = $parse(menuCtrl.tiles);

                // listen to resize
                angular.element($window).bind('resize', function() {
                    scope.resize();
                    if (!scope.$$phase) {
                            scope.$apply();
                    }
                });

                var splitArr = function(a, s) {
                  var c = []
                  while (a.length) {
                    c.push(a.splice(0, s))
                  }
                  return c
                }

                var sortTiles = function(data) {
                    // 1. sort tiles by the sizes into 3 size arrays.
                    var deferredTiles = $q.defer();
                    for (var val in data){
                        var tile = data[val]
                        if (tile.size == 1) {
                            scope.smallLinks.push(tile);
                        } else if (tile.size == 2 ) {
                            scope.midLinks.push(tile);
                        } else {
                            scope.largeLinks.push(tile)
                        }
                    };
                    deferredTiles.resolve();
                    return deferredTiles.promise
                };

                var sortLists = function() {
                    //2.  arrange lists into the template match sizes with the sizes in the template. 
                    var deferredLists = $q.defer();
                    scope.template.forEach(function (element) {
                        if (scope.smallLinks.length + scope.midLinks.length + scope.largeLinks.length > 0) {
                            switch (element) {
                                case 1:
                                    if (scope.smallLinks.length > 0) {
                                        handleSmall(1);
                                    }
                                    else if (scope.midLinks.length > 0) {
                                        handleMid(1);
                                    }
                                    else if (scope.largeLinks.length > 0) {
                                        handleLarge(1)
                                    }
                                    break;
                                case 2:
                                    if (scope.midLinks.length > 0) {
                                        handleMid(2);
                                    }
                                    else if (scope.smallLinks.length > 0) {
                                        handleSmall(2);
                                    }
                                    else if (scope.largeLinks.length > 0) {
                                        handleLarge(2);
                                    }
                                    break;
                                case 3:
                                    if (scope.largeLinks.length > 0) {
                                        handleLarge(3)
                                    }
                                    else if (scope.midLinks.length > 0) {
                                        handleMid(3)
                                    }
                                    else if (scope.smallLinks.length > 0) {
                                        handleSmall(3);
                                    }
                                    break;
                                default:
                            }
                        };
                    });
                    while (scope.smallLinks.length + scope.midLinks.length + scope.largeLinks.length > 0) {
                        sortLists();
                    }

                    function handleSmall(size) {
                        var link = scope.smallLinks[scope.smallLinks.length - 1];
                        link.size = size;
                        scope.links.push(scope.smallLinks[scope.smallLinks.length - 1]);
                        scope.smallLinks.pop(scope.smallLinks.length - 1);
                    }
                    function handleMid(size) {
                        var link = scope.midLinks[scope.midLinks.length - 1];
                        link.size = size;
                        scope.links.push(scope.midLinks[scope.midLinks.length - 1]);
                        scope.midLinks.pop(scope.midLinks.length - 1);
                    }
                    function handleLarge(size) {
                        var link = scope.largeLinks[scope.largeLinks.length - 1];
                        link.size = size;
                        scope.links.push(scope.largeLinks[scope.largeLinks.length - 1]);
                        scope.largeLinks.pop(scope.largeLinks.length - 1);
                    };

                    $timeout(function(){
                        scope.showfooter = true
                    }, 100); 
                    deferredLists.resolve();
                    return deferredLists.promise

                } // end sortList()


                scope.tileFloor = function(size){
                        return Math.floor( (16/12) * size)
                }
                scope.tileHalf = function(size){
                    return Math.floor( (16/12) * size)*3
                }
                scope.resize = function(){
                    var windowElement = angular.element(scope.browser).parent()[0],
                    style = window.getComputedStyle(windowElement),
                    margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight),
                    padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
                    border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth),
                    panel = scope.panels[0],
                    windowWidth = windowElement.offsetWidth+margin+padding+border;
                    if(windowWidth >730){
                        scope.panelWidth = windowWidth * (scope.panels.length);
                        scope.panelLeft = -1*(windowWidth*scope.current);
                    } else {
                        scope.panelLeft = 0
                        scope.panelWidth = windowWidth;
                    }
                }
                scope.sliderElem = element[0];

                scope.handleSlide = function(event, what){
                    var currentTarget = scope.sliderElem;
                    var max = scope.sliderElem.clientWidth-scope.sliderElem.children[0].clientWidth;
                    // need to add if 0 no more right
                    if(what == 'left' && scope.sliderElem.offsetLeft > max * -1){
                        scope.current++
                        angular.element(currentTarget).css('left',scope.sliderElem.offsetLeft-scope.sliderElem.children[0].clientWidth+'px');
                    }
                    //need to add if last no more left    
                    else if(what =='right' && scope.sliderElem.offsetLeft < 0) {
                        --scope.current
                        angular.element(currentTarget).css('left',scope.sliderElem.offsetLeft+scope.sliderElem.children[0].clientWidth+'px');
                    }
                    $timeout(function() {
                        scope.setMark(event, scope.current)
                    },500);
                    
                };

                scope.clickSlide = function(event,index){

                    if(index<scope.current){
                        scope.handleSlide(event,'right');
                        scope.resize();
                    }else{
                        scope.handleSlide(event,'left');
                        scope.resize();
                    }
                    scope.setMark(event,index);
                }


                scope.setMark = function(event,index){
                    if (event.type == 'mouseup') {
                        scope.current = Math.abs(scope.sliderElem.offsetLeft)/scope.sliderElem.children[0].clientWidth;
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                        scope.resize();
                    }
                    else {
                        scope.current = index;
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                        scope.resize();
                    }
                }

                var unwatch = scope.$watch('tiles', function(newVal, oldVal){
                    if(newVal !== oldVal){
                        sortTiles(newVal)
                        .then(function(data){
                            sortLists()
                            .then(function(data){
                                scope.panels = splitArr(scope.links, scope.template.length);
                                scope.browser = angular.element(element);
                                scope.resize();
                                scope.$broadcast('dataloaded');
                                $timeout(function() {
                                    scope.resize();
                                }, 200);
                            });
                        });
                        unwatch();
                    }
                })
            }
        }
    }]);