requirejs(['common'],function(){
	requirejs(['angular'],function(angular){
		var app=angular.module('x1App',[]);
		app.controller('x1Ctrl',['$scope',function($scope){
			$scope.bigpic='/image/bigpic.png';			

		}]);
		angular.bootstrap(document,['x1App']);
	});	
});
