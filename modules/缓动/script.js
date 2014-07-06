var getCoords = function(el){
                var box = el.getBoundingClientRect(),//获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置
                doc = el.ownerDocument,//返回节点所属的根元素
                body = doc.body,
                html = doc.documentElement,
                clientTop = html.clientTop || body.clientTop || 0,
                clientLeft = html.clientLeft || body.clientLeft || 0,
                top  = box.top  + (self.pageYOffset || html.scrollTop  ||  body.scrollTop ) - clientTop,
                left = box.left + (self.pageXOffset || html.scrollLeft ||  body.scrollLeft) - clientLeft
                return { 'top': top, 'left': left };
            };

            var getStyle = function(el, style){
                if(!+"\v1"){
                    style = style.replace(/\-(\w)/g, function(all, letter){
                        return letter.toUpperCase();
                    });
                    var value = el.currentStyle[style];
                    (value == "auto")&&(value = "0px" );
                    return value;
                }else{
                    return document.defaultView.getComputedStyle(el, null).getPropertyValue(style)
                }
            }

            var _ = function(id){
                return document.getElementById(id);
            }           

            if (typeof Array.prototype['max'] == 'undefined') {
                Array.prototype.map = function(fn, thisObj) {
                    var scope = thisObj || window;
                    var a = [];
                    for ( var i=0, j=this.length; i < j; ++i ) {
                        a.push(fn.call(scope, this[i], i, this));
                    }
                    return a;
                };
                Array.prototype.max = function(){
                    return Math.max.apply({},this)
                }
                Array.prototype.min = function(){
                    return Math.min.apply({},this)
                }
            }

            var range = function(start,end){
                var _range = []
                for(var i = start,l=end-start;i<l;i++){
                    _range.push(i)
                }
                return _range
            }

            var draw = function(ease){
                var demo = _("transition");
                demo.innerHTML = "";//还原！
                //***********绘制控制台********************
                var values = range(0,200).map(function(v){
                    return  TTween[ease](v/200) * 200;
                }),
                max = Math.max(200, values.max()),
                min = Math.min(0, values.min());
                if (min==max) {
                    min = 0;
                    max = 200;
                }
                var factor = 200/(max-min),
                grid = '<span style="bottom:'+Math.round((0-min)*factor)+'px">0</span>'+
                    '<span style="bottom:'+Math.round((200-min)*factor)+'px">1</span>',
                graph = range(0,200).map(function(v){
                    return '<div style="left:'+v+'px;bottom:'+Math.round((values[v]-min)*factor)+'px;height:1px"></div>';
                }).join('') + '<div id="indicator" style="display:none">'
                    +'</div><div id="marker" style="display:none"></div><div id="label"></div>';
                demo.innerHTML = grid + graph;
                var indicator = _("indicator"),
                marker = _("marker"),
                label = _("label"),
                demoTransition = function(pos){
                    var value = TTween[ease](pos);
                    indicator.style.display = "block";
                    marker.style.display = "block";
                    marker.style.left = Math.round(pos*200)+'px';
                    marker.style.bottom = Math.round((value*200-min)*factor)+'px';
                    label.innerHTML = Math.round(pos*200)+'px';
                    return value;
                }
                TTween.transition($i("indicator"),{field:"left",begin:parseFloat(getCoords(demo).left),change:200,
                    ease:demoTransition})
            }

            window.onload = function(){
                var panelHTML = function(){
                    var builder = [];
                    var _temp = 'Back Circ Cubic Expo Quad Quart Quint Sine'.split(' ');
                    var ease = _temp.map(function(v){
                        return 'easeIn'+v;
                    });
                    ease = ease.concat(_temp.map(function(v){
                        return 'easeOut'+v;
                    }));
                    ease = ease.concat(_temp.map(function(v){
                        return 'easeInOut'+v;
                    }));
                    ease = ease.concat('blink bounce bouncePast easeFrom easeFromTo easeOutBounce easeTo elastic'.split(' '));
                    ease = ease.concat('flicker full linear mirror none pulse reverse sinusoidal spring swingTo swingFrom swingFromTo wobble'.split(' '))
                    for(var i =0,l=ease.length;i<l;i++){
                        builder.push("<div onclick='draw(this.innerHTML)'>");
                        builder.push(ease[i]);
                        builder.push("</div>");
                    }
                    return builder.join('');//将数组连接成字符串
                }
                var panel = document.createElement("div");
                panel.id = "panel"
                panel.innerHTML = panelHTML();
                _("transition").parentNode.insertBefore(panel,_("transition").nextSibling);

            }