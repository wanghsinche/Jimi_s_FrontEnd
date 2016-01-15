requirejs(['common'],function(){
	requirejs(['angular','serv/browseContent','angular-ui-route'],function(angular){
		var app=angular.module('x5App',['dectModule','ui.router']);
		app.controller('xCtrl',['$scope','$rootScope','$state','dectServ','$window','$http','$filter',function($scope,$rootScope,$state,dectServ,$window,$http,$filter){
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
