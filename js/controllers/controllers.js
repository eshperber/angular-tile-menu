portList.controller('PortfolioController', ['$scope','$http', '$animate', '$location', function($scope, $http, $animate, $location) {


        
}]);

// tile
portList.controller('TileController', ['$scope', '$rootScope','$http', '$q', '$window', '$timeout', function($scope, $rootScope, $http, $q, $window, $timeout) {
            // first lest take inventory
			//listen to window resize

			// template for ƒ structure
			$scope.templateLayout = [3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1,1];
			$http({method: 'GET', url: '../../data/tiles.json'}).success(function(data, status, headers, config) {
				$scope.title = data.title;
                $scope.tiles = data.tiles;
            });

			// steps 
			// 1. get template
			// 2. arrange all the data in queues according to size
			// 3. start setting tiles in arrangement accoding to template and repeat remplate until all queques are empty. 
			//	if one queue is empty use alternative queues (if size 1 is empty use )

			// organize tiles into arrays
			
}])