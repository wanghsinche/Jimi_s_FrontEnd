define(['angular'],function(angular){
  var app=angular.module('dectModule', []);  
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
    app.directive('backButton', ['$window',function ($window) {
    return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.bind('click', function () {
                    $window.history.back();
                });
            }             
    };
  }]); 
  app.directive('starRating', function () {
      return {
          restrict: 'A',
          template: '<ul class="rating">' +
              '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
              '\u2605' +
              '</li>' +
              '</ul>',
          scope: {
              ratingValue: '=',
              max: '=',
              onRatingSelected: '&'
          },
          link: function (scope, elem, attrs) {

              var updateStars = function () {
                  scope.stars = [];
                  for (var i = 0; i < scope.max; i++) {
                      scope.stars.push({
                          filled: i < scope.ratingValue
                      });
                  }
              };

              scope.toggle = function (index) {
                  scope.ratingValue = index + 1;
                  scope.onRatingSelected({
                      rating: index + 1
                  });
              };

              scope.$watch('ratingValue', function (oldVal, newVal) {
                  if (newVal) {
                      updateStars();
                  }
              });
          }
      };
  });

    
  return app;
});