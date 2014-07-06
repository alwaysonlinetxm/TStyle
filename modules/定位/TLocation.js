/**
* TLocation
* @version 1.0
* @explain 用于获取地理位置信息，和现实google地图
* @author  alwaysonlinetxm
* @email   txm19921005@126.com
* 外部API：
* TLocation();               构造函数
* getMap(mapele, opt);       显示地图
* watchMap(mapele, opt);     实时监视地图
* getInfo(opt, func);        获取地理位置信息
* watchInfo(opt, func);      实时监视地理位置信息
* removeWatch(watch);        移除监视器
*/

function TLocation(){
    var self = this;
	self.info = {};          //位置信息缓存
	self.mapWatch = null;    //地图监视器
	self.infoWatch = null;   //信息监视器
};

TLocation.prototype = {
    getMap: function(mapele, opt){  //显示地图，参数为待显示的div元素, 以及属性列表
	    var self = this;
	    if (navigator.geolocation){
		    opt = opt == null ? {enableHighAccuracy:true,maximumAge:1000} : opt;
			//取得当前地理位置
			navigator.geolocation.getCurrentPosition(function(position){
			    self.initMap(mapele, position);
			}, self.errorInfo, opt);
		} else {
		    alert("抱歉，您的浏览器不支持HTML5定位技术..");
		}
	},
	watchMap: function(mapele, opt){  //监视地理位置，参数同上
	    var self = this;
	    if (navigator.geolocation){
		    opt = opt == null ? {enableHighAccuracy:true,maximumAge:1000} : opt;
			//取得当前地理位置
			self.mapWatch = navigator.geolocation.watchPosition(function(position){
			    self.initMap(mapele, position);
			}, self.errorInfo, opt);
		} else {
		    alert("抱歉，您的浏览器不支持HTML5定位技术..");
		}
	},
	initMap: function(mapele, position){
	    var coords = position.coords;
		if (mapele != null){
			//设定地图参数，将用户的当前位置的纬度、经度设定为地图的中心点。
			var latlng = new google.maps.LatLng(coords.latitude, coords.longitude);
			var myOptions = {
				zoom: 14,
				center: latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			//创建地图并在“map”div中显示
			var map1; 
			map1 = new google.maps.Map(mapele, myOptions);
			//在地图上创建标记
			var marker = new google.maps.Marker({position: latlng, map: map1});
			//设定标注窗口，并指定该窗口中的注释文字
			var infowindow = new google.maps.InfoWindow({content: "当前位置!"});
			//打开标注窗口
			infowindow.open(map1, marker);
		}
	},
	getInfo: function(opt, func){ //参数是属性列表，以及获取信息成功后的回调函数,函数的参数是成功获取到的self.info
	    var self = this;
	    if (navigator.geolocation){
		    opt = opt == null ? {enableHighAccuracy:true,maximumAge:1000} : opt;
			// 取得当前地理位置
			navigator.geolocation.getCurrentPosition(function(position){
			    self.initInfo(func, position);
			}, self.errorInfo, opt);
		} else {
		    alert("抱歉，您的浏览器不支持HTML5定位技术..");
		}
	},
	watchInfo: function(opt, func){ //参数是属性列表，以及获取信息成功后的回调函数
	    var self = this;
	    if (navigator.geolocation){
		    opt = opt == null ? {enableHighAccuracy:true,maximumAge:1000} : opt;
			// 取得当前地理位置
			self.infoWatch = navigator.geolocation.watchPosition(function(position){
			    self.initInfo(func, position);
			}, self.errorInfo, opt);
		} else {
		    alert("抱歉，您的浏览器不支持HTML5定位技术..");
		}
	},
	initInfo: function(func, position){
	    var self = this;
	    for(var key in position){
			if(typeof (position[key])!= "object" || position[key] == null){
				self.info[key] = position[key];
			} else {
				var sub = position[key];
				for (var skey in sub) self.info[skey] = sub[skey];
			}
		}
		if (func != null) func(self.info);
	},
	removeWatch: function(watch){  //移除监视器，参数是监视器
	    if (navigator.geolocation){
			navigator.geolocation.clearWatch(watch);
		} else {
		    alert("抱歉，您的浏览器不支持HTML5定位技术..");
		}	    
	},
	errorInfo: function(error){
	    var type = {1:'位置服务被拒绝', 2:"获取不到位置信息", 3:"获取信息超时"};
		alert(type[error.code]);
	}
};