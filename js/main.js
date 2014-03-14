(function() {
	if( !window.HAT ) {
		window.HAT = {};
	}
})();

HAT.Main = {
	loginInfo : {
		identify : "",
		username : "",
		password : "",
		pwd_ordered : "",
		pwd_reverse : ""
	},

    //获取浏览器相关信息
    agent:function(){
        var a={},userAgent=navigator.userAgent.toLowerCase(),s;
        (s=userAgent.match(/msie ([\d.]+)/))?a.ie=s[1]:(s=userAgent.match(/firefox\/([\d.]+)/))?a.firefox=s[1]:(s=userAgent.match(/chrome\/([\d.]+)/))?a.chrome=s[1]:(s=userAgent.match(/opera.([\d.]+)/))?a.opera=s[1]:(s=userAgent.match(/version\/([\d.]+).*safari/))?a.safari=s[1]:0;
        var b='',version='';
        if(a.ie){
            b='msie';
            version=a.ie
        }
        else if(a.firefox){
            b='firefox';
            version=a.firefox
        }
        else if(a.chrome){
            b='chrome';
            version=a.chrome
        }
        else if(a.opera){
            b='opera';
            version=a.opera
        }
        else if(a.safari){
            b='safari';
            version=a.safari
        }
        else{
            b='unknown'
        }
        return{
            name:b,version:version.split('.')[0],versions:version
        }
    },

    /**
     * 检测插件是否安装
     * @param {String} a 插件名
     * @return {Boolean}
     * */
    hasPlugin:function(a){
        if(!a)return false;
        a=a.toLowerCase();
        var b=window.navigator.plugins;
        for(var i=0;i<b.length;i++){
            if(b[i]&&b[i].name.toLowerCase().indexOf(a)>-1){
                return true
            }
        }
        return false
    },

    //播放错误码
    _errCmd : {
        //操作错误码
        "-1" : "未知错误",
        "-9001" : "库加载失败",
        "-9002" : "构造组件失败",
        "-9003" : "参数错误",
        "-9004" : "JSON错误",
        "-9005" : "所选窗口不可用",
        "-9006" : "没有实现该功能",
        "-9007" : "HOSTID不可用",
        "-9008" : "HOSTNAME不可用",
        "-9009" : "CHANNAME不可用",
        "-9010" : "通道已经打开",
        "-9011" : "线程创建失败",

        //SDK错误码
        "0" : "成功",
        "-1001" : "未知错误",
        "-1002" : "缺少组件或驱动",
        "-1003" : "非法的cp组件",
        "-1004" : "非法参数",
        "-1005" : "内存不足",
        "-1006" : "该对象已存在",
        "-1007" : "该对象不存在",
        "-1008" : "该功能未实现",
        "-1009" : "内部错误",
        "-1010" : "连接管道服务失败(win)",
        "-1011" : "读管道数据失败",
        "-1012" : "写管道数据失败",
        "-1013" : "不支持的命令请求",
        "-1014" : "错误的用户名密码",
        "-1015" : "连接设备失败",
        "-1016" : "未连接设备",
        "-1017" : "网络错误",
        "-1018" : "接口未实现",
        "-1019" : "SDK返回未知错误",
        "-1020" : "源流打开失败",
        "-1021" : "目标流打开失败"
    },

    //层对象
    layer:{
        toString:function(){
            return'HAT.Main.layer';
        },
        add:function(b){
            if($('#HATools-layer').length>0){
                this.clear();
            }
            var c="数据处理中...";
            if(!b){
                c=b;
            }
            var d=$('<div></div>'),doc=$(document),txt=$(['<span>',c,'</span>'].join(''));
            d.attr('id','HATools-layer').html(txt);
            var e=function(){
                var a=doc.height()/2+doc.scrollTop();
                txt.css({
                    top:a,left:(doc.width()-txt.width())/2,position:'absolute'
                });
                d.css({
                    height:doc.height()
                })
            };
            $('body').append(d);
            e();
            $(window).bind('resize scroll',function(){
                e();
            });
            return this;
        },
        clear:function(){
            $('#HATools-layer').remove();
            return this;
        },
        clearAll:function(){
            $('.HATools-mask').remove();
            return this ;
        },
        addInfo:function(a,b){
            var c=$('#HATools-layer span');
            b?c.append(a):c.html(a);
            return this;
        },
        mask:function(a,b){
            $('#'+a.attr('masker')).remove();
            var c='HATools-mask-'+HATools.random(),o_h=a.outerHeight(),o_w=a.outerWidth(),pos=a.position(),txt=$(['<div>',(b?b:''),'</div>'].join('')),mask=$(['<div class="HATools-mask" id="',c,'"></div>'].join(''));
            a.after(mask).attr('masker',c);
            mask.append(txt).css({
                position:'absolute',top:pos.top,left:pos.left,height:o_h,width:o_w
            });
            txt.css({
                top:(o_h-txt.height())/2,left:(o_w-txt.width())/2
            });
            return mask;
        },
        clearMask:function(a){
            if(a){
                $('#'+a.attr('masker')).remove();
            }
            else{
                $('.HATools-mask').remove();
            }
            return this;
        },
        move2Center:function(a,b,c){
            var d=$(document),_resetPos=function(){
                a.css({
                    'z-index':c?c:0,position:'absolute',left:(d.width()-a.width())/2,top:d.scrollTop()+(($.browser.msie?d.height():window.innerHeight)-a.height())/2
                })
            };
            _resetPos();
            if(b){
                $(window).bind('resize scroll',function(){
                    _resetPos();
                })
            }
            return a;
        }
    }
};
