/** ------------------------------------------------------------------------------
* TStyle
* @version 1.0
* @explain 封装了一些底层功能的js API以及一些js内置类的扩展，包涵HTMLElement的扩展形式，IE8以上浏览器可用，调用更方便
* @author  alwaysonlinetxm
* @email   alwaysolinetxm@gmail.com
* --------------------------------------------------------------------------------
*/

/** 
* @explain 选择器函数及功能函数宿主
* @param   选择器字符串，第二个可选参数可以指定父级
* @return  参数所对应的元素/元素列表
*/
function $(selector, ele){
    if (ele != undefined) {
        //修复选择器可以包括父级的bug
        var old = ele.id, id = ele.id = "__sizzle__";
        try {
            var query = '#' + id + ' ' + selector;
            var ret = ele.querySelectorAll(query);
        } catch(e) {
            console.log('Error! selector: ' + selector + ', element: ' + ele);
        } finally {
            old ? ele.id = old : ele.removeAttribute("id");
        }
    } else {
    	try {
    		var ret = document.querySelectorAll(selector);
    	} catch(e) {
            console.log('Error! selector: ' + selector + ', element: ' + ele);
        }    
    }

    if (ret && ret.length == 0) { //没有对应的元素 则返回一个空的script元素 用于容错
        var null_obj = document.createElement('script');
        null_obj._type = 'null_obj';
        return null_obj;
    } else if (ret.length == 1) { //只有一个元素
         return ret[0];
    } else { //多个元素则返回列表
        return ret;
    }               
};

/***************************************************** HTMLElement prototype *****************************************************/ 

/**
* @explain 事件注册/移除
* @param   待注册的事件类型字符串，绑定的函数
* @return  无
* PS：该函数可为单个元素的同个事件注册绑定多个函数，同时不支持addEventListener和attachEvent除外
*/
// 注册
HTMLElement.prototype.on = function(type, func){
	if (this._type != 'null_obj') {
        if (this.addEventListener) {
            this.addEventListener(type, func, false);
        } else if (this.attachEvent) {
            this.attachEvent('on' + type, func);
        } else {
            this['on' + type] = func;
        }
    }
    return this;
};

//移除
HTMLElement.prototype.unon = function(type, func){
    if (this._type != 'null_obj') {
        if (this.removeEventListener){
            this.removeEventListener(type, func, false);
        } else if (this.detachEvent) {
            this.detachEvent("on" + type, func);
        } else {
           this["on" + type] = null;
        }
    }
    return this;
};

/**
* @explain 添加/删除/检测/转换class
* @param   待添加/删除/检测/转换的类名
* @return  无
*/
//添加
HTMLElement.prototype.addClass = function(className){
    if (this._type != 'null_obj') {
        if (!new RegExp('(^|\\s+)'+className).test(this.className)){
            this.className += " " + className;
        }
    }
    return this;
};

//移除
HTMLElement.prototype.removeClass = function(className){
    if (this._type != 'null_obj') {
        this.className = this.className.replace(new RegExp('(^|\\s+)'+className), "");
    }
    return this;
};

//检测
HTMLElement.prototype.hasClass = function(className){
    if (this._type != 'null_obj') {
        var regExp = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
        return regExp.test(this.className);
    } 
    return this;
};

//转换类
HTMLElement.prototype.toggleClass = function(className){
	if (this.hasClass(className)){
        this.removeClass(className);
    } else {
        this.addClass(className);
    }
};

/**
* @explain 获取/设置text/html/value内容
* @param   可选，待设置的内容
* @return  元素的text/html/value内容
*/
//text 
HTMLElement.prototype.text = function(content){
    if (this._type != 'null_obj') {
        if (content == undefined){
            return this.textContent;
        } else {
            this.textContent = content;
        }
    }
    return this;
};

//html
HTMLElement.prototype.html = function(content){
    if (this._type != 'null_obj') {
        if (content == undefined) {
            return this.innerHTML;
        } else {
            this.innerHTML = content;
        }
    }
    return this;
};

//value
HTMLElement.prototype.val = function(value){
    if (this._type != 'null_obj') {
        if (value == undefined){
            return this.value;
        } else {
            this.value = value;
        }
    }
    return this;
};

/**
* @explain 获取/设置/删除元素属性
* @param   属性名，第二个参数可选，待设置的值
* @return  无
*/
//设置/获取
HTMLElement.prototype.attr = function(attribute, value){
    if (this._type != 'null_obj') {
        if (value == undefined){
            return this.getAttribute(attribute);
        } else {
            this.setAttribute(attribute, value);
        }
    }
    return this;
};

//删除
HTMLElement.prototype.removeAttr = function(attribute){
    if (this._type != 'null_obj') {
        this.removeAttribute(attribute);
    }
    return this;
};

/**
* @explain 获取指定元素的当前CSSStyleDeclaration对象，适用于内联样式，内部样式，外部样式
* @param   待获取样式的元素，第二个可选的伪元素信息
* @return  元素的CSSStyleDeclaration对象
*/
HTMLElement.prototype.getStyle = function(fake){
    if (this._type != 'null_obj') {
        fake = fake ? fake : null;
        return window.getComputedStyle ? window.getComputedStyle(this, fake) : this.currentStyle;
    }
    return this;
};

/**
* @explain 获取/设置元素的css属性
* @param   待获取/设置的css属性，第二个可选，待设置的值
* @return  元素指定属性的值
*/
HTMLElement.prototype.css = function(attr, value){
    if (this._type != 'null_obj') {
        if (value == undefined){
            return this.getStyle()[attr];          
        } else {
            this.style[attr] = value;
        }
    }
    return this;
};

/**
* @explain 克隆节点
* @param   可选，指定是否要克隆所有子节点内容
* @return  克隆的节点
*/
HTMLElement.prototype.clone = function(deep){
    if (this._type != 'null_obj') {
        deep = deep == undefined ? true : deep;
        return this.cloneNode(deep);
    }
    return this;
};

/**
* @explain 获取带有指定class或id的最近的父元素
* @param   class或id
* @return  获取到的父节点
*/
HTMLElement.prototype.closest = function(name){
    if (this._type != 'null_obj') {
        var type = name.slice(0, 1);
        name = name.slice(1)
        var parent = this.parentNode;

        if (type == '.') {
            while (!parent.hasClass(name) && parent.tagName.toLowerCase() != 'body') {
                parent = parent.parentNode;
            }
        } else if (type == '#') {
            while (!(parent.id == name) && parent.tagName.toLowerCase() != 'body') {
                parent = parent.parentNode;
            }           
        }
        return parent;
    }
    return this;
};

/**
* @explain 获取指定的子节点
* @param   选择器
* @return  获取到的子节点
*/
HTMLElement.prototype.find = function(name){
    if (this._type != 'null_obj') {
        return $(name, this);
    }
    return this;
};

/**
* @explain 获取指定节点的前/后兄弟节点，跳过文本
* @param   无
* @return  前/后兄弟节点
*/
//获取前兄弟节点
HTMLElement.prototype.previous = function(){
	if (this._type != 'null_obj') {
        var pre = this.previousSibling;
		while (pre.nodeName == "#text"){
			pre = pre.previousSibling;
		}
		return pre;
    }
    return this;
};

//获取后兄弟节点
HTMLElement.prototype.next = function(){
	if (this._type != 'null_obj') {
        var next = this.nextSibling;
		while (next.nodeName == "#text"){
			next = next.nextSibling;
		}
		return next;
    }
    return this;
};

/**
* @explain 获取元素距文档的left/top
* @param   无
* @return  left/top number类型
*/
// left
HTMLElement.prototype.getOffsetLeft = function(){
    if (this._type != 'null_obj') {
        var ele = this;
        var x = ele.offsetLeft;
        while (ele.offsetParent) {
            ele = ele.offsetParent;
            x += ele.offsetLeft;
        }
        return x;
    } 
    return this;
};

// top
HTMLElement.prototype.getOffsetTop = function(){
    if (this._type != 'null_obj') {
        var ele = this;
        var y = ele.offsetTop;
        while (ele.offsetTop) {
            ele = ele.offsetParent;
            y += ele.offsetTop;
        }
        return y;
    } 
    return this;
};

/***************************************************** Date prototype *****************************************************/ 

/**
* @explain 将日期转化为指定格式
* @param   格式参数字符串 y M d h m s q S
* @return  规格化后的日期字符串
*/
Date.prototype.format = function(fmt) { 
    var o = {   
        "M+" : this.getMonth()+1,                 
        "d+" : this.getDate(),                    
        "h+" : this.getHours(),                   
        "m+" : this.getMinutes(),                 
        "s+" : this.getSeconds(),                 
        "q+" : Math.floor((this.getMonth()+3)/3), 
        "S"  : this.getMilliseconds()            
    };   
    if (/(y+)/.test(fmt))   
        fmt = fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
    for (var k in o)   
        if (new RegExp("("+ k +")").test(fmt))   
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
    return fmt;   
};

/**
* @explain 拷贝当前Date对象
* @param   无
* @return  当前Date对象的拷贝
*/
Date.prototype.copy = function() {
	return new Date(this.getTime());
}

/***************************************************** String prototype *****************************************************/ 

/**
* @explain 去除字符串的前导，后导空格
* @param   无
* @return  去除空格后的字符串
*/
//除去前后空格
String.prototype.trim = String.prototype.trim || function(){ 
    return this.replace(/(^\s*)|(\s*$)/g, ""); 
} 

//除去前导空格
String.prototype.ltrim = function(){ 
    return this.replace(/(^\s*)/g, ""); 
}

//除去后导空格 
String.prototype.rtrim = function() { 
    return this.replace(/(\s*$)/g, ""); 
}

/***************************************************** RegExp prototype *****************************************************/ 

/**
* RegExp类扩展
* @explain 拷贝当前RegExp对象
* @param   无
* @return  当前RegExp对象的拷贝
*/
RegExp.prototype.copy = function() {
	var gim = ""; 
	if (this.global) {
		gim += "g";
	}
	if (this.ignoreCase) {
		gim += "i";
	}
	if (this.multiline) {
		gim += "m";
	}
	return new RegExp(this.source, gim);
}

/***************************************************** functions *****************************************************/ 

/**
* @explain 获取页面被滚动条卷去的高度/宽度
* @param   无
* @return  卷去的高度/宽度
* PS：http://hi.baidu.com/alimyself/item/69a7c5fca55495e41b111ff7
*/
//卷去的高度
$.getScrollTop = function(){
	return Math.max(
		(document.body?document.body.scrollTop:0),
		(document.documentElement?document.documentElement.scrollTop:0),
		(window.pageYOffset?window.pageYOffset:0)
	);   
}

//卷去的宽度
$.getScrollLeft = function(){
	return Math.max(
		(document.body ? document.body.scrollLeft : 0),
		(document.documentElement ? document.documentElement.scrollLeft : 0),
		(window.pageYOffset ? window.pageXOffset : 0)
	); 
}

/**
* @explain 获取鼠标事件发生时相对于事件触发元素的坐标
* @param   事件对象e，可选参数nonborder，可指定是否把border计算在内，传入true等真值是不计算border在内
* @return  坐标x/y
* PS：http://www.feelcss.com/firefox-support-offsetx-and-offsety.html
*/
//横坐标
$.getOffsetX = function(e, nonborder){
	if (e.offsetX){
		if (nonborder){
			if ($.browser() == "MSIE"){ //IE下offsetX本身就不包括border
				return e.offsetX;
			} else {
				return e.offsetX - $.getStyle(e.target).borderLeftWidth.slice(0, -2);
			}
		} else {
			if ($.browser() == "MSIE"){ 
				return e.offsetX + $.getStyle(e.target).borderLeftWidth.slice(0, -2)*1;
			} else {
				return e.offsetX;
			}
		}
	} else {
		var x1 = e.pageX ? e.pageX : $.getScrollLeft() + e.clientX;
		var ele = e.target;
		var x2 = ele.offsetLeft;
		while (ele.offsetParent){
			ele = ele.offsetParent;
			x2 += ele.offsetLeft;
		}
		return nonborder ? x1 - x2 - $.getStyle(e.target).borderLeftWidth.slice(0, -2) : x1 - x2;
	}
}

//纵坐标
$.getOffsetY = function(e, nonborder){
	if (e.offsetY){
		if (nonborder){
			if ($.browser() == "MSIE"){ //IE下offsetX本身就不包括border
				return e.offsetY;
			} else {
				return e.offsetY - $.getStyle(e.target).borderTopWidth.slice(0, -2);
			}
		} else {
			if ($.browser() == "MSIE"){ 
				return e.offsetY + $.getStyle(e.target).borderTopWidth.slice(0, -2)*1;
			} else {
				return e.offsetY;
			}
		}
	} else {
		var y1 = e.pageY ? e.pageY : $.getScrollTop() + e.clientY;
		var ele = e.target;
		var y2 = ele.offsetTop;
		while (ele.offsetParent){
			ele = ele.offsetParent;
			y2 += ele.offsetTop;
		}
		return nonborder ? y1 - y2 - $.getStyle(e.target).borderTopWidth.slice(0, -2) : y1 - y2;
	}
}

/**
* @explain 获取变量类型
* @param   待获取类型的对象
* @return  对象的类型，以字符串形式
*/
$.getType = function(obj){
	var t = typeof obj;
    return (t == "object" ? obj == null && "null" || Object.prototype.toString.call(obj).slice(8,-1) : t).toLowerCase();
}

/**
* @explain 深拷贝一个对象，效率较高，但不适用对象的function属性，Date属性，RegExp属性
* @param   待拷贝的对象
* @return  拷贝后的新对象
*/
$.deepCopy = function(obj){
    return JSON.parse(JSON.stringify(obj));
}

/**
* @explain 递归地深拷贝一个对象，效率较低，但适用对象的function属性，Date属性，RegExp属性
* @param   待拷贝的对象，第二个参数可选，目标对象，不指定时会创建一个空对象
* @return  拷贝后的新对象
*/
$.extend = function(source, destination) {
    if (destination == undefined){
        destination = getType(source) == 'array' ? [] : {};
    }
    for(var key in source) {
        var type = getType(source[key]);
        switch (type) {
            case 'array': 
                if (!destination[key]) 
                    destination[key] = [];
                arguments.callee(source[key], destination[key]);
                break;
            case 'object': 
                if (!destination[key]) 
                    destination[key] = {};
                arguments.callee(source[key], destination[key]);
                break;
            case 'date': 
            case 'regexp': 
                destination[key] = source[key].copy();
                break;
            default: 
                destination[key] = source[key];
        }
    }
    return destination;
}


/**
* @explain 遍历一个列表，为每个成员调用指定函数
* @param   待遍历的列表，以及待调用的函数
* @return  无
*/
$.each = function(nodes, func) {
    if (nodes.length) {
        for (var i = 0; i < nodes.length; i++) {
            func(nodes[i], i, nodes);
        }
    }
    else {
        func(nodes, 0, nodes);
    } 
}

/**
* @explain 继承指定的对象
* @param   待继承的对象
* @return  继承后的对象
*/
$.inherit = function(pro){
    if (pro == null) throw TypeError();
	//存在Object.create则直接调用，参数为要创建对象的原型
	if (Object.create) return Object.create(pro); 
	
	var type = typeof pro;
	if (type !== 'object' && type != 'function') throw TypeError();
	//定义构造函数，以此来创建新对象，以{}创建的对象具有Object.prototype原型
	function func(){};
	func.prototype = pro;
	return new func();
}

/**
* @explain 获取浏览器类型
* @param   无
* @return  浏览器类型字符串
*/
$.browser = function(){
    if (navigator.userAgent.indexOf("MSIE") >= 0){
        return "MSIE"; 
    }
    if (navigator.userAgent.indexOf("Firefox") >= 0){
        return "Firefox"; 
    }
    if (navigator.userAgent.indexOf("Opera") >= 0){
        return "Opera"; 
    }
	if (navigator.userAgent.indexOf("Chrome") >= 0){
        return "Chrome"; 
    }
    if (navigator.userAgent.indexOf("Safari") >= 0) { 
        return "Safari"; 
    } 
    if (navigator.userAgent.indexOf("Camino") >= 0){ 
        return "Camino"; 
    } 
    if (navigator.userAgent.indexOf("Gecko") >=0 ){ 
        return "Gecko"; 
    } 
}

/**
* @explain 检测是否支持canvas元素
* @param   无
* @return  支持则返回ture，否则返回false
*/
$.isCanvasEnable = function(){
    return !!document.createElement('canvas').getContext;
}

/**
* @explain 随机获取颜色
* @param   无
* @return  颜色十六进制表示值
*/
$.getRandomColor = function(){
	return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
}

/**
* @explain 对指定对象的指定属性进行属性配置，配置值、可枚举性、可写性、可配置性
* @param   待配置得对象，要配置的属性数组(可选)，属性配置对象
* @return  配置完的对象
* PS：当不指定任何属性时，默认对所有属性进行配置
*/
$.config = function(obj){
    if (typeof obj == "object"){
		if (arguments.length == 2){
			var names = Object.getOwnPropertyNames(obj);
			var configs = arguments[1];
		} else if (arguments.length == 3 && Array.isArray(arguments[1])){
		    var names = arguments[1];
			var configs = arguments[2];
		}		
		names.forEach(function(n){   //检测是否有此自有属性，有则进行设置
		    if (obj.hasOwnProperty(n)) Object.defineProperty(obj, n, configs);
		});
	}
	return obj;
}

