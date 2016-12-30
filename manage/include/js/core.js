/**
 * Created by shawn on 2016/11/8.
 */
(function (window, addFuncs, addObjs) {
    window['$AppData'] = {
        _scope: {},
        _menuLv1List: []
    };

    window['$AppFunc'] = addFuncs();

    window['$AppObj'] = addObjs();
})(window, function () {
    var appFunc = {};
    /**
     * 注册页面控制域
     * @param module
     * @param $scope
     */
    appFunc.registerScope = function (module, $scope) {
        $AppData._scope[module] = $scope;
        $scope.$on('$routeChangeStart', function (scope, next, current) {
        });
    }

    /**
     * 获得已注册的页面控制域
     * @param module
     * @returns {*}
     */
    appFunc.getScope = function (module) {
        return $AppData._scope[module];
    }

    /**
     * 激活菜单Lv1
     * @param active 模块名称
     */
    appFunc.activeMenuLv1 = function (active) {
        appFunc.getScope('App').menuLv1 = active;
    }

    /**
     * 激活菜单Lv2
     * @param active 功能名称
     */
    appFunc.activeMenuLv2 = function (active) {
        appFunc.getScope('App').menuLv2 = active;
    }

    /**
     * 设置二级菜单include路径
     * @param url
     */
    appFunc.setMenuLv2 = function (url) {
        appFunc.getScope('App').menu = url;
    }

    return appFunc;
}, function () {
    var appObj = {};
    /**
     * 一级菜单对象
     * @param active 模块名称
     * @param router 路由地址
     * @param title 模块标题
     * @returns {{active: *, router: *}}
     * @constructor
     */
    appObj.MenuLv1 = function (active, router, title) {
        var obj = {
            active: active,
            router: router,
            title: title
        };
        return obj;
    }

    return appObj;
});