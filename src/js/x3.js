requirejs(['common'],function(){
	requirejs(['angular','serv/browseContent','angular-ui-route'],function(angular){
		var app=angular.module('x3App',['dectModule','ui.router']);

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
				postDelContact:function(contact,callfinish){
					$http.post('json/x3-deleteContact.json',{id:contact.id})
					.success(function(data){
						alert('删除成功');
						callfinish(data);
					});
				},				
				postNewContact:function(newContact,callfinish){
					if(newContact.name===''||newContact.phone===''||newContact.text===''){
						alert("information is not complete");
						return;
					}else{
						var location='';
						for(var i in newContact.location){
							location+=newContact.location[i];
						}
						//it should be post
						console.log(location);
						$http.get('json/x3-addContact.json',{name:newContact.name,phone:newContact.phone,location:location})
						.success(function(data){
							console.log(data);
							callfinish(data);

						}).error(function(data, status) {
	  						console.log('Repos error', status, data);
	  						alert('network error');
						});
					}
				},
				getContact:function(callback){
					$http.get('json/x3-contact.json')
					.success(function(data){
						callback(data);
					});					
				},
				getEle:function(key,val,objLst){
					var child;
					for(var i in objLst){
						if(objLst[i][key]===val){
							child=objLst[i];
							break; 
						}
					}
					return child;
				}
			};
		}]);   
		app.controller('xCtrl',['$scope','$rootScope','dectServ','contactServ','$window','$http','$state',function($scope,$rootScope,dectServ,contactServ,$window,$http,$state){
			console.log('init');
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
			
			$rootScope.title="确认下单";
			var sliceContact=function(lenght){
				$scope.contact_f=$rootScope.contact===undefined?[]:$rootScope.contact.slice(0,lenght);
			};
			//get info and reserve info in root to prevent depulicate get
			if ($rootScope.info===undefined) {
				contactServ.getInfo(function(data){
					$rootScope.info=data;
					$rootScope.currPosttime=data.posttime[0];
					$rootScope.hongBao={'id':'000','name':'不使用红包',"price":0,"title":"不使用红包","expr":"2116-3-8","available":true};
				});				
			}
			//get contact when it is first time load controller
			if ($rootScope.contact===undefined) {
				contactServ.getContact(function(data){
					$rootScope.contact=data.lst;
					// sliceContact(3);
					//if user has set currcontact, don't rewrite currcontact
					if ($rootScope.currContact===undefined) {
						$rootScope.currContact=data.contact[0];
					}
				});				
			}						
			//get hongbaoLst when it is pc
			if ($scope.uaData.ispc===true) {
				$http.get('json/x5-hongbao.json?type=available')
				.success(function(data){
					$scope.hongbaoLst=data.lst;				
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
			$scope.deleteContact=function(i){
				contactServ.postNewContact(i,function(data){
					contactServ.getContact(function(data){
						$rootScope.contact=data.lst;
						// sliceContact(3);
						//if user has set currcontact, don't rewrite currcontact
						if ($rootScope.currContact===undefined) {
							$rootScope.currContact=data.contact[0];
						}
					});						
				});
			};
			$scope.switchAddContact=function(flag){
				$scope.addContactFlag=flag;
			};
			$scope.dropdownActive=false;
			$scope.switchDropdown=function(){
				$scope.dropdownActive=!$scope.dropdownActive;
			};
			$scope.useHongBao=function(i){
				$rootScope.hongBao=i;
				$scope.switchDropdown();
			};	
			$scope.postOrder=function(){
				var id=dectServ.getParameterByName('id');
				var num=dectServ.getParameterByName('num');
				var hongBao=parseInt($scope.hongBao);
				var contact=$scope.currContact;
				var postTime=$scope.currPosttime;
				//it should be post
				$http.get('json/x3-postOrder.json',{id:id,num:num,hongBao:hongBao.id,postTime:postTime,contactName:contact.name,contactPhone:contact.phone,contactLocation:contact.location})
				.success(function(data){
					// if (data==="success") {
						$window.location.replace('/x4.html?code='+data);
					// }
				});
			};
			$scope.$on('addevent',function(e,msg){
				if(msg==='done'){$state.go('chooseContact');}
				$scope.switchAddContact(false);
			});
			


		}]);
		app.controller('addContCtrl',['$scope','$rootScope','contactServ','$http',function($scope,$rootScope,contactServ,$http){
			$rootScope.title="添加地址";
			$scope.newContact={name:'',phone:'',location:{p:'',c:'',d:''}};
			if($rootScope.sites===undefined){
				$http.get("json/x3-siteData.json").success(function(data){
					$rootScope.sites=data;
				});				
			}
			$scope.t_c='';
			$scope.t_d='';
			$scope.showOpt=true;
			$scope.switchOpt=function(){
				// $scope.showOpt=!$scope.showOpt;
			};
			//short hand to get child with attr of a list
			$scope.f_n=function(val,objLst){
				return contactServ.getEle('n',val,objLst);
			};
			$scope.set_p=function(i){
				$scope.newContact.location.p=i;
				$scope.t_c=$scope.f_n($scope.newContact.location.p,$rootScope.sites).s;
				$scope.newContact.location.c='';
				$scope.newContact.location.d='';
			};
			$scope.set_c=function(i){
				$scope.newContact.location.c=i;
				$scope.t_d=$scope.f_n($scope.newContact.location.c,$scope.t_c).s;
				$scope.newContact.location.d='';				
			};
			$scope.set_d=function(i){
				$scope.newContact.location.d=i;
			};									
			$scope.postNewContact=function(){
				contactServ.postNewContact($scope.newContact,function(data){
					if (data==='success') {
						console.log(data);
						contactServ.getContact(function(data){
							$rootScope.contact=data.contact;
							alert('成功');
							$scope.$emit('addevent','done');
						});
					} else{
						alert(data);
					}
				});
			};									
		}]);
		app.controller('chooseContact',['$scope','$rootScope','contactServ',function($scope,$rootScope,contactServ){
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

		}]);
		app.controller('hongbaoCtrl',['$scope','$rootScope','$http','$state',function($scope,$rootScope,$http,$state){
			$rootScope.state=$state.current;
			$rootScope.title="选择红包";	
			var type='';
			switch($state.current.name){
				case 'hongbao.available':
				type='available';
				break;
				case 'hongbao.history':
				type='history';
				break;
			}
			$scope.useHongBao=function(i){
				$rootScope.hongBao=i;
				// $state.go('order');
			};			
			$scope.getNumber = function(num) {
		        return new Array(num);   
		    };
			$http.get('json/x5-hongbao.json?type='+type)
			.success(function(data){
				$scope.hongbaoLst=data.lst;
				$scope.curr=data.curr;
				$scope.allPage=data.allPage;				
			});
			$scope.toPage=function(i){
				$http.get('json/x5-hongbao.json?'+'?type='+type+'&page='+i)
				.success(function(data){
					$scope.hongbaoLst=data.lst;
					$scope.curr=data.curr;
					$scope.allPage=data.allPage;
				});				
			};									
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
		      		controller:'xCtrl'
		      	},
		      }
		    })
		    .state('addContact', {
		      url: "/addContact",
		      views:{
		      	'xView':{
		      		templateUrl:'x3-module/x-addContact.html',
		      		controller:'addContCtrl'
		      	},
		      }
		    })
		    .state('hongbao', {
		      	url: "/hongbao",
		    	views:{
		    		'xView':{
		    			templateUrl:'x3-module/x-hongbao.html',
		    			controller:'hongbaoCtrl'
		    		},
		    	}		      
		    })
		    .state('hongbao.available',{
		    	url:"/available",
		    	views:{
		    		'hongbaoView':{
		    			templateUrl:'x5-module/hongbaoLst.html',
		    			controller:'hongbaoCtrl'
		    		}
		    	}
		    })
		    .state('hongbao.history',{
		    	url:"/history",
		    	views:{
		    		'hongbaoView':{
		    			templateUrl:'x5-module/hongbaoLst.html',
		    			controller:'hongbaoCtrl'
		    		}
		    	}
		    })		    	    
		    .state('chooseContact', {
		      url: "/chooseContact",
		      views:{
		      	'xView':{
		      		templateUrl:'x3-module/x-chooseContact.html',
		      		controller:'chooseContact'
		      	},
		      }
		    });
		}]);		
		////
		angular.bootstrap(document,['x3App']);
	});	
});
