'use strict';

angular.module('myApp.shop', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        var menuLv1 = $AppObj.MenuLv1('shop', '#!/shop', '商户管理');
        $AppData._menuLv1List.push(menuLv1);

        $routeProvider.when('/shop', {
            templateUrl: 'shop/shops.html',
            controller: 'ShopsCtrl'
        }).when('/shop/shops', {
            templateUrl: 'shop/shops.html',
            controller: 'ShopsCtrl'
        }).when('/shop/detail/:id', {
            templateUrl: 'shop/shopdetail.html',
            controller: 'DetailCtrl'
        }).when('/shop/add', {
            templateUrl: 'shop/shopadd.html',
            controller: 'AddCtrl'
        });

    }])

    .controller('ShopsCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
        $AppFunc.registerScope('shop_shops', $scope);
        $AppFunc.activeMenuLv1('shop');
        $AppFunc.setMenuLv2('shop/menu.html?_v=1');
        $AppFunc.activeMenuLv2('shops');

        $http({
            method: "POST",
            url: "shop/shops",
            data: {
                'page': 1
            }
        }).success(function (data, status) {
            if (data.errcode == 0) {
                $scope.tableData = data.shops.data;
            } else {
                alert(data.errmsg);
            }
        }).error(function (data, status) {
        });

    }]).controller('DetailCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
        $AppFunc.registerScope('shop_detail', $scope);
        $AppFunc.activeMenuLv1('shop');
        $AppFunc.setMenuLv2('shop/menu.html');
        $AppFunc.activeMenuLv2('shops');

        $scope.shopid = $routeParams.id;
    }]).controller('AddCtrl', ['$scope', '$http', function ($scope, $http) {
        $AppFunc.registerScope('shop_add', $scope);
        $AppFunc.activeMenuLv1('shop');
        $AppFunc.setMenuLv2('shop/menu.html');
        $AppFunc.activeMenuLv2('shops');

    }]);
