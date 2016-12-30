'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        var menuLv1 = $AppObj.MenuLv1('view1', '#!/view1', 'view1页面');
        $AppData._menuLv1List.push(menuLv1);

        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope',function ($scope) {
        $AppFunc.registerScope('view1_view1', $scope);
        $AppFunc.activeMenuLv1('view1');
        $AppFunc.setMenuLv2('table/menu.html');
        $AppFunc.activeMenuLv2('table1');
    }]);