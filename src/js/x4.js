requirejs(['common'],function(){
	requirejs(['angular','serv/browseContent'],function(angular){
		var app=angular.module('x4App',['dectModule']);
		app.controller('x4Ctrl',['$scope','dectServ','$window','$http',function($scope,dectServ,$window,$http){
			var dect=function(threshold){
				var uaData=dectServ.getUA(800);
				$scope.uaData=uaData;
				if(uaData.ispc===true){
					$scope.cssprefix="";
				}else{
					$scope.cssprefix="x-";
				}
			};

			dect(800);

			$window.onresize=function(){
				dect(800);
				$scope.$apply();
			};			
		}]);
		////
		angular.bootstrap(document,['x4App']);
	});	
});