/***************************************************** ajax *****************************************************/ 
/**
* @explain 发起ajax请求
* @param   配置参数
* @return  无
*/
$.ajax = function(opt) {
	(new AjaxRequest()).send(opt);
}

// AjaxRequest object constructor
function AjaxRequest() {
    // Try the XMLHttpRequest object first
    if (window.XMLHttpRequest) {
        try {
            this.request = new XMLHttpRequest();
        } catch(e) {
            this.request = null;
        }
    // Now try the ActiveX (IE) version
    } else if (window.ActiveXObject) {
        try {
            this.request = new ActiveXObject("Msxml2.XMLHTTP");
        // Try the older ActiveX object for older versions of IE
        } catch(e) {
            try {
                this.request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch(e) {
                this.request = null;
            }
        }
    }
    // If the request creation failed, notify the user
    if (this.request == null){
        console.log("Ajax error creating the request.\n" + "Details: " + e);
    }

    this.timeout;
    this.global = false;
}

AjaxRequest.sendBefore = function() {
};

AjaxRequest.sendSuccess= function() {
};

AjaxRequest.sendError = function() {
};

// Send an Ajax request to the server  type, url, asyn, handler, dataType, timeout, postDataType, postData, beforeSend, success, error
AjaxRequest.prototype.send = function(opt) {
    var self = this;

    if (self.request != null) {
        // Kill the previous request
        self.request.abort();
        //set timeout
        if (opt.timeout) {
            self.timeout = setTimeout(function() {
                self.request.abort();
                opt.error(self.request, 'timeout');
                clearTimeout(self.timeout);
            }, opt.timeout);
        }
        //set asyn
        opt.asyn = opt.asyn == undefined ? true : opt.asyn;
        //set dataType
        opt.dataType = opt.dataType ? opt.dataType : 'text';
        //set global
        self.global = opt.global ? opt.global : false;
        //run sendBefore
        if (self.global && typeof AjaxRequest.sendBefore == 'function'){
            AjaxRequest.sendBefore({type: 'ajaxSend'}, self.request, opt);
        }
        //run beforeSend
        if (opt.beforeSend){
            opt.beforeSend();
        }
        try {
            self.request.onreadystatechange = function() {
                if (self.getReadyState() == 4) {
                    var _status = self.getStatus();
                    clearTimeout(self.timeout);
                    if ((_status >= 200 && _status < 300) || _status == 304) { 
                        switch (opt.dataType) {
                            case 'text': opt.success(self.getResponseText(), _status);
                                break;
                            case 'xml': opt.success(self.getResponseXML(), _status);
                                break;
                            case 'json': opt.success(JSON.parse(self.getResponseText()), _status);
                                break;
                        }
                        if (self.global && typeof AjaxRequest.sendSuccess == 'function'){
                            AjaxRequest.sendSuccess({type: 'ajaxSuccess'}, self.request, opt);
                        }
                    } else {
                        switch (opt.dataType) {
                            case 'text': opt.error(self.request, _status, self.getResponseText());
                                break;
                            case 'xml': opt.error(self.request, _status, self.getResponseXML());
                                break;
                            case 'json': opt.error(self.request, _status, self.getResponseText());
                                break;
                        }
                        if (self.global && typeof AjaxRequest.sendError == 'function') {
                            AjaxRequest.sendError({type: 'ajaxError'}, self.request, opt);
                        }
                    }
                }
            }
            self.request.open(opt.type, opt.url, opt.asyn); // always asynchronous (true)
            if (opt.type.toLowerCase() == "get") {
                // Send a GET request; no data involved
                self.request.send(null);
            } else {
                // Send a POST request; the last argument is data
                opt.postDataType = opt.postDataType ? opt.postDataType : 'application/x-www-form-urlencoded';
                self.request.setRequestHeader("Content-Type", opt.postDataType);
                self.request.send(opt.postData);
            }
        } catch(e) {
            opt.error(self.request, self.getStatus(), e);
            if (self.global && typeof AjaxRequest.sendError == 'function'){
                AjaxRequest.sendError({type: 'ajaxError'}, self.request, opt);
            }
            console.log("Ajax error communicating with the server.\n" + "Details: " + e);
        }
    }
}

AjaxRequest.prototype.getReadyState = function(){
    return this.request.readyState;
}

AjaxRequest.prototype.getStatus = function() {
    return this.request.status;
}

AjaxRequest.prototype.getResponseText = function() {
    return this.request.responseText;
}

AjaxRequest.prototype.getResponseXML = function() {
    return this.request.responseXML;
};


