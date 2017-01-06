'use strict';

var shopApp = angular.module('myApp.shop', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        /**
         * 一级菜单对象
         * @param active 模块名称
         * @param router 路由地址
         * @param title 模块标题
         * @returns {{active: *, router: *}}
         * @constructor
         */
        var menuLv1 = $AppObj.MenuLv1('shop', '#!/shop', '商户账户管理');
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
        }).when('/shop/changeShopData',{
            templateUrl:'shop/shopchangedata.html',
            controller:'ChangeCtrl'
        });

    }])
    .controller('ShopsCtrl', ['$scope','$rootScope','$location', '$http', '$routeParams', function ($scope,$rootScope,$location,$http, $routeParams) {

        //注册shop_shops
        $AppFunc.registerScope('shop_shops', $scope);
        $AppFunc.activeMenuLv1('shop');
        $AppFunc.setMenuLv2('shop/menu.html?_v=1');
        $AppFunc.activeMenuLv2('shops');

        //请求数据
        $scope.shopId = null
        $scope.shopName = null
        $scope.itemClassFilter = {"name":"全部","baseRate":"0"}
        $scope.itemStateFilter = {"canUseState":"全部","status":"0"}
        // 获取行业列表数据
        // $http({
        //     method: "POST",
        //     url: "",
        //     data: {
        //     }
        // }).success(function (data, status) {
        //     if (data.errcode == 0) {
        //         $scope.industries = data.shopIndustries;
        //     } else {
        //         alert(data.errmsg);
        //     }
        // }).error(function (data, status) {
        // });
        $scope.industries = [
            {"name":"全部","baseRate":"0"},
            {"name":"餐饮组","baseRate":"1"},
            {"name":"娱乐组","baseRate":"2"},
            {"name":"电商组","baseRate":"3"}
        ];
        $rootScope.industries = $scope.industries;
        $scope.shopCanUseStates = [
            {"canUseState":"全部","status":"0"},
            {"canUseState":"可用","status":"1"},
            {"canUseState":"锁定","status":"2"},
            {"canUseState":"停用","status":"3"}
        ];
        // 获取列表数据
        // $http({
        //     method: "POST",
        //     url: "shop/shops",
        //     data: {
        //         'page': $scope.page
        //     }
        // }).success(function (data, status) {
        //     if (data.errcode == 0) {
        //         $scope.tableData = data.shops.data;
        //         $scope.page = $scope.page + 1;
        //     } else {
        //         alert(data.errmsg);
        //     }
        // }).error(function (data, status) {
        // });
        $scope.tableData = [
            {"shopId":"10002560","shopName":"海底捞","location":"天河广场","industry":"餐饮组","shopManagerName":"张三丰","commission":"2083003","status":"0"},
            {"shopId":"10002561","shopName":"海底捞","location":"天河广场","industry":"餐饮组","shopManagerName":"张三丰","commission":"2083003","status":"1"},
            {"shopId":"10002562","shopName":"海底捞","location":"天河广场","industry":"餐饮组","shopManagerName":"张三丰","commission":"2083003","status":"2"},
        ]

        $scope.page = 1
        $scope.hasNext = 1
        $scope.searchBtnClick = function () {
            alert($scope.shopId + $scope.shopName + $scope.itemClassFilter.baseRate + $scope.itemStateFilter.status)
            // 点击搜索
            // $http({
            //     method: "POST",
            //     url: "",
            //     data: {
            //         "page":$scope.page,
            //         "shopId": $scope.shopId,
            //         "shopName"  : $scope.shopName,
            //         "itemClassFilter": $scope.itemClassFilter.baseRate,
            //         "status": $scope.itemStateFilter.status,
            //     }
            // }).success(function (data, status) {
            //     if (data.errcode == 0) {
            //     } else {
            //         alert(data.errmsg);
            //     }
            // }).error(function (data, status) {
            // });
        }
        $scope.jumpToForwardPage = function () {
            if($scope.page == 1) {
                alert("已经是第一页")
            }else {
                // 获取列表数据
                // $http({
                //     method: "POST",
                //     url: "shop/shops",
                //     data: {
                //         'page': $scope.page
                //     }
                // }).success(function (data, status) {
                //     if (data.errcode == 0) {
                //         $scope.tableData = data.shops.data;
                //         $scope.page = $scope.page -1;
                //     } else {
                //         alert(data.errmsg);
                //     }
                // }).error(function (data, status) {
                // });
            }
        }
        $scope.jumpToNextPage = function () {
            alert("已经是最后一页")
            if($scope.hasNext == 0){
                alert("已经是最后一页")
            }else {
                // 获取列表数据
                // $http({
                //     method: "POST",
                //     url: "shop/shops",
                //     data: {
                //         'page': $scope.page
                //     }
                // }).success(function (data, status) {
                //     if (data.errcode == 0) {
                //         $scope.tableData = data.shops.data;
                //         $scope.page = $scope.page + 1;
                //     } else {
                //         alert(data.errmsg);
                //     }
                // }).error(function (data, status) {
                // });
            }
        }



        $scope.destroyShopId = null
        $scope.destroyShopName = null
        $scope.shopItemDestroiedBtnClick = function (model) {
            $scope.destroyShopId = model[0]
            $scope.destroyShopName = model[1]

            $('#destroyShopModal').modal('show')
        }

        $scope.destroyShopBtnClick = function () {
            $('#destroyShopModal').modal('hide')
        }
        $scope.destroyShopConformBtnClick = function () {
            $('#destroyShopConformModal').modal('hide')
            $('#destroyShopSuccessModal').modal('show')

            for(var i = 0;i<$scope.tableData.length;i++){
                if($scope.tableData[i].shopId == $scope.destroyShopId){
                    $scope.tableData[i].status = 1
                }
            }

            setTimeout(function () {

                $('#destroyShopSuccessModal').modal('hide')
            },1000)

            // $http({
            //     method: "POST",
            //     url: "",
            //     data: {
            //         'shopId': $scope.shopId,
            //         'status': '1',
            //     }
            // }).success(function (data, status) {
            //     if (data.errcode == 0) {
            //     } else {
            //         alert(data.errmsg);
            //     }
            // }).error(function (data, status) {
            // });
        }


    }])
    .controller('DetailCtrl', ['$scope','$rootScope', '$http', '$routeParams', function ($scope,$rootScope, $http, $routeParams) {
        $AppFunc.registerScope('shop_detail', $scope);
        $AppFunc.activeMenuLv1('shop');
        $AppFunc.setMenuLv2('shop/menu.html');
        $AppFunc.activeMenuLv2('shops');

        $scope.shopId = $routeParams.id;
        // 获取列表数据
        // $http({
        //     method: "POST",
        //     url: "shop/shops",
        //     data: {
        //         'shopId': $scope.shopId
        //     }
        // }).success(function (data, status) {
        //     if (data.errcode == 0) {
        //          $scope.shop = data.shop
        //          $scope.shopAdmin = data.shopAdmin
        //          $scope.shopCashiers = data.shopCashiers
        //          $scope.deviceTerminals = data.deviceTerminals
        //     } else {
        //         alert(data.errmsg);
        //     }
        // }).error(function (data, status) {
        // });
        $scope.shop = {
            "brand": "hi百货",
            "commissionChargeRate": 1,
            "industry": "百货",
            "integralInRate": 0,
            "integralOutRate": 1,
            "isApproval": 1,
            "isJoinMobilePay": 1,
            "location": "天河路正佳广场A123",
            "mallName": "正佳广场",
            "mobilePayShopId": 2,
            "shopId": 1,
            "shopManagerMobile": "13268112212",
            "shopManagerName": "AOLIU",
            "shopName": "hi百货",
            "status": 1
        }
        $rootScope.shop = $scope.shop;
        if($scope.shop.status == 0){
            $scope.shopDetailStatus = "正常"
        }else if($scope.shop.status == 1){
            $scope.shopDetailStatus = "冻结"
        }else {
            $scope.shopDetailStatus = "禁用"
        }
        $scope.shopAdmin = {
            "code": "dtnZiS0rAyZ2ev8lXIn0uvMyobqbPcBR",
            "contact": "13268112212",
            "createTime": 1481619780526,
            "expireIn": 1482355048294,
            "lastLoginTime": 1482283048294,
            "password": "123456",
            "shopId": 1,
            "token": "D398D1909301FDACB2C030D39EE8D8FB518D40EE",
            "username": "13268112212"
        }
        $scope.shopCashiers = [
            {
                "code": "0Rd822NTLw6PRdOeO8xyCIeHxuN56W4y",
                "expireIn": 1482354565510,
                "lastLoginTime": 1482282565510,
                "creatTime":1482282565510,
                "mobile": "13268112212",
                "pass": "123456",
                "realname": "lll",
                "shopId": 1,
                "status": 0,
                "token": "7CA54B70F0319180FD82B9EEE7CB1F8A6E7683FD"
            },
            {
                "code": "0Rd822NTLw6PRdOeO8xyCIeHxuN56W4y",
                "expireIn": 1482354565510,
                "lastLoginTime": 1482282565510,
                "creatTime":1482282565510,
                "mobile": "13268112212",
                "pass": "123456",
                "realname": "www",
                "shopId": 1,
                "status": 0,
                "token": "7CA54B70F0319180FD82B9EEE7CB1F8A6E7683FD"
            }
        ]
        $scope.deviceTerminals = [
            {
                "createTime": 1483004699108,
                "mallName": "正佳",
                "modelNo": "Device1",
                "shopId": 1,
                "status": 0,
                "terminalId": 1,
                "terminalSN": "addDeviceCase1"
            } ]
        $scope.shopName = $scope.shop.shopName;


        //修改商户状态
        $scope.virtualStatus = $scope.shop.status;
        $scope.changeStatusReason = null;
        $scope.changeStatusAbilityCode = null
        $scope.startUsingBtnClick = function () {
            $scope.virtualStatus = 0;
        }
        $scope.freezeUsingBtnClick = function () {
            $scope.virtualStatus = 1;
        }
        $scope.forbidUsingBtnClick = function () {
            $scope.virtualStatus = 2;
        }
        $scope.changeShopStatusConformBtnClick = function () {

            $scope.shop.status = $scope.virtualStatus;
            if($scope.shop.status == 0){
                $scope.shopDetailStatus = "正常"
            }else if($scope.shop.status == 1){
                $scope.shopDetailStatus = "冻结"
            }else {
                $scope.shopDetailStatus = "禁用"
            }
            $('#changeShopStatusModal').modal('hide')

            // $http({
            //     method: "POST",
            //     url: "",
            //     data: {
            //         'shopId': $scope.shopId,
            //         'status': $scope.shop.status,
            //         'changeStatusReason':$scope.changeStatusReason,
            //         'changeStatusAbilityCode':$scope.changeStatusAbilityCode,
            //     }
            // }).success(function (data, status) {
            //     if (data.errcode == 0) {
            //     } else {
            //         alert(data.errmsg);
            //     }
            // }).error(function (data, status) {
            // });
        }


        //删除该商户
        $scope.destroyShopReason = null;
        $scope.destroyShopAbilityCode = null;
        $scope.destroyShopBtnClick = function () {
            $('#destroyShopModal').modal('hide')
        }
        $scope.destroyShopConformBtnClick = function () {
            $('#destroyShopConformModal').modal('hide')
            $('#destroyShopSuccessModal').modal('show')
            // $('#destroyShopFailModal').modal('show')
            $scope.shop.status = 1;
            if($scope.shop.status == 0){
                $scope.shopDetailStatus = "正常"
            }else if($scope.shop.status == 1){
                $scope.shopDetailStatus = "冻结"
            }else {
                $scope.shopDetailStatus = "禁用"
            }

            setTimeout(function () {

                $('#destroyShopSuccessModal').modal('hide')
                // $('#destroyShopFailModal').modal('hide')
            },1000)

            // $http({
            //     method: "POST",
            //     url: "",
            //     data: {
            //         'shopId': $scope.shopId,
            //         'status': '1',
            //     }
            // }).success(function (data, status) {
            //     if (data.errcode == 0) {
            //     } else {
            //         alert(data.errmsg);
            //     }
            // }).error(function (data, status) {
            // });
        }


        //添加管理员
        $scope.addManagerName = null;
        $scope.addManagerPwd = null;
        $scope.addManagerConformBtnClick = function () {
            $('#addShopManagerModal').modal('hide')
            $('#addShopManagerSuccessModal').modal('show')
            setTimeout(function () {
                $('#addShopManagerSuccessModal').modal('hide')
            },1000)
            // $http({
            //     method: "POST",
            //     url: "",
            //     data: {
            //         'addManagerName': $scope.addManagerName,
            //         'addManagerPwd': $scope.addManagerPwd,
            //          'shopId':$scope.shopId
            //     }
            // }).success(function (data, status) {
            //     if (data.errcode == 0) {
            //     } else {
            //         alert(data.errmsg);
            //     }
            // }).error(function (data, status) {
            // });
            $scope.addManagerName = null;
            $scope.addManagerPwd = null;
        }

        //修改管理员信息
        $scope.changeManagerItemInfo = function (itemModel) {
            $scope.addManagerName = itemModel[0];
            $scope.addManagerPwd = itemModel[1];
            $('#addShopManagerModal').modal('show')
        }



        $scope.deleteManagerName = null;
        $scope.deleteManagerPwd = null;
        //删除管理员
        $scope.deleteManagerItemInfo = function (itemModel) {
            $scope.deleteManagerName = itemModel[0];
            $scope.deleteManagerPwd = itemModel[1];
            $('#deleteShopManagerModal').modal('show')
        }

        //确认删除
        $scope.deleteShopManagerConformBtnClick = function () {

            $('#deleteShopManagerModal').modal('hide')
            $('#deleteShopManagerSuccessModal').modal('show')
            setTimeout(function () {
                $('#deleteShopManagerSuccessModal').modal('hide')
            },1000)
            // $http({
            //     method: "POST",
            //     url: "",
            //     data: {
            //         'addManagerName': $scope.addManagerName,
            //         'addManagerPwd': $scope.addManagerPwd,
            //          'shopId':$scope.shopId
            //     }
            // }).success(function (data, status) {
            //     if (data.errcode == 0) {
            //     } else {
            //         alert(data.errmsg);
            //     }
            // }).error(function (data, status) {
            // });
            $scope.deleteManagerName = null;
            $scope.deleteManagerPwd = null;
        }


        }])
    .controller('AddCtrl', ['$scope','$rootScope', '$http', function ($scope,$rootScope, $http) {
        $AppFunc.registerScope('shop_add', $scope);
        $AppFunc.activeMenuLv1('shop');
        $AppFunc.setMenuLv2('shop/menu.html');
        $AppFunc.activeMenuLv2('shops');

        $scope.itemClassFilter = {"name":"全部","baseRate":"0"}
        $scope.shopName = ""
        $scope.shopLocation = ""
        $scope.companyName = ""
        $scope.brandName = ""
        $scope.shopManagerName = ""
        $scope.shopManagerIdcardno = ""
        $scope.managerPhoneNum = ""
        $scope.checkboxChecked = true

        $scope.addShopConformBtnClick = function () {

            if ($scope.checkboxChecked == true){
                // 添加商户接口
                // $http({
                //     method: "POST",
                //     url: "",
                //     data: {
                //         brand :  $scope.brandName,
                //         mallName:$scope.companyName,
                //         location:$scope.location,
                //         shopName:$scope.shopName,
                //         industry:$scope.itemClassFilter.baseRate,
                //         shopManagerName:$scope.shopManagerName,
                //         shopManagerIdcardno:$scope.shopManagerIdcardno,
                //         shopManagerMobile:$scope.shopManagerMobile
                //     }
                // }).success(function (data, status) {
                //     if (data.errcode == 0) {
                //     } else {
                //         alert(data.errmsg);
                //     }
                // }).error(function (data, status) {
                // });
            }else {
                alert("必须同意×××协议")
            }

        }

    }])
    .controller('ChangeCtrl',['$scope','$rootScope','$http', function ($scope,$rootScope, $http) {

        $AppFunc.registerScope('shop_change', $scope);
        $AppFunc.activeMenuLv1('shop');
        $AppFunc.setMenuLv2('shop/menu.html');
        $AppFunc.activeMenuLv2('shops');

        $scope.industries = $rootScope.industries;

        $scope.itemClassFilter = $rootScope.shop.industry
        $scope.shopName = $rootScope.shop.shopName
        $scope.shopId = $rootScope.shop.shopId
        $scope.shopLocation = $rootScope.shop.location
        $scope.companyName = $rootScope.shop.mallName
        $scope.brandName = $rootScope.shop.brand
        $scope.shopManagerName = $rootScope.shop.shopManagerName
        $scope.shopManagerIdcardno = $rootScope.shop.shopManagerMobile
        $scope.managerPhoneNum = $rootScope.shop.shopManagerMobile
        $scope.checkboxChecked = true


        $scope.changeShopConformBtnClick = function () {

            if ($scope.checkboxChecked == true) {
                // 修改商户接口
                // $http({
                //     method: "POST",
                //     url: "",
                //     data: {
                //         shopId:  $scope.shopId
                //         brand :  $scope.brandName,
                //         mallName:$scope.companyName,
                //         location:$scope.location,
                //         shopName:$scope.shopName,
                //         industry:$scope.itemClassFilter,
                //         shopManagerName:$scope.shopManagerName,
                //         shopManagerIdcardno:$scope.shopManagerIdcardno,
                //         shopManagerMobile:$scope.shopManagerMobile
                //     }
                // }).success(function (data, status) {
                //     if (data.errcode == 0) {
                //     } else {
                //         alert(data.errmsg);
                //     }
                // }).error(function (data, status) {
                // });
            } else {
                alert("必须同意×××协议")
            }
        }
    }]);




shopApp.service('dataFormat', function() {
    this.myFunc = function (x) {

        var creatInterval =  x;
        var date = new Date(creatInterval);

        return  date.format("yyyy年MM月dd日 hh:mm:ss")//创建时间
    }
});
shopApp.filter('myDateFormat',['dataFormat', function(dataFormat) {
    return function(x) {
        return dataFormat.myFunc(x);
    };
}]);
//时间格式化,调用示例new
//     Date(startTime).format("yyyy-MM-dd")
//startTime为时间戳
Date.prototype.format = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}