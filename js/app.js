var portList = angular.module('portList', [
	'ngRoute',
	'ngTouch',
    'ngAnimate',
	'ui.bootstrap',
	'ui.router',
    'tile.menu'
    ])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'views/pages/tile.html',
            controller: 'TileController'
        
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true);

}]);

