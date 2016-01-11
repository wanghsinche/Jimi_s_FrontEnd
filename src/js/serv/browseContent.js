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
              },
        getParameterByName:function (name) {
              name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
              var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                  results = regex.exec(location.search);
              return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
          }      
      };
    });
  app.directive('myBack', function($window) {
    return {
      link: function(scope,elems, attrs){
        console.log(elems);
        elems.bind('click',function(){
          $window.history.back();          
        });
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