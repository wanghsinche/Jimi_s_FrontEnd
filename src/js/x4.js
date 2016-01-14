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
			var code=dectServ.getParameterByName('code');
			//it should be post
			$http.get('json/x4.json',{code:code})
			.success(function(data){
				$scope.info=data;
			});
			$scope.payby=function(val){
				$scope.paybyFlag=val;
			};
			$scope.setpayDialog=function(flag){
				$scope.payDialog=flag;
			};
			$scope.goCenter=function(){
				$window.location.replace('/x5.html');
			};
			$scope.postPay=function(){
				if ($scope.paybyFlag===undefined) {
					alert('请选择支付方式');
				}else{
					switch($scope.paybyFlag){
						case'ali':
						$scope.payDialog=true;
						$window.open($scope.info.ali);
						break;
						case'weixin':
						$scope.payDialog=true;
						$window.open($scope.info.weixin);
						break;						
						case'cash':
						alert('成功下单，采用货到付款');
						$scope.goCenter();
						break;						
					}
				}
			};
		}]);
		////
		angular.bootstrap(document,['x4App']);
	});	
});
