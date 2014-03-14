2013.11.06
	1.修改版本号为0.1.16;
	2.新增regStreamConnectError接口;

2013.11.01
	1.修改版本号为0.1.15;
	2.新增区分插件模式功能,分为回放模式和正常浏览模式;
	3.修改了之前在回放模式下的页面布局,在底部加入了时间线插件;

2013.10.28
	1.修改版本号为0.1.14;
	2.新增 regURLStartEvent regURLStopEvent regURLAlarmEvent regStreamCaptureEvent等事件回调注册函数;
	3.新增 URLOpenStart URLOpenStop接口,设置手机看店报警的打开和关闭;

2013.10.22
	1.修改版本号为0.1.13;
	2.增加了 查询图片 正在下载图片  下载图片完成  设置选中窗口 界面视频参数获取 界面视频参数设置等宏定义;
	3.增加_iCurrentScreenTotal字段,用来保存当前的窗口数量;
	4.增加_fPollingCallback巡检按钮消息回调;
	5.增加巡检按钮;
	6.增加tellReleaseOCX接口;
	7.增加getPollObj,获取当前的巡检按钮对象;
	8.增加getScreenNum接口,获取当前的窗口数;
	9.增加regVideoColorGet和regVideoColorSet接口,注册获取视频ui参数事件回调;
	10.增加regPollingEvent接口,注册巡检事件;
	11.增加_getFilePath和GetPicSavePath接口,获取图片截图路径;
	12.增加SetPicSavePath接口,设置截图保存路径;

2013.10.15
	1.修改版本号为0.1.12;
	2.增加开始巡航和停止巡航控制宏;
	3.修改了视频本地回放插件的显示样式;
	4.新增callCruise对外接口;

2013.08.29
	1.修改版本号为0.1.9;
	2.新增外部接口delPTZPP();

2013.08.26
	1.修改版本号为0.1.8;
	2.新增外部接口setVideoParam(),批量设置视频参数;

2013.08.22
	1.修改版本号为0.1.7;
	2.修改在初始化插件是,如果传入参数为""的话, 控件报错的问题;

2013.08.19
	1.修改版本号为0.1.6;
	2.修改ie浏览器的事件注册接口OnComponentEvent为SetComponentEventCB, 兼容ie9及其以下浏览器的事件响应;

2013.08.15 
	1.修改版本号为0.1.5;
	2.修改playUrl stopUrl两个接口,增加protocal和streamtype两个字段;

2013.08.13
	1.修改插件版本为0.1.4;
	2.修改外部事件回调注册接口"regRMSClientDevTouch"为"regDevAdd";
	3.修改外部事件回调注册接口"regVideoColor"为"regVideoColorGet"和"regVideoColorSet";
	4.新增外部事件回调注册接口 regDevDel regDevDelAll regDevRefresh regDevRefreshAll regPtzEvent regFileSearch regFilePlayByTime regFilePlayByName regFileGetByTime regFileGetByName regFileCtrlStart regFileCtrlStop regAddChannel regUrlOpenStream regUrlCloseStream regServeRunning regServeHalt;
	5.新增外部事件回调注册接口 regInitFinished, 注册该回调之后, 必须在回调函数中调用 tellGetInitEvent() 方法, 所有在页面初始化时对控件接口的操作建议都在该回调函数内执行 避免在ie系列浏览器下出现浏览器崩溃的BUG;

2013.08.09
	1.修改插件版本为0.1.3;
	2.修改所有消息回调接口;

2013.07.24
	1.修改插件版本为0.1.2;
	2.新增oWindow和oControl对象,增加了对插件按钮显示状态的控制;

2013.07.24
	1.修改插件版本为0.1.1;
	2.修改了云台控制部分的接口;
	3.修改了视频参数设置部分的接口;

2013.07.22
	1.修改插件版本问0.1.0;
	2.在_ptzOpt()函数中, 增加了sID字段的合法性验证, 如果发现为空的话, 就随机生成一个时间;

2013.07.15
	1.修改插件版本为0.0.E;
	2.修改_ptzOpt函数,取消了控制台的输出消息,解决了在xp ie8环境下,调用云台控制会失败的的BUG;

2013.06.28
	1.修改插件版本为0.0.C;
	2.给_oFuncInfo常量赋初始值;
	
2013.07.02
	1.修改plugin.css文件,解决在ie7下高度差4px问题;
	
2013.07.05
	1.修改插件版本为0.0.E;
	2.修改视频插件内部的所有回调消息响应接口;
	3.修改回调消息的宏定义;