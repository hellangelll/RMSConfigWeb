(function() {
	if( !window.HAT ) {
		window.HAT = {};
	}
})();

HAT.User = {
	//用户列表的table对象
	_oUserlistTable : "",
    //用户名列表
    _oUserNameList:[],
	_dialog : "",
	//通道列表
	_oChlList : null,
    //当前操作的用户名
    _sCurrentUsername : "",
	//已经绑定的通道
	_oBindList : null,

    //false-正常模式  true--查询模式
    searchFlag : false,

	initPage : function() {
		if( PosaUI.Table ) {
			HAT.User._oUserlistTable = new PosaUI.Table('userlist_table', {
				height : 300,
				footer : true,
				align : 'center',
				thead : [{
                    name:'<input type="checkbox" id="parentCheckbox" onclick="HAT.User.optAllUserList()">',
                    width:10,
                    align: 'center'
                },
                {
					name : '序号',
					width : 10,
					align : 'center'
				}, {
					name : '用户名',
					width : 30,
					align : 'center'
				}, {
					name : '通道数',
					width : 15,
					align : 'center'
				}, {
					name : '操作',
					width : 35,
					align : 'center'
				}]
			});

			HAT.User.getUserlistInfo();
		}
	},

	//获取用户列表信息
	getUserlistInfo : function(username) {
		var data = {"name":""};
        if( username ){
            data.name = username;
        }

		HAT.ajax.post(HAT.target.userlist, "get", data, function(data) {
			if( data.status==0 ) {
				HAT.User._oUserlistTable.clear();

                if( !data.data ){
                    HAT.msg.infoAlert("没有搜索到相关信息!");
                    return;
                }

				HAT.User.initUserlistTable(data.data);


                //添加用户名自动匹配数据库
                HAT.User._oUserNameList = [];

                var t = data.data.users;
                for(var i=0; i< t.length; i++){
                    HAT.User._oUserNameList[i]= {
                        label : t[i].name,
                        category : ""
                    };
                }
                $( "#searchName" ).catcomplete({
                    delay: 0,
                    source: HAT.User._oUserNameList
                }).val("");
			}
		});
	},

	//初始化用户列表
	initUserlistTable : function(data) {
		var user = data.users, tbl = HAT.User._oUserlistTable, a;
		if( tbl && user ) {
			for( var i = 0; i<user.length; i++ ) {
				tbl.append([user[i].name =="admin"?"":'<input type="checkbox" onclick="HAT.User.modifyStatus();" name="userListCheckbox" value="'+user[i].name+'" />' ,i+1, user[i].name, user[i].channel_count,
					tbl.btnPlay("查看", "HAT.User.showCheckUserlist('" + user[i].name + "')") + 
					tbl.btnEdit("修改", "HAT.User.showModifyChannellist('" + user[i].name + "')")+
					tbl.btnDel(false, "HAT.User.batchRemoveUser('" + user[i].name + "')")
				]);
			}
		}
	},

    //检测checkbox按钮状态
    modifyStatus : function(){
        var user = HAT.User.getCheckedUser();
        if( user.length <= 0 ){
            $("#parentCheckbox").prop("checked", false);
        }else if( user.length == HAT.User._oUserNameList.length-1 ){
            $("#parentCheckbox").prop("checked", true);
        }
    },

	//搜索用户
	searchUserByName : function() {
        this.getUserlistInfo($("#searchName").val() || "");
	},

	//删除用户
	batchRemoveUser : function(username) {
        var data={}, users = [];
		if( username == "admin" ){
			HAT.msg.infoAlert("不能删除 admin!");
			return false;
		}

        if( !confirm("确定要删除用户吗?") ){
            return false;
        }

		if( username ){ //删除某个指定用户
		    users[0] = {"name":username};
			data.users = users
		}else{  //批量删除
            data.users = this.getCheckedUser();
		}

        HAT.ajax.post(HAT.target.userldel, "set", data, function(data) {
            if( data.status == 0 ){
                HAT.msg.infoAlert("用户删除成功!");
                HAT.User.initPage();
            }
        });
	},

    //操作用户列表checkbox
    optAllUserList : function(){
        if( $("#parentCheckbox").is(":checked") ){
           $("input[name='userListCheckbox']").prop("checked", true)
        }else{
            $("input[name='userListCheckbox']").prop("checked", false);
        }
    },

	//显示添加用户对话框
	showAddUser : function() {
		$("#messages > div").removeClass("show").addClass("hide");
		$("#adduser").addClass("show");
		
		$("#inputAdduser_name").val("").focus();;
		$("#inputAdduser_pwd").val("");
		$("#inputAdduser_pwdr").val("");
	},
	
	//保存添加的用户
	saveAddUser : function(){
		var name = $("#inputAdduser_name").val(),
		pwd = $("#inputAdduser_pwd").val(),
		pwdr = $("#inputAdduser_pwdr").val(),
		data = {users:{}};
		
		if( !name || !pwd || !pwdr ){
			HAT.msg.infoError("请输入正确的参数!");
			return false;
		}
		
		if( pwd != pwdr ){
			HAT.msg.infoError("两次输入的密码不匹配!");
			$("#inputAdduser_pwd").val("");
			$("#inputAdduser_pwdr").val("");
			return false;
		}
		
		var pwd_ordered = hex_md5(name+"_"+pwd),
		pwd_reverse = hex_md5(pwd+"_"+name);
		
		data.users.name = name;
		data.users.pwd_ordered = pwd_ordered;
		data.users.pwd_reverse = pwd_reverse;
		
		
		HAT.ajax.post(HAT.target.useradd, "set", data, function(data) {
			if( data.status == 0 ){
				HAT.msg.infoAlert("用户添加成功!");
			}
		});
	},

    //重置密码
    resetUserPwd : function(){
        var data={};
        data.users = this.getCheckedUser();
        if( data.users.length <= 0 ){
            HAT.msg.infoWarning("请选择您要重置的用户!");
            return;
        }

        HAT.ajax.post(HAT.target.resetpwd, "set", data, function(data) {
            if( data.status == 0 ){
                HAT.msg.infoAlert("用户密码重置成功,密码默认为'123456'!");
                HAT.User.initPage();
            }
        });
    },

    //获取被选中的用户列表
    getCheckedUser : function(){
        var users =[];

        $.each($("input[name='userListCheckbox']"), function(i,n){
            if( $(n).prop("checked") ){
                users[i] = {"name":n.value};
            }
        });

        return users;
    },
	
	//保存修改用户密码参数
	saveModifyPwd : function(){
		var name = $("#modifyPwd_name").text(),
		pwdo = $("#inputModifypwd_pwdo").val(),
		pwdn = $("#inputModifypwd_pwdn").val(),
		pwdnr = $("#inputModifypwd_pwdnr").val(),
		data = {users:{}};
		
		if( name == "" || pwdo == "" || pwdn == "" || pwdnr =="" ){
			HAT.msg.infoError("请输入合法数据!");
			return false;
		}
		
		if( pwdn != pwdnr ){
			HAT.msg.infoError("两次输入密码不匹配!");
			$("#inputModifypwd_pwdo").val("");
			$("#inputModifypwd_pwdn").val("");
			$("#inputModifypwd_pwdnr").val("");
			return false;
		}
		
		var pwd_ordered = hex_md5(name+"_"+pwdn),
		pwd_reverse = hex_md5(pwdn+"_"+name);
		
		data.users.name = name;
		data.users.old_pwd = hex_md5(name+"_"+pwdo);
		data.users.new_pwd_ordered = pwd_ordered;
		data.users.new_pwd_reverse = pwd_reverse;
		
		
		HAT.ajax.post(HAT.target.userlmodify, "set", data, function(data) {
			if( data.status == 0 ){
				HAT.msg.infoAlert("用户密码修改成功!");
			}
		});
	},

	//显示修改用户对应通道页面
    showModifyChannellist : function(name) {
        $("#channelSearchName").val("");
        HAT.User._sCurrentUsername = name;
        var oChannelList$ = $("#channelList-list");

        $("#messages > div").removeClass("show").addClass("hide");
        $("#bindChanel").addClass("show");

        $("#bindChanel_name").text(name);

        var setting = HAT.Tree._oTreeSetting;
        setting.check.enable = true;
        setting.check.chkStyle = "checkbox";
        setting.check.chkboxType = {"Y":"ps","N":"ps"};
        setting.check.autoCheckTrigger = true;
        setting.callback.beforeExpand = HAT.User.beforeExpandCallback;
        setting.callback.onClick = HAT.User.onClickCallbackForListModify;
        setting.callback.beforeCheck = HAT.User.onCheckCallback;

        HAT.Tree._oTreeRoot.showAll = true;

        //重置搜索标志
        HAT.User.searchFlag = false;

        //初始化树
        var oTree = HAT.Tree.initTree(oChannelList$, setting, HAT.Tree._oTreeRoot);
        if(oTree)
        {
            HAT.User.getChannelList(name, oTree.getNodeByParam("id", HAT.treeRootName), "channelList-list", HAT.searchMode.general, HAT.User.showChannelListTree);
        }
    },

    //显示所有的设备树
    showChannelListTree : function(data, treeNode, treeId){
        var channels = data.channel_list, oTree = $.fn.zTree.getZTreeObj("channelList-list"), nodes=[], parentNode={}, bStatus = true;
        if( channels && oTree ){
            for(var i=0; i< channels.length; i++){
                //兼容老版本程序
                if( typeof channels[i].status != "undefined" ){
                    bStatus = channels[i].status;
                }

                nodes[i] = {
                    "pId": channels[i].pid,
                    "id" : channels[i].name,
                    "name" : channels[i].title,
                    "checked":channels[i].binded,
                    "isHidden": false,
                    "status" : bStatus,
                    "icon": HAT.User.getChannelIcon(channels[i].nodetype, bStatus)
                };

                if( !HAT.User.searchFlag ){
                    nodes[i].isParent = channels[i].nodetype;
                    $("#btnUncheckAllNodes").removeClass("hide");
                    $("#btnCheckAllNodes").removeClass("hide");
                }else{
                    $("#btnUncheckAllNodes").addClass("hide");
                    $("#btnCheckAllNodes").addClass("hide");
                }
            }

            //如果是模糊查询的话 treeNode的值就是查询的关键字
            if( typeof treeNode == "string" ){
                parentNode = oTree.getNodeByParam("id", HAT.treeRootName);
            }else if( typeof treeNode == "object" ){  //如果是普通查询的话, treeNode的值就为当前查询的父节点对象
                parentNode = treeNode;
            }

            HAT.Tree.updateTreeNodes(parentNode, nodes, treeId);
        }
    },

    //获取通道的图标
    getChannelIcon : function(type, status){
        var str = "";
        if( type ){
            if( status ){
                str = HAT.Tree._oIconPath.deviceOnline;
            }else{
                str = HAT.Tree._oIconPath.deviceOffline;
            }
        }else{
            if( status ){
                str = str = HAT.Tree._oIconPath.channelOnline;
            }else{
                str = str = HAT.Tree._oIconPath.channelOffline;
            }
        }
        return str;
    },
	
	//显示修改用户密码页面
	showModifyPwd : function(name){
		$("#messages > div").removeClass("show").addClass("hide");
		$("#updateuser").addClass("show");
		
		$("#inputModifypwd_pwdo").val("").focus();
		$("#inputModifypwd_pwdn").val("");
		$("#inputModifypwd_pwdnr").val("");
		$("#modifyPwd_name").text(name);
	},

	//显示用户对应通道查看页面
	showCheckUserlist : function(name) {
        HAT.User._sCurrentUsername = name;
        var oDeviceList = $("#deviceList-list");
		$("#messages > div").removeClass("show").addClass("hide");
		$("#usercheck").addClass("show");
		
		$("#userlist_name").text(name);

        var setting = HAT.Tree._oTreeSetting;
        setting.check.enable = false;
        setting.callback.beforeExpand = HAT.User.beforeExpandCallback;
        setting.callback.onClick = HAT.User.onClickCallbackForListDisplay;
        setting.callback.onDblClick = HAT.User.onRightClickCallbackForListDisplay;

        HAT.Tree._oTreeRoot.showAll = false;

        //初始化树
        var oTree = HAT.Tree.initTree(oDeviceList, setting, HAT.Tree._oTreeRoot);
        if(oTree)
        {
            HAT.User.getChannelList(name, oTree.getNodeByParam("id", HAT.treeRootName), "deviceList-list", HAT.searchMode.general, HAT.User.showUserBindTree);
        }
	},
	
	//获取设备列表
    //如果是模糊查询的话 searchflag=1  treeNode的值就是查询的关键字
    //如果是普通查询的话 searchflag=0  treeNode的值就为当前查询的父节点对象
	getChannelList : function(name, treeNode, treeId, searchflag, callback){
		var data={
            "name":name,
            "channelname" : searchflag ? treeNode : treeNode.id,  //通道列表名称  为空的话  就是查询当前级别的所有通道
            "searchflag" : searchflag     //0--正常  1--模糊搜索
        };

		HAT.ajax.post(HAT.target.channellist, "get", data, function(data) {
			if( data.status == 0 ){
                if( !data.data || !data.data.channel_list ){
                    if( searchflag ){
                        HAT.msg.infoAlert("没有找到与之相关的设备!");
                        var oTree = $.fn.zTree.getZTreeObj("channelList-list");
                        oTree.removeChildNodes(oTree.getNodeByParam("id", HAT.treeRootName));
                    }else{
                        HAT.msg.infoAlert("该设备还没有添加通道!")
                    }
                    return;
                }
                if( callback ){
                    callback(data.data, treeNode, treeId);
                }
			}
		});
	},

    //显示用户已经绑定了的设备树
    showUserBindTree : function(data, treeNode, treeId){
        var channels = data.channel_list, oTree = $.fn.zTree.getZTreeObj("deviceList-list"), nodes=[], bStatus = true;

        if( channels && oTree ){
            for(var i=0; i< channels.length; i++){

                //兼容老版本程序
                if( typeof channels[i].status != "undefined" ){
                    bStatus = channels[i].status;
                }
                nodes[i] = {
                    "pId": channels[i].pid,
                    "id" : channels[i].name,
                    "name" : channels[i].title,
                    "isParent": channels[i].nodetype,
                    "isHidden": !channels[i].binded,
                    "status" : bStatus,
                    "icon": HAT.User.getChannelIcon(channels[i].nodetype, bStatus)
                };
            }

            HAT.Tree.updateTreeNodes(treeNode, nodes, treeId);
        }
    },

	//设置用户通道绑定
    saveBindChannel : function(treeNode){
        var list = {
                "title" : treeNode.name,
                "name" : treeNode.id,
                "pid" : treeNode.pId,
                "binded" : treeNode.checked,
                "nodetype" : treeNode.isParent
            },
            data={
                "name" : $("#bindChanel_name").text(),
                "channel_list" : [list]
            };

        HAT.ajax.post(HAT.target.channellist, "set", data, function(data) {
            if( data.status == 0 ){
                HAT.msg.infoAlert("配置已保存!");
            }
        });
	},

    //搜索指定用户绑定的指定关键字的通道
    searchChannelByName : function(){
        var sUsername = $("#bindChanel_name").text(),
            sKeyword = $("#channelSearchName").val();
        if( !sKeyword ){
            HAT.msg.infoWarning("请输入需要查找的关键字!");
            return;
        }

        HAT.User.searchFlag = true;

        HAT.User.getChannelList(sUsername, sKeyword, "channelList-list", HAT.searchMode.fuzzy, HAT.User.showChannelListTree);
    },

    //全选和全不选
    checkAllNodes : function(bShow){
        var str = bShow ? "'绑定所有设备'":"'取消所有设备的绑定'";
        if( !confirm("您确定要"+str+"? 该操作是不可逆的,建议您谨慎操作!") ){
            return false;
        }

        var tree = $.fn.zTree.getZTreeObj("channelList-list");
        if( tree ){
            tree.checkAllNodes(bShow);
        }

        var node = tree.getNodeByParam("id", HAT.treeRootName);
        var list = {
                "title" : node.name,
                "name" : node.id,
                "pid" : node.pId,
                "binded" : bShow,
                "nodetype" : node.isParent
            },
            data={
                "name" : $("#bindChanel_name").text(),
                "channel_list" : [list]
            };

        HAT.ajax.post(HAT.target.channellist, "set", data, function(data) {
            if( data.status == 0 ){
                HAT.msg.infoAlert("配置已保存!");
            }
        });
    },

    //刷新修改通道界面的通道
    refreshChannelList : function(){
        $("#channelSearchName").val("");
        var tree = $.fn.zTree.getZTreeObj("channelList-list");
        HAT.User.searchFlag = false;
        HAT.User.getChannelList($("#bindChanel_name").text(), tree.getNodeByParam("id", HAT.treeRootName), "channelList-list", HAT.searchMode.general, HAT.User.showChannelListTree);
    },

    //通道查看页面的树节点点击的回调函数
    onClickCallbackForListDisplay : function(event, treeId, treeNode){
        //TODO
        return true;
    },

    // 通道查看页面的树节点右键点击的回调函数
    onRightClickCallbackForListDisplay : function(event, treeId, treeNode){
//        if( 'msie' === HAT.Main.agent().name ){
//            HAT.msg.infoAlert("您使用的IE浏览器暂时不被支持, 如需观看视频, 请使用最新版chrome或者firefox浏览器!");
//            return false;
//        }

        if( !treeNode.status ){
            HAT.msg.infoAlert("该通道不在线!");
            return;
        }

        if( treeNode.isParent ){
            HAT.msg.infoAlert("该节点不是通道!");
            return;
        }
        HAT.Player.addChannel(HAT.Param.param.rms_id, treeNode.id, treeNode.pId);
//        console.log(treeNode.id);
        HAT.Player.play(treeNode.id, "正在播放通道 "+treeNode.name+" 的实时视频!");
    },

    //通道修改页面的树展开之前的回调函数
    beforeExpandCallback : function(treeId, treeNode){
        var callback={};
        if( HAT.Tree._oTreeRoot.showAll ){
            callback = HAT.User.showChannelListTree;
        }else{
            callback = HAT.User.showUserBindTree;
        }
        if( HAT.User.searchFlag ){
            return ;
        }
        if (!treeNode.isAjaxing) {
            HAT.User.getChannelList(HAT.User._sCurrentUsername, treeNode, treeId, HAT.searchMode.general, callback);
            return true;
        } else {
            alert("正在下载数据中，请稍后展开节点。。。");
            return false;
        }
    },

    //通道修改页面的树节点点击的回调函数
    onClickCallbackForListModify : function(event, treeId, treeNode){
        var treeObj = $.fn.zTree.getZTreeObj(treeId), loopFlag = true;

        if( !treeObj || !treeNode ){
            return;
        }

        treeNode.checked = !treeNode.checked;
        treeObj.updateNode(treeNode, true);

        HAT.User.saveBindChannel(treeNode);

//        while(loopFlag)
//        {
//            //如果是选中节点  就退出循环
//            if( treeNode.checked ){
//                loopFlag = false;
//                continue;
//            }
//
//            treeNode = treeNode.getParentNode();
//            //如果已经到根节点  就退出循环
//            if( treeNode == null || !treeNode || treeNode.name == HAT.treeRootName ){
//                loopFlag = false;
//                continue;
//            }
//
//            if( !treeNode.checked ){
//                HAT.User.saveBindChannel(treeNode);
//            }
//        }
    },

    //点击checkbox的回调
    onCheckCallback : function(treeId, treeNode){
        //HAT._log._console(treeNode.tId + ", " + treeNode.name + "," + treeNode.checked);

        HAT.User.onClickCallbackForListModify("", treeId, treeNode);
        return false;
    }
};
