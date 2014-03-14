var HAT = {
    version: "RMSConfig_V1.0.0",

    //程序模式 true-调试模式
    _bDebugMode: true,

    errinfo: {
        "0": "无错误",
        //兼容老版本
        "-101": "身份标识无效,请退出重新登录!",
        "-102": "用户密码验证失败!",
        "-103": "登录用户达上限!",
        "-104": "登录用户非管理员!",
        "-105": "读取数据库失败!",
        "-106": "写入数据库错误!",
        "-107": "打开进程失败!",
        "-108": "客户端传入数据错误!",
        "-110": "获取验证信息失败!",
        "-111": "授权失败!",
        "-112": "生成keyid错误!",

        //新版错误码
        "-1001": "登录已过期,请退出重新登录!",
        "-1002": "用户密码验证失败!",
        "-1003": "登录用户达上限!",
        "-1004": "登录用户非管理员!",
        "-1005": "读取数据库失败!",
        "-1006": "写入数据库错误!",
        "-1007": "启动rms程序失败!",
        "-1008": "客户端传入数据错误!",
        "-1010": "获取授权验证信息失败!",
        "-1011": "授权失败!",
        "-1012": "生成keyid错误!",
        "-1013": "数据库连接错误!",
        "-1014": "未知错误!",

        "-1050": "通道不存在!",
        "-1051": "用户不存在!",
        "-1052": "用户已存在!",
        "-1053": "获取用户列表失败!",
        "-1054": "添加用户失败!",
        "-1055": "修改密码失败!",
        "-1056": "获取通道列表失败!",
        "-1057": "绑定用户通道失败!",
        "-1058": "获取配置信息失败!",
        "-1059": "设置配置信息失败!",
        "-1060": "重置密码失败!",
        "-1061": "授权已过期!"
    },
    target: {
        userlogin: "user_login",
        userlogout: "user_logout",
        paramcfg: "param_cfg",
        userlist: "user_list",
        useradd: "user_add",
        userlmodify: "userl_modify",
        userldel: "userl_del",
        restart: "restart",
        bindlist: "bind_list",
        channellist: "Channel_list",
        resetpwd: "reset_pwd",
        authkey: "auth_key",
        authcheck: "auth_check"
    },

    //通道的查询模式
    searchMode: {
        general: 0,
        fuzzy: 1
    },

    //树的根节点名
    treeRootName: "rms",

    ajax: {
        _post: function (data, callback) {
            if (!data) {
                return false;
            }

            data = JSON.stringify(data);
            $.ajax({
                data: data,
                type: "POST",
                async: true,
                url: "/",
                dataType: "text",
                timeout: 10000,
                success: function (data, b){
                    if (!data) {
                        return
                    }
                    try {
                        data = $.parseJSON(data)
                    }
                    catch (e) {
                        HAT.msg.infoError("JSON Format Error:" + e.toString());
                    }

                    if (data.status != 0) {
                        HAT.msg.infoError(HAT.errinfo[data.status]);
                        if( data.status == '-101' || data.status == '-1001' ){
                            setTimeout(function(){
                                window.location.href = "index.html";
                            }, 100);
                        }
                    }

                    if (callback && data) {
                        callback(data || {})
                    }
                },
                error: function (a, b, c) {
                    if (b == "timeout") {
                        HAT.msg.infoError("访问超时:" + c)
                    }
                    HAT.msg.infoError("访问失败");
                    throw {
                        XMLHttpRequest: a,
                        textStatus: b,
                        errorThrown: c
                    }
                }
            });
        },

        post: function (target, action, data, callback) {
            var o = HAT.cookie.getCookie();
            var cmd = {
                target: target,
                action: action,
                identify: o ? o.identify : "",
                status: 0,
                data: data
            };
            this._post(cmd, callback);
        }
    },

    msg: {
        toString: function () {
            return 'HAT.msg'
        },
        infoAlert: function (a, b) {
            this._infoImpl(a, 'c_alert_f', b)
        },
        infoCorrect: function (a, b) {
            this._infoImpl(a, 'c_correct_f', b)
        },
        infoWarning: function (a, b) {
            this._infoImpl(a, 'c_warning_f', b)
        },
        infoError: function (a, b) {
            this._infoImpl(a, 'c_error_f', b)
        },
        infoClear: function () {
            $('#c_msg_x').remove()
        },
        _infoImpl: function (b, c, d) {
            $('#c_msg_x').remove();
            var e = $('<span id="c_msg_x"></span>');
            e.css({
                position: 'absolute'
            }).addClass(c).html(b);
            var f = $('body');
            if (d < 0) {
                f.prepend(e)
            }
            else {
                d = (d == undefined ? 5 : d);
                f.prepend(e.fadeIn().delay(d * 1000).fadeOut())
            }
            var g = $('#c_msg_x'), top_orig = g.position().top, _resetPos = function (a) {
                g.delay(10).css({
                    left: (f.width() - g.width()) / 2,
                    top: a + $(document).scrollTop()
                })
            };
            _resetPos(top_orig);
            $(window).bind('resize scroll', function () {
                _resetPos(top_orig)
            })
        }
    },

    cookie: {
        /**
         * 将登录对象以Cookie形式写入到客户端浏览器
         * @param info
         */
        setCookie: function (info) {
            $.cookie('_Login', JSON.stringify(info));
        },
        /**
         * 获取Cookie
         * @returns {Object} {name:'name'}
         */
        getCookie: function () {
            return $.parseJSON($.cookie('_Login'));
        },
        /**
         * 清除Cookie
         */
        clearCookie: function () {
            $.cookie('_Login', null);
        }
    },

    isOwnEmpty: function (obj) {
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                return false;
            }
        }
        return true;
    },

    /**
     * 日志模块
     * @lends JSVideoCtrl.prototype
     * @private
     */
    _log: {
        /**
         * 打印信息(非开发模式不打印)
         * @method _console
         * @param{String} msg
         */
        _console: function (msg) {
            if (!HAT._bDebugMode)
                return false;

            if (( typeof (console) == "undefined")) {
                //alert(msg);
            }
            else {
                console.log(msg);
            }
        },

        /**
         * 打印常规信息(非开发模式不打印)
         * @method _console
         * @param{String} msg
         */
        _info: function (msg) {
            if (!HAT._bDebugMode)
                return false;

            if (( typeof (console) == "undefined")) {
                alert(msg);
            }
            else {
                console.info(msg);
            }
        },

        /**
         * 打印错误信息
         * @method _err
         * @param{String} msg
         */
        _err: function (msg) {
            // if( !HAT._bDebugMode )
            // return false;

            if (( typeof (console) == "undefined")) {
                alert(msg);
            }
            else {
                console.error(msg);
            }
        },

        /**
         * 在页面(id为RESULT的标签)上输出信息
         * @method _print
         * @param{String} msg
         */
        _print: function (msg) {
            if (!HAT._bDebugMode)
                return false;

            try {
                var debugDiv = document.createElement("div");
                var css = 'position:absolute; border:1px; height:300px; width:400px;z-index:99999;';
                debugDiv.style.cssText = css;
                document.body.appendChild(debugDiv);

                debugDiv.innerText = msg;
            }
            catch (e) {
                if (( typeof (console) == "undefined")) {
                    alert("print err: " + e);
                }
                else {
                    console.log("print err: " + e);
                }
            }
        }
    },

    //登出
    logout : function(callback){
        var o = HAT.cookie.getCookie();
        var data={
            "identify": o ? o.identify : ""
        };
        HAT.ajax.post(HAT.target.userlogout, "set", data, function(){
            if( callback ){
                callback();
            }
        });
    },

    //窗口关闭
    IsClose: function () {
        if (HAT.Main.agent().name == "msie") {
            try{
                HAT.Player.playerObject.tellReleaseOCX();
            }catch (e){}
        }
    }
};

/**
 * 去除字符左右两边空格
 */
String.prototype.trim=function(){
    return this.replace(/(^\s*)|(\s*$)/g,"")
};
/**
 * 去除字符中所有空格
 */
String.prototype.trimBlanks=function(){
    return this.replace(/(\s*)/g,"")
};