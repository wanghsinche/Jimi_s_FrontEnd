requirejs(['common'],function(common){
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
			$scope.title="订单详情";
			var code=dectServ.getParameterByName('code');
			//it should be post
			$http.get('json/x6.json',{code:code})
			.success(function(data){
				$scope.i=data.detail;
				$scope.express=data.express;
				$scope.express.process=$scope.express.process.reverse();
			});
			$scope.rating={price:5,quality:5,speed:5,text:''};
			$scope.postRating=function(){
				var postData=$scope.rating;
				postData.code=code;
				$http.post('json/x6-postRating.json',postData)
				.success(function(data){
					alert('谢谢你的评论');
				})
				.error(function(data){
					alert('评论失败');
				});
			};
		    $scope.action=function(i,code){
		    	switch(i){
		    		case 3://确认收货
		    		$http.post('json/x6-comfirmReceive.json',{code:code})
		    		.success(function(data){
		    			alert("确认收货成功");
						$http.get('json/x6.json',{code:code})
						.success(function(data){
							$scope.i=data.detail;
							$scope.express=data.express;
							$scope.express.process=$scope.express.process.reverse();
						});
		    		})
		    		.error(function(data){
		    			alert("确认收货失败");
		    		});
		    		break;
		    		
		    		case 4://评论
		    		$window.location.replace('/x6-comment.html?code='+code);
		    		break;

		    	}
		    };			
		}]);
		////
		angular.bootstrap(document,['x6App']);
	});	
});
