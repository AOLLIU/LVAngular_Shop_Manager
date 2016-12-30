'use strict';

angular.module('myApp.table', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        var menuLv1 = $AppObj.MenuLv1('table', '#!/table', 'Table页面');
        $AppData._menuLv1List.push(menuLv1);

        $routeProvider.when('/table', {
            templateUrl: 'table/table.html',
            controller: 'TableCtrl'
        }).when('/table/table', {
            templateUrl: 'table/table.html',
            controller: 'TableCtrl'
        }).when('/table/table2', {
            templateUrl: 'table/table2.html',
            controller: 'Table2Ctrl'
        });
    }])

    .controller('TableCtrl', ['$scope', function ($scope) {
        $AppFunc.registerScope('table_table', $scope);
        $AppFunc.activeMenuLv1('table');
        $AppFunc.setMenuLv2('table/menu.html');
        $AppFunc.activeMenuLv2('table1');

        $scope.tableData = [
            {d1: 'd1', d2: 'd2', d3: 'd3'},
            {d1: 'd1', d2: 'd2', d3: 'd3'},
            {d1: 'd1', d2: 'd2', d3: 'd3'}
        ]

    }]).controller('Table2Ctrl', ['$scope', function ($scope) {
        $AppFunc.registerScope('table_table2', $scope);
        $AppFunc.activeMenuLv1('table');
        $AppFunc.setMenuLv2('table/menu.html');
        $AppFunc.activeMenuLv2('table2');
    }]);

