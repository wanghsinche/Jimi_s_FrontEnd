requirejs(['common'],function(){
	requirejs(['angular','serv/browseContent'],function(angular){
		var app=angular.module('x1App',['dectModule']);
		app.controller('x1Ctrl',['$scope','dectServ','$window',function($scope,dectServ,$window){
			var dect=function(threshold){
				var uaData=dectServ.getUA(800);
				$scope.uaData=uaData;
				if(uaData.ispc===true){
					$scope.cssprefix="";
				}else{
					$scope.cssprefix="x-";
				}
			};

			$scope.bigpic='/image/bigpic.png';
			dect(800);
			$window.onresize=function(){
				dect(800);
				$scope.$apply();
			};			
		}]);
		////
		angular.bootstrap(document,['x1App']);
	});	
});
