'use strict';

var equipmentApp = angular.module('myApp.table', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        var menuLv1 = $AppObj.MenuLv1('table', '#!/table', '机具管理系统');
        $AppData._menuLv1List.push(menuLv1);

        $routeProvider.when('/table', {
            templateUrl: 'table/table.html',
            controller: 'TableCtrl'
        }).when('/table/table', {
            templateUrl: 'table/table.html',
            controller: 'TableCtrl'
        }).when('/table/addequipment', {
            templateUrl: 'table/addequipment.html',
            controller: 'AddEquipmentCtrl'
        });
    }])

    .controller('TableCtrl', ['$scope','$rootScope', function ($scope,$rootScope) {
        $AppFunc.registerScope('table_table', $scope);
        $AppFunc.activeMenuLv1('table');
        $AppFunc.setMenuLv2('table/menu.html');
        $AppFunc.activeMenuLv2('table1');

        $scope.tableData = [
            {
            "createTime": 1483004699107,
            "mallName": "正佳",
            "modelNo": "Device1", //终端型号
            "status": 0,
            "terminalId": 1233, //终端编号
            "terminalSN": "addDeviceCase1" //序列号
             },
            {
                "createTime": 1483004699108,
                "mallName": "天河城",
                "modelNo": "Device2",
                "status": 1,
                "terminalId": 4323,
                "terminalSN": "addDeviceCase2"
            },
            {
                "createTime": 1483004699109,
                "mallName": "体育中心",
                "modelNo": "Device3",
                "status": 2,
                "terminalId": 2343,
                "terminalSN": "addDeviceCase3"
            }
        ]
        $scope.equipmentBindStates = [
            {"equipmentBindStates":"全部","status":"0"},
            {"equipmentBindStates":"可用","status":"1"},
            {"equipmentBindStates":"锁定","status":"2"},
            {"equipmentBindStates":"停用","status":"3"}
        ];
        $rootScope.equipmentBindStates = $scope.equipmentBindStates;

        $scope.terminalId = null
        $scope.terminalSN = null
        $scope.modelNo = null
        $scope.selectEquipmentBindStates = {"equipmentBindStates":"全部","status":"0"},


        //搜索
        $scope.page = 1
        $scope.hasNext = 1
        $scope.searchEquipmentBtnClick = function () {
            alert($scope.terminalId + $scope.terminalSN + $scope.modelNo + $scope.selectEquipmentBindStates.status)
            // 点击搜索
            // $http({
            //     method: "POST",
            //     url: "",
            //     data: {
            //         "page":$scope.page,
            //         "terminalId": $scope.terminalId,
            //         "terminalSN"  : $scope.terminalSN,
            //         "modelNo": $scope.modelNo,
            //         "selectEquipmentBindStates": $scope.selectEquipmentBindStates.status,
            //     }
            // }).success(function (data, status) {
            //     if (data.errcode == 0) {
            //     } else {
            //         alert(data.errmsg);
            //     }
            // }).error(function (data, status) {
            // });
        }

        //上一页/下一页
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



        //修改设备信息
        $scope.changeEquipmentItemInfo = function (equipmentItem) {
            $scope.willChangedEquipmentItem = equipmentItem
            $('#changeEquipmentInfoModal').modal('show')
        }
        //确认修改设备信息
        $scope.changeEquipmentInfoConformBtnClick = function () {
            $('#changeEquipmentInfoModal').modal('hide')
            $('#changeEquipmentInfoSuccessModal').modal('show')
            setTimeout(function () {
                $('#changeEquipmentInfoSuccessModal').modal('hide')
            },1000)

            // 修改设备信息
            // $http({
            //     method: "POST",
            //     url: "",
            //     data: {
            //         "terminalId":$scope.willChangedEquipmentItem.terminalId,
            //         "terminalSN"  : $scope.willChangedEquipmentItem.terminalSN,
            //         "modelNo": $scope..willChangedEquipmentItem.modelNo,
            //         "mallName": $scope.willChangedEquipmentItem.mallName,
            //     }
            // }).success(function (data, status) {
            //     if (data.errcode == 0) {
            //     } else {
            //         alert(data.errmsg);
            //     }
            // }).error(function (data, status) {
            // });
        }


        //绑定或者解绑
        $scope.changeEquipmentItemBind = function (equipmentItem) {

            if(equipmentItem.status == 0){//已绑定,现在要解绑定
                $scope.willChangeEquipmentBindItem = equipmentItem
                $('#destoryEquipmentBindStatusModal').modal('show')
            }else if(equipmentItem.status == 1){//未绑定,现在要绑定
                $('#buildEquipmentBindStatusModal').modal('show')
            }else {//已删除,现在只能查看
                alert("弹出查看")
            }
        }
        //确认绑定
        $scope.buildEquipmentBindStatusConformBtnClick = function () {

            $('#buildEquipmentBindStatusModal').modal('hide')
            $('#buildEquipmentBindStatusSuccessModal').modal('show')
            setTimeout(function () {
                $('#buildEquipmentBindStatusSuccessModal').modal('hide')
            },1000)

            $scope.equipmentBindPwd = null
            // 确认绑定
            // $http({
            //     method: "POST",
            //     url: "",
            //     data: {
            //         "terminalId":$scope.willChangeEquipmentBindItem.terminalId,
            //         "terminalSN"  : $scope.willChangeEquipmentBindItem.terminalSN,
            //         "modelNo": $scope..willChangeEquipmentBindItem.modelNo,
            //          "forbidEquipmentPwd":$scope.forbidEquipmentPwd
            //     }
            // }).success(function (data, status) {
            //     if (data.errcode == 0) {
            //     } else {
            //         alert(data.errmsg);
            //     }
            // }).error(function (data, status) {
            // });

        }
        //确认解绑
        $scope.destoryEquipmentBindStatusConformBtnClick = function () {

            $('#destoryEquipmentBindStatusModal').modal('hide')
            $('#destoryEquipmentBindStatusSuccessModal').modal('show')
            setTimeout(function () {
                $('#destoryEquipmentBindStatusSuccessModal').modal('hide')
            },1000)

            $scope.destoryEquipmentBindPwd = null
            // 确认解绑
            // $http({
            //     method: "POST",
            //     url: "",
            //     data: {
            //         "terminalId":$scope.willChangeEquipmentBindItem.terminalId,
            //         "terminalSN"  : $scope.willChangeEquipmentBindItem.terminalSN,
            //         "modelNo": $scope..willChangeEquipmentBindItem.modelNo,
            //          "destoryEquipmentBind":$scope.destoryEquipmentBind
            //     }
            // }).success(function (data, status) {
            //     if (data.errcode == 0) {
            //     } else {
            //         alert(data.errmsg);
            //     }
            // }).error(function (data, status) {
            // });

        }



        //删除设备(禁用设备)
        $scope.changeEquipmentItemUseStatus = function (equipmentItem) {
            $scope.willChangeEquipmentUseStatusItem = equipmentItem
            if(equipmentItem.status == 0){//现在可以使用,点击弹出禁用modal
                $('#changeEquipmentItemUseStatusModal').modal('show')
            }else if(equipmentItem.status == 1){//现在可以使用,点击弹出禁用modal
                $('#changeEquipmentItemUseStatusModal').modal('show')
            }else {//现在是禁用状态,点击弹出启用modal
                $('#startEquipmentItemUseStatusModal').modal('show')
            }
        }
        //禁用确认按钮点击
        $scope.changeEquipmentItemUseStatusConformBtnClick = function () {
            $('#changeEquipmentItemUseStatusModal').modal('hide')
            $('#changeEquipmentItemUseStatusSuccessModal').modal('show')
            setTimeout(function () {
                $('#changeEquipmentItemUseStatusSuccessModal').modal('hide')
            },1000)

            $scope.forbidEquipmentReason = null
            $scope.forbidEquipmentPwd = null
            // 禁用
            // $http({
            //     method: "POST",
            //     url: "",
            //     data: {
            //         "terminalId":$scope.willChangeEquipmentBindItem.terminalId,
            //         "terminalSN"  : $scope.willChangeEquipmentBindItem.terminalSN,
            //         "modelNo": $scope..willChangeEquipmentBindItem.modelNo,
            //          "forbidEquipmentReason":$scope.forbidEquipmentReason,
            //          "forbidEquipmentPwd":$scope.forbidEquipmentPwd
            //     }
            // }).success(function (data, status) {
            //     if (data.errcode == 0) {
            //     } else {
            //         alert(data.errmsg);
            //     }
            // }).error(function (data, status) {
            // });

        }
        //启用确认按钮点击
        $scope.startEquipmentItemUseStatusModalConformBtnClick = function () {
            $('#startEquipmentItemUseStatusModal').modal('hide')
            $('#changeEquipmentItemUseStatusSuccessModal').modal('show')
            setTimeout(function () {
                $('#changeEquipmentItemUseStatusSuccessModal').modal('hide')
            },1000)
            // 启用
            // $http({
            //     method: "POST",
            //     url: "",
            //     data: {
            //         "terminalId":$scope.willChangeEquipmentBindItem.terminalId,
            //         "terminalSN"  : $scope.willChangeEquipmentBindItem.terminalSN,
            //         "modelNo": $scope..willChangeEquipmentBindItem.modelNo,
            //     }
            // }).success(function (data, status) {
            //     if (data.errcode == 0) {
            //     } else {
            //         alert(data.errmsg);
            //     }
            // }).error(function (data, status) {
            // });
        }






    }]).controller('AddEquipmentCtrl', ['$scope', function ($scope) {
        $AppFunc.registerScope('table_addequipment', $scope);
        $AppFunc.activeMenuLv1('table');
        $AppFunc.setMenuLv2('table/menu.html');
        $AppFunc.activeMenuLv2('table1');


        //添加
        $scope.terminalId = null
        $scope.terminalSN = null
        $scope.modelNo = null
        $scope.selectEquipmentBindStates = {"equipmentBindStates":"全部","status":"0"},
        $scope.addEquipmentConformBtnClick = function () {

            alert($scope.terminalId + $scope.terminalSN + $scope.modelNo + $scope.selectEquipmentBindStates.equipmentBindStates)

            // 添加设备接口
            // $http({
            //     method: "POST",
            //     url: "",
            //     data: {
            //         terminalId :  $scope.terminalId,
            //         terminalSN:$scope.terminalSN,
            //         modelNo:$scope.modelNo,
            //         selectEquipmentBindStates:$scope.selectEquipmentBindStates.status,
            //     }
            // }).success(function (data, status) {
            //     if (data.errcode == 0) {
            //     } else {
            //         alert(data.errmsg);
            //     }
            // }).error(function (data, status) {
            // });
        }
        
        
        
    }]);


equipmentApp.service('showBindState', function() {
    this.myFunc = function (x) {

        var a = "查看"
        var b = "禁用"
        if(x == 0){
            a = "解绑"
        }else if(x == 1){
            a = "绑定"
        }else {
            b = "启用"
        }
        return  {"a":a,"b":b};
    }
});
equipmentApp.filter('showBindState',['showBindState', function(showBindState) {
    return function(x) {
        return showBindState.myFunc(x);
    };
}]);


