jsmx = {};
(function(){
	var isIE=(typeof document.all!='undefined'&&typeof window.opera=='undefined'&&navigator.vendor!='KDE');
	var docMode = document.documentMode || 0;

	this.get = function(id){return document.getElementById(id);};
	this.element = function(elm,ats){var o=document.createElement(elm);var a;var at;if(ats){for(var x in ats){if(x){at=x.toLowerCase();if(at=='innerhtml'){o.appendChild(this.text(ats[x]));}else{switch(at){case'classname':a=isIE && docMode < 8?'className':'class';break;case'for':a='htmlFor';break;default:a=x;break;}o.setAttribute(a,ats[x]);}}}}return o;};
	this.event = function(e){var ev = (typeof e == "undefined") ? window.event : e ;if (typeof ev.pageX == "undefined"){var scrll = getScrollingPosition(); ev.pageX = ev.clientX + scrll.X; ev.pageY = ev.clientY + scrll.Y;} return ev;};
	this.listen = function(elm,ev,fn,cap){var t=this.target(elm);if(typeof t.addEventListener!='undefined'){t.addEventListener(ev,fn,cap||false);}else if(typeof t.attachEvent!='undefined'){t.attachEvent('on'+ev,fn);}else{ev='on'+ev;if(typeof t[ev]=='function'){var oL=t[ev];t[ev]=function(){oL();return fn();};}else{t[ev]=fn;}}return true;};
	this.ignore = function(elm,ev,fn,cap){var t=this.target(elm);if(typeof t.removeEventListener!='undefined'){t.removeEventListener(ev,fn,cap||false);}else if(typeof t.detachEvent!='undefined'){t.detachEvent('on'+ev,fn);}else{t['on'+ev]=null;}return true;};
	this.text = function(txt){return document.createTextNode(txt);};
	this.target = function(e,tp,d){if(typeof e == 'undefined'){return null;}var t;var depth=d||1;var i=0;if(e.nodeType==1||e==document){t=e;}else if(typeof e=='string'){t=document.getElementById(e);}else{var event=(typeof e=='undefined')?window.event:e;t=(typeof event.target!='undefined')?event.target:event.srcElement;while(t.nodeType==3&&t.parentNode!==null){t=t.parentNode;}}if(t==null) return null;var tN=(tp||t.nodeName).toUpperCase();var cont=(t==document)?false:true;while(cont){if(t.nodeName!=tN){t=t.parentNode;}if(t.nodeName==tN){i++;}if(i==depth){break;}else{t=t.parentNode;}if(t.nodeName=='#document'){t=null;break;}}return t;};

	return this;
}).apply(jsmx);