'use strict';

// "modelNo": "", //终端型号
// "terminalId": ", //终端编号
// "terminalSN": "" //序列号

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

    .controller('TableCtrl', ['$scope','$http', function ($scope,$http) {
        $AppFunc.registerScope('table_table', $scope);
        $AppFunc.activeMenuLv1('table');
        $AppFunc.setMenuLv2('table/menu.html');
        $AppFunc.activeMenuLv2('table1');

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

        //获取所有绑定状态
        $scope.equipmentBindStates = [
            {"equipmentBindStates":"全部","status":""},
            {"equipmentBindStates":"已绑定","status":"1"},
            {"equipmentBindStates":"未绑定","status":"0"},
            {"equipmentBindStates":"已禁用","status":"2"}
        ];

        //获取所有商城列表(发送请求获取)
        $scope.mallNames = ["天河城","正佳","万达","沃尔玛"];

        //一.获取数据
        //获取列表数据
        $scope.page = 1;
        $scope.hasNext = 0;
        $scope.equipmentsearchItem = {
            "modelNo":"",//终端型号
            "terminalId":"",//终端编号
            "terminalSN":"",//序列号
            "status":{"equipmentBindStates":"全部","status":""},
        };

        function requestTableData(page,equipmentsearchItem) {
            $http({
                method: "POST",
                url: "http://www.joosure.com:18081/shopmanage/manage/device/terminals",
                data: {
                    "page":page,
                    "modelNo": equipmentsearchItem.modelNo,
                    "terminalId": equipmentsearchItem.terminalId,
                    "terminalSN": equipmentsearchItem.terminalSN,
                    "status": equipmentsearchItem.status.status,
                }
            }).success(function (data, status) {
                if (data.errcode == 0) {

                    if(data.deviceTerminals.data.length == 0){
                        alertTipMessage("暂时没有搜索数据,请重新搜索!")
                        $('#bodyContainerFooter').hide()
                        $scope.tableData = data.deviceTerminals.data;
                    }else {
                        $('#bodyContainerFooter').show()
                        $scope.tableData = data.deviceTerminals.data;
                    }
                    $scope.page = data.deviceTerminals.page;
                    $scope.hasNext = data.deviceTerminals.hasNext;
                } else {
                    $('#bodyContainerFooter').hide()
                    alertTipMessage(data.errmsg)
                }
            }).error(function (data, status) {
                $('#bodyContainerFooter').hide()
                alertTipMessage("请求出错了!")
            });
        }
        requestTableData(1,$scope.equipmentsearchItem)


        //二.搜索
        $scope.searchEquipmentBtnClick = function () {
            requestTableData(1,$scope.equipmentsearchItem)
        }

        //三.上一页/下一页
        $scope.jumpToForwardPage = function () {
            if($scope.page == 1) {
                alertTipMessage("已经是第一页!")
            }else {
                $scope.page = $scope.page -1;
                requestTableData($scope.page,$scope.equipmentsearchItem)
            }
        }
        $scope.jumpToNextPage = function () {
            if($scope.hasNext == 0){
                alertTipMessage("已经是最后一页!")
            }else {
                $scope.page = $scope.page + 1;
                requestTableData($scope.page,$scope.equipmentsearchItem)
            }
        }


        //四.修改设备信息
        $scope.willChangedEquipmentItem = {
            "terminalId":0,
            "terminalSN":"",
            "modelNo":"",
            "mallName":""
        }
        $scope.changeEquipmentItemInfo = function (equipmentItem) {

            $scope.willChangedEquipmentItem.terminalId = equipmentItem.terminalId
            $scope.willChangedEquipmentItem.terminalSN = equipmentItem.terminalSN
            $scope.willChangedEquipmentItem.modelNo = equipmentItem.modelNo
            $scope.willChangedEquipmentItem.mallName = equipmentItem.mallName

            $scope.willChangedEquipmentItemIndex = "";
            for(var i = 0;i<$scope.tableData.length;i++){
                if(equipmentItem == $scope.tableData[i]){
                    $scope.willChangedEquipmentItemIndex = i;
                }
            }
            $('#changeEquipmentInfoModal').modal('show')
        }
        //确认修改设备信息
        $scope.changeEquipmentInfoConformBtnClick = function () {
            $('#changeEquipmentInfoModal').modal('hide')

            // 修改设备信息
            $http({
                method: "POST",
                url: "http://www.joosure.com:18081/shopmanage/manage/device/edit",
                data: {
                    "terminalId":$scope.willChangedEquipmentItem.terminalId,
                    "terminalSN"  :$scope.willChangedEquipmentItem.terminalSN,
                    "modelNo": $scope.willChangedEquipmentItem.modelNo,
                    "mallName": $scope.willChangedEquipmentItem.mallName,
                }
            }).success(function (data, status) {
                if (data.errcode == 0) {
                    alertTipMessage("修改成功!")
                    $scope.tableData[$scope.willChangedEquipmentItemIndex] = data.deviceTerminal
                } else {
                    alertTipMessage(data.errmsg)
                }
            }).error(function (data, status) {
                alertTipMessage("请求出错了!")
            });
        }

        //五.查询可绑定商户
        function requestCanBindShop() {
            $http({
                method: "POST",
                url: "http://www.joosure.com:18081/shopmanage/manage/device/searchBindableShop",
                data: {

                }
            }).success(function (data, status) {
                if (data.errcode == 0) {

                } else {
                    alertTipMessage(data.errmsg)
                }
            }).error(function (data, status) {
                alertTipMessage("请求出错了!")
            });
        }


        //六.绑定或者解绑
        $scope.changeEquipmentItemBind = function (equipmentItem) {

            $scope.willChangeEquipmentBindItem = equipmentItem

            $scope.willChangeEquipmentBindItemIndex = "";
            for(var i = 0;i<$scope.tableData.length;i++){
                if(equipmentItem == $scope.tableData[i]){
                    $scope.willChangeEquipmentBindItemIndex = i;
                }
            }
            if(equipmentItem.status == 1){//已绑定,现在要解绑定
                $('#destoryEquipmentBindStatusModal').modal('show')
            }else if(equipmentItem.status == 0){//未绑定,现在要绑定
                $('#buildEquipmentBindStatusModal').modal('show')
            }else {//已删除,现在只能查看
                alert("弹出查看")
            }
        }
        //确认绑定
        $scope.buildEquipmentBindStatusConformBtnClick = function () {


            $('#buildEquipmentBindStatusModal').modal('hide')

            // 确认绑定
            $http({
                method: "POST",
                url: "http://www.joosure.com:18081/shopmanage/manage/device/bind",
                data: {
                    "terminalId":$scope.willChangeEquipmentBindItem.terminalId,
                    "terminalSN"  : $scope.willChangeEquipmentBindItem.terminalSN,
                    "modelNo": $scope.willChangeEquipmentBindItem.modelNo,
                     "forbidEquipmentPwd":$scope.forbidEquipmentPwd
                }
            }).success(function (data, status) {
                if (data.errcode == 0) {
                    alertTipMessage("绑定成功!")
                    $scope.tableData[$scope.willChangeEquipmentBindItemIndex] = data.deviceTerminal

                    $scope.equipmentBindPwd = null
                } else {
                    alertTipMessage(data.errmsg)
                }
            }).error(function (data, status) {
                alertTipMessage("请求出错了!")
            });

        }
        //确认解绑
        $scope.destoryEquipmentBindStatusConformBtnClick = function () {

            $('#destoryEquipmentBindStatusModal').modal('hide')

            $http({
                method: "POST",
                url: "http://www.joosure.com:18081/shopmanage/manage/device/unbind",
                data: {
                    "terminalId":$scope.willChangeEquipmentBindItem.terminalId,
                    "terminalSN"  : $scope.willChangeEquipmentBindItem.terminalSN,
                    "modelNo": $scope.willChangeEquipmentBindItem.modelNo,
                    "forbidEquipmentPwd":$scope.forbidEquipmentPwd
                }
            }).success(function (data, status) {
                if (data.errcode == 0) {
                    alertTipMessage("解绑成功!")
                    $scope.tableData[$scope.willChangeEquipmentBindItemIndex] = data.deviceTerminal
                    $scope.destoryEquipmentBindPwd = null
                } else {
                    alertTipMessage(data.errmsg)
                }
            }).error(function (data, status) {
                alertTipMessage("请求出错了!")
            });


        }


        //七.删除设备(禁用设备)//这写接口都还没有
        $scope.changeEquipmentItemUseStatus = function (equipmentItem) {
            $scope.willChangeEquipmentUseStatusItem = equipmentItem
            if(equipmentItem.status == 1){//现在可以使用,点击弹出禁用modal
                $('#changeEquipmentItemUseStatusModal').modal('show')
            }else if(equipmentItem.status == 0){//现在可以使用,点击弹出禁用modal
                $('#changeEquipmentItemUseStatusModal').modal('show')
            }else {//现在是禁用状态,点击弹出启用modal
                $('#startEquipmentItemUseStatusModal').modal('show')
            }
        }
        //禁用确认按钮点击
        $scope.changeEquipmentItemUseStatusConformBtnClick = function () {
            $('#changeEquipmentItemUseStatusModal').modal('hide')
            alertTipMessage("操作成功!")

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
            alertTipMessage("操作成功!")
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


    }])
    .controller('AddEquipmentCtrl', ['$scope','$http', function ($scope,$http) {
        $AppFunc.registerScope('table_addequipment', $scope);
        $AppFunc.activeMenuLv1('table');
        $AppFunc.setMenuLv2('table/menu.html');
        $AppFunc.activeMenuLv2('table1');

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

        //一.获取列表页的scope
        var equipmentPageScope = $AppFunc.getScope("table_table")
        //获取所属商城(在列表页已经从网络获取)
        $scope.mallNames = equipmentPageScope.mallNames

        //二.添加设备
        $scope.equipmentItem = {
            "terminalId":"",
            "terminalSN":"",
            "modelNo":"",
            "mallName":""
        }
        $scope.addEquipmentConformBtnClick = function () {

            // 添加设备接口
            $http({
                method: "POST",
                url: "http://www.joosure.com:18081/shopmanage/manage/device/add",
                data: {
                    'terminalId' :  $scope.equipmentItem.terminalId,
                    'terminalSN':$scope.equipmentItem.terminalSN,
                    'modelNo':$scope.equipmentItem.modelNo,
                    'mallName':$scope.equipmentItem.mallName,
                }
            }).success(function (data, status) {
                if (data.errcode == 0) {
                    alertTipMessage("添加成功!")
                    setTimeout(function () {
                        location.href = '#!/table/table'
                    },2000)
                } else {
                    alertTipMessage(data.errmsg)
                }
            }).error(function (data, status) {
                alertTipMessage("请求出错了!")
            });
        }
    }]);


equipmentApp.service('showBindState', function() {
    this.myFunc = function (x) {

        var a = "查看"
        var b = "禁用"
        if(x == 0){
            a = "绑定"
        }else if(x == 1){
            a = "解绑"
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


