requirejs(['common'],function(){
	requirejs(['angular','serv/browseContent'],function(angular){
		var app=angular.module('x3App',['dectModule']);
		app.controller('x3Ctrl',['$scope','dectServ','$window','$http',function($scope,dectServ,$window,$http){
			var dect=function(threshold){
				var uaData=dectServ.getUA(800);
				$scope.uaData=uaData;
				if(uaData.ispc===true){
					$scope.cssprefix="";
				}else{
					$scope.cssprefix="x-";
				}
			};

			var id=dectServ.getParameterByName('id');
			var num=dectServ.getParameterByName('num');
			$scope.title="确认下单";
			dect(800);
			$http.get('json/x3.json?id='+id+"&num="+num)
			.success(function(data){
				$scope.contact=data.contact;

			});			
			$window.onresize=function(){
				dect(800);
				$scope.$apply();
			};			
		}]);
		////
		angular.bootstrap(document,['x3App']);
	});	
});
