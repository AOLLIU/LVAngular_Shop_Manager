'use strict';

/**
 * AngularJS 模块的 config 函数用于配置路由规则。通过使用 configAPI，我们请求把$routeProvider
 * 注入到我们的配置函数并且使用$routeProvider.whenAPI来定义我们的路由规则。
 */


angular.module('myApp', FuncPermissions)
    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {

        /*
        * $location服务解析地址栏中的URL（基于window.location），让你在应用代码中能获取到。改变地
        * 址栏中的URL会反应$location服务中，反之亦然。
        *
        *   什么时候用:在你想对URL的改变做出响应是，或者在你想改变当前URL时。
        *   $location服务的具体行为取决于它初始化时的配置。默认设置对大多数应用都是适合的，你也可以自定义配置来增加些新特性。
        *   参考地址:http://www.angularjs.cn/A00M
        * */
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/shop'});
    }])
    .controller('AppCtrl', ['$scope', function ($scope) {

        /*注册整个的作用域*/
        $AppFunc.registerScope('App', $scope);
        $scope._menuLv1List = $AppData._menuLv1List;
    } ]);
