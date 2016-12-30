'use strict';

angular.module('myApp.view2', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        var menuLv1 = $AppObj.MenuLv1('view2', '#!/view2', 'view2');
        $AppData._menuLv1List.push(menuLv1);

        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
        });
    }])

    .controller('View2Ctrl', ['$scope', function ($scope) {
        $AppFunc.registerScope('view2_view2', $scope);
        $AppFunc.activeMenuLv1('view2');
        $AppFunc.setMenuLv2('table/menu.html');
        $AppFunc.activeMenuLv2('table1');
    }]);