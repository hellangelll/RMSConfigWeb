(function () {
    if (!window.HAT) {
        window.HAT = {};
    }
})();

HAT.Param = {
    //配置参数;
    param : {},

    initPage: function () {
        $("#btnLoginout").bind("click", function () {
            HAT.logout(function(){
                window.location.href = "index.html";
            });
        });

        $("#btnSaveParamCfg").bind("click", function () {
            HAT.Param.saveParamCfg();
        });

        $("#btnRebootDevice").bind("click", function () {
            if (confirm("您确定要重启设备吗!")) {
                HAT.Param.saveRebootDevice();
            }
        });

        $("#authentication ~ ul a").bind("click", function () {
            $("#authentication span:first").text($(this).text());
        });

        this.getParamCfg();
    },

    getParamCfg: function () {
        var data = {};
        HAT.ajax.post(HAT.target.paramcfg, "get", data, function (data) {
            if (data.status == 0) {
                $(".panel-primary").removeClass("hide");
                HAT.Param.param = data.data;
                HAT.Param.initParam(data.data);
                HAT.treeRootName = data.data.rms_id;
                HAT.Tree._oTreeRoot.id = data.data.rms_id;
                HAT.Tree._oTreeRoot.name = data.data.rms_title;
                HAT.Player.initData();
            }
        });
    },

    setParamCfg: function (data) {
        if (!data) {
            return false;
        }

        HAT.ajax.post(HAT.target.paramcfg, "set", data, function (data) {
            if (data.status == 0) {
                HAT.msg.infoAlert("参数配置成功, <span style='color:red;'>需要重启设备才会生效</span>!");
            }
        });
    },

    //初始化页面数据
    initParam: function (data) {
        if (data.command_encryption) {
            $("#command_encryption").attr("checked", true);
        } else {
            $("#command_encryption").attr("checked", false);
        }

        if (data.stream_encryption) {
            $("#stream_encryption").attr("checked", true);
        } else {
            $("#stream_encryption").attr("checked", false);
        }

        $("#heartbeat_timeout").val(data.heartbeat_timeout);

        $("#superior_rms_address").val(data.superior_rms_address);

        $("#rms_id").val(data.rms_id);

        $("#superior_rms_port").val(data.superior_rms_port);

        $("#rms_title").val(data.rms_title);

        $("#cms_url").val(data.cms_url);

        $("#rms_foreign_address").val(data.rms_foreign_address);

        $("#rms_foreign_port").val(data.rms_foreign_port);

        //鉴权方法
        $("#authentication span:first").text(data.authentication);

        $("#remark").val(data.remark);

        //如果不是local模式,就隐藏设备绑定
        if( data.authentication != "local" ){
            $("#tab_userset").addClass("hide");
            $("#mdypwdreturnlist").addClass("hide");
            $("#tab_modifypsd").removeClass("hide");
        }else{
            $("#tab_modifypsd").addClass("hide");
            $("#tab_userset").removeClass("hide");
            $("#mdypwdreturnlist").removeClass("hide");
        }
    },

    saveParamCfg: function () {
        var data = {};

        data.command_encryption = $("#command_encryption").is(":checked");

        if ($("#authentication span:first").text() != "") {
            data.authentication = $("#authentication span:first").text();
        }

        if ($("#heartbeat_timeout").val() != "") {
            data.heartbeat_timeout = $("#heartbeat_timeout").val();
        } else {
            HAT.msg.infoWarning("请输入合法心跳超时时间!");
            return false;
        }

        if ($("#superior_rms_address").val() != "") {
            data.superior_rms_address = $("#superior_rms_address").val();
        } else {
            if( data.authentication == "rms" ){
                HAT.msg.infoWarning("上级RMS地址只能是IP地址!");
                return false;
            }
        }

        if ($("#rms_id").val() != "") {
            data.rms_id = $("#rms_id").val();
        } else {
            HAT.msg.infoWarning("请输入合法RMS ID!");
            return false;
        }

        if ($("#superior_rms_port").val() != "") {
            data.superior_rms_port = $("#superior_rms_port").val();
        } else {
            if( data.authentication == "rms" ){
                HAT.msg.infoWarning("请输入合法上级RMS端口!");
                return false;
            }
        }

        if ($("#rms_title").val() != "") {
            data.rms_title = $("#rms_title").val();
        } else {
            HAT.msg.infoWarning("请输入合法RMS TITLE!");
            return false;
        }

        if ($("#cms_url").val() != "") {
            data.cms_url = $("#cms_url").val();
        } else {
            if( data.authentication == "vrm" || data.authentication == "cms" ){
                HAT.msg.infoWarning("请输入正确的CMS URL地址!");
                return false;
            }
        }

        if ($("#rms_foreign_address").val() != "") {
            data.rms_foreign_address = $("#rms_foreign_address").val();
        } else {
            HAT.msg.infoWarning("请输入正确的RMS URL地址!");
            return false;
        }

        if ($("#rms_foreign_port").val() != "") {
            data.rms_foreign_port = $("#rms_foreign_port").val();
        } else {
            HAT.msg.infoWarning("请输入合法RMS对外服务端口!");
            return false;
        }

        data.stream_encryption = $("#stream_encryption").is(":checked");

        data.remark = $("#remark").val();

        HAT.Param.setParamCfg(data);
    },

    //设备重启
    saveRebootDevice: function () {
        HAT.ajax.post(HAT.target.restart, "set", {}, function (data) {
            if (data.status == 0) {
                alert("设备即将重启,请稍等片刻!");
                //window.location.href = "index.html";
            }
        });
    }
};
