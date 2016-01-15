requirejs(['common'],function(){
	requirejs(['angular','serv/browseContent','angular-ui-route'],function(angular){
		var app=angular.module('x2App',['dectModule','ui.router']);
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
			var id=dectServ.getParameterByName('id');
			$http.get('json/x2.json?id='+id)//?id=id
			.success(function(data){
				$rootScope.lst=data.lst;
				$rootScope.opt=data.opt;
				$rootScope.info=data.info;
			});
			$scope.ok=function(){
				console.log('ok');
			};

		}]);
		app.controller('choseCtrl',['$scope','$rootScope','$window','$filter','$state',function($scope,$rootScope,$window,$filter,$state){
			$scope.ver='';
			$scope.color='';
			$scope.strg='';
			$scope.num=1;
			$scope.good='';
			$rootScope.state=$state.current;							
			$scope.checkColor=function(c){
				var hasColorLst=[];
				if($scope.ver===''){
					return false;
				}else{
					if ($rootScope.lst===undefined) {
						return false;
					} else{
						hasColorLst=$filter('filter')($rootScope.lst,{'version':$scope.ver,'color':c},true);
					}
				}
				if (hasColorLst.length===0) {
					return false;
				} else{
					return true;
				}
			};
			$scope.checkStrg=function(s){
				var hasStrgLst=[];
				if($scope.ver===''||$scope.color===''){
					return false;
				}else{
					if ($rootScope.lst===undefined) {
						return false;
					} else{
						hasStrgLst=$filter('filter')($rootScope.lst,{'version':$scope.ver,'color':$scope.color,'storage':s},true);
					}
				}
				if (hasStrgLst.length===0) {
					return false;
				} else{
					return true;
				}
			};			
			$scope.setVer=function(v){
				$scope.ver=v;
				$scope.color='';
				$scope.strg='';
				$scope.checkPrice();								
			};			
			$scope.setColor=function(c){
				$scope.color=c;
				$scope.strg='';	
				$scope.checkPrice();											
			};
			$scope.setStrg=function(s){
				$scope.strg=s;
				$scope.checkPrice();				
			};
			$scope.checkPrice=function(){
				var finalLst=$filter('filter')($rootScope.lst,{'version':$scope.ver,'color':$scope.color,'storage':$scope.strg},true);
				$scope.good=(finalLst!==undefined&&finalLst.length!==0)?finalLst[0]:'';
				return $scope.good!=='';
			};
			$scope.comfirm=function(){
				$window.location.replace('/x3.html?id='+$scope.good.id+'&num='+$scope.num);
			};
			$scope.addNum=function(add){
				if(add){$scope.num++;}else{$scope.num--;}
				
			};		
		}]);					
		app.controller('detailCtrl',['$scope','$rootScope','$http','$state',function($scope,$rootScope,$http,$state){
			$rootScope.state=$state.current;							
		}]);
		app.controller('commentCtrl',['$scope','$rootScope','$http','dectServ','$state',function($scope,$rootScope,$http,dectServ,$state){
			$rootScope.state=$state.current;										
			var id=dectServ.getParameterByName('id');
			$http.get('json/x2-comment.json?id='+id)
			.success(function(data){
				$scope.comments=data.lst;
			});
		}]);		
		app.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
		  //
		  // For any unmatched url, redirect to /state1
		  // if($rootScope.uaData.ispc){
		  // 	$urlRouterProvider.otherwise("/state2");
		  // }else{
		  // 	$urlRouterProvider.otherwise("/state1");
		  // }
		  //
		  $urlRouterProvider.otherwise("/detail");		  
		  // Now set up the states
		  $stateProvider
		    .state('chose', {
		      url: "/chose",
		      views:{
		      	'choseview':{
		      		templateUrl:'x2-module/choseGood.html',
		      		controller:'choseCtrl'
		      	},
		      	'tagview':{
		      		templateUrl:'x2-module/choseGood.html',
		      		controller:'choseCtrl'
		      	}
		      }
		    })
		    .state('detail', {
		      url: "/detail",
		      views:{
		      	'choseview':{
		      		templateUrl:'x2-module/choseGood.html',
		      		controller:'choseCtrl'
		      	},
		      	'tagview':{
		      		templateUrl:'x2-module/detail.html',
		      		controller:'detailCtrl'
		      	}
		      }
		    })
		    .state('comment', {
		      url: "/comment",
		      views:{
		      	'choseview':{
		      		templateUrl:'x2-module/choseGood.html',
		      		controller:'choseCtrl'
		      	},
		      	'tagview':{
		      		templateUrl:'x2-module/comment.html',
		      		controller:'commentCtrl'
		      	}
		      }
		    });
		}]);
		////
		angular.bootstrap(document,['x2App']);
	});	
});
