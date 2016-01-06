requirejs.config({
    baseUrl: '/js/',
    paths: {
        module:'module',
        lib: 'lib',
        zepto:'lib/zepto.min',
        siteData:'lib/siteData_bas',
    },
    shim:{
    	zepto:{
    		exports:'Zepto',//这里的z首字母必须大写，因为zepto.js就是这样定义的
    	},
        siteData:{
            exports:'arrCity',
        }
    }
});

