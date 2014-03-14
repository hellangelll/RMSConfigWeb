(function() {
    if( !window.HAT ) {
        window.HAT = {};
    }
})();

HAT.Tree = {
    //图标路径
    _oIconPath : {
        deviceOnline:"img/icon-tree-device-online.png",
        deviceOffline:"img/icon-tree-device-offline.png",
        channelOnline:"img/icon-tree-channel-online.png",
        channelOffline:"img/icon-tree-channel-offline.png"
    },

    //更节点数据
    _oTreeRoot : {
        "pId":"/",
        "id":"rms",
        "name":"rms",
        "isParent":true,
        "showAll":true, // true--显示已绑定和未绑定的所有节点  false--显示已绑定的节点
        "icon":"img/icon-tree-device.png",
        "nocheck":true,
        "status":true
    },

    //树的初始化参数
    _oTreeSetting : {
        async: {
//                enable: true,
//                url: "/"
        },
        check: {
            enable: false

        },
        keep:{
            parent:true
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pId",
                rootPId: 0
            }
        },
        view: {
            expandSpeed: ""
        },
        callback: {
            beforeExpand: function(treeId, treeNode){},
            onClick: function(event, treeId, treeNode){},
            onDblClick : function(event, treeId, treeNode){},
            beforeCheck : function(event, treeId, treeNode){}
        }
    },
    /*
    * 初始化树
    * @param {Object} oParent 父容器jq对象
    * @param {Object} oSetting 初始化树的参数
    * @return {Object} zTree 对象
    * */
    initTree : function(oParent, oSetting, nodes){
        if( !oParent || !oSetting ){
            return false;
        }

        return $.fn.zTree.init(oParent, oSetting, nodes);
    },

    //追加子节点
    addTreeNodes : function(parentNode, nodes, treeId){
        var tree = $.fn.zTree.getZTreeObj(treeId);
        if( tree && nodes ){
            tree.addNodes(parentNode, nodes, false);
        }
    },

    //更新子节点
    updateTreeNodes : function(parentNode, nodes, treeId){
        var tree = $.fn.zTree.getZTreeObj(treeId);
        if( tree && nodes ){
            tree.removeChildNodes(parentNode);
            tree.addNodes(parentNode, nodes, false);
        }
    }
};