requirejs.config({
    baseUrl: '/js/',
    paths: {
      "angular" : "lib/angular.min",
      "angular-ui-route" : "lib/angular-ui-router.min",        
        siteData:'lib/siteData_bas',
    },
    shim:{
       'angular': {
          exports: 'angular'
       },
       'angular-ui-route':{
          deps: ["angular"],
          exports: 'angular-ui-route'
       },         
        siteData:{
            exports:'arrCity',
        }
    },
});

