requirejs(['common'],function(){
	requirejs(['angular','serv/browseContent'],function(angular){
		var app=angular.module('x2App',['dectModule']);
		app.controller('x2Ctrl',['$scope','dectServ','$window','$http','$filter',function($scope,dectServ,$window,$http,$filter){
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
			var id=dectServ.getParameterByName('id');
			$http.get('json/x2.json?id='+id)//?id=id
			.success(function(data){
				$scope.lst=data.lst;
				$scope.opt=data.opt;
			});
			$scope.ver='';
			$scope.color='';
			$scope.strg='';
			$scope.num=1;
			$scope.good='';	
			$scope.t_chose='/choseGood.html';		
			$scope.checkColor=function(c){
				var hasColorLst=[];
				if($scope.ver===''){
					return false;
				}else{
					if ($scope.lst===undefined) {
						return false;
					} else{
						hasColorLst=$filter('filter')($scope.lst,{'version':$scope.ver,'color':c},true);
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
					if ($scope.lst===undefined) {
						return false;
					} else{
						hasStrgLst=$filter('filter')($scope.lst,{'version':$scope.ver,'color':$scope.color,'storage':s},true);
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
				var finalLst=$filter('filter')($scope.lst,{'version':$scope.ver,'color':$scope.color,'storage':$scope.strg},true);
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
		////
		angular.bootstrap(document,['x2App']);
	});	
});
