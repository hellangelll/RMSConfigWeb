/*! rmsWebconfig 2014-03-14 author:hellangel*/
var HAT={version:"RMSConfig_V1.0.0",_bDebugMode:!0,errinfo:{0:"无错误","-101":"身份标识无效,请退出重新登录!","-102":"用户密码验证失败!","-103":"登录用户达上限!","-104":"登录用户非管理员!","-105":"读取数据库失败!","-106":"写入数据库错误!","-107":"打开进程失败!","-108":"客户端传入数据错误!","-110":"获取验证信息失败!","-111":"授权失败!","-112":"生成keyid错误!","-1001":"登录已过期,请退出重新登录!","-1002":"用户密码验证失败!","-1003":"登录用户达上限!","-1004":"登录用户非管理员!","-1005":"读取数据库失败!","-1006":"写入数据库错误!","-1007":"启动rms程序失败!","-1008":"客户端传入数据错误!","-1010":"获取授权验证信息失败!","-1011":"授权失败!","-1012":"生成keyid错误!","-1013":"数据库连接错误!","-1014":"未知错误!","-1050":"通道不存在!","-1051":"用户不存在!","-1052":"用户已存在!","-1053":"获取用户列表失败!","-1054":"添加用户失败!","-1055":"修改密码失败!","-1056":"获取通道列表失败!","-1057":"绑定用户通道失败!","-1058":"获取配置信息失败!","-1059":"设置配置信息失败!","-1060":"重置密码失败!","-1061":"授权已过期!"},target:{userlogin:"user_login",userlogout:"user_logout",paramcfg:"param_cfg",userlist:"user_list",useradd:"user_add",userlmodify:"userl_modify",userldel:"userl_del",restart:"restart",bindlist:"bind_list",channellist:"Channel_list",resetpwd:"reset_pwd",authkey:"auth_key",authcheck:"auth_check"},searchMode:{general:0,fuzzy:1},treeRootName:"rms",ajax:{_post:function(a,b){return a?(a=JSON.stringify(a),void $.ajax({data:a,type:"POST",async:!0,url:"/",dataType:"text",timeout:1e4,success:function(a){if(a){try{a=$.parseJSON(a)}catch(c){HAT.msg.infoError("JSON Format Error:"+c.toString())}0!=a.status&&(HAT.msg.infoError(HAT.errinfo[a.status]),("-101"==a.status||"-1001"==a.status)&&setTimeout(function(){window.location.href="index.html"},100)),b&&a&&b(a||{})}},error:function(a,b,c){throw"timeout"==b&&HAT.msg.infoError("访问超时:"+c),HAT.msg.infoError("访问失败"),{XMLHttpRequest:a,textStatus:b,errorThrown:c}}})):!1},post:function(a,b,c,d){var e=HAT.cookie.getCookie(),f={target:a,action:b,identify:e?e.identify:"",status:0,data:c};this._post(f,d)}},msg:{toString:function(){return"HAT.msg"},infoAlert:function(a,b){this._infoImpl(a,"c_alert_f",b)},infoCorrect:function(a,b){this._infoImpl(a,"c_correct_f",b)},infoWarning:function(a,b){this._infoImpl(a,"c_warning_f",b)},infoError:function(a,b){this._infoImpl(a,"c_error_f",b)},infoClear:function(){$("#c_msg_x").remove()},_infoImpl:function(a,b,c){$("#c_msg_x").remove();var d=$('<span id="c_msg_x"></span>');d.css({position:"absolute"}).addClass(b).html(a);var e=$("body");0>c?e.prepend(d):(c=void 0==c?5:c,e.prepend(d.fadeIn().delay(1e3*c).fadeOut()));var f=$("#c_msg_x"),g=f.position().top,h=function(a){f.delay(10).css({left:(e.width()-f.width())/2,top:a+$(document).scrollTop()})};h(g),$(window).bind("resize scroll",function(){h(g)})}},cookie:{setCookie:function(a){$.cookie("_Login",JSON.stringify(a))},getCookie:function(){return $.parseJSON($.cookie("_Login"))},clearCookie:function(){$.cookie("_Login",null)}},isOwnEmpty:function(a){for(var b in a)if(a.hasOwnProperty(b))return!1;return!0},_log:{_console:function(a){return HAT._bDebugMode?void("undefined"==typeof console||console.log(a)):!1},_info:function(a){return HAT._bDebugMode?void("undefined"==typeof console?alert(a):console.info(a)):!1},_err:function(a){"undefined"==typeof console?alert(a):console.error(a)},_print:function(a){if(!HAT._bDebugMode)return!1;try{var b=document.createElement("div"),c="position:absolute; border:1px; height:300px; width:400px;z-index:99999;";b.style.cssText=c,document.body.appendChild(b),b.innerText=a}catch(d){"undefined"==typeof console?alert("print err: "+d):console.log("print err: "+d)}}},logout:function(a){var b=HAT.cookie.getCookie(),c={identify:b?b.identify:""};HAT.ajax.post(HAT.target.userlogout,"set",c,function(){a&&a()})},IsClose:function(){if("msie"==HAT.Main.agent().name)try{HAT.Player.playerObject.tellReleaseOCX()}catch(a){}}};String.prototype.trim=function(){return this.replace(/(^\s*)|(\s*$)/g,"")},String.prototype.trimBlanks=function(){return this.replace(/(\s*)/g,"")};