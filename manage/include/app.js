'use strict';

angular.module('myApp', FuncPermissions)

    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.otherwise({redirectTo: '/shop'});
    }])

    .controller('AppCtrl', ['$scope', function ($scope) {
        $AppFunc.registerScope('App', $scope);
        $scope._menuLv1List = $AppData._menuLv1List;
    } ]);
