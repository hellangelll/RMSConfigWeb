/**
 * @version 0.0.1.10
 * @date 2013.09.09
 */

/**
 * @name JSVideoCtrl
 * @class 视频插件,动态生成 netposa web video realtime control
 * @author hellangel
 * @param {Object} m_oParentObj 父对象 jquery对象 为空就自己创建
 * @param {String} m_sUserRight 用户权限
 * @param {String} m_sUIInfo 控件UI信息 css文件的路径
 * @param {Object} m_oFuncInfo 控件的功能列表信息 不传则使用默认值
 * m_oFuncInfo:{
 * 	bWindowMode:false,
 * 	bShowScreenCtrl:true,
 *  bShowPlayCtrl:true,
 *  bShowParaCtrl:true,
 *  iWhichShowOnTop:0-screen 1-playctrl
 oControl : {
 bRecord : true,
 bTalkback : true,
 bCapture : true,
 bAudio : true,
 bStopAll : true,
 bStop : true,
 bReplay : true
 },
 oWindow : {
 bOne : true,
 bFour : true,
 bNine : true,
 bFull : true
 }
 * }
 * @param {Object} m_oLanguageInfo 控件的语言包对象 定义见 _oLanguagePackage
 * @return {Object} externalInterface
 * @constructor
 * @requires jquery1.7.0+
 * @example var o = new JSVideoCtrl();
 * */
