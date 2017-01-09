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
    .controller('ShopsCtrl', ['$scope', '$http', '$routeParams', function ($scope,$http, $routeParams) {

        //注册shop_shops
        $AppFunc.registerScope('shop_shops', $scope);
        $AppFunc.activeMenuLv1('shop');
        $AppFunc.setMenuLv2('shop/menu.html?_v=1');
        $AppFunc.activeMenuLv2('shops');


        //一.请求本页数据
        //1.1这个是网络获取的分组
        // 获取行业分组
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
        $scope.industries = ["餐饮组", "娱乐组", "电商组",];
        //这个是本地添加全部以后的分组
        $scope.shopIndustries = ["全部", "餐饮组", "娱乐组", "电商组"];

        //1.2网络获取所有的状态
        // 获取所有的状态
        // $http({
        //     method: "POST",
        //     url: "",
        //     data: {
        //     }
        // }).success(function (data, status) {
        //     if (data.errcode == 0) {
        //         $scope.shopCanUseStates = data.shopCanUseStates;
        //     } else {
        //         alert(data.errmsg);
        //     }
        // }).error(function (data, status) {
        // });
        $scope.shopCanUseStates = [
            {"canUseState":"全部","status":"0"},
            {"canUseState":"可用","status":"1"},
            {"canUseState":"锁定","status":"2"},
            {"canUseState":"停用","status":"3"}
        ];

        //1.3网络获取列表内容
        // 获取列表数据
        // $http({
        //     method: "POST",
        //     url: "",
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
            {"shopId":"10002560","shopName":"海底捞1","location":"天河广场1","industry":"餐饮组","shopManagerName":"张三丰","commission":"2083003","status":"0"},
            {"shopId":"10002561","shopName":"海底捞2","location":"天河广场2","industry":"娱乐组","shopManagerName":"张三丰","commission":"2083003","status":"1"},
            {"shopId":"10002562","shopName":"海底捞3","location":"天河广场3","industry":"电商组","shopManagerName":"张三丰","commission":"2083003","status":"2"},
        ]


        //二.搜索
        //2.1搜索模型
        $scope.searchShopItem = {
            "shopId":"",
            "shopName":"",
            "industry":"",
            "status":""
        }
        //2.2发送请求
        $scope.page = 1
        $scope.hasNext = 1
        $scope.searchBtnClick = function () {
            alert($scope.searchShopItem.shopId + $scope.searchShopItem.shopName + $scope.searchShopItem.industry + $scope.searchShopItem.status)
            // 点击搜索
            // $http({
            //     method: "POST",
            //     url: "",
            //     data: {
            //         "page":$scope.page,
            //         "shopId": $scope.searchShopItem.shopId,
            //         "shopName"  : $scope.searchShopItem.shopName,
            //         "industry": $scope.searchShopItem.industry,
            //         "status": $scope.searchShopItem.status,
            //     }
            // }).success(function (data, status) {
            //     if (data.errcode == 0) {
            //          $scope.hasNext = data.hasNext
            //     } else {
            //         alert(data.errmsg);
            //     }
            // }).error(function (data, status) {
            // });
        }
        //2.3上一页
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
        //2.4下一页
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

        //三.注销
        $scope.destroyShopItem = {
            "shopId":"",
            "shopName":"",
        }
        $scope.shopItemDestroiedBtnClick = function (model) {
            $scope.destroyShopItem.shopId = model[0]
            $scope.destroyShopItem.shopName = model[1]
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
    .controller('DetailCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
        $AppFunc.registerScope('shop_detail', $scope);
        $AppFunc.activeMenuLv1('shop');
        $AppFunc.setMenuLv2('shop/menu.html');
        $AppFunc.activeMenuLv2('shops');


        //一.获取商户具体信息
        //从列表页获取shopId,发送请求,获取具体商户具体信息
        $scope.shopId = $routeParams.id;

        // 获取商户数据
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
            "industry": "电商组",
            "integralInRate": 0,
            "integralOutRate": 1,
            "isApproval": 1,
            "isJoinMobilePay": 1,
            "location": "天河路正佳广场A123",
            "mallName": "正佳广场",
            "mobilePayShopId": 2,
            "shopId": 10002561,
            "shopManagerMobile": "13268112212",
            "shopManagerName": "AOLIU",
            "shopManagerIdcardno":"1304261990000000",
            "companyName":"hi百货有限责任公司",
            "shopName": "hi百货",
            "status": 1
        }
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


        //二.修改商户状态
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


        //三.删除该商户
        $scope.destroyShopSubmitItem = {
            "destroyShopReason":"",
            "destroyShopAbilityCode":""
        }
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

        //四.添加管理员
        $scope.addManagerSubmitItem = {
            "addManagerName":"",
            "addManagerPwd":""
        }
        //修改管理员信息
        $scope.changeManagerSubmitItem = {
            "changeManagerName":"",
            "changeManagerPwd":""
        }
        //以后添加管理员后返回的错误信息来显示提示
        $scope.addShopManagerTipHide = true
        $scope.changeManagerItemInfo = function (itemModel) {
            $scope.changeManagerSubmitItem.changeManagerName = itemModel[0];
            $scope.changeManagerSubmitItem.changeManagerPwd = itemModel[1];

            $('#changeShopManagerModal').modal('show')
        }
        //确认按钮点击
        $scope.addOrChangeManagerConformBtnClick = function (managerInfo) {

            //根据是添加还是修改发送不同的网络请求
            if(managerInfo == "addManager"){

                $('#addShopManagerModal').modal('hide')
                $('#addShopManagerSuccessModal').modal('show')
                setTimeout(function () {
                    $('#addShopManagerSuccessModal').modal('hide')
                },1000)

                // $http({
                //     method: "POST",
                //     url: "",
                //     data: {
                //         'addManagerName': $scope.addManagerSubmitItem.addManagerName,
                //         'addManagerPwd': $scope.addManagerSubmitItem.addManagerPwd,
                //          'shopId':$scope.shopId
                //     }
                // }).success(function (data, status) {
                //     if (data.errcode == 0) {
                //     } else {
                //         alert(data.errmsg);
                //     }
                // }).error(function (data, status) {
                // });

                $scope.addManagerSubmitItem.addManagerName = null;
                $scope.addManagerSubmitItem.addManagerPwd = null;

            }else if(managerInfo == "changeManager"){

                $('#changeShopManagerModal').modal('hide')
                $('#addShopManagerSuccessModal').modal('show')
                setTimeout(function () {
                    $('#addShopManagerSuccessModal').modal('hide')
                },1000)
                // $http({
                //     method: "POST",
                //     url: "",
                //     data: {
                //         'changeManagerName': $scope.changeManagerSubmitItem.changeManagerName,
                //         'changeManagerPwd': $scope.changeManagerSubmitItem.changeManagerPwd,
                //          'shopId':$scope.shopId
                //     }
                // }).success(function (data, status) {
                //     if (data.errcode == 0) {
                //     } else {
                //         alert(data.errmsg);
                //     }
                // }).error(function (data, status) {
                // });

                $scope.changeManagerSubmitItem.changeManagerName = null
                $scope.changeManagerSubmitItem.changeManagerPwd = null
            }

        }


        //五.删除管理员
        $scope.deleteManagerName = null;
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
            //         'deleteManagerName': $scope.deleteManagerName,
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
        }


        }])
    .controller('AddCtrl', ['$scope','$location', '$http', function ($scope,$location, $http) {
        $AppFunc.registerScope('shop_add', $scope);
        $AppFunc.activeMenuLv1('shop');
        $AppFunc.setMenuLv2('shop/menu.html');
        $AppFunc.activeMenuLv2('shops');

        //一.获取商品列表页的scope
        var shopPageScope = $AppFunc.getScope("shop_shops")
        //获取所属类别(在列表页已经从网络获取)
        $scope.addindustries = shopPageScope.industries

        //二.创建一个要添加的商品对象
        $scope.shopDetailInfo = {
            "shopName": "",
            "location": "",
            "companyName":"",
            "industry": "",
            "brand": "",
            "shopManagerName": "",
            "shopManagerIdcardno":"",
            "shopManagerMobile": "",
        }
        $scope.checkboxChecked = true

        //点击确认添加商户账户,发送网络请求
        $scope.addShopConformBtnClick = function () {

            if ($scope.checkboxChecked == true){

                // $('#addShopSuccessModal').modal('show')
                // setTimeout(function () {
                //     $('#addShopSuccessModal').modal('hide')
                //
                // },1000)

                alert("添加成功")
                //回到详情页面
                $location.path('#!/shop/shops')

                // 添加商户接口
                // $http({
                //     method: "POST",
                //     url: "",
                //     data: {
                //         shopName : $scope.shopDetailInfo.shopName,
                //         location:$scope.shopDetailInfo.location,
                //         companyName:$scope.shopDetailInfo.companyName,
                //          brand:$scope.shopDetailInfo.brand
                //         industry:$scope.shopDetailInfo.industry,
                //         shopManagerName:$scope.shopDetailInfo.shopManagerName,
                //         shopManagerIdcardno:$scope.shopDetailInfo.shopManagerIdcardno,
                //         shopManagerMobile:$scope.shopDetailInfo.shopManagerMobile
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
    .controller('ChangeCtrl',['$scope','$location','$http', function ($scope,$location, $http) {

        $AppFunc.registerScope('shop_change', $scope);
        $AppFunc.activeMenuLv1('shop');
        $AppFunc.setMenuLv2('shop/menu.html');
        $AppFunc.activeMenuLv2('shops');

        //一.获取商户列表页的scope
        var shopListPageScope = $AppFunc.getScope("shop_shops")
        //获取所属类别(在列表页已经从网络获取)
        $scope.changeindustries = shopListPageScope.industries

        //二.获取商户详情页的scope
        var shopDetailPageScope = $AppFunc.getScope("shop_detail")
        //获取当前商户资料
        $scope.shopDetailInfo = shopDetailPageScope.shop

        //默认勾选遵守选中协议
        $scope.checkboxChecked = true

        //三.确认修改按钮点击发送请求
        $scope.changeShopConformBtnClick = function () {

            if ($scope.checkboxChecked == true) {

                // $('#addShopSuccessModal').modal('show')
                // setTimeout(function () {
                //     $('#addShopSuccessModal').modal('hide')
                //
                // },1000)

                alert("修改成功")
                //回到详情页面
                // alert('#!/shop/detail/'+$scope.shopDetailInfo.shopId)
                // $location.path('#!/shop/detail/'+$scope.shopDetailInfo.shopId)

                // 修改商户接口
                // $http({
                //     method: "POST",
                //     url: "",
                //     data: {
                //         shopId:  $scope.shopDetailInfo.shopId
                //         brand :  $scope.shopDetailInfo.brand,
                //         mallName:$scope.shopDetailInfo.mallName,
                //         location:$scope.shopDetailInfo.location,
                //         shopName:$scope.shopDetailInfo.shopName,
                //         industry:$scope.shopDetailInfo.industry,
                //         shopManagerName:$scope.shopDetailInfo.shopManagerName,
                //         shopManagerIdcardno:$scope.shopDetailInfo.shopManagerIdcardno,
                //         shopManagerMobile:$scope.shopDetailInfo.shopManagerMobile
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



//时间格式化服务
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