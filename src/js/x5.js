requirejs(['common'],function(){
	requirejs(['angular','serv/browseContent','angular-ui-route'],function(angular){
		var app=angular.module('x5App',['dectModule','ui.router']);
		app.controller('xCtrl',['$scope','$rootScope','$state','dectServ','$window','$http','$anchorScroll',function($scope,$rootScope,$state,dectServ,$window,$http,$anchorScroll){
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
				//if pc is detected then transform 'chose' to 'detail'
				if($scope.uaData.ispc===true&&$state.current.name==="chose"){
					$state.go('detail');
				}
			};
			$rootScope.getNumber = function(num) {
		        return new Array(num);   
		    };
		    $rootScope.cancelOrderDialog=false;
		    $rootScope.currOrderCode='';
		    $rootScope.switchCancelDialog=function(flag){
		    	$rootScope.cancelOrderDialog=flag;
		    };
		    $rootScope.postCancel=function(){
		    	$http.post('json/cancelorder.json',{code:$rootScope.currOrderCode})
		    	.success(function(data){
		    		alert('取消成功');
		    		$rootScope.switchCancelDialog(false);
		    	})
		    	.error(function(data){
		    		alert('取消失败');
		    	});
		    };
		    $rootScope.action=function(i,code){
		    	switch(i){
		    		case 1://取消订单
		    		$rootScope.switchCancelDialog(true);
		    		$rootScope.currOrderCode=code;
		    		
		    		break;
		    		case 2://支付
		    		$window.location.replace('/x4.html?code='+code);
		    		break;
		    		
		    		case 4://评论
		    		$window.location.replace('/x6-comment.html?code='+code);
		    		break;

		    	}
		    };

		}]);
		app.controller('doingCtrl',['$scope','$rootScope','$window','$state','$http',function($scope,$rootScope,$window,$state,$http){
			$rootScope.state=$state.current;										
			$http.get('json/x5-order-doing.json')
			.success(function(data){
				$scope.orderLst=data.lst;
				$scope.curr=data.curr;
				$scope.allPage=data.allPage;
			});
			$scope.toPage=function(i){
				$http.get('json/x5-order-doing.json?page='+i)
				.success(function(data){
					$scope.orderLst=data.lst;
					$scope.curr=data.curr;
					$scope.allPage=data.allPage;
				});				
			};

		}]);					
		app.controller('doneCtrl',['$scope','$rootScope','$http','$state',function($scope,$rootScope,$http,$state){
			$rootScope.state=$state.current;
			$http.get('json/x5-order-done.json')
			.success(function(data){
				$scope.orderLst=data.lst;
				$scope.curr=data.curr;
				$scope.allPage=data.allPage;				
			});
			$scope.toPage=function(i){
				$http.get('json/x5-order-doing.json?page='+i)
				.success(function(data){
					$scope.orderLst=data.lst;
					$scope.curr=data.curr;
					$scope.allPage=data.allPage;
				});				
			};			
											
		}]);
		app.controller('canceledCtrl',['$scope','$rootScope','$http','$state',function($scope,$rootScope,$http,$state){
			$rootScope.state=$state.current;										
			$http.get('json/x5-order-canceled.json')
			.success(function(data){
				$scope.orderLst=data.lst;
				$scope.curr=data.curr;
				$scope.allPage=data.allPage;				
			});
			$scope.toPage=function(i){
				$http.get('json/x5-order-doing.json?page='+i)
				.success(function(data){
					$scope.orderLst=data.lst;
					$scope.curr=data.curr;
					$scope.allPage=data.allPage;
				});				
			};			
		
		}]);		
		app.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {

		  $urlRouterProvider.otherwise("/doing");		  
		  // Now set up the states
		  $stateProvider
		    .state('doing', {
		      url: "/doing",
		      views:{
		      	'tagview':{
		      		templateUrl:'x5-module/orderLst.html',
		      		controller:'doingCtrl'
		      	}
		      }
		    })
		    .state('done', {
		      url: "/done",
		      views:{
		      	'tagview':{
		      		templateUrl:'x5-module/orderLst.html',
		      		controller:'doneCtrl'
		      	}
		      }
		    })
		    .state('canceled', {
		      url: "/canceled",
		      views:{
		      	'tagview':{
		      		templateUrl:'x5-module/orderLst.html',
		      		controller:'canceledCtrl'
		      	}
		      }
		    });
		}]);
		////
		angular.bootstrap(document,['x5App']);
	});	
});
