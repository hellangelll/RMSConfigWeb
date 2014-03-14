/**
 * Created with JetBrains WebStorm.
 * User: Hellangel
 * Date: 13-12-18
 * Time: 下午5:55
 * To change this template use File | Settings | File Templates.
 */
(function() {
    if( !window.HAT ) {
        window.HAT = {};
    }
})();

HAT.Player = {
    //播放控件实例
    playerObject: null,

    //参数设置data类
    _data : {},

    _playerVersion: "2.0.4.7",
    _playerUrl: 'asset/NPPlayer.exe',
    //
    target : {
        addDevice : "device/add",
        enumNode : "node/enum",
        addChannel : "channel/add",
        openStream : "stream/open",
        closeStream : "stream/close"
    },

    //初始化_data对象
    initData : function(){
        var o = HAT.cookie.getCookie();
        if( !HAT.isOwnEmpty(HAT.Param.param) && o ){
            var par = HAT.Param.param,
                data = HAT.Player._data;

            //初始化参数设置对象的部分参数
            data.devname = par.rms_id;
            data.devtype = "rms";
            data.devip = document.location.hostname;
            data.devport = Number(par.rms_foreign_port);
            data.username = o.username;
            data.password = o.password;
            data.isencrypt = 0;  //是否加密
            data.ext = "ext";
            data.nodeid = "*";  //枚举节点名
            data.chanid = "";   //通道id
            data.streamtype = 0;    //码流类型 0-主码流
            data.protocal = "tcp"; //协议类型
            data._id = "";      //没用

            //添加设备
            this.addDev();
        }
    },

    //操作处理接口
    _handle :function(target,data){
        var o = {
            "target" : target || "",
            "action" : "set",
            "sid" : "e55ae30a1441a2bc14c4d078",
            "data" : data || ""
        };
        return this.playerObject.videoCtrl.handleComponent(o,3);
    },

    /**
     * 检测播放插件是否安装
     * @returns {boolean}
     */
    checkPlugin: function () {
        // 检测播放器（非IE）
        if ('msie' === HAT.Main.agent().name) {
            if (!this.playerObject.videoCtrl.getVersion()) {
                if (confirm('系统运行需要播放插件，是否下载？\n【安装前请关闭所有打开浏览器】')) {
                    location.href = this._playerUrl;
                }
                return false;
            }
            return true;
        } else {
            if (!HAT.Main.hasPlugin('NPPlayer')) {
                if (confirm('系统运行需要播放插件，是否下载？\n【安装前请关闭所有打开浏览器】')) {
                    location.href = this._playerUrl;
                }
                return false;
            }
            return true;
        }
    },

    /*
    * 初始化播放器
    * @returns {boolean}
    * */
    init : function(){

        var funcObj = {
            //是否以窗口模式显示 true-显示窗口模式
            bWindowMode : 1,
            //是否显示屏幕切换控制面板 true-显示
            bShowScreenCtrl : 1,
            //是否显示播放控制面板 true-显示
            bShowPlayCtrl : 1,
            //是否显示参数控制面板 true-显示
            bShowParaCtrl : 0,
            //定义哪一个面板显示在视频播放窗口的上部 0-screen 1-playctrl
            iWhichShowOnTop : 0,
            oControl : {
                bRecord : 0,
                bTalkback : 0,
                bCapture : 0,
                bAudio : 0,
                bStopAll : 0,
                bStop : 0,
                bReplay : 0,
                bVideoPath : 1
            },
            oWindow : {
                bOne : true,
                bFour : true,
                bNine : true,
                bFull : true
            }
        };

        this.playerObject = new JSVideoCtrl($("#playerDiv"), 1, "lib/videoPlugin/css/plugin.css", funcObj, "");
        this.playerObject.draw();
        if ('msie' === HAT.Main.agent().name) {
            this.playerObject.setPosition(-90,-40);
        }else{
            HAT.Player.playerObject.videoCtrl.setVisibility(false);
        }

        //check plugin
        if (!this.checkPlugin()) {
            return false;
        }

        // 检测更新
        var nVersion = this.playerObject.videoCtrl.getVersion();
        if (nVersion && nVersion < this._playerVersion) {
            $("#upgradeCrtl_description").html('您当前的控件版本为(' + nVersion + '),检测到新版本播放器(' + this._playerVersion + ')是否下载更新？\n【安装前请关闭所有打开浏览器】');
            var frm = $("#frm-upgradeControl");
            $("#frm-upgradeControl-submit").bind("click", function(){
                HAT.Dialog.hide();
                window.location.href = HAT.Player._playerUrl;
            });
            HAT.Dialog.init(frm, '视频控件更新', 'add').show();
        }

        this.regEventCallback();
    },
    /*
     * 注册消息回调函数
     *
     * */
    regEventCallback : function(){
        var o = this.playerObject;

        o.videoCtrl.eventCtrl.regInitFinished(function(data){
            HAT.Player.playerObject.tellGetInitEvent();

            HAT.Player.playerObject.videoCtrl.setVisibility(false);
            HAT.Player.playerObject.videoCtrl.setScreenNum(1);
//            HAT.Player.playerObject.setPosition(0,0);
//            HAT.Player.playerObject.resize(650,340);
            HAT.Player.playerObject.resize(1,1);
            HAT.Player.playerObject.setDebugMode(false);

            HAT.Param.initPage();
            HAT.User.initPage();
        });

        o.videoCtrl.eventCtrl.regPlayEvent(function(data){
            var ret = JSON.parse(data);
            if( ret.code != 0 ){
                var str = "播放错误,<span style='color:red;'>"+ret.code +", "+HAT.Main._errCmd[ret.code]+"</span>";
                HAT.Player.playerObject.uiCtrl.setTitleContext(str);
            }
            HAT._log._console("Play____"+data);
        });

        o.videoCtrl.eventCtrl.regStopEvent(function(data){
            HAT.Main.layer.clear();
            HAT._log._console("StopEvent_____"+data);
        });

        o.videoCtrl.eventCtrl.regStopAllEvent(function(data){
            HAT.Main.layer.clear();
            HAT._log._console("stopAll____"+data);
        });

        o.videoCtrl.eventCtrl.regDevAdd(function(data){
            HAT._log._console("DevAdd_____"+data);
        });

        o.videoCtrl.eventCtrl.regDevConnectEvent(function(data){
            //HAT.Player.enumNode();
            HAT._log._console("DevConnectEvent_____"+data);
        });

        o.videoCtrl.eventCtrl.regEnumNode(function(data){
            HAT._log._console("EnumNode_____"+data);
        });

        o.videoCtrl.eventCtrl.regAddChannel(function(data){
            HAT._log._console("addChannel_____"+data);
        });

        o.videoCtrl.eventCtrl.regStreamConnectError(function(data){
            HAT.msg.infoWarning("流连接错误!");
        });
    },

    /*
     * 添加设备
     *
     * */
    addDev : function(){
        this._handle(HAT.Player.target.addDevice, this._data);
    },

    /*
     * 枚举节点
     *
     * */
    enumNode : function(){
        this._handle(HAT.Player.target.enumNode, this._data);
    },

    /*
    * 手动添加节点
    * */
    addChannel : function(devName, channelId, pid){
        var data={
            "devname" : devName,
            "pid" : pid,
            "chanid" : channelId,
            "chncap" : channelId+"#0#tcp"
        };
        this._handle(HAT.Player.target.addChannel, data);
    },

     /*
     * 播放
     * @param {String} chanid  需要播放的通道id
     *
     * */
    play : function(chanid, title){
        HAT.Player.playerObject.videoCtrl.setVisibility(true);
        HAT.Player.playerObject.videoCtrl.setScreenNum(1);
        HAT.Player.playerObject.uiCtrl.setTitleContext(title||"")
        this._data.chanid = chanid || "";
        this._handle( HAT.Player.target.openStream, this._data );
        this.playerObject.resize(500,350);
        HAT.Main.layer.add();
    },
    /*

     * 停止播放
     *
     * */
    stop : function(){
        this._handle(HAT.Player.target.closeStream, this._data);
        HAT.Player.playerObject.videoCtrl.setVisibility(false);
        HAT.Main.layer.clear()
    }
};
