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
    .controller('ShopsCtrl', ['$scope','$location', '$http', '$routeParams', function ($scope,$location,$http, $routeParams) {

        //注册shop_shops
        $AppFunc.registerScope('shop_shops', $scope);
        $AppFunc.activeMenuLv1('shop');
        $AppFunc.setMenuLv2('shop/menu.html?_v=1');
        $AppFunc.activeMenuLv2('shops');

        //提醒
        $scope.tipMessage = ""
        //提示
        function alertTipMessage(tipMessage) {
            $scope.tipMessage = tipMessage
            $('#tipMessageModal').modal('show')
            setTimeout(function () {
                $('#tipMessageModal').modal('hide')
            },1000)
        }

        //一.请求本页数据
        //1.1这个是网络获取的分组
        $scope.shopIndustries = [{
            "baseRate": 0,
            "name": "全部"
        }];
        $scope.industries = [];
        function getIndustries() {
            $http({
                method: "POST",
                url: "http://www.joosure.com:18081/shopmanage/manage/shop/industries",
                data: {
                }
            }).success(function (data, status) {
                if (data.errcode == 0) {
                    $scope.industries = data.shopIndustries;
                    $scope.shopIndustries = $scope.shopIndustries.concat($scope.industries);
                } else {
                    alertTipMessage(data.errmsg)
                }
            }).error(function (data, status) {
                alertTipMessage("请求出错了!")
            });
        }
        getIndustries()


        //1.2网络获取所有的状态
        $scope.shopCanUseStates = [
            {"canUseState":"全部","status":0},
            {"canUseState":"启用","status":1},
            {"canUseState":"锁定","status":2},
            {"canUseState":"已注销","status":3}
        ];

        //1.3网络获取列表内容
        $scope.page = 1;
        $scope.hasNext = 0;
        $scope.searchShopItem = {
            "shopId":"",
            "shopName":"",
            "status":{
                "canUseState":"全部",
                "status":0,
            },
            "industry":{
                "baseRate": 0,
                "name": "全部",
            },
        }
        //网络请求
        function requestTableData(page,searchShopItem) {
            $http({
                method: "POST",
                url: "http://www.joosure.com:18081/shopmanage/manage/shop/shops",
                data: {
                    "page":page,
                    "shopId": searchShopItem.shopId,
                    "shopName": searchShopItem.shopName,
                    "industry": (searchShopItem.industry.name == "全部")? "" : searchShopItem.industry.name,
                    "status": searchShopItem.status.status,
                }
            }).success(function (data, status) {
                if (data.errcode == 0) {

                    if(data.shops.data.length == 0){
                        alertTipMessage("暂时没有搜索数据,请重新搜索!")
                        $('#bodyContainerFooter').hide()
                    }else {
                        $('#bodyContainerFooter').show()
                        $scope.tableData = data.shops.data;
                    }
                    $scope.page = data.shops.page;
                    $scope.hasNext = data.shops.hasNext;
                } else {
                    $('#bodyContainerFooter').hide()
                    alertTipMessage(data.errmsg)
                }
            }).error(function (data, status) {
                $('#bodyContainerFooter').hide()
                alertTipMessage("请求出错了!")
            });
        }
        requestTableData(1,$scope.searchShopItem)


        //二.搜索
        //2.1搜索模型
        $scope.searchBtnClick = function () {
            requestTableData(1,$scope.searchShopItem)
        }

        //2.2上一页
        $scope.jumpToForwardPage = function () {
            if($scope.page == 1) {
                alertTipMessage("已经是第一页!")
            }else {
                $scope.page = $scope.page -1;
                requestTableData($scope.page,$scope.searchShopItem)
            }
        }
        //2.3下一页
        $scope.jumpToNextPage = function () {
            if($scope.hasNext == 0){
                alertTipMessage("已经是最后一页!")
            }else {
                $scope.page = $scope.page + 1;
                requestTableData($scope.page,$scope.searchShopItem)
            }
        }


        //三.注销
        $scope.destroyShopItem = {
            "shopId":0,
            "shopName":"",
        }
        $scope.destroyShopSubmitItem = {
            "destroyShopReason":"",
            "destroyShopAbilityCode":""
        }
        $scope.shopItemDestroiedBtnClick = function (model) {
            $scope.destroyShopItem.status = model.status
            $scope.destroyShopItem.shopId = model.shopId
            $scope.destroyShopItem.shopName = model.shopName
            if(model.status == 3){
                alertTipMessage("该商户已被注销,无需重复操作!")
            }else {
                $('#destroyShopModal').modal('show')
            }
        }
        $scope.destroyShopBtnClick = function () {
            $('#destroyShopModal').modal('hide')
        }
        $scope.destroyShopConformBtnClick = function () {

            $('#destroyShopConformModal').modal('hide')
            $http({
                method: "POST",
                url: "http://www.joosure.com:18081/shopmanage/manage/shop/changeShopStatus",
                data: {
                    'shopId': parseInt($scope.destroyShopItem.shopId),
                    'status': 3,
                    'destroyShopReason':$scope.destroyShopSubmitItem.destroyShopReason,
                    'destroyShopAbilityCode':$scope.destroyShopSubmitItem.destroyShopAbilityCode
                }
            }).success(function (data, status) {
                if (data.errcode == 0) {
                    alertTipMessage("注销成功!")
                    $location.path('#!/shop/shops')
                } else {
                    alertTipMessage(data.errmsg)
                }
            }).error(function (data, status) {
                alertTipMessage("请求出错了!")
            });
        }

    }])
    .controller('DetailCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {

        $AppFunc.registerScope('shop_detail', $scope);
        $AppFunc.activeMenuLv1('shop');
        $AppFunc.setMenuLv2('shop/menu.html');
        $AppFunc.activeMenuLv2('shops');

        //提醒
        $scope.tipMessage = ""
        //提示
        function alertTipMessage(tipMessage) {
            $scope.tipMessage = tipMessage
            $('#tipMessageModal').modal('show')
            setTimeout(function () {
                $('#tipMessageModal').modal('hide')
            },1000)
        }

        //一.获取商户具体信息
        //从列表页获取shopId,发送请求,获取具体商户具体信息
        $scope.shopId = $routeParams.id;
        // 获取商户数据
        function getShopDetailInfo() {
            $http({
                method: "POST",
                url: "http://www.joosure.com:18081/shopmanage/manage/shop/shop",
                data: {
                    'shopId': parseInt($scope.shopId)
                }
            }).success(function (data, status) {
                if (data.errcode == 0) {
                    $scope.shop = data.shop
                    if($scope.shop.status == 1){
                        $scope.shopDetailStatus = "正常"
                    }else if($scope.shop.status == 2){
                        $scope.shopDetailStatus = "冻结"
                    }else {
                        $scope.shopDetailStatus = "禁用"
                    }
                    $scope.shopAdmin = data.shopAdmin
                    $scope.shopCashiers = data.shopCashiers
                    $scope.deviceTerminals = data.deviceTerminals
                    $scope.shopName = $scope.shop.shopName;
                    $scope.virtualStatus = $scope.shop.status;
                } else {
                    alertTipMessage(data.errmsg)
                }
            }).error(function (data, status) {
                alertTipMessage("请求出错了!")
            });
        }
        getShopDetailInfo()


        //二.修改商户状态
        $scope.changeStatusReason = null;
        $scope.changeStatusAbilityCode = null
        $scope.startUsingBtnClick = function () {
            $scope.virtualStatus = 1;
        }
        $scope.freezeUsingBtnClick = function () {
            $scope.virtualStatus = 2;
        }
        $scope.forbidUsingBtnClick = function () {
            $scope.virtualStatus = 3;
        }
        $scope.changeShopStatusConformBtnClick = function () {
            $('#changeShopStatusModal').modal('hide')
            $http({
                method: "POST",
                url: "http://www.joosure.com:18081/shopmanage/manage/shop/changeShopStatus",
                data: {
                    'shopId': parseInt($scope.shopId),
                    'status': parseInt($scope.virtualStatus),
                    'changeStatusReason':$scope.changeStatusReason,
                    'changeStatusAbilityCode':$scope.changeStatusAbilityCode,
                }
            }).success(function (data, status) {
                if (data.errcode == 0) {
                    $scope.changeStatusReason = null;
                    $scope.changeStatusAbilityCode = null;
                    $scope.shop.status = data.shop.status;
                    $scope.virtualStatus = $scope.shop.status;
                    if($scope.virtualStatus == 1){
                        $scope.shopDetailStatus = "正常"
                    }else if($scope.virtualStatus == 2){
                        $scope.shopDetailStatus = "冻结"
                    }else {
                        $scope.shopDetailStatus = "禁用"
                    }
                    alertTipMessage("修改成功")
                } else {
                    alertTipMessage(data.errmsg)
                }
            }).error(function (data, status) {
                alertTipMessage("请求出错了!")
            });
        }


        //三.删除该商户
        $scope.destroyShopSubmitItem = {
            "destroyShopReason":"",
            "destroyShopAbilityCode":""
        }
        $scope.destroyShopModalBtnClick = function () {
            if($scope.shop.status == 3){
                alertTipMessage("该商户已被注销,无需重复操作!")
            }else {
                $('#destroyShopModal').modal('show')
            }
        }
        $scope.destroyShopBtnClick = function () {
            $('#destroyShopModal').modal('hide')
        }
        $scope.destroyShopConformBtnClick = function () {



            $('#destroyShopConformModal').modal('hide')
            $http({
                method: "POST",
                url: "http://www.joosure.com:18081/shopmanage/manage/shop/changeShopStatus",
                data: {
                    'shopId': parseInt($scope.destroyShopItem.shopId),
                    'status': 3,
                    'destroyShopReason':$scope.destroyShopSubmitItem.destroyShopReason,
                    'destroyShopAbilityCode':$scope.destroyShopSubmitItem.destroyShopAbilityCode
                }
            }).success(function (data, status) {
                if (data.errcode == 0) {
                    $scope.shop.status = data.shop.status;
                    if($scope.shop.status == 1){
                        $scope.shopDetailStatus = "正常"
                    }else if($scope.shop.status == 2){
                        $scope.shopDetailStatus = "冻结"
                    }else {
                        $scope.shopDetailStatus = "禁用"
                    }
                    alertTipMessage("注销成功")
                } else {
                    alertTipMessage(data.errmsg)
                }
            }).error(function (data, status) {
                 alertTipMessage("请求出错了!")
            });
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
                $http({
                    method: "POST",
                    url: "http://www.joosure.com:18081/shopmanage/manage/shop/add",
                    data: {
                        'addManagerName': $scope.addManagerSubmitItem.addManagerName,
                        'addManagerPwd': $scope.addManagerSubmitItem.addManagerPwd,
                         'shopId':$scope.shopId
                    }
                }).success(function (data, status) {
                    if (data.errcode == 0) {
                        alertTipMessage("添加成功")
                    } else {
                        alertTipMessage(data.errmsg)
                    }
                }).error(function (data, status) {
                    alertTipMessage("请求出错了!")
                });

                $scope.addManagerSubmitItem.addManagerName = null;
                $scope.addManagerSubmitItem.addManagerPwd = null;

            }else if(managerInfo == "changeManager"){

                $('#changeShopManagerModal').modal('hide')
                $http({
                    method: "POST",
                    url: "",
                    data: {
                        'changeManagerName': $scope.changeManagerSubmitItem.changeManagerName,
                        'changeManagerPwd': $scope.changeManagerSubmitItem.changeManagerPwd,
                         'shopId':$scope.shopId
                    }
                }).success(function (data, status) {
                    if (data.errcode == 0) {
                        alertTipMessage("修改成功!")
                    } else {
                        alertTipMessage(data.errmsg)
                    }
                }).error(function (data, status) {
                    alertTipMessage("请求出错了!")
                });

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

            $http({
                method: "POST",
                url: "http://www.joosure.com:18081/shopmanage/manage/shop/add",
                data: {
                    'deleteManagerName': $scope.deleteManagerName,
                     'shopId':$scope.shopId
                }
            }).success(function (data, status) {
                if (data.errcode == 0) {
                    alertTipMessage("删除成功!")
                } else {
                    alertTipMessage(data.errmsg)
                }
            }).error(function (data, status) {
                alertTipMessage("请求出错了!")
            });
            $scope.deleteManagerName = null;
        }


        }])
    .controller('AddCtrl', ['$scope','$location', '$http', function ($scope,$location, $http) {
        $AppFunc.registerScope('shop_add', $scope);
        $AppFunc.activeMenuLv1('shop');
        $AppFunc.setMenuLv2('shop/menu.html');
        $AppFunc.activeMenuLv2('shops');

        //提醒
        $scope.tipMessage = ""
        //提示
        function alertTipMessage(tipMessage) {
            $scope.tipMessage = tipMessage
            $('#tipMessageModal').modal('show')
            setTimeout(function () {
                $('#tipMessageModal').modal('hide')
            },1000)
        }

        //一.获取商品列表页的scope
        var shopPageScope = $AppFunc.getScope("shop_shops")
        //获取所属类别(在列表页已经从网络获取)
        $scope.addindustries = shopPageScope.industries

        //二.创建一个要添加的商品对象
        $scope.shopDetailInfo = {
            "shopName": "",
            "location": "",
            "companyName":"",
            "mallName":"正佳",
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

                $http({
                    method: "POST",
                    url: "http://www.joosure.com:18081/shopmanage/manage/shop/add",
                    data: {
                        'shopName' : $scope.shopDetailInfo.shopName,
                        'location':$scope.shopDetailInfo.location,
                        'companyName':$scope.shopDetailInfo.companyName,
                        'mallName':"正佳",
                        'brand':$scope.shopDetailInfo.brand,
                        'industry':$scope.shopDetailInfo.industry.name,
                        'shopManagerName':$scope.shopDetailInfo.shopManagerName,
                        'shopManagerIdcardno':$scope.shopDetailInfo.shopManagerIdcardno,
                        'shopManagerMobile':$scope.shopDetailInfo.shopManagerMobile
                    }
                }).success(function (data, status) {
                    if (data.errcode == 0) {
                        //回到详情页面
                        alertTipMessage("添加成功!")
                        setTimeout(function () {
                            $location.path('#!/shop/shops')
                        },2000)
                    } else {
                        alertTipMessage(data.errmsg)
                    }
                }).error(function (data, status) {
                    alertTipMessage("请求出错了!")
                });
            }else {
                alertTipMessage("必须同意×××协议")
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

            if ($scope.checkboxChecked == true){

                $http({
                    method: "POST",
                    url: "http://www.joosure.com:18081/shopmanage/manage/shop/add",
                    data: {
                        'shopName' : $scope.shopDetailInfo.shopName,
                        'location':$scope.shopDetailInfo.location,
                        'companyName':$scope.shopDetailInfo.companyName,
                        'brand':$scope.shopDetailInfo.brand,
                        'industry':$scope.shopDetailInfo.industry.name,
                        'shopManagerName':$scope.shopDetailInfo.shopManagerName,
                        'shopManagerIdcardno':$scope.shopDetailInfo.shopManagerIdcardno,
                        'shopManagerMobile':$scope.shopDetailInfo.shopManagerMobile
                    }
                }).success(function (data, status) {
                    if (data.errcode == 0) {
                        //回到详情页面
                        alertTipMessage("修改成功!")
                        setTimeout(function () {
                            $location.path('#!/shop/shops')
                        },2000)
                    } else {
                        alertTipMessage(data.errmsg)
                    }
                }).error(function (data, status) {
                    alertTipMessage("请求出错了!")
                });
            }else {
                alertTipMessage("必须同意×××协议")
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

shopApp.service('showEquipmentBindState', function() {
    this.myFunc = function (x) {

        var a = "已绑定"
        if(x == 0){
            a = "已绑定"
        }else if(x == 1){
            a = "未绑定"
        }else {
            a = "已禁用"
        }
        return  a;
    }
});
shopApp.filter('showEquipmentBindState',['showEquipmentBindState', function(showEquipmentBindState) {
    return function(x) {
        return showEquipmentBindState.myFunc(x);
    };
}]);