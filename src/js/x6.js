requirejs(['common'],function(){
	requirejs(['angular','serv/browseContent'],function(angular){
		var app=angular.module('x6App',['dectModule']);
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

			dect(800);

			$window.onresize=function(){
				dect(800);
				$scope.$apply();
			};	
			var code=dectServ.getParameterByName('code');
			//it should be post
			$http.get('json/x6.json',{code:code})
			.success(function(data){
				$scope.i=data.detail;
			});
			$scope.rating={price:5,quality:5,speed:4};
		}]);
		////
		angular.bootstrap(document,['x6App']);
	});	
});
