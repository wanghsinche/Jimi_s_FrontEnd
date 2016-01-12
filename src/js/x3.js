requirejs(['common'],function(){
	requirejs(['angular','serv/browseContent','angular-ui-route'],function(angular){
		var app=angular.module('x3App',['dectModule','ui.router']);
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
			dect(800);			
			$window.onresize=function(){
				dect(800);
				$scope.$apply();
			};			
		}]);
		//addContact service
		app.factory('contactServ',['$http','dectServ',function($http,dectServ){
			return {
				getInfo:function(callback){
					var id=dectServ.getParameterByName('id');
					var num=dectServ.getParameterByName('num');					
					$http.get('json/x3-info.json?id='+id+'&num='+num)
					.success(function(data){
						callback(data);
					});
				},
				postNewContact:function(newContact){
					if(newContact.name===''||newContact.phone===''||newContact.text===''){
						alert("information is not complete");
						return;
					}else{
						var location='';
						for(var i in newContact.location){
							location+=newContact.location[i].n===undefined?newContact.location[i]:newContact.location[i].n;
						}
						//it should be post
						console.log(location);
						$http.get('json/x3-addContact.json',{name:newContact.name,phone:newContact.phone,location:location})
						.success(function(data){
							console.log(data);
							if(data==="success"){
								return "success";
							}else{
								alert(data);
								return "failed";
							}

						}).error(function(data, status) {
	  						console.log('Repos error', status, data);
	  						alert('network error');
								return "failed";  						
						});
					}
				},
				getContact:function(callback){
					$http.get('json/x3-contact.json')
					.success(function(data){
						callback(data);
					});					
				}
			};
		}]);   
		app.controller('orderCtrl',['$scope','$rootScope','contactServ','$http',function($scope,$rootScope,contactServ,$http){
			$rootScope.title="确认下单";
			// $scope.value="ok";
			$scope.newContact={name:'',phone:'',location:{p:'',c:'',d:'',text:''}};
			// $scope.currPosttime='';
			// var id=dectServ.getParameterByName('id');
			// var num=dectServ.getParameterByName('num');
			// var updateContact=function(){
			// 	$http.get('json/x3-contact.json')
			// 	.success(function(data){
			// 		$rootScope.contact=data.contact;
			// 		$rootScope.currContact=$rootScope.currContact===undefined?data.contact[0]:$rootScope.currContact;
			// 		sliceContact(3);
			// 	});				
			// };
			// var updateInfo=function(){
			// 	$http.get('json/x3-info.json?id='+id+'&num='+num)
			// 	.success(function(data){
			// 		$scope.info=data;
			// 		$scope.currPosttime=data.posttime[0];
			// 	});				
			// };
			var sliceContact=function(lenght){
				$scope.contact_f=$rootScope.contact===undefined?[]:$rootScope.contact.slice(0,lenght);
			};
			//get info and reserve info in root to prevent depulicate get
			if ($rootScope.info===undefined) {
				contactServ.getInfo(function(data){
					$rootScope.info=data;
					$rootScope.currPosttime=data.posttime[0];				
				});				
			}
			//get contact when it is first time load controller
			if ($rootScope.contact===undefined) {
				contactServ.getContact(function(data){
					$rootScope.contact=data.contact;
					sliceContact(3);
					//if user has set currcontact, don't rewrite currcontact
					if ($rootScope.currContact===undefined) {
						$rootScope.currContact=data.contact[0];
					}
				});				
			}						

			
			$scope.addContactFlag=false;
			// sliceContact(3);
			$scope.setContact=function(i){
				$rootScope.currContact=i;
			};
			$scope.setPosttime=function(i){
				$rootScope.currPosttime=i;
			};			
			$scope.switchAllContact=function(){
				if($scope.contact_f.length===$rootScope.contact.length){
					sliceContact(3);
				}else{
					$scope.contact_f=$rootScope.contact===undefined?[]:$rootScope.contact;
				}
			};
			$scope.switchAddContact=function(flag){
				if(flag){					
					$http.get("json/x3-siteData.json").success(function(data){
						$scope.sites=data;
						$scope.addContactFlag=flag;					
					});
				}else{
					$scope.addContactFlag=flag;					
				}

			};
			$scope.postNewContact=function(){
				switch(contactServ.postNewContact($scope.newContact)){
					case 'success':
					$rootScope.currContact=$scope.newContact;
					contactServ.getContact(function(data){
						$rootScope.contact=data.contact;
						sliceContact(3);
					});
					$scope.switchAddContact(false);
					break;
					case 'failed':
					alert('failed');
					break;
				}
			};

		}]);
		app.controller('xchooseContact',['$scope','$rootScope','contactServ',function($scope,$rootScope,contactServ){
			$rootScope.title="选择地址";
			$scope.setContact=function(i){
				$rootScope.currContact=i;
			};
			if ($rootScope.contact===undefined) {
				contactServ.getContact(function(data){
					$rootScope.contact=data.contact;
					//if user has set currcontact, don't rewrite currcontact
					if ($rootScope.currContact===undefined) {
						$rootScope.currContact=data.contact[0];
					}
				});				
			}						

			// var updateContact=function(){
			// 	$http.get('json/x3-contact.json')
			// 	.success(function(data){
			// 		$rootScope.contact=data.contact;
			// 		$rootScope.currContact=data.contact[0];
			// 	});				
			// };
			// if ($rootScope.currContact===undefined) {
			// 	updateContact();
			// }

		}]);

		app.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
		  $urlRouterProvider.otherwise("/order");		  
		  // Now set up the states
		  $stateProvider
		    .state('order', {
		      url: "/order",
		      views:{
		      	'xView':{
		      		templateUrl:'x3-module/x-order.html',
		      		controller:'orderCtrl'
		      	},
		      }
		    })
		    .state('addContact', {
		      url: "/addContact",
		      views:{
		      	'xView':{
		      		templateUrl:'x3-module/x-addContact.html',
		      		controller:'xaddContact'
		      	},
		      }
		    })
		    .state('chooseContact', {
		      url: "/chooseContact",
		      views:{
		      	'xView':{
		      		templateUrl:'x3-module/x-chooseContact.html',
		      		controller:'xchooseContact'
		      	},
		      }
		    });
		}]);		
		////
		angular.bootstrap(document,['x3App']);
	});	
});