function JSVideoCtrl(m_oParentObj, m_sUserRight, m_sUIInfo, m_oFuncInfo, m_oLanguageInfo) {
	var JSVideoCtrl = {
		/**
		 * 宏定义
		 */
		_macro : {
			_ptzCmd : {
				TCSP_PTZ_PANRIGHT : 0, //右
				TCSP_PTZ_RIGHTUP : 1, //右上
				TCSP_PTZ_TILTUP : 2, //上
				TCSP_PTZ_LEFTUP : 3, //左上
				TCSP_PTZ_PANLEFT : 4, //左
				TCSP_PTZ_LEFTDOWN : 5, //左下
				TCSP_PTZ_TILTDOWN : 6, //下
				TCSP_PTZ_RIGHTDOWN : 7, //右下
				TCSP_PTZ_SCAN : 8, //扫描
				TCSP_PTZ_HALT : 9, //停止
				TCSP_PTZ_IRIS : 10, //光圈 param<0光圈缩小，>0光圈放大，=0停止动作
				TCSP_PTZ_ZOOM : 11, //焦距 param<0焦距变小(倍率变小),>0焦距变大(倍率变大),=0停止动作
				TCSP_PTZ_FOCUS : 12, //焦点 param<0焦点后调,>0焦点前调,=0停止动作
				TCSP_PTZ_VIEW : 13, //预置位  param为转到预预置点的序号
				TCSP_PTZ_SETVIEW : 14, //设置预置位 param为设置预置点的序号
				TCSP_PTZ_AUX : 15, //辅助
				TCSP_PTZ_WASH : 16,
				TCSP_PTZ_WIPE : 17,
				TCSP_PTZ_LIGHT : 18, //灯光
				TCSP_PTZ_POWER : 19,
				TCSP_PTZ_FLASHBACK : 20,
				TCSP_PTZ_DEVKEY : 21,
				TCSP_PTZ_LOCKCAM : 22,
				TCSP_PTZ_UNLOCKCAM : 23,
				TCSP_PTZ_EXCLUSIVE : 24,
				TCSP_PTZ_INCLUSIVE : 25,
				TCSP_PTZ_GET_OPINFO : 26,
				TCSP_PTZ_CHANGE_MY_LEVEL : 27,
				CPM_PTZ_CLEARVIEW : 28 ,    //清除预置位				
				CPM_PTZ_FAN : 29     //风扇				

			},

			_eventCmd : {
				RMSCLIENTSDK_SDK_EVENT_DEV_BROKEN : 1225, //设备断线
				RMSCLIENTSDK_SDK_EVENT_DEV_CONNECT : 1226, //设备连接上
				RMSCLIENTSDK_SDK_EVENT_STREAM_BROKEN : 1227, //流断线
				RMSCLIENTSDK_SDK_EVENT_STREAM_CONNECT : 1228, //流连接上
				RMSCLIENTSDK_SDK_EVENT_SERVE_RUNNING : 1229, //设备服务启动OK
				RMSCLIENTSDK_SDK_EVENT_SERVE_HALT : 1230, //设备服务挂掉
				RMSCLIENTSDK_SDK_EVENT_NODE_CHANGE : 1231, //节点改变
                RMSCLIENTSDK_SDK_EVENT_STREAM_CONNECT_ERROR : 1232, //流连接错误
				RMSCLIENTSDK_WINDOW_EVENT_SELECTWINDOW_CHANGE : 1125, //选中窗体改变
				RMSCLIENTSDK_WINDOW_EVENT_INIT_FINISHED : 1126, //初始化控件完成

				RMSCLIENTSDK_COMMAND_EVENT_ADDDEV : 1325, //添加设备
				RMSCLIENTSDK_COMMAND_EVENT_DELDEV : 1326, //删除设备
				RMSCLIENTSDK_COMMAND_EVENT_DELALLDEV : 1327, //删除所有设备
				RMSCLIENTSDK_COMMAND_EVENT_REFRESHDEV : 1328, //刷新设备
				RMSCLIENTSDK_COMMAND_EVENT_REFRESHALLDEV : 1329, //刷新所有设备
				RMSCLIENTSDK_COMMAND_EVENT_ENUMNODE : 1330, //枚举节点
				RRMSCLIENTSDK_COMMAND_EVENT_OPENSTREAM : 1331, //开流
				RMSCLIENTSDK_COMMAND_EVENT_CLOSESTREAM : 1332, //关流
                RMSCLIENTSDK_COMMAND_EVENT_CLOSEALLSTREAM : 1333, //关闭所有通道
				RMSCLIENTSDK_COMMAND_EVENT_PTZ : 1334, //云台控制
				RMSCLIENTSDK_COMMAND_EVENT_VIDEOCOLORGET : 1335, //获取视频参数
				RMSCLIENTSDK_COMMAND_EVENT_VIDEOCOLORSET : 1336, //设置视频参数
				RMSCLIENTSDK_COMMAND_EVENT_FILESEARCH : 1337, //查询历史文件
				RMSCLIENTSDK_COMMAND_EVENT_FILEPLAYBYTIME : 1338, //按时间播放历史文件
				RMSCLIENTSDK_COMMAND_EVENT_FILEPLAYBYNAME : 1339, //按文件名播放历史文件
				RMSCLIENTSDK_COMMAND_EVENT_FILEDOWNLOADBYTIME : 1340, //按时间下载历史文件
				RMSCLIENTSDK_COMMAND_EVENT_FILEDOWNLOADBYNAME : 1341, //按文件名下载历史文件
				RMSCLIENTSDK_COMMAND_EVENT_FILEIDCTRL : 1342, //历史文件ID控制
				RMSCLIENTSDK_COMMAND_EVENT_FILEIDSTOP : 1343, //历史文件ID关闭
				RMSCLIENTSDK_COMMAND_EVENT_ADDCHAN : 1344, //添加通道
				RMSCLIENTSDK_COMMAND_EVENT_URLOPENSTREAM : 1347, //url开流
				RMSCLIENTSDK_COMMAND_EVENT_URLCLOSESTREAM : 1348 //url关流

			},

			_fileCtlCmd : {
				//远程文件控制命令
				CPMSDK_VOD_PLAY : 0, //      [IN]NO   [OUT]NO
				CPMSDK_VOD_STOP : 1, //      [IN]NO   [OUT]NO
				CPMSDK_VOD_PAURSE : 2, //     [IN]NO   [OUT]NO
				CPMSDK_VOD_CONTINUE : 3, //      [IN]NO   [OUT]NO
				CPMSDK_VOD_SETPOS : 4, //      [IN]YES  [OUT]NO
				CPMSDK_VOD_GETPOS : 5, //     [IN]NO   [OUT]YES
				CPMSDK_VOD_SETPROCESSRARE : 6, //   [IN]YES  [OUT]NO //进度百分比[0-100]
				CPMSDK_VOD_GETPROCESSRARE : 7, // [IN]NO   [OUT]YES //获取进度百分比[0-100],100: 完成，-1: 异常
				CPMSDK_VOD_GETDURATION : 8, // [IN]NO   [OUT]YES
				CPMSDK_VOD_SETSPEED : 9 //  [IN]YES  [OUT]NO
			},

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
			}
		},

		/**
		 * 日志模块
		 * @lends JSVideoCtrl.prototype
		 * @private
		 */
		_log : {
			/**
			 * 打印信息(非开发模式不打印)
			 * @method _console
			 * @param{String} msg
			 */
			_console : function(msg) {
				if( !JSVideoCtrl._oVariableObj._bDebugMode )
					return false;

				if( ( typeof (console)=="undefined") ) {
					alert(msg);
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
			_info : function(msg) {
				if( !JSVideoCtrl._oVariableObj._bDebugMode )
					return false;

				if( ( typeof (console)=="undefined") ) {
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
			_err : function(msg) {
				// if( !CtrlPanel._oVariableObj._bDebugMode )
				// return false;

				if( ( typeof (console)=="undefined") ) {
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
			_print : function(msg) {
				if( !JSVideoCtrl._oVariableObj._bDebugMode )
					return false;

				try {
					var debugDiv = document.createElement("div");
					var css = 'position:absolute; border:1px; height:300px; width:400px;';
					debugDiv.style.cssText = css;
					document.body.appendChild(debugDiv);

					debugDiv.innerText = msg;
				}
				catch(e) {
					if( ( typeof (console)=="undefined") ) {
						alert("print err: " + e);
					}
					else {
						console.log("print err: " + e);
					}
				}
			}
		},

		/**
		 * 内部使用的检测工具
		 * @private
		 * @lends JSVideoCtrl.prototype
		 * */
		_toolkit : {
			/**
			 * 检测当前浏览器是否是ie
			 * @method  _isIE
			 * @return {Boolean} true-是ie
			 */
			_isIE : function() {
				// if(document.attachEvent){
				// return true;
				// }
				// else{
				// return false;
				// }
				if( navigator.userAgent.toLowerCase().indexOf('msie')!=-1 ) {
					return true;
				}
				else {
					return false;
				}
			},

			/**
			 * 动态加载js文件和css文件
			 * @method  _loadFile
			 * @param filename 文件路径+文件名 如 js/test.js
			 * @param filetype 文件类型, js和css
			 * @return {Boolean} true-成功
			 */
			_loadFile : function(filename, filetype) {
				if( filetype=="js" ) {
					//判定文件类型
					var fileref = document.createElement('script');
					//创建标签
					fileref.setAttribute("type", "text/javascript");
					//定义属性type的值为text/javascript
					fileref.setAttribute("src", filename);
					//文件的地址
				}
				else
				if( filetype=="css" ) {
					//判定文件类型
					var fileref = document.createElement("link");
					fileref.setAttribute("rel", "stylesheet");
					fileref.setAttribute("type", "text/css");
					fileref.setAttribute("href", filename);
				}
				if( typeof fileref!="undefined" ) {
					document.getElementsByTagName("head")[0].appendChild(fileref);
					return true;
				}
				return false;
			},

			/**
			 * @example _rDrag.init(moveObj);
			 * @lends _toolkit.prototype
			 */
			_rDrag : {
				/**
				 * 需要移动的dom对象
				 * @default null
				 * @type Object
				 */
				o : null,

				/**
				 * 初始化接口
				 * @param o 要移动的dom对象
				 */
				init : function(o) {
					o.onmousedown = this.start;
				},

				/**
				 * 开始移动
				 * @param e event对象
				 */
				start : function(e) {
					var o;
					e = JSVideoCtrl._toolkit._rDrag.fixEvent(e);
					e.preventDefault && e.preventDefault();
					JSVideoCtrl._toolkit._rDrag.o = o = this;
					o.x = e.clientX - JSVideoCtrl._toolkit._rDrag.o.offsetLeft;
					o.y = e.clientY - JSVideoCtrl._toolkit._rDrag.o.offsetTop;
					document.onmousemove = JSVideoCtrl._toolkit._rDrag.move;
					document.onmouseup = JSVideoCtrl._toolkit._rDrag.end;
				},

				/**
				 * 移动
				 * @param e event对象
				 */
				move : function(e) {
					e = JSVideoCtrl._toolkit._rDrag.fixEvent(e);
					var oLeft, oTop;
					oLeft = e.clientX - JSVideoCtrl._toolkit._rDrag.o.x;
					oTop = e.clientY - JSVideoCtrl._toolkit._rDrag.o.y;
					if( oLeft<0 ) {
						oLeft = 0;
					}
					if( oTop<0 ) {
						oTop = 0;
					}
					JSVideoCtrl._toolkit._rDrag.o.style.left = oLeft + 'px';
					JSVideoCtrl._toolkit._rDrag.o.style.top = oTop + 'px';
				},

				/**
				 * 停止移动
				 * @param e event对象
				 */
				end : function(e) {
					e = JSVideoCtrl._toolkit._rDrag.fixEvent(e);
					JSVideoCtrl._toolkit._rDrag.o = document.onmousemove = document.onmouseup = null;
				},

				/**
				 * 获取event对象
				 * @param e event对象
				 * @return  返回event对象
				 */
				fixEvent : function(e) {
					if( !e ) {
						e = window.event;
						e.target = e.srcElement;
						e.layerX = e.offsetX;
						e.layerY = e.offsetY;
					}
					return e;
				}
			},

			/**
			 * json对象转字符串形式
			 */
			_json2str : function(obj) {
				var THIS = this;
				switch(typeof(obj))
				{
					case 'string':
						return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';
					case 'array':
						return '[' + obj.map(THIS._json2str).join(',') + ']';
					case 'object':
						if( obj instanceof Array ) {
							var strArr = [];
							var len = obj.length;
							for( var i = 0; i<len; i++ ) {
								strArr.push(THIS._json2str(obj[i]));
							}
							return '[' + strArr.join(',') + ']';
						}
						else
						if( obj==null ) {
							return 'null';
						}
						else {
							var string = [];
							for( var property in obj )
							string.push(THIS._json2str(property) + ':' + THIS._json2str(obj[property]));
							return '{' + string.join(',') + '}';
						}
					case 'number':
						return obj;
					case false:
						return obj;
				}
			}
		},

		/**
		 * @description 视频控件控制
		 * @lends JSVideoCtrl.prototype
		 * @private
		 */
		_VideoPlayerCtrl : {
			/**
			 * 视频控件的初始化状态
			 * @static _bPlayerInitState
			 * */
			_bPlayerInitState : false,

			/**
			 * @static _oVideoPlayer 视频控件实例
			 * */
			_oVideoPlayer : '',

			/**
			 * 检测是否需要更新控件
			 * @param {String} version 控件版本
			 * @return {Boolean} true-需要更新 false-不需要
			 * */
			_checkUpgrade : function(version) {
				return false;
			},

			/**
			 * 检测视频控件的相关信息
			 * @return {Boolean} true-检测正常 false-检测有误
			 * */
			_checkPlugin : function() {

				return 0;
			},

			/**
			 * 视频控件外观样式设定
			 * @param {Object} oPlayerInitParam 定义见_oPlayerInitParam
			 * */
			_PlayerDisplayMode : function(oPlayerInitParam) {
				try {
					var s = oPlayerInitParam;
					var _s = JSVideoCtrl._oVariableObj._oPlayerInitParam;
					var obj = JSVideoCtrl._VideoPlayerCtrl._oVideoPlayer;

					if( typeof (s)!="object" ) {
						s = _s;
					}
					// obj.SetBKDisplayMode(s._heading, s._headingColor, s._subheading,
					// s._subheadingColor, s._msgColor, s._containerColor,
					// s._playerColor, s._focusBorderColor, s._bstretch);

					//obj.SetSurface(JSVideoCtrl._toolkit._json2str(s));
				}
				catch(e) {
					JSVideoCtrl._log._console('_PlayerDisplayMode err:' + e.toString());
				}
			},

			/**
			 * 视频控件消息响应
			 * @method _PlayerEvent
			 * */
			_PlayerEvent : {
				/**
				 * 事件处理器,根据项目不同逻辑结果可重新定义
				 * @property _event
				 */
				_event : {
					/**
					 * 注册所有回调消息事件
					 * @method registerStreamBroken
					 * @param {String} eventtype 消息类型索引
					 * @param {String} eventinfo 回调事件返回的消息
					 */
					_switchReg : function(eventtype, eventinfo) {
						if( !eventtype || typeof eventtype!="number" ) {
							JSVideoCtrl._log._info('_switchReg err : eventtype is underfind');
							return false;
						}
						else {
							try {
								JSVideoCtrl._VideoPlayerCtrl._PlayerEvent._bind._oAllEvents["_"+eventtype](eventinfo);
							}
							catch(e) {
								if( typeof JSVideoCtrl._VideoPlayerCtrl._PlayerEvent._bind._oAllEvents["_" + eventtype]!="function" ) {
									JSVideoCtrl._log._info('_switchReg info: Didn\'t register this event, eventtype= ' + eventtype + ' !');
								}
								else {
									JSVideoCtrl._log._info('_switchReg err: ' + e);
								}
							}
						}
					}
				},

				/**
				 * 事件处理器,根据项目不同逻辑结果可重新定义
				 * @property _event
				 */
				_bind : {
					/**
					 *所有消息回调事件的事件响应函数对象
					 * @method _oAllEvents
					 */
					_oAllEvents : {},

					/*
					 *内部注册控件完成回调消息
					 */
					_regInitFinished : function() {
						JSVideoCtrl.externalInterface.videoCtrl.eventCtrl.regInitFinished(function() {
							JSVideoCtrl._VideoPlayerCtrl._oVideoPlayer.TellGetInitEvent();
							JSVideoCtrl._oVariableObj._bOCXInitSuccess = true;
						});
					}
				}
			},

			/**
			 * 视频控件方法
			 * @method _PlayerMethod
			 * */
			_PlayerMethod : {
				_Obj : function() {
					return JSVideoCtrl._VideoPlayerCtrl._oVideoPlayer;
				},
				/**
				 * 播放url，支持链接类型：1).NPStreamClientComponent$[IP]192.168.14.167[/IP][PORT]8082[/PORT];<br>
				 * 2).NPTcspSDKComponent$pem://netposa@12345:m.netposa.com:6888/hik_video?v=F:\\演示视频\\hik_video.mp4<br>
				 * 播放成功返回0,失败返回-1
				 * @method _play
				 * @param {Object} o 流控制对象
				 * @return {Boolean} true-播放成功;false-播放失败
				 */
				_play : function(o) {
					var ret = false;
					try {
						var obj = this._Obj();
						if( this._Obj() && url ) {
							ret = (this._Obj().Play(o)===0 ? true : false);
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_play err' + e.toString());
					}
					return ret;
				},

				/**
				 * 重连选中的播放窗口
				 * @method _rePlay
				 * @return {Boolean} true-停止成功;false-停止失败
				 */
				_replay : function() {
					var ret = false;
					try {
						if( this._Obj() ) {
							//TODO 控件接口未实现
							//ret=(this._Obj().Stop()===0 ? true : false);
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_replay err' + e.toString());
					}
					return ret;
				},

				/**
				 * 停止选中的播放窗口
				 * @method _stop
				 * @param {Object} o 流控制对象
				 * @return {Boolean} true-停止成功;false-停止失败
				 */
				_stop : function(o) {
					var ret = false;
					try {
						if( this._Obj() ) {
							ret = (this._Obj().Stop(o)===0 ? true : false);
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_stop err' + e.toString());
					}
					return ret;
				},

				/**
				 * 停止所有播放窗口
				 * @method _stopAll
				 * @param {Object} o 流控制对象
				 * @return {Boolean} true-停止成功;false-停止失败
				 */
				_stopAll : function(o) {
					var ret = false;
					try {
						if( this._Obj() ) {
							ret = (this._Obj().CloseAllChannel(o)===0 ? true : false);
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_stopAll err' + e.toString());
					}
					return ret;
				},

				/**
				 * 重连选中的播放窗口
				 * @method _playUrl
				 * @param {Object} o 流控制对象
				 * @return {Boolean} true-播放成功;false-播放失败
				 */
				_playUrl : function(o) {
					var ret = false;
					try {
						var obj = this._Obj();
						if( obj && o ) {
							ret = (obj.Play(o)===0 ? true : false);
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_playUrl err' + e.toString());
					}
					return ret;
				},

				/**
				 * 重连选中的播放窗口
				 * @method _stopUrl
				 * @param {Object} o 流控制对象
				 * @return {Boolean} true-播放成功;false-播放失败
				 */
				_stopUrl : function(o) {
					var ret = false;
					try {
						var obj = this._Obj();
						if( obj && o ) {
							ret = (obj.Stop(o)===0 ? true : false);
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_stopUrl err' + e.toString());
					}
					return ret;
				},

				/**
				 * 开关播放器声音
				 * @method _setAudio
				 * @param{Boolean} audio true-打开声音;false-关闭声音
				 * @return {Boolean} true-打开/关闭声音成功;false-打开/关闭声音失败
				 */
				_setAudio : function(audio) {
					var ret = false;
					try {
						if( this._Obj() ) {
							ret = (this._Obj().SetAudio( audio ? "1" : "0")===0 ? true : false);

							if( ret ) {
								JSVideoCtrl._oVariableObj._isMute = !audio;
							}
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_setAudio err' + e.toString());
					}
					return ret;
				},

				/**
				 * 设置播放窗口大小
				 * @param{Number} width 宽度px
				 * @param{Number} height 高度px
				 * @method _setSize
				 * @return {Boolean} true-成功;false-失败
				 */
				_setSize : function(width, height) {
					var ret = false;
					try {
						var o = this._Obj();
						if( o ) {
							o.ResizeOCX(width + "", height + "");
							var s = o.style;
							s.width = width + 'px';
							s.height = height + 'px';
							ret = true;
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_setSize err' + e.toString());
					}

					return ret;
				},

				/**
				 * 设置播放器可见性
				 * @param{Boolean} visibility true-可见;false-隐藏
				 * @method _setVisibility
				 * @return  {Boolean} true-成功;false-失败
				 */
				_setVisibility : function(visibility) {
					var ret = false;
					try {
						if( this._Obj() ) {
							var s = this._Obj().style;
							if( visibility ) {
								s.visibility = 'visible';
							}
							else {
								s.visibility = 'hidden';
							}
							ret = true;
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_setVisibility err' + e.toString());
					}
					return ret;
				},

				/**
				 * 设置对讲开关
				 * @method _setTalkback
				 * @param{Boolean} talkback true-打开对讲;false-关闭对讲
				 * @return {Boolean} true-打开/关闭对讲成功;false-打开/关闭对讲失败
				 */
				_setTalkback : function(talkback) {
					var ret = false;
					try {
						if( this._Obj() ) {
							if( talkback ) {
								ret = (this._Obj().StartTalk()===0 ? true : false);
							}
							else {
								ret = (this._Obj().StopTalk()===0 ? true : false);
							}
							if( ret ) {
								JSVideoCtrl._oVariableObj._isTalkback = talkback;
							}
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_setTalkback err' + e.toString());
					}
					return ret;
				},

				/**
				 * 设置报警开关
				 * @method _setAlarm
				 * @param{Boolean} alarm true-打开报警;false-关闭报警
				 * @return {Boolean} 0-打开/关闭报警成功; -1-打开/关闭报警失败
				 */
				_setAlarm : function(alarm) {
					var ret = 0;
					try {
						if( this._Obj() ) {
							if( alarm ) {
								ret = (this._Obj().StartEvent()===0 ? true : false);
							}
							else {
								ret = (this._Obj().StopEvent()===0 ? true : false);
							}
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_setAlarm err' + e.toString());
						ret = -1;
					}
					return ret;
				},

				/**
				 * 对选中窗口进行截图，第一次调用该接口会默认弹出一个路径设置的公共对话框
				 * @method _snapshot
				 * @return {Boolean} 0-截图成功; -1-截图失败
				 */
				_snapshot : function() {
					var ret = 0;
					try {
						if( this._Obj() ) {
							ret = (this._Obj().PrintWindow()===0 ? true : false);
						}
					}
					catch (e) {
						JSVideoCtrl._log._info('_snapshot err' + e.toString());
						ret = -1;
					}
					return ret;
				},

				/**
				 * 设置截图保存路径
				 * @method _setFilePath
				 * @return {Boolean}
				 */
				_setFilePath : function() {
					var ret = false;
					try {
						if( this._Obj() ) {
							this._Obj().SetPicSavePath();
							ret = true;
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_setFilePath err' + e.toString());
					}
					return ret;
				},

				/**
				 * 获取截图保存路径
				 * @method _getFilePath
				 * @return {Boolean}
				 */
				_getFilePath : function() {
					var ret = false;
					try {
						if( this._Obj() ) {
							this._Obj().GetPicSavePath();
							ret = true;
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_getFilePath err' + e.toString());
					}
					return ret;
				},

				/**
				 * 打开截图路径
				 * @method _openFilePath
				 * @return {Boolean}
				 */
				_openFilePath : function() {
					var ret = false;
					try {
						if( this._Obj() ) {
							this._Obj().ViewSavePic();
							ret = true;
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_openFilePath err' + e.toString());
					}
					return ret;
				},

				/**
				 * 设置录像文件大小
				 * @method _setRecordFileSize
				 * @param {Number} size 录像文件大小(MB)
				 * @return {Boolean}
				 */
				_setRecordFileSize : function(size) {
					var ret = false;
					try {
						if( this._Obj() ) {
							this._Obj().SetRecordFileSize(size + '');
							ret = true;
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_setRecordFileSize err' + e.toString());
					}
					return ret;
				},

				/**
				 * 设置录像开关
				 * @method _setRecord
				 * @param{Boolean} record true-打开录像;false-关闭录像
				 * @return {Boolean} true-打开/关闭录像成功;false-打开/关闭录像失败
				 */
				_setRecord : function(record) {
					var ret = false;
					try {
						if( this._Obj() ) {
							if( record ) {
								ret = (this._Obj().StartRecordVideo()===0 ? true : false);
							}
							else {
								ret = (this._Obj().StopRecordVideo()===0 ? true : false);
							}
							if( ret ) {
								JSVideoCtrl._oVariableObj._isRecord = record;
							}
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_setRecord err' + e.toString());
					}
					return ret;
				},

				/**
				 * 设置录像文件保存路径
				 * @method _setRecordpath
				 * @return{Boolean}
				 */
				_setRecordPath : function() {
					var ret = false;
					try {
						if( this._Obj() ) {
							this._Obj().SetRecSavePath();
							ret = true;
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_setRecordPath err' + e.toString());
					}
					return ret;
				},

				/**
				 * 获取录像文件保存路径
				 * @method _getRecordPath
				 * @return{String}
				 */
				_getRecordPath : function() {
					var str = "";
					try {
						if( this._Obj() ) {
							str = this._Obj().GetRecSavePath();
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_getRecordPath err' + e.toString());
					}
					return str;
				},

				/**
				 * 打开录像文件保存路径
				 * @method _openRecordPath
				 * @return{Boolean}
				 */
				_openRecordPath : function() {
					var ret = false;
					try {
						if( this._Obj() ) {
							this._Obj().OpenRecSavePath();
							ret = true;
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_openRecordPath err' + e.toString());
					}
					return ret;
				},

				/**
				 * 获取选中播放器当前截图路径
				 * @method _getMotionPicture
				 * @return{String} 成功返回截图的保存路径,失败返回""
				 */
				_getMotionPicture : function() {
					var path = "";
					try {
						if( this._Obj() ) {
							path = this._Obj().PrintOnePicForMotionSetting();
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_getMotionPicture err' + e.toString());
					}
					return path;
				},

				/**
				 * 删除选中播放器当前截图路径图片
				 * @method _deleteMotionPicture
				 * @return{Boolean} 0-删除图片成功; -1-删除图片失败
				 */
				_deleteMotionPicture : function() {
					var ret = false;
					try {
						if( this._Obj() ) {
							ret = this._Obj().DeleteThePicForMotionSetting();
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_deleteMotionPicture err' + e.toString());
					}
					return ret;
				},

				/**
				 * 播放控件全屏
				 * @method _fullScreen
				 * @return {Boolean}
				 */
				_fullScreen : function() {
					try {
						if( this._Obj() ) {
							this._Obj().SetMutiFullScreen();
							return true;
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_fullScreen err' + e.toString());
						return false;
					}
				},

				/**
				 * 设置屏幕窗口数量
				 * @method _setScreenNum
				 * @param{Number} screens
				 * @return {Boolean}
				 */
				_setScreenNum : function(screens) {
					try {
						if( this._Obj() ) {
							this._Obj().SetWindowNum(screens + "");
							return true;
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_setScreenNum err' + e.toString());
						return false;
					}
				},

				/**
				 * 获取控件版本
				 * @method _getOCXVersion
				 * @return {String} 成功返回版本号，类似"1.4.5.6"的字符串 失败返回""
				 */
				_getOCXVersion : function() {
					try {
						if( this._Obj() ) {
							return this._Obj().GetVersion();
						}
						return "";
					}
					catch (e) {
						JSVideoCtrl._log._console('_getOCXVersion err' + e.toString());
						return "";
					}
				},

				/**
				 * 云台控制接口
				 * @method _ptzCtrl
				 * @param {Number} cmd 云台控制命令
				 * @param {Number} param 云台速度[-10,10],如果是方向控制(0-10),如果是机芯控制(-10~10,0为停止)
				 * @return {Number} 成功返回true，失败返回false
				 */
				_ptzCtrl : function(cmd, param) {
					var ret = false;
					try {
						if( this._Obj() ) {
							if( this._Obj().PTZ(cmd, param)==0 ) {
								ret = true;
							}
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_ptzCtrl err' + e.toString());
					}
					return ret;
				},

				/**
				 * 对组件的操作接口
				 * @method _handleComponent
				 * @param {Object} devjson JSON格式的参数。
				 * 添加设备[in]
				 * 例如："{\"target\":\"device/add\",\"action\":\"set\",\"sid\":\"100861\",\"data\":{\"component\":\"RMSClientComponent\",\"devip\":\"192.168.15.88\",\"devport\":6100,\"devname\":\"dev01\",\"username\":\"admin\",\"password\":\"admin\",\"devtype\":\"cu\",\"ext\":\"ext\"}}"
				 * [out]   {code:0,msg:"ok",data:{}}
				 *
				 * 删除设备
				 * 例如："{\"target\":\"device/delete\",\"action\":\"set\",\"sid\":\"100861\",\"data\":{\"component\":\"RMSClientComponent\",\"devname\":\"dev01\"}}"
				 * [out]   {code:0,msg:"ok",data:{}}
				 *
				 * 开流
				 * 例如："{\"target\":\"stream/open\",\"action\":\"set\",\"sid\":\"100861\",\"data\":{\"component\":\"RMSClientComponent\",\"devname\":\"dev01\",\"chanid\":\"rms/234/1\",\"streamtype\":0,\"protocal\":\"tcp\",\"ext\":\"\",\"_id\":\"121212\"}}"
				 * [out]   {code:0,msg:"ok",data:{index:1,_id : "zt01"}}
				 *
				 * 关流
				 * 例如："{\"target\":\"stream/close\",\"action\":\"set\",\"sid\":\"100861\",\"data\":{\"component\":\"RMSClientComponent\",\"devname\":\"dev01\",\"chanid\":\"rms/234/1\",\"streamtype\":0,\"protocal\":\"tcp\",\"ext\":\"\",\"_id\":\"121211\"}}"
				 * [out]   {code:0,msg:"ok",data:{index:1,_id : "zt01"}}
				 * @return {Number} 成功返回0，失败返回错误码
				 */
				_handleComponent : function(devjson) {
					var ret = 0;
					try {
						if( this._Obj() ) {
							ret = this._Obj().HandleComponent(JSVideoCtrl._toolkit._json2str(devjson));
						}
					}
					catch (e) {
						JSVideoCtrl._log._console('_handleComponent err' + e.toString());
					}

					return ret;
				}
			}
		},

		/**
		 * @description 常量
		 * @lends JSVideoCtrl.prototype
		 * @private
		 */
		_oVariableObj : {
			/**
			 * 用户权限
			 * @default ''
			 * @type String
			 */
			_sUserRight : '',

			/**
			 * @description 模块的宽 默认400px
			 * @field
			 * @default 820
			 * @type Number
			 */
			_iCanvasX : 820,

			/**
			 * @description 模块高 默认300px
			 * @field
			 * @default 460
			 * @type Number
			 */
			_iCanvasY : 460,

			/**
			 * @description 模块相对页面左上角的x坐标 默认0px
			 * @field
			 */
			_iPositionX : 0,

			/**
			 * @description 模块相对页面左上角的Y坐标 默认0px
			 * @field
			 */
			_iPositionY : 0,

			/**
			 * @description 视频连接的url
			 * @field
			 */
			_sPlayUr : '',
			/**
			 * @description 调试信息开关量 true-开启调试信息 false-关闭调试信息
			 * @field
			 * @type Boolean
			 */
			_bDebugMode : false,

			/**
			 * 控件的上下控制面板的高度
			 * @field
			 * @default 40
			 * @type {Number}
			 */
			_iPanelHeight : 40,

			/**
			 * 是否静音
			 * @field
			 * @default false
			 * @property _isMute
			 */
			_isMute : false,

			/**
			 * 是否打开对讲
			 * @field
			 * @default false
			 * @property _isTalkback
			 */
			_isTalkback : false,

			/**
			 * 控件是否已经初始化成功
			 * @field
			 * @default false
			 * @property _bOCXInitSuccess
			 */
			_bOCXInitSuccess : false,

			/**
			 * 是否正在录像
			 * @field
			 * @default false
			 * @property _isRecord
			 */
			_isRecord : false,

			/**
			 * 控件的classid
			 * @field
			 * @default 4EF69BF4-0B48-4EC8-AD65-C5B59483592B
			 * @property _sClassid
			 */
			_sClassid : 'FC3149DC-24F6-46BF-8B0B-FE9C59DDB93F',

			/**
			 * 控件最低层的div的Id
			 * @field
			 * @default JSVideoPluginDiv
			 * @property _sBasicDivId
			 */
			_sBasicDivId : 'JSVideoPluginDiv',

			/**
			 * ie浏览器下的控件id
			 * @field
			 * @default NP_WEB_PLAYER_OBJ
			 * @property _sIEVideoControlId
			 */
			_sIEVideoControlId : 'NP_WEB_PLAYER_OBJ',

			/**
			 * 非ie浏览器下的控件id
			 * @field
			 * @default NP_WEB_PLAYER_EMB
			 * @property _sOtherVideoControlId
			 */
			_sOtherVideoControlId : 'NP_WEB_PLAYER_EMB',

			/**
			 * top控制部分div的id
			 * @field
			 * @default _videoCtrl_northDiv
			 * @property _sTopCtrlId
			 */
			_sTopCtrlId : '_videoCtrl_northDiv',

			/**
			 * 左边控制部分div的id
			 * @field
			 * @default _videoCtrl_westDiv
			 * @property _sLeftCtrlId
			 */
			_sLeftCtrlId : '_videoCtrl_westDiv',

			/**
			 * bottom控制部分div的id
			 * @field
			 * @default _videoCtrl_southDiv
			 * @property _sBottomCtrlId
			 */
			_sBottomCtrlId : '_videoCtrl_southDiv',

			/**
			 * 参数控制部分div的id
			 * @field
			 * @default _videoCtrl_eastDiv
			 * @property _sControlCtrlId
			 */
			_sControlCtrlId : '_videoCtrl_eastDiv',

			/**
			 * title部分div的id
			 * @field
			 * @default _videoCtrl_titleDiv
			 * @property _sTitleCtrlId
			 */
			_sTitleCtrlId : '_videoCtrl_titleDiv',

			/**
			 * title显示部分div的id
			 * @field
			 * @default _videoCtrl_titleShowDiv
			 * @property _sTitleShowId
			 */
			_sTitleShowId : '_videoCtrl_titleShowDiv',

			/**
			 * 语言包 默认为英文
			 * */
			_oLanguagePackage : {
				l_oScreen : {
					l_fullScreen : 'Fullscreen',
					l_oneWindow : 'One Window',
					l_fourWindow : 'Four Window',
					l_nineWindow : 'Nine Window',
					l_sixteenWindow : 'Sixteen Window'
				},

				l_oPlayCtrl : {
					l_replay : 'Replay',
					l_stop : 'Stop',
					l_audioOpen : 'Audio Open',
					l_audioclose : 'Audio Close',
					l_talkbackOpen : 'Talkback Open',
					l_talkbackClose : 'Talkback Close',
					l_snapshot : 'Snapshot',
					l_record : 'Record',
					l_stopAll : 'Stop All'
				}

			},

			/**
			 * 语言包实例对象
			 * @default ''
			 */
			_oLangPkg : null,

			/**
			 * 默认的外部样式配置文件路径
			 * @static _sCssFilePath
			 */
			_sCssFilePath : "css/plugin.css",

			/**
			 * 初始化功能类表
			 */
			_functionInfo : {
				//是否以窗口模式显示 true-显示窗口模式
				bWindowMode : false,
				//是否显示屏幕切换控制面板 true-显示
				bShowScreenCtrl : true,
				//是否显示播放控制面板 true-显示
				bShowPlayCtrl : true,
				//是否显示参数控制面板 true-显示
				bShowParaCtrl : false,
				//定义哪一个面板显示在视频播放窗口的上部 0-screen 1-playctrl
				iWhichShowOnTop : 0,
				//播放控制按钮是否显示 true-显示
				oControl : {
					//手动录像
					bRecord : true,
					//语音对讲
					bTalkback : true,
					//抓图
					bCapture : true,
					//音频
					bAudio : true,
					//停止所有
					bStopAll : true,
					//停止当前
					bStop : true,
					//重连
					bReplay : true
				},
				//窗口数按钮是否显示 true-显示
				oWindow : {
					bOne : true,
					bFour : true,
					bNine : true,
					bFull : true
				}
			},

			/**
			 * 功能列表实例对象  _oFuncInfo
			 * @default ''
			 */
			_oFuncInfo : {
				//是否以窗口模式显示 true-显示窗口模式
				bWindowMode : false,
				//是否显示屏幕切换控制面板 true-显示
				bShowScreenCtrl : true,
				//是否显示播放控制面板 true-显示
				bShowPlayCtrl : true,
				//是否显示参数控制面板 true-显示
				bShowParaCtrl : false,
				//定义哪一个面板显示在视频播放窗口的上部 0-screen 1-playctrl
				iWhichShowOnTop : 0,
				//播放控制按钮是否显示 true-显示
				oControl : {
					//手动录像
					bRecord : true,
					//语音对讲
					bTalkback : true,
					//抓图
					bCapture : true,
					//音频
					bAudio : true,
					//停止所有
					bStopAll : true,
					//停止当前
					bStop : true,
					//重连
					bReplay : true
				},
				//窗口数按钮是否显示 true-显示
				oWindow : {
					bOne : true,
					bFour : true,
					bNine : true,
					bFull : true
				}
			},

			/*
			 * 连接的协议头
			 * */
			_oComponetType : ['NPStreamClientComponent', 'NPRMSClientComponent', 'NPTcspSDKComponent', 'RMSClientComponent'],

			/**
			 * @method 视频控件初始化参数对象
			 * */
			_oPlayerInitParam : {
				/**
				 * 播放容器颜色，类似"RGB(128,128,128)",输入串"null"为默认颜色
				 * @property _containerColor
				 * @default 'RGB(128,128,128)'
				 */
				baseclr : null,
				/**
				 * 播放窗口颜色，类似"RGB(54,54,54)",输入串"null"为默认颜色
				 * @property _playerColor
				 * @default 'RGB(54,54,54)'
				 */
				playclr : null,
				/**
				 * 被选中窗口边框颜色，类似"RGB(1255,170,25)",输入串"null"为默认颜色
				 * @property _focusBorderColor
				 * @default 'RGB(255,170,25)'
				 */
				selclr : null,
				/**
				 * 背景中显示的主标题文字，若不需要标题可输入空" ",输入串"null"默认为公司初始背景
				 * @property _heading
				 * @default ' '
				 */
				maintitle : null,
				/**
				 * 背景中显示的主标题文字的颜色，类似"RGB(180,180,180)" 输入串"null"为默认值
				 * @property _headingColor
				 * @default 'RGB(180,180,180)'
				 */
				maintitleclr : null,
				/**
				 * 背景中显示的副标题文字，若没有主标题那副标题就不起作用，输入串"null"为默认值
				 * @property _subheading
				 * @default 'WISDOM LIGHTS HARMONY'
				 */
				subtitle : null,
				/**
				 * 背景中显示的副标题文字的颜色，类似"RGB(238,154,0)" 输入串"null"为默认值
				 * @property _subheadingColor
				 * @default 'RGB(238,154,0)'
				 */
				subtitleclr : null,
				/**
				 * 播放窗体中消息文字显示的颜色，类似"RGB(128,128,128)" 输入串"null"为默认值
				 * @property _msgColor
				 * @default 'RGB(128,128,128)'
				 */
				msgclr : null
				/**
				 * "0"图像不拉伸显示，保持纵横比；"1"图像拉伸显示，填充显示窗口
				 * @property _bstretch
				 * @default 0
				 */
				//_bstretch : 0
			},

			_bCallBackRegFlag : false
		},

		/**
		 * @description ui接口
		 * @private
		 */
		_ui : {
			/**
			 * @method _setTitleContext 设置控件上部显示的内容(只在窗口模式下生效)
			 * @param {String} context 需要显示的内容
			 * @return {Number} 成功返回true，失败返回false
			 */
			_setTitleContext : function(context) {
				$("#" + JSVideoCtrl._oVariableObj._sTitleShowId).html(context);
				return true;
			}
		},

		/**
		 * @description 初始化接口
		 * @private
		 */
		_init : {
			/**
			 * @description 初始化OCX控件接口
			 * @method _initVideoPlugin
			 * @param sClassid 控件的classid Ps: 4EF69BF4-0B48-4EC8-AD65-C5B59483592B
			 * @return {String} 如果是程序内部创建的父对象则返回创建对象的id, 否则返回空
			 */
			_initVideoPlugin : function(sClassid) {
				//new时传进来的y依附对象
				var pluginDiv = m_oParentObj;
				var sParentId = "";
				//如果发现没有传递父对象进来 则创建父容器对象
				if( typeof (m_oParentObj)!="object" ) {
					sParentId = JSVideoCtrl._oVariableObj._sBasicDivId + new Date().getTime();
					pluginDiv = $('<div id=' + sParentId + '></div>');
					$("body").append(pluginDiv);
					//更新成员变量的值
					JSVideoCtrl._oVariableObj._sBasicDivId = sParentId;
				}
				else {
					JSVideoCtrl._oVariableObj._sBasicDivId = pluginDiv.attr("id");
				}

				this._initUI(sClassid);

				//把视频插件对象存入变量列表中
				JSVideoCtrl._VideoPlayerCtrl._oVideoPlayer = document.getElementById(JSVideoCtrl._oVariableObj._sIEVideoControlId);

				// $("#_videoCtrl_eastDiv").accordion({
				// autoHeight : false
				// });

				//内部注册控件加载完成的回调函数;
				JSVideoCtrl._VideoPlayerCtrl._PlayerEvent._bind._regInitFinished();

				this._resize();
				this._eventBind();
				return sParentId;
			},

			/**
			 * @description 初始化功能模块接口
			 * @method _initFun
			 * @param {Object} oFuncInfo  _functionInfo的实例
			 */
			_initFun : function(oFuncInfo) {
				try {
					if( oFuncInfo.bShowScreenCtrl==undefined || oFuncInfo.bShowPlayCtrl==undefined || oFuncInfo.bShowParaCtrl==undefined || oFuncInfo.iWhichShowOnTop==undefined || oFuncInfo.bWindowMode==undefined ) {
						JSVideoCtrl._oVariableObj._oFuncInfo = JSVideoCtrl._oVariableObj._functionInfo;
						JSVideoCtrl._log._console("oFuncInfo error undefined");
					}
					else {
						JSVideoCtrl._oVariableObj._oFuncInfo = oFuncInfo;
					}
				}
				catch(e) {
					JSVideoCtrl._oVariableObj._oFuncInfo = JSVideoCtrl._oVariableObj._functionInfo;
					JSVideoCtrl._log._console("oFuncInfo error:" + e);
				}
			},

			/* *
			 *  @description 初始化语言包接口
			 * @ method _initLanguage
			 * @param {Object} oFile _languagePackage对象实例
			 */
			_initLanguage : function(oFile) {
				if( typeof oFile=="undefined" || oFile == "" ) {
					JSVideoCtrl._oVariableObj._oLangPkg = JSVideoCtrl._oVariableObj._oLanguagePackage;
				}
				else {
					JSVideoCtrl._oVariableObj._oLangPkg = oFile;
				}
			},

			/**
			 * @description 初始化UI接口
			 * @method _initUI
			 * @param sClassid 控件的classid Ps: 4EF69BF4-0B48-4EC8-AD65-C5B59483592B
			 */
			_initUI : function(sClassid) {
				var pluginDiv = $("#" + JSVideoCtrl._oVariableObj._sBasicDivId);
				var oFuncInfo = JSVideoCtrl._oVariableObj._oFuncInfo;
				//如果是窗口模式
				if( oFuncInfo.bWindowMode ) {
					pluginDiv.append(this._createTitle(true));
					pluginDiv.append(this._createPlugin(sClassid));
					pluginDiv.css({
						position : "absolute"
					});
					JSVideoCtrl._toolkit._rDrag.init(document.getElementById(JSVideoCtrl._oVariableObj._sBasicDivId));
				}
				//如果是视频浏览模式
				else {
					//创建视频插件对象
					var str = this._createLeftCtrl(true);
					if( str=="" ) {
						return false;
					}

					pluginDiv.append(str);
					str = "";

					//决定哪个控件放在视频控件的上方
					if( oFuncInfo.iWhichShowOnTop==0 ) {
						$("#" + JSVideoCtrl._oVariableObj._sLeftCtrlId).append(this._createTopCtrl(oFuncInfo.bShowScreenCtrl));
						$("#" + JSVideoCtrl._oVariableObj._sLeftCtrlId).append(this._createPlugin(sClassid));
						$("#" + JSVideoCtrl._oVariableObj._sLeftCtrlId).append(this._createBottomCtrl(oFuncInfo.bShowPlayCtrl));
					}
					else {
						$("#" + JSVideoCtrl._oVariableObj._sLeftCtrlId).append(this._createBottomCtrl(oFuncInfo.bShowPlayCtrl));
						$("#" + JSVideoCtrl._oVariableObj._sLeftCtrlId).append(this._createPlugin(sClassid));
						$("#" + JSVideoCtrl._oVariableObj._sLeftCtrlId).append(this._createTopCtrl(oFuncInfo.bShowScreenCtrl));
					};

					//添加参数控制面板
					pluginDiv.append(this._createControlCtrl(oFuncInfo.bShowParaCtrl));
				}
				return true;
			},

			/**
			 * @description 程序资源释放接口
			 * @method _done
			 */
			_done : function() {

			},

			/**
			 * @method _createPlugin 创建插件
			 * @return {String}  插件的字符串表示
			 * */
			_createPlugin : function(sClassid) {
				var sDate = new Date();
				var sId = JSVideoCtrl._oVariableObj._sIEVideoControlId + sDate.getTime();
				var str = '';
				if( JSVideoCtrl._toolkit._isIE() ) {
					str = '<object classid="clsid:' + sClassid + '" hspace="0" vspace="0" class="p-videoPlugin" standby="loading..." name="' + sId + '" id="' + sId + '"></object>';
				}
				else {
					// str = '<embed width="100%" height="100%" pluginspage="/" name="' +
					// JSVideoCtrl._oVariableObj._sOtherVideoControlId + '" id="' +
					// JSVideoCtrl._oVariableObj._sOtherVideoControlId + '"2

					// type="application/mozilla-npruntime-scriptable-plugin"
					// style="overflow:hidden;"></embed>';
					str = '<embed class="p-videoPlugin" pluginspage="/" name="' + sId + '" id="' + sId + '" type="application/NPPlayer"></embed>';
				}

				JSVideoCtrl._oVariableObj._sIEVideoControlId = sId;
				delete sDate;
				return str;
			},

			/**
			 * @method _createLeftCtrl 创建左边控制部分
			 * @param flag 是否创建标志 true-创建 false-返回""
			 * @return {String}  字符串表示
			 * */
			_createLeftCtrl : function(flag) {
				var sDate = new Date();
				var sId = JSVideoCtrl._oVariableObj._sLeftCtrlId + sDate.getTime();
				var arr = new Array(''), str = '';
				if( !flag ) {
					return str;
				}
				arr.push('<div id="' + sId + '" class="p-videoCtrl-westDiv">');
				arr.push('</div>');
				str = arr.join('');

				JSVideoCtrl._oVariableObj._sLeftCtrlId = sId;
				delete sDate;
				delete arr;
				return str;
			},

			/**
			 * @method _createTopCtrl 创建top控制部分
			 * @param flag 是否创建标志 true-创建 false-返回""
			 * @return {String}  字符串表示
			 * */
			_createTopCtrl : function(flag) {
				var sDate = new Date();
				var o = JSVideoCtrl._oVariableObj._oLangPkg;
				var oCtl = JSVideoCtrl._oVariableObj._oFuncInfo.oWindow;
				var sId = JSVideoCtrl._oVariableObj._sTopCtrlId + sDate.getTime();
				var arr = new Array(''), str = '';
				if( !flag ) {
					return str;
				}
				arr.push('<div id="' + sId + '" class="p-videoCtrl-northDiv p-gradient-ctrl">');
				arr.push(!oCtl.bFull ? '' : '<div class="p-s-0 p-button" title="' + o.l_oScreen.l_fullScreen + '"></div>');
				arr.push(!oCtl.bNine ? '' : '<div class="p-s-9 p-button" title="' + o.l_oScreen.l_nineWindow + '"><table><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></table></div>');
				arr.push(!oCtl.bFour ? '' : '<div class="p-s-4 p-button" title="' + o.l_oScreen.l_fourWindow + '"></div>');
				arr.push(!oCtl.bOne ? '' : '<div class="p-s-1 p-button" title="' + o.l_oScreen.l_oneWindow + '"><table><tr><td></td></tr></table></div>');
				if( JSVideoCtrl._oVariableObj._oFuncInfo.iWhichShowOnTop ) {
					arr.push('<div class="p-c-decorate"></div>');
				}
				arr.push('</div>');
				str = arr.join('');

				JSVideoCtrl._oVariableObj._sTopCtrlId = sId;
				delete sDate;
				delete arr;
				return str;
			},

			/**
			 * @method _createBottomCtrl 创建bottom控制部分
			 * @param flag 是否创建标志 true-创建 false-返回""
			 * @return {String}  字符串表示
			 * */
			_createBottomCtrl : function(flag) {
				var o = JSVideoCtrl._oVariableObj._oLangPkg;
				var oCtl = JSVideoCtrl._oVariableObj._oFuncInfo.oControl;
				var sDate = new Date();
				var sId = JSVideoCtrl._oVariableObj._sBottomCtrlId + sDate.getTime();
				var arr = new Array(''), str = '';
				if( !flag ) {
					return str;
				}
				arr.push('<div id="' + sId + '" class="p-videoCtrl-southDiv p-gradient-ctrl">');
				arr.push(!oCtl.bRecord ? '' : '<div class="p-c-video p-button" title="' + o.l_oPlayCtrl.l_record + '"></div>');
				arr.push(!oCtl.bTalkback ? '' : '<div class="p-c-talkback p-button" title="' + o.l_oPlayCtrl.l_talkbackOpen + '"></div>');
				arr.push(!oCtl.bCapture ? '' : '<div class="p-c-capture p-button" title="' + o.l_oPlayCtrl.l_snapshot + '"></div>');
				arr.push(!oCtl.bAudio ? '' : '<div class="p-c-audio p-button" title="' + o.l_oPlayCtrl.l_audioOpen + '"></div>');
				arr.push(!oCtl.bStopAll ? '' : '<div class="p-c-stopAll p-button" title="' + o.l_oPlayCtrl.l_stopAll + '"></div>');
				arr.push(!oCtl.bStop ? '' : '<div class="p-c-stop p-button" title="' + o.l_oPlayCtrl.l_stop + '"></div>');
				arr.push(!oCtl.bReplay ? '' : '<div class="p-c-play p-button" title="' + o.l_oPlayCtrl.l_replay + '"></div>');
				if( !JSVideoCtrl._oVariableObj._oFuncInfo.iWhichShowOnTop ) {
					arr.push('<div class="p-c-decorate"></div>');
				}
				arr.push('</div>');
				str = arr.join('');

				JSVideoCtrl._oVariableObj._sBottomCtrlId = sId;
				delete sDate;
				delete arr;
				return str;
			},

			/**
			 * @method _createControlCtrl 创建参数控制部分
			 * @param flag 是否创建标志 true-创建 false-返回""
			 * @return {String}  字符串表示
			 * */
			_createControlCtrl : function(flag) {
				var sDate = new Date();
				var sId = JSVideoCtrl._oVariableObj._sControlCtrlId + sDate.getTime();
				var arr = new Array(''), str = '';
				if( !flag ) {
					return str;
				}
				arr.push('<div id="' + sId + '" class="p-videoCtrl-eastDiv">');
				arr.push('	<h3>First</h3>');
				arr.push('	<div>Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.</div>');
				arr.push('	<h3>Second</h3>');
				arr.push('	<div>Phasellus mattis tincidunt nibh.</div>');
				arr.push('	<h3>3</h3>');
				arr.push('	<div>Phasellus mattis tincidunt nibh.</div>');
				arr.push('</div>');
				str = arr.join('');

				JSVideoCtrl._oVariableObj._sControlCtrlId = sId;
				delete sDate;
				delete arr;
				return str;
			},

			/**
			 * @method _createTitle 创建窗口模式中的title
			 * @param flag 是否创建标志 true-创建 false-返回""
			 * @return {String}  字符串表示
			 * */
			_createTitle : function(flag) {
				var sDate = new Date();
				var sTitleId = JSVideoCtrl._oVariableObj._sTitleCtrlId + sDate.getTime();
				var sShowId = JSVideoCtrl._oVariableObj._sTitleShowId + sDate.getTime();
				var arr = new Array(''), str = '';
				if( !flag ) {
					return str;
				}
				arr.push('<div id="' + sTitleId + '" class="p-videoCtrl-titleDiv p-gradient-ctrl">');
				arr.push('<iframe style= "position:absolute; left:0px; top:0px; width:100%; height:100%; z-index:-1; scrolling:no;" frameborder="0"></iframe>');
				arr.push('<div id="' + sShowId + '" class="p-videoCtrl-titleDiv-show"></div>');
				arr.push('<div id="_videoCtrl_titleDiv_close" class="p-videoCtrl-titleDiv-close"><span>×</span></div>');
				arr.push('</div>');
				str = arr.join('');

				JSVideoCtrl._oVariableObj._sTitleCtrlId = sTitleId;
				JSVideoCtrl._oVariableObj._sTitleShowId = sShowId;
				delete sDate;
				delete arr;
				return str;
			},

			/**
			 * @method _eventBind 绑定界面事件
			 * */
			_eventBind : function() {
				if( JSVideoCtrl._oVariableObj._oFuncInfo.bWindowMode ) {
					$(".p-videoCtrl-titleDiv-close").bind("click", function() {
						//停止所有窗口连接
						JSVideoCtrl.externalInterface.videoCtrl.realtimeCtrl.stopAll();
						$("#" + JSVideoCtrl._oVariableObj._sBasicDivId).css({
							visibility : "hidden"
						});
					});
				}
				else {
					//全屏
					$(".p-s-0").bind("click", function() {
						JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._fullScreen();
					});

					//单窗口
					$(".p-s-1").bind("click", function() {
						JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._setScreenNum(1);
					});

					//4窗口
					$(".p-s-4").bind("click", function() {
						JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._setScreenNum(4);
					});

					//9窗口
					$(".p-s-9").bind("click", function() {
						JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._setScreenNum(9);
					});

					//重连
					$(".p-c-play").bind("click", function() {
						JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._replay();
					});

					//断开重连
					$(".p-c-stop").bind("click", function() {
						//JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._stop();
						JSVideoCtrl.externalInterface.videoCtrl.realtimeCtrl.stop();
					});

					//断开所有重连
					$(".p-c-stopAll").bind("click", function() {
						//JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._stopAll();
						JSVideoCtrl.externalInterface.videoCtrl.realtimeCtrl.stopAll();
					});

					//音频
					$(".p-c-audio").toggle(function() {
						JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._setAudio(true);
					}, function() {
						JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._setAudio(false);
					});

					//语音对讲
					$(".p-c-talkback").toggle(function() {
						JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._setTalkback(true);
					}, function() {
						JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._setTalkback(false);
					});

					//抓图
					$(".p-c-capture").bind("click", function() {
						JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._snapshot();
					});

					//本地录像
					$(".p-c-video").bind("click", function() {
						if( JSVideoCtrl._oVariableObj._isRecord ) {
							JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._setRecord(false);
							$(this).addClass("p-button-hover");
						}
						else {
							JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._setRecord(true);
							$(this).removeClass("p-button-hover");
						}
					});
				};

			},

			/**
			 * @method _moveDiv 移动视频控件的位置
			 * @return {String}  插件的字符串表示
			 * */
			_resize : function(iWidth, iHeight) {
				var w, h;
				if( typeof iWidth!="undefined" && typeof iHeight!="undefined" ) {
//					w = iWidth>=330 ? iWidth : 670;
//					h = iHeight>=120 ? iHeight : 460;
                    w = iWidth>=330 ? iWidth : 1;
					h = iHeight>=120 ? iHeight : 1;

					JSVideoCtrl._oVariableObj._iCanvasX = w;
					JSVideoCtrl._oVariableObj._iCanvasY = h;
				}

				if( typeof iWidth=="undefined" || typeof iHeight=="undefined" ) {
					w = $("#" + JSVideoCtrl._oVariableObj._sBasicDivId).width();
					h = $("#" + JSVideoCtrl._oVariableObj._sBasicDivId).height();

					JSVideoCtrl._oVariableObj._iCanvasX = w;
					JSVideoCtrl._oVariableObj._iCanvasY = h;
				}

				//改变父容器大小
				JSVideoCtrl._init._moveDiv();
			},

			/**
			 * @method _moveDiv 移动视频控件的位置
			 * @return {String}  插件的字符串表示
			 * */
			_moveDiv : function() {
				var oFuncInfo = JSVideoCtrl._oVariableObj._oFuncInfo;
				var o = JSVideoCtrl._oVariableObj;
				var bddiv = $("#" + o._sBasicDivId);
				bddiv.css({
					width : o._iCanvasX + "px",
					height : o._iCanvasY + "px"
				});

				//如果是窗口模式
				if( oFuncInfo.bWindowMode ) {
					$("#" + o._sTitleCtrlId).width(o._iCanvasX).height(25);
					$("#" + o._sIEVideoControlId).width($("#" + o._sTitleCtrlId).width() + 2).height(o._iCanvasY - $("#" + o._sTitleCtrlId).height());
					bddiv.css({
						left : ($(window).width() - bddiv.width()) / 2 + "px",
						top : ($(window).height() - bddiv.height()) / 2 + "px"
					});
				}
				else {
					//如果需要显示右边的参数控制面板
					if( oFuncInfo.bShowParaCtrl ) {
						$("#" + o._sControlCtrlId).css({
							width : 168 + "px",
							height : o._iCanvasY + "px"
						});

						$("#" + o._sLeftCtrlId).css({
							width : (o._iCanvasX - $("#" + o._sControlCtrlId).width() + "px"),
							height : (o._iCanvasY + "px")
						});
					}
					else {
						$("#" + o._sLeftCtrlId).css({
							width : (o._iCanvasX + "px"),
							height : (o._iCanvasY + "px")
						});
					}

					if( oFuncInfo.bShowScreenCtrl ) {
						if( oFuncInfo.bShowPlayCtrl ) {
							$("#" + o._sTopCtrlId).height(o._iPanelHeight).width($("#" + o._sLeftCtrlId).width());
							$("#" + o._sBottomCtrlId).height(o._iPanelHeight).width($("#" + o._sLeftCtrlId).width());
							$("#" + o._sIEVideoControlId).width($("#" + o._sLeftCtrlId).width()).height(o._iCanvasY - $("#" + o._sTopCtrlId).height() - $("#" + o._sBottomCtrlId).height());
						}
						else {
							$("#" + o._sTopCtrlId).height(o._iPanelHeight).width($("#" + o._sLeftCtrlId).width());
							$("#" + o._sIEVideoControlId).width($("#" + o._sLeftCtrlId).width()).height(o._iCanvasY - $("#" + o._sTopCtrlId).height());
						}
					}
					else {
						if( oFuncInfo.bShowPlayCtrl ) {
							$("#" + o._sBottomCtrlId).height(o._iPanelHeight).width($("#" + o._sLeftCtrlId).width());
							$("#" + o._sIEVideoControlId).width($("#" + o._sLeftCtrlId).width()).height(o._iCanvasY - $("#" + o._sBottomCtrlId).height());
						}
						else {
							$("#" + o._sIEVideoControlId).width($("#" + o._sLeftCtrlId).width()).height(o._iCanvasY);
						}
					}
				}
			}
		},

		/**
		 * @description 外部接口
		 * @lends JSVideoCtrl.prototype
		 */
		externalInterface : {
			/**
			 * @deprecated 已经废弃
			 * @description 设置模块相对于页面左上角的位置
			 * @param {Number} positionX=0 x坐标
			 * @param {Number} positionY=0 y坐标
			 */
			setPosition : function(positionX, positionY) {
//				var x = positionX>0 ? positionX : 0;
//				var y = positionY>0 ? positionY : 0;

                var x = positionX, y=positionY;

				JSVideoCtrl._oVariableObj._iPositionX = x;
				JSVideoCtrl._oVariableObj._iPositionY = y;

				try {
					var o = $("#" + JSVideoCtrl._oVariableObj._sBasicDivId);
					o.css({
						left : x + 'px',
						top : y + 'px'
					});
					//o.addClass('JSVideoPluginDiv');
				}
				catch(e) {
					JSVideoCtrl._log._console('err setPosition:' + e);
				}
			},

			/**
			 * @description 重设控件的宽高
			 * @param {number} canvasX=840 模块的宽 可以为空 为空则获取依附对象的宽
			 * @param {number} canvasY=460 模块的高 可以为空 为空则获取依附对象的高
			 */
			resize : function(iWidht, iHeight) {
				JSVideoCtrl._init._resize(iWidht, iHeight);
			},

			/**
			 * @description 窗口大小改变事件回调
			 */
			resizeCallback : function() {
				var w = $("#" + JSVideoCtrl._oVariableObj._sBasicDivId).width();
				var h = $("#" + JSVideoCtrl._oVariableObj._sBasicDivId).height();
				JSVideoCtrl._init._resize(w, h);
			},

			/**
			 * @description 设置控制的模式  默认为false
			 * @param {Boolean} bFlag true-debug  false-relase
			 */
			setDebugMode : function(bFlag) {
				JSVideoCtrl._oVariableObj._bDebugMode = bFlag;
			},

			// /**
			// * @description 设置控件窗口数 默认为4
			// * @param {Boolean} iNum
			// */
			// setScreenNum : function(iNum) {
			// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._setScreenNum(iNum?iNum:4);
			// },
			//
			/**
			 * @description 设置控件样式
			 */
			setSurface : function(o) {
				JSVideoCtrl._VideoPlayerCtrl._oVideoPlayer.SetSurface(JSVideoCtrl._toolkit._json2str(o));
			},
			/**
			 * 通知控件已经收到了初始化完成的消息 让控件停止当前的这个消息回调
			 */
			tellGetInitEvent : function() {
				JSVideoCtrl._VideoPlayerCtrl._oVideoPlayer.TellGetInitEvent();
			},

            /**
             * 通知控件销毁窗口
             */
            tellReleaseOCX: function () {
                JSVideoCtrl._VideoPlayerCtrl._oVideoPlayer.ReleaseOCX();
            },

            /**
             * @description 获取当前播放器的窗口数
             * @lends videoCtrl.prototype
             * @return {Number}
             */
            getScreenNum: function () {
                return JSVideoCtrl._oVariableObj._iCurrentScreenTotal || 1;
            },

            /**
             * @description 获取巡检按钮对象
             * @lends videoCtrl.prototype
             * @return {Number}
             */
            getPollObj: function () {
                return document.getElementById("p_s_poll");
            },

			/**
			 * @description 绘制控件
			 * @param {Object} [oPlayerInitParam] 控件的外观样式定义,为空的话,就用默认样式
			 * @param {String} [sPluginId] 视频控件的classid, 为空的话  就用默认值
			 * @return {String} 如果是内部创建的父对象  则返回父对象id 否则返回""
			 */
			draw : function(oPlayerInitParam, sPluginClassId) {
				if( typeof sPluginClassId!="undefined" ) {
					JSVideoCtrl._oVariableObj._sClassid = sPluginClassId;
				}
				JSVideoCtrl._init._initFun(m_oFuncInfo);
				JSVideoCtrl._init._initLanguage(m_oLanguageInfo);
				var cssfilepath = m_sUIInfo;
				if( typeof cssfilepath!="string" ) {
					cssfilepath = JSVideoCtrl._oVariableObj._sCssFilePath;
				}
				//如果外部没有传入样式配置文件路径  则使用默认路径
				if( !JSVideoCtrl._toolkit._loadFile(cssfilepath, "css") ) {
					JSVideoCtrl._log._console("load css fail, the file path:" + sFilePath);
					return false;
				}
				//绘制对象
				var sParent = JSVideoCtrl._init._initVideoPlugin(JSVideoCtrl._oVariableObj._sClassid);

				//注册所有事件回调处理函数
				if( JSVideoCtrl._VideoPlayerCtrl._oVideoPlayer ) {
					try {
						if( document.addEventListener ) {
							JSVideoCtrl._VideoPlayerCtrl._oVideoPlayer.OnComponentEvent = JSVideoCtrl._VideoPlayerCtrl._PlayerEvent._event._switchReg;
						}
						else {
							//新的注册事件方法, 兼容ie9
							JSVideoCtrl._VideoPlayerCtrl._oVideoPlayer.SetComponentEventCB(JSVideoCtrl._VideoPlayerCtrl._PlayerEvent._event._switchReg);
							//JSVideoCtrl._VideoPlayerCtrl._oVideoPlayer.attachEvent("OnComponentEvent", JSVideoCtrl._VideoPlayerCtrl._PlayerEvent._event._switchReg);
						}
					}
					catch (e) {
						JSVideoCtrl._log._info('_regEventCallback err:' + e);
					}
				}
				else {
					JSVideoCtrl._log._info('_regEventCallback: Control not init!');
				}
				//初始化控件外观样式
				JSVideoCtrl._VideoPlayerCtrl._PlayerDisplayMode(oPlayerInitParam);

				return sParent;
			},

			/**
			 * @description 视频控制模块
			 * @lends externalInterface.prototype
			 */
			videoCtrl : {
				/**
				 * @deprecated 已经废弃
				 * @description 设置控件的宽高
				 * @lends videoCtrl.prototype
				 * @param {number} canvasX=840 模块的宽 最小值 x=450 y=340
				 * @param {number} canvasY=460 模块的高
				 */
				setSize : function(canvasX, canvasY) {

					// var x = canvasX>=450 ? canvasX : 670;
					// var y = canvasY>=340 ? canvasY : 460;
					//
					// JSVideoCtrl._oVariableObj._iCanvasX = x;
					// JSVideoCtrl._oVariableObj._iCanvasY = y;

					//改变父容器大小
					//JSVideoCtrl._init._moveDiv();

					//JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._setSize(x, y);
				},

				/**
				 * @description 播放控件全屏
				 * @lends videoCtrl.prototype
				 * @return {Boolean}
				 */
				setFullScreen : function() {
					return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._fullScreen();
				},

				/**
				 * @description 设置屏幕窗口数量
				 * @lends videoCtrl.prototype
				 * @param {Number} screens 窗口数 范围为 1,4,9,16 默认为1
				 * @return {Boolean}
				 */
				setScreenNum : function(screens) {
					if( screens!=1 && screens!=4 && screens!=9 && screens!=16 ) {
						screens = 1;
					}
					return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._setScreenNum(screens);
				},

				/**
				 * @description 设置播放器可见性
				 * @lends videoCtrl.prototype
				 * @param{Boolean} visibility true-可见;false-隐藏 如果不传的话 默认为可见
				 * @return {boolean}
				 */
				setVisibility : function(visibility) {
					if( ! typeof (visibility) ) {
						visibility = true;
					}
					$("#" + JSVideoCtrl._oVariableObj._sBasicDivId).css({
						visibility : visibility ? "visible" : "hidden"
					});

					return true;

					//return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._setVisibility(vidibility);
				},

				/**
				 * @description 语音对讲操作
				 * @lends videoCtrl.prototype
				 * @param {boolean} talk true-打开对讲;false-关闭对讲 默认为关闭
				 * @return {boolean} true-成功 false-失败
				 */
				setTalk : function(talk) {
					if( ! typeof (talk) ) {
						talk = false;
					}
					return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._setTalkback(talk);
				},

				/**
				 * @description 开关播放器声音
				 * @lends videoCtrl.prototype
				 * @param{Boolean} audio true-打开声音;false-关闭声音 如果不传的话 默认为关闭声音
				 * @return {boolean}
				 */
				setAudio : function(audio) {
					if( ! typeof (audio) ) {
						audio = false;
					}
					return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._setAudio(audio);
				},

				/**
				 * 对组件的操作接口
				 * @lends videoCtrl.prototype
				 * @param {Object} devjson JSON格式的参数.
				 * 添加设备[in]
				 * 例如："{\"target\":\"device/add\",\"action\":\"set\",\"sid\":\"100861\",\"data\":{\"component\":\"RMSClientComponent\",\"devip\":\"192.168.15.88\",\"devport\":6100,\"devname\":\"dev01\",\"username\":\"admin\",\"password\":\"admin\",\"devtype\":\"cu\",\"ext\":\"ext\"}}"
				 * [out]   {code:0,msg:"ok",data:{}}
				 *
				 * 删除设备
				 * 例如："{\"target\":\"device/delete\",\"action\":\"set\",\"sid\":\"100861\",\"data\":{\"component\":\"RMSClientComponent\",\"devname\":\"dev01\"}}"
				 * [out]   {code:0,msg:"ok",data:{}}
				 *
				 * 开流
				 * 例如："{\"target\":\"stream/open\",\"action\":\"set\",\"sid\":\"100861\",\"data\":{\"component\":\"RMSClientComponent\",\"devname\":\"dev01\",\"chanid\":\"rms/234/1\",\"streamtype\":0,\"protocal\":\"tcp\",\"ext\":\"\",\"_id\":\"121212\"}}"
				 * [out]   {code:0,msg:"ok",data:{index:1,_id : "zt01"}}
				 *
				 * 关流
				 * 例如："{\"target\":\"stream/close\",\"action\":\"set\",\"sid\":\"100861\",\"data\":{\"component\":\"RMSClientComponent\",\"devname\":\"dev01\",\"chanid\":\"rms/234/1\",\"streamtype\":0,\"protocal\":\"tcp\",\"ext\":\"\",\"_id\":\"121211\"}}"
				 * [out]   {code:0,msg:"ok",data:{index:1,_id : "zt01"}}
				 * @param {Number} iType 协议类型
				 * @return {String} 成功返回[out]字符串，失败返回""
				 */
				handleComponent : function(devjson, iType) {
					if( typeof devjson=="undefined" ) {
						return "";
					}
                    return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._handleComponent(devjson);
				},

				/**
				 * @description 获取控件版本
				 * @lends videoCtrl.prototype
				 * @return {String} 成功返回版本号，类似"1.4.5.6"的字符串 失败返回""
				 */
				getVersion : function() {
					return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._getOCXVersion();
				},

				/**
				 * @description 实时视频播放控制
				 * @lends videoCtrl.prototype
				 */
				realtimeCtrl : {
					/**
					 *决定当前的协议类型
					 * @return {String} 见 _oComponetType 定义
					 * @see _oComponetType
					 *  */
					_CheckCompentType : function(iType) {
						if( iType>=0 && iType<JSVideoCtrl._oVariableObj._oComponetType.length ) {
							return JSVideoCtrl._oVariableObj._oComponetType[iType];
						}
						else {
							return "";
						}
					},
					/**
					 * @description 连接视频函数(播放)
					 * @lends realtimeCtrl.prototype
					 * @param{Object} data 播放链接

					 * 开流
					 * 例如："{"component":"RMSClientComponent","devname":"dev01","chanid":"rms/234/1","streamtype":0,"protocal":"tcp","ext":"","_id":"121212"}"
					 * [out]   {code:0,msg:"ok",data:{index:1,_id : "zt01"}}
					 * @param {String} iType 0-NPStreamClientComponent
					 * 1-NPRMSClientComponent 2-NPTcspSDKComponent 3-RMSClientComponent
					 * @param {String} sID 客户端身份标识
					 * @return {String} [out]
					 */
					playVideo : function(data, iType, sID) {
						data.component = JSVideoCtrl.externalInterface.videoCtrl.realtimeCtrl._CheckCompentType(iType);
						var o = {
							"target" : 'stream/open',
							"action" : 'set',
							"sid" : sID,
							"data" : data
						};

						// return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._play(o);
						return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._handleComponent(o);
					},

					/**
					 *TODO 控件未实现 replayVideo
					 * @description 视频重连
					 * @lends videoCtrl.prototype
					 * @return {boolean}
					 */
					replayVideo : function() {
						return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._replay();
					},

					/**
					 * @description 断开视频
					 * @lends videoCtrl.prototype
					 * @param {String} sID 客户端身份标识
					 * @return {String} [out]
					 */
					stop : function(data, iType, sID) {
						data.component = JSVideoCtrl.externalInterface.videoCtrl.realtimeCtrl._CheckCompentType(iType);
						var o = {
							"target" : 'stream/close',
							"action" : 'set',
							"sid" : sID,
							"data" : data
						};

						// return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._stop(o);
						return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._handleComponent(o);
					},

					/**
					 * @description 断开所有窗口视频连接
					 * @lends videoCtrl.prototype
					 * @return {boolean}
					 */
					stopAll : function() {
						var o = {
							"target" : 'stream/closeall',
							"action" : 'set',
							"sid" : "",
							"data" : null //data为空就是停止所有连接
						};

						// return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._stopAll(o);
						return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._handleComponent(o);
					},

					/**
					 * @description 通过url连接视频
					 * @lends videoCtrl.prototype
					 * @param {String} sID 客户端身份标识
					 * @param {Object} data
					 * 		{String} url 连接视频的url地址
					 * "rtsp://192.168.10.154:25700/realplay?devid=812A91B3DC3&channelno=0&streamtype=0&hashtoken=d3a69edc3dc0f44915eb999ddce6fa8c"
					 * 		{Number} streamtype 码流类型 0-主码流
					 * 		{String} protocal 协议类型 "tcp"
					 * 		{String} _id
					 * @return {String} [out]
					 */
					playUrl : function(sID, data) {
						var o = {
							"target" : 'url/open',
							"action" : 'set',
							"sid" : sID,
							"data" : data
						};

						return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._handleComponent(o);
						;
					},

					/**
					 * @description 通过url断开视频
					 * @lends videoCtrl.prototype
					 * @param {String} url 连接视频的url地址
					 * "rtsp://192.168.10.154:25700/realplay?devid=812A91B3DC3&channelno=0&streamtype=0&hashtoken=d3a69edc3dc0f44915eb999ddce6fa8c"
					 * @param {String} sID 客户端身份标识
					 * @param {Object} data
					 * 		{String} url 连接视频的url地址
					 * "rtsp://192.168.10.154:25700/realplay?devid=812A91B3DC3&channelno=0&streamtype=0&hashtoken=d3a69edc3dc0f44915eb999ddce6fa8c"
					 * 		{String} _id
					 * @return {String} [out]
					 */
					stopUrl : function(sID, data) {
						var o = {
							"target" : 'url/close',
							"action" : 'set',
							"sid" : sID,
							"data" : data
						};

						return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._handleComponent(o);
						;
					},

					/**
					 * @description 设置对讲开关
					 * @lends videoCtrl.prototype
					 * @param{Boolean} alarm true-打开报警;false-关闭报警 如果不传的话 默认为关闭
					 * @return {boolean}
					 */
					setAlarm : function(alarm) {
						if( ! typeof (alarm) ) {
							alarm = false;
						}
						return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._setAlarm(alarm);
					},

					/**
					 * @description 获取选中播放器当前截图路径
					 * @lends videoCtrl.prototype
					 * @return {String} 成功返回截图的保存路径,失败返回""
					 */
					getMotionPicture : function() {
						return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._getMotionPicture();
					},

					/**
					 * @description 删除选中播放器当前截图路径图片
					 * @lends videoCtrl.prototype
					 * @return {Boolean} true-删除图片成功;false-删除图片失败
					 */
					deleteMotionPicture : function() {
						return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._deleteMotionPicture();
					}
				},

				/**
				 * @description 本地操作控制
				 * @lends videoCtrl.prototype
				 */
				localCtrl : {
					/**
					 * @description 图片控制
					 * @lends localCtrl.prototype
					 */
					picCtrl : {
						/**
						 * @description 手动抓图
						 * @lends picCtrl.prototype
						 * @return {Boolean} 成功-true 失败-false
						 */
						getSnapshot : function() {
							var ret = JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._snapshot();
							if( ret==0 ) {
								ret = true;
							}
							else {
								ret = false;
							}
							return ret;
						},

						/**
						 * @description 设置截图保存路径
						 * @lends picCtrl.prototype
						 * @return {Boolean} 成功-true 失败-false
						 */
						setFilePath : function() {
							return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._setFilePath();
						},

						/**
						 * @description 打开截图保存路径
						 * @lends picCtrl.prototype
						 * @return {Boolean} 成功-true 失败-false
						 */
						openFilePath : function() {
							return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._openFilePath();
						}
					},

					/**
					 * @description 视频控制
					 * @lends localCtrl.prototype
					 * @param {boolean} audio true-打开对讲;false-关闭对讲
					 */
					streamCtrl : {
						/**
						 * @description 设置录像文件大小
						 * @lends streamCtrl.prototype
						 * @param {Number} size 录像文件大小(MB) 如果没传的话 默认为5M
						 * @return {boolean} true-成功;false-失败
						 */
						setRecordFileSize : function(size) {
							if( size<=0 ) {
								size = 5;
							}
							return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._setRecordFileSize(size);
						},

						/**
						 * @description 设置录像开关
						 * @lends streamCtrl.prototype
						 * @param {Number} record true-打开录像;false-关闭录像 如果没传 默认为关闭
						 * @return {boolean} true-打开/关闭录像成功;false-打开/关闭录像失败
						 */
						setRecord : function(record) {
							if( !record ) {
								record = false;
							}
							return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._setRecord(record);
						},

						/**
						 * @description 设置录像文件保存路径
						 * @lends streamCtrl.prototype
						 * @return {boolean} true-成功;false-失败
						 */
						setRecordPath : function() {
							return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._setRecordPath();
						},
						
						/**
						 * @description 获取录像文件保存路径
						 * @lends streamCtrl.prototype
						 * @return {boolean} true-成功;false-失败
						 */
						getRecordPath : function() {
							return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._getRecordPath();
						},

						/**
						 * @description 打开录像文件保存路径
						 * @lends streamCtrl.prototype
						 * @return {boolean} true-成功;false-失败
						 */
						openRecordPath : function() {
							return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._openRecordPath();
						}
					}
				},

				/**
				 * @description 控件事件控制
				 * @lends videoCtrl.prototype
				 */
				eventCtrl : {
					//定义事件宏对象
					_cmd : function() {
						return JSVideoCtrl._macro._eventCmd;
					},

					_regEvent : function(iType, func) {
						if( typeof iType=="number" && typeof func=="function" ) {
							try {
								JSVideoCtrl._VideoPlayerCtrl._PlayerEvent._bind._oAllEvents["_" + iType] = func;
								return true;
							}
							catch(e) {
								JSVideoCtrl._log._info("_regEvent err:" + e + " type=" + iType);
							}
						}
						else {
							return false;
						}
					},

					/**
					 * 注册设备添加事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regDevAdd : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_COMMAND_EVENT_ADDDEV, func);
					},

					/**
					 * 注册设备删除事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regDevDel : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_COMMAND_EVENT_DELDEV, func);
					},

					/**
					 * 注册删除所有设备事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regDevDelAll : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_COMMAND_EVENT_DELALLDEV, func);
					},

					/**
					 * 注册刷新设备事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regDevRefresh : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_COMMAND_EVENT_REFRESHDEV, func);
					},

					/**
					 * 注册刷新所有设备事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regDevRefreshAll : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_COMMAND_EVENT_REFRESHALLDEV, func);
					},

					/**
					 * 注册枚举节点事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regEnumNode : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_COMMAND_EVENT_ENUMNODE, func);
					},

					/**
					 * 注册开流事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regPlayEvent : function(func) {
						return this._regEvent(this._cmd().RRMSCLIENTSDK_COMMAND_EVENT_OPENSTREAM, func);
					},

					/**
					 * 注册关流事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regStopEvent : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_COMMAND_EVENT_CLOSESTREAM, func);
					},

					/**
					 * 注册关闭所有通道事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regStopAllEvent : function(func) {
					    return this._regEvent(this._cmd().RMSCLIENTSDK_COMMAND_EVENT_CLOSEALLSTREAM, func);
					},

					/**
					 * 注册云台控制事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regPtzEvent : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_COMMAND_EVENT_PTZ, func);
					},

					/**
					 * 注册获取视频参数事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regVideoColorGet : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_COMMAND_EVENT_VIDEOCOLORGET, func);
					},

					/**
					 * 注册设置视频参数事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regVideoColorSet : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_COMMAND_EVENT_VIDEOCOLORSET, func);
					},

					/**
					 * 注册查询历史文件事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regFileSearch : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_COMMAND_EVENT_FILESEARCH, func);
					},

					/**
					 * 注册按时间播放历史文件事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regFilePlayByTime : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_COMMAND_EVENT_FILEPLAYBYTIME, func);
					},

					/**
					 * 注册按文件名播放历史文件事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regFilePlayByName : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_COMMAND_EVENT_FILEPLAYBYNAME, func);
					},

					/**
					 * 注册按时间下载历史文件事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regFileGetByTime : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_COMMAND_EVENT_FILEDOWNLOADBYTIME, func);
					},

					/**
					 * 注册按文件名下载历史文件事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regFileGetByName : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_COMMAND_EVENT_FILEDOWNLOADBYNAME, func);
					},

					/**
					 * 注册历史文件播放控制事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regFileCtrlStart : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_COMMAND_EVENT_FILEIDCTRL, func);
					},

					/**
					 * 注册历史文件停止事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regFileCtrlStop : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_COMMAND_EVENT_FILEIDSTOP, func);
					},

					/**
					 * 注册添加通道事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regAddChannel : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_COMMAND_EVENT_ADDCHAN, func);
					},

					/**
					 * 注册URL开流事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regUrlOpenStream : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_COMMAND_EVENT_URLOPENSTREAM, func);
					},

					/**
					 * 注册URL关流事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regUrlCloseStream : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_COMMAND_EVENT_URLCLOSESTREAM, func);
					},

					/**
					 * @description 注册设备断线事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regDevBrokenEvent : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_SDK_EVENT_DEV_BROKEN, func);
					},

					/**
					 * 注册设备连接成功事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regDevConnectEvent : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_SDK_EVENT_DEV_CONNECT, func);
					},

					/**
					 * @description 注册视频断线 在打开组件的断线报警后每当有通道断线就会进行该回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regStreamBroken : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_SDK_EVENT_STREAM_BROKEN, func);
					},

					/**
					 * @description 注册视频重连事件回调 在打开组件的断线报警后每当有通道断线后重连成功就会进行该回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regStreamConnectEvent : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_SDK_EVENT_STREAM_CONNECT, func);
					},

					/**
					 * 设备服务器启动完成事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regServeRunning : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_SDK_EVENT_SERVE_RUNNING, func);
					},

					/**
					 * 设备服务器死掉事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regServeHalt : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_SDK_EVENT_SERVE_HALT, func);
					},

					/**
					 * 设备节点改变事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regServeHalt : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_SDK_EVENT_NODE_CHANGE, func);
					},

                    /**
                     * 流连接错误
                     * @param{Function} func 回调事件执行的函数
                     * @return {Boolean} true-成功
                     */
                    regStreamConnectError: function (func) {
                        return this._regEvent(this._cmd().RMSCLIENTSDK_SDK_EVENT_STREAM_CONNECT_ERROR, func);
                    },

					/**
					 * 控件初始化完成事件回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regInitFinished : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_WINDOW_EVENT_INIT_FINISHED, func);
					},

					/**
					 * @description 注册选中窗口事件回调 每次选择框变更即会进行该回调
					 * @param{Function} func 回调事件执行的函数
					 * @return {Boolean} true-成功
					 */
					regSelectEvent : function(func) {
						return this._regEvent(this._cmd().RMSCLIENTSDK_WINDOW_EVENT_SELECTWINDOW_CHANGE, func);
					}
				}
			},

			/**
			 * @description 云台控制模块
			 * @lends exterrnalInterfice.prototype
			 */
			ptzCtrl : {
				/**
				 * 检测云台速度合法值
				 * @param {Number} speed [0,10]
				 * @return {Number} 合法返回本身 如果非法 默认返回5
				 */
				_checkout : function(speed) {
					if( speed<0 || speed>15 ) {
						speed = 5;
					}
					return speed;
				},

				/**
				 *云台控制
				 * @param {Number} cmd 云台控制命令 详见 _macro对象
				 * @param {Number} speed 云台速度[0,10]
				 * @return {Number} 成功返回true，失败返回false
				 */
				ptz : function(cmd, speed) {
					return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(cmd, speed);
				},

				/**
				 * 云台停止
				 * @param {Number} speed 云台速度[0,10]
				 * @return {Number} 成功返回true，失败返回false
				 */
				turnHalt : function(speed, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_HALT, this._checkout(speed), sID);
					// return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro.TCSP_PTZ_HALT,
					// this._checkout(speed));
				},

				/**
				 * 云台左转
				 * @lends ptzCtrl.prototype
				 * @param {Number} speed 云台速度[0,10]
				 * @param {Number} iType 协议类型
				 * @param {String} sID 客户端身份标识
				 * @return {Number} 成功返回true，失败返回false
				 */
				turnLeft : function(speed, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_PANLEFT, this._checkout(speed), sID);
					// return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro.TCSP_PTZ_PANLEFT,
					// this._checkout(speed));
				},

				/**
				 * 云台左转
				 * @lends ptzCtrl.prototype
				 * @param {Number} speed 云台速度[0,10]
				 * @return {Number} 成功返回true，失败返回false
				 */
				turnUp : function(speed, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_TILTUP, this._checkout(speed), sID);
					// return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro.TCSP_PTZ_TILTUP,
					// this._checkout(speed));
				},

				/**
				 * 云台右转
				 * @lends ptzCtrl.prototype
				 * @param {Number} speed 云台速度[0,10]
				 * @return {Number} 成功返回true，失败返回false
				 */
				turnRight : function(speed, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_PANRIGHT, this._checkout(speed), sID);
					// return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro.TCSP_PTZ_PANRIGHT,
					// this._checkout(speed));
				},

				/**
				 * 云台下转
				 * @lends ptzCtrl.prototype
				 * @param {Number} speed 云台速度[0,10]
				 * @return {Number} 成功返回true，失败返回false
				 */
				turnDown : function(speed, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_TILTDOWN, this._checkout(speed), sID);
					// return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro.TCSP_PTZ_TILTDOWN,
					// this._checkout(speed));
				},

				/**
				 * 云台左上
				 * @lends ptzCtrl.prototype
				 * @param {Number} speed 云台速度[0,10]
				 * @return {Number} 成功返回true，失败返回false
				 */
				turnLeftUp : function(speed, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_LEFTUP, this._checkout(speed), sID);
					//return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro.TCSP_PTZ_LEFTUP,
					// this._checkout(speed));
				},

				/**
				 * 云台右上
				 * @lends ptzCtrl.prototype
				 * @param {Number} speed 云台速度[0,10]
				 * @return {Number} 成功返回true，失败返回false
				 */
				turnRightUp : function(speed, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_RIGHTUP, this._checkout(speed), sID);
					//return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro.TCSP_PTZ_RIGHTUP,
					// this._checkout(speed));
				},

				/**
				 * 云台左下
				 * @lends ptzCtrl.prototype
				 * @param {Number} speed 云台速度[0,10]
				 * @return {Number} 成功返回true，失败返回false
				 */
				turnLeftDown : function(speed, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_LEFTDOWN, this._checkout(speed), sID);
					// return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro.TCSP_PTZ_LEFTDOWN,
					// this._checkout(speed));
				},

				/**
				 * 云台右下
				 * @lends ptzCtrl.prototype
				 * @param {Number} speed 云台速度[0,10]
				 * @return {Number} 成功返回true，失败返回false
				 */
				turnRightDown : function(speed, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_RIGHTDOWN, this._checkout(speed), sID);
					// return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro.TCSP_PTZ_RIGHTDOWN,
					// this._checkout(speed));
				},

				/**
				 * 云台360°旋转
				 * @lends ptzCtrl.prototype
				 * @param {Number} speed 云台速度[0,10]
				 * @return {Number} 成功返回true，失败返回false
				 */
				turnScan : function(speed, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_SCAN, this._checkout(speed), sID);
					//return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro.TCSP_PTZ_SCAN,
					// this._checkout(speed));
				},

				/**
				 * 焦距变大
				 * @lends ptzCtrl.prototype
				 * @param {Number} speed 云台速度[0,10]
				 * @return {Number} 成功返回true，失败返回false
				 */
				zoomAdd : function(speed, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_ZOOM, this._checkout(speed), sID);
					// return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro.TCSP_PTZ_ZOOM,
					// this._checkout(speed));
				},

				/**
				 * 焦距变小
				 * @lends ptzCtrl.prototype
				 * @param {Number} speed 云台速度[0,10]
				 * @return {Number} 成功返回true，失败返回false
				 */
				zoomSubtract : function(speed, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_ZOOM, -1 * this._checkout(speed), sID);
					// return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro.TCSP_PTZ_ZOOM,
					// -1 * this._checkout(speed));
				},

				/**
				 * 焦距停止
				 * @lends ptzCtrl.prototype
				 * @param {Number} [speed] 云台速度[0,10] 可以省略
				 * @return {Number} 成功返回true，失败返回false
				 */
				zoomStop : function(speed, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_ZOOM, this._checkout(0), sID);
					// return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro.TCSP_PTZ_ZOOM,
					// 0);
				},

				/**
				 * 光圈变大
				 * @lends ptzCtrl.prototype
				 * @param {Number} speed 云台速度[0,10]
				 * @return {Number} 成功返回true，失败返回false
				 */
				irisAdd : function(speed, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_IRIS, this._checkout(speed), sID);
					//return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro.TCSP_PTZ_IRIS,
					// this._checkout(speed));
				},

				/**
				 * 光圈变小
				 * @lends ptzCtrl.prototype
				 * @param {Number} speed 云台速度[0,10]
				 * @return {Number} 成功返回true，失败返回false
				 */
				irisSubtract : function(speed, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_IRIS, -1 * this._checkout(speed), sID);
					//return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro.TCSP_PTZ_IRIS,
					// -1 * this._checkout(speed));
				},

				/**
				 * 光圈停止
				 * @lends ptzCtrl.prototype
				 * @param {Number} speed 云台速度[0,10]
				 * @return {Number} 成功返回true，失败返回false
				 */
				irisStop : function(speed, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_IRIS, this._checkout(0), sID);
					// return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro.TCSP_PTZ_IRIS,
					// 0);
				},

				/**
				 * 焦点前调
				 * @lends ptzCtrl.prototype
				 * @param {Number} speed 云台速度[0,10]
				 * @return {Number} 成功返回true，失败返回false
				 */
				focusAdd : function(speed, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_FOCUS, this._checkout(speed), sID);
					// return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro.TCSP_PTZ_FOCUS,
					// this._checkout(speed));
				},

				/**
				 * 焦点后调
				 * @lends ptzCtrl.prototype
				 * @param {Number} speed 云台速度[0,10]
				 * @return {Number} 成功返回true，失败返回false
				 */
				focusSubtract : function(speed, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_FOCUS, -1 * this._checkout(speed), sID);
					//return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro.TCSP_PTZ_FOCUS,
					// -1 * this._checkout(speed));
				},

				/**
				 * 焦点停止
				 * @lends ptzCtrl.prototype
				 * @param {Number} speed 云台速度[0,10]
				 * @return {Number} 成功返回true，失败返回false
				 */
				focusStop : function(speed, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_HALT, this._checkout(0), sID);
					//return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro.TCSP_PTZ_FOCUS,
					// 0);
				},

				/**
				 * 调用预置位
				 * @lends ptzCtrl.prototype
				 * @param {Number} ptzpp 预置点号
				 * @return {Number} 成功返回true，失败返回false
				 */
				callPTZPP : function(ptzpp, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_VIEW, ptzpp, sID);
					// return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro.TCSP_PTZ_VIEW,
					// ptzpp);
				},

				/**
				 * 设置预置位
				 * @lends ptzCtrl.prototype
				 * @param {Number} ptzpp 预置点号
				 * @return {Number} 成功返回true，失败返回false
				 */
				setPTZPP : function(ptzpp, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_SETVIEW, ptzpp, sID);
					//return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro.TCSP_PTZ_SETVIEW,
					// ptzpp);
				},
				
				/**
				 * 删除预置位
				 * @lends ptzCtrl.prototype
				 * @param {Number} ptzpp 预置点号
				 * @return {Number} 成功返回true，失败返回false
				 */
				delPTZPP : function(ptzpp, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.CPM_PTZ_CLEARVIEW, ptzpp, sID);
				},

				/**
				 * 灯光操作
				 * @lends ptzCtrl.prototype
				 * @param {Boolean} bFlag 控制开关 true-打开 false-关闭
				 * @return {Number} 成功返回true，失败返回false
				 */
				setPtzLight : function(bFlag, sID) {
					return this._ptzOpt(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_LIGHT, this._checkout(bFlag), sID);
					// return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro.TCSP_PTZ_LIGHT,
					// bFlag);
				},

				/**
				 *TODO 风扇接口未完成
				 * 风扇操作
				 * @lends ptzCtrl.prototype
				 * @param {Boolean} bFlag 控制开关 true-打开 false-关闭
				 * @return {Number} 成功返回true，失败返回false
				 */
				setPtzFan : function(bFlag) {
					//return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_LIGHT,
					// bFlag);
				},

				/**
				 *TODO 雨刷接口未完成
				 * 雨刷操作
				 * @lends ptzCtrl.prototype
				 * @param {Boolean} bFlag 控制开关 true-打开 false-关闭
				 * @return {Number} 成功返回true，失败返回false
				 */
				setPtzWiper : function(bFlag) {
					//return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_LIGHT,
					// bFlag);
				},

				/**
				 *TODO 加热器接口未完成
				 * 加热器操作
				 * @lends ptzCtrl.prototype
				 * @param {Boolean} bFlag 控制开关 true-打开 false-关闭
				 * @return {Number} 成功返回true，失败返回false
				 */
				setPtzHeater : function(bFlag) {
					//return
					// JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._ptzCtrl(JSVideoCtrl._macro._ptzCmd.TCSP_PTZ_LIGHT,
					// bFlag);
				},

				/**
				 * _ptzOpt
				 * @lends ptzCtrl.prototype
				 * @param {Number} cmd 云台控制命令 详见 _macro对象
				 * @param {Number} speed 云台速度[0,10] 或预置位号
				 * @param {String} sID 客户端身份标识
				 * @return {Number} 成功返回true，失败返回false
				 */
				_ptzOpt : function(cmd, speed, sID) {
					sID = sID || new Date().getTime().toString();
					var o = {
						"target" : 'ptz',
						"action" : 'set',
						"sid" : sID,
						"data" : {
							"ptzcmd" : cmd,
							"ptzparam" : speed
						}
					};
					return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._handleComponent(o);
				},

				/**
				 * @description 实时视频显示参数控制
				 * @lends videoCtrl.prototype
				 */
				paramCtrl : {
					_o : {
						"target" : 'videocolor',
						"action" : 'set',
						"sid" : "3",
						"data" : {
							brightness : 30,
							contrast : 30,
							saturation : 30,
							hue : 30
						}
					},
					/**
					 * @description 实时视频亮度值 范围0-100
					 * @lends paramCtrl.prototype
					 * @param {Integer} value 亮度值
					 */
					setBrightness : function(value) {
						this._o.data = {};
						this._o.data.brightness = value;
						return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._handleComponent(this._o);
					},

					/**
					 * @description 色度值 范围0-100
					 * @lends paramCtrl.prototype
					 * @param {Integer} value 色度值
					 */
					setChroma : function(value) {
						this._o.data = {};
						this._o.data.hue = value;
						return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._handleComponent(this._o);
					},

					/**
					 * @description 对比度值 范围0-100
					 * @lends paramCtrl.prototype
					 * @param {Integer} value 对比度值
					 */
					setContrast : function(value) {
						this._o.data = {};
						this._o.data.contrast = value;
						return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._handleComponent(this._o);
					},
					/**
					 * @description 饱和度值 范围0-100
					 * @lends paramCtrl.prototype
					 * @param {Integer} value 饱和度值
					 */
					setSaturation : function(value) {
						this._o.data = {};
						this._o.data.saturation = value;
						return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._handleComponent(this._o);
					},
					/**
					 * @description 设置视频参数 范围0-100
					 * @param {Object} data {brightness:30,contrast:30,saturation:30,hue:30}
					 */
					setVideoParam : function(data) {
						if( data != "" ){
							this._o.data = data;
						}
						return JSVideoCtrl._VideoPlayerCtrl._PlayerMethod._handleComponent(this._o);
					}
				},

				//注册窗口点击事件回调(外部调用)
				regVideoColorGet : function(func) {
					return JSVideoCtrl.externalInterface.videoCtrl.eventCtrl.regVideoColorGet(func);
				},

				//注册窗口点击事件回调(外部调用)
				regVideoColorSet : function(func) {
					return JSVideoCtrl.externalInterface.videoCtrl.eventCtrl.regVideoColorSet(func);
				}
			},

			/**
			 * @description UI控制模块
			 * @lends externalInterface.prototype
			 */
			uiCtrl : {
				/**
				 * 设置控件上部显示的内容(只在窗口模式下生效)
				 * @lends uiCtrl.prototype
				 * @param {String} context 需要显示的内容
				 * @return {Number} 成功返回true，失败返回false
				 */
				setTitleContext : function(context) {
					if( JSVideoCtrl._oVariableObj._oFuncInfo.bWindowMode ) {
						return JSVideoCtrl._ui._setTitleContext(context);
					}
				}
			}
		}
	}

	return JSVideoCtrl.externalInterface;
}
