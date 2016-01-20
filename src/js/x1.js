
requirejs(['common'],function(common){
	requirejs(['angular','serv/browseContent'],function(angular){
		var app=angular.module('x1App',['dectModule']);
		app.controller('xCtrl',['$scope','dectServ','$window','$http',function($scope,dectServ,$window,$http){
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
			$http.get('json/x1.json')
			.success(function(data){
				$scope.lst=data.lst;
			});			
			$window.onresize=function(){
				dect(800);
				$scope.$apply();
			};			
		}]);
		////
		angular.bootstrap(document,['x1App']);
	});	
});
