(function() {
	if( !window.HAT ) {
		window.HAT = {};
	}
})();

HAT.Login = {
	initPage : function(){
		$("#loginDiv").modal('show');
		
		$("#btnLogin").bind("click", function(){
			HAT.Login.userlogin();
		});

        $("#username").focus();
	},
	//登录
	userlogin : function() {
		var name = $("#username").val(),action="set";
		var pwd = $("#password").val(), pwd_ordered;
		if( !name || !pwd ){
			HAT.msg.infoWarning("请输入正确的用户名和密码!");
			return false;
		}
		
		if( name != "admin" ){
			HAT.msg.infoWarning("该用户没有权限登陆本系统,本系统只能管理员登陆!");
            window.location.href = "http://192.168.15.111?username="+name+"&pwd="+hex_md5(name+"_"+pwd);
			return false;
		}
		
		pwd_ordered = hex_md5(name+"_"+pwd);

		var data = {
			"name" : name,
			"pwd_ordered" : pwd_ordered //md5加密 32位小写
		};
		
		HAT.ajax.post(HAT.target.userlogin, action, data, function(data) {
			if( data.status == 0 ){
				var name = $("#username").val(), pwd = $("#password").val(), o={};
				o.identify = data.data.identify;
				o.username = name;
				o.password = pwd;
				o.pwd_ordered = hex_md5(name+"_"+pwd);
				o.pwd_reverse = hex_md5(pwd+"_"+name);
				HAT.cookie.setCookie(o);
				
				window.location.href = "main.html";
			}
		});
	},
	
	bindKey : function (keycode, element, callback) {
		element.keydown(function (e) {
			if(e.keyCode == keycode) {
				if(typeof callback == 'function')
					callback(element, e);
			}
		});
	}

};

