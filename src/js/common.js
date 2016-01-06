requirejs.config({
    baseUrl: '/js/',
    paths: {
        module:'module',
        lib: 'lib',
        zepto:'lib/zepto.min',
        siteData:'lib/siteData_bas',
        text: 'lib/text',
        underscore: 'lib/underscore-min',
        backbone: 'lib/backbone',                
    },
    shim:{
    	zepto:{
    		exports:'Zepto',//这里的z首字母必须大写，因为zepto.js就是这样定义的
    	},
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'zepto'
            ],
            exports: 'Backbone'
        },        
        siteData:{
            exports:'arrCity',
        }
    },
    map: {
        backbone: {
            'jquery': 'zepto'
        },
    }
});

