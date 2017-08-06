(function(){
	function Plugin(){
		var _this = this;

		var _bridgeInit = false;

		_this.response = {};

		_this.cache = {};

		_this.entryPlat = '';

		var utils = {
			getMobileDevice : function(){
				var mbldevice = navigator.userAgent.toLowerCase();
				if (/iphone|ipod|ipad/gi.test( mbldevice ))
				{
					return "iOS";
				}
				else if (/android/gi.test( mbldevice ))
				{
					return "Android";
				}
				else
				{
					return "Unknow Device";
				}
			},

			connectWebViewJavascriptBridge : function( cb ) {								/*桥连*/
				if (window.WebViewJavascriptBridge) {
					cb(WebViewJavascriptBridge);
				}else{
					document.addEventListener('WebViewJavascriptBridgeReady', function() {
						cb(WebViewJavascriptBridge);
					}, false);
				}
				setTimeout(function(){
                	if (!window.WebViewJavascriptBridge) {
                		alert('客户端版本过低,请升级客户端');
                        // alert(window.WebViewJavascriptBridge)
                	}

                },3000);
			},

			callApiCenter : function( api, param , callback ){
				var mbldevice = utils.getMobileDevice();
					utils.connectWebViewJavascriptBridge(function( bridge ){
						if (!_bridgeInit) {
	                          bridge.init(function(message, responseCallback) {});
	                          _bridgeInit = true;
	                      }
						bridge.callHandler( api, param, function(response) {
							response = typeof response == 'string' ? JSON.parse( response ) : response;
							$.isFunction( callback ) && callback( response );
						});
						if( api == 'getLocation'){
							bridge.registerHandler('getLocation', function( response, responseCallback) {
								response = typeof response == 'string' ? JSON.parse( response ) : response;
								_this.response[ api ] = response;
								$.isFunction( callback ) && callback( response );
								responseCallback('success');
							});
						}

					});

			}
		}

		_this.callApiCenter = function( api, param , callback ){
			return utils.callApiCenter( api, param , callback );
		}
	}

 $.extend( Plugin.prototype , {
		constructor : Plugin,

		getClient : function( api, json ){
			this.entryPlat = this.entryPlat || 'app';
			this.response[ api ] = json;
			this.cache[ api ]( json );
		},


		getUserInfo : function( callback ){														/*获取用户信息*/
			return this.callApiCenter( 'getUserInfo', null , callback );
		},
		getSystemInfo : function( callback ){													/*获取设备信息*/
			return this.callApiCenter( 'getSystemInfo', null , callback );
		},
		getLocation : function( callback ){														/*获取定位信息*/
			return this.callApiCenter( 'getLocation', null , callback );
		},
		goLogin : function(){																	/*去登录*/
			return this.callApiCenter( 'goLogin' , null , null );
		},
		shareTo : function( param ){															/*分享*/
			return this.callApiCenter( 'shareTo' , param , null );
		},
		quickCreate : function( param ){															/*快速创建客户端*/
			return this.callApiCenter( 'quickCreate' , param , null );
		},
		linkTo : function( param ){																/*跳内链*/
			return this.callApiCenter( 'linkTo' , param , null );
		},
		goBack : function(){																/*后退*/
			return this.callApiCenter( 'goBack' , null , null );
		},
		goRoot : function(){
			return this.callApiCenter( 'goRoot' , null , null );											/*去根目录*/
		},
		goUcenter : function(){
			return this.callApiCenter( 'goUcenter' , null , null );											/*去用户中心*/
		}
	} );

	window.SmartCity = new Plugin();

	window.getUserInfo = function( json ){
		Plugin.prototype.getClient.call( SmartCity, 'getUserInfo', json );
	};

	window.getSystemInfo = function( json ){
		Plugin.prototype.getClient.call( SmartCity, 'getSystemInfo', json );
	};

	window.getLocation = function( json ){
		Plugin.prototype.getClient.call( SmartCity, 'getLocation', json );
	};
})();



/*
			demo:
			页面引入当前js

			在自己js方法里面调用

			如：

			SmartCity.getUserInfo(function( res ){												//获取用户信息:
					//	res为用户信息
					if( res && res.userinfo.userTokenKey ){
							//  即用户已登录
					}else{
							//  即用户未登录  跳登录页登录
 							SmartCity.goLogin();
					}
			});

			SmartCity.getSystemInfo(function( res ){
					//	res为设备信息  如：device_token等
			});

			SmartCity.getLocation(function( res ){
					//	res为定位信息    确保定位开启
			});

			SmartCity.goLogin();    																	//去登录

			SmartCity.goUcenter();    																//去用户中心

			SmartCity.linkTo({innerLink:'news#123'})                  //  innerLink :   模块标识＃内容id  例：文稿 123

			SmartCity.goBack();     //返回上一步

			SmartCity.shareTo({																				//分享
				title: 标题,
				brief: 描述,
				contentURL: 内容链接,
				imageLink: 图片链接
			});
            SmartCity.quickCreate({																				//创建客户端
				mTitle: 标题,
				mLink: 内容链接,
				mLogo: 图片链接
			});
*/ 
