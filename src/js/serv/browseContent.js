define(['angular'],function(angular){
  var app=angular.
  module('dectModule', []);
  app.factory('dectServ', function($window) {
   
      return {
        getUA:function(threshold){
            var data={ua:'unknow',ispc:true,width:800};          
                var screenWidth = $window.innerWidth;
                if (screenWidth < threshold) {
                    data.ispc=false;
                } else if (screenWidth >= threshold) {
                    data.ispc=true;
                }
                data.width=screenWidth;
                var userAgent = $window.navigator.userAgent;

                    var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};

                    for(var key in browsers) {
                        if (browsers[key].test(userAgent)) {
                      data.ua=key;
                        }
                    }
                    return data;
              }
      };
    });
  // app.directive('myLink', function() {
  //   return {
  //     template: function(elem, attr){
  //       var val=attr.myhref;
  //       var type=attr.myload;
  //       console.log(attr.href);
  //       console.log(type);        
  //       // if(type===true){
  //       //   attr.$set('href',val);
  //       //   console.log(attr.href);
  //       // }

  //     }
  //   };
  // });        
  return app;
});