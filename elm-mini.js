var Guid=function(){var d=0;return{guid:function(){return d+=1}}}(),Value=function(){var d=function(a){if("boolean"===typeof a)return a?"True":"False";if("number"!==typeof a&&a[0]){if("Tuple"===a[0].substring(0,5)){for(var e="",b=a.length;--b;)e=","+d(a[b])+e;","===e[0]&&(e=e.substring(1));return"("+e+")"}if("Cons"===a[0])for(var b="string"===typeof a[1]?'"':"]",c="string"===typeof a[1]?"":",",e=("string"===typeof a[1]?'"':"[")+d(a[1]),a=a[2];;)if("Cons"===a[0])e+=c+d(a[1]),a=a[2];else return e+b;
else{if("Nil"===a[0])return"[]";e="";for(b=a.length;--b;)e=" "+d(a[b])+e;e=a[0]+e;return 1<a.length?"("+e+")":e}}return a+""};return{show:function(a){return Text.monospace(String.properEscape(d(a)))},Tuple:function(){var a=arguments.length,e=Array(a+1);for(e[0]="Tuple"+arguments.length;a--;)e[a+1]=arguments[a];return e},append:function(a,e){if("string"===typeof a&&"string"===typeof e)return a.concat(e);if("Nil"===a[0])return e;for(var b=["Cons",a[1],["Nil"]],c=b,a=a[2];"Cons"===a[0];)c[2]=["Cons",
a[1],["Nil"]],a=a[2],c=c[2];c[2]=e;return b}}}(),String=function(){return{toText:function(d){for(var a=[];"Cons"===d[0];)a.push(d[1]),d=d[2];return String.properEscape(a.join(""))},properEscape:function(d){d.replace('"',"&#34;");d.replace("&","&#38;");d.replace("'","&#39;");d.replace("<","&#60;");d.replace(">","&#62;");return d}}}(),Color=function(){var d=function(a,e,b,c){return{r:Math.round(255*a),g:Math.round(255*e),b:Math.round(255*b),a:c}};return{black:d(0,0,0,1),white:d(1,1,1,1),red:d(1,0,0,
1),green:d(0,1,0,1),blue:d(0,0,1,1),rgba:function(a){return function(e){return function(b){return function(c){return d(a,e,b,c)}}}},rgb:function(a){return function(e){return function(b){return d(a,e,b,1)}}},Internal:{extract:function(a){return 1===a.a?"rgb("+a.r+","+a.g+","+a.b+")":"rgba("+a.r+","+a.g+","+a.b+","+a.a+")"}}}}(),Element=function(){var d=function(a){a=document.createElement(a);a.id=Guid.guid();return a},a=function(a){var b=d("div");b.appendChild(a);return b},e=function(a){return function(b){return function(e){var c=
d("div");c.isElmText=!0;c.innerHTML=e;c.style.textAlign=b;0<a&&(c.style.width=a+"px");c.isElmLeaf=!0;c.style.visibility="hidden";c.style.styleFloat="left";c.style.cssFloat="left";document.body.appendChild(c);e=window.getComputedStyle(c);0>=a&&(c.style.width=e.getPropertyValue("width"));c.style.height=e.getPropertyValue("height");document.body.removeChild(c);c.style.visibility="visible";c.style.styleFloat="none";c.style.cssFloat="none";return c}}},b=e(0)("left"),c=e(0)("justify"),h=e(0)("center"),
f=function(b){return"DIV"===b.tagName?b:a(b)},g=function(a){a.style.styleFloat="left";a.style.cssFloat="left";return a},j=function(a){a.style.position="absolute";return a},i=function(a,b,c){for(var e=d("div"),h=c.length;h--;){var j=b(c[h]);e.appendChild(j)}e.elmFlowDirection=a;return e},k=function(a){return function(b){for(var c=[];"Cons"===b[0];)c.push(b[1]),b=b[2];3<=a&&c.reverse();b=a%3;if(0==b)return i("Y",f,c);if(1==b)return i("X",g,c);if(2==b)return i("Z",j,c)}},l=function(a){return function(b){if("A"===
b.tagName)return l(a)(b.firstChild),b;if(b.hasOwnProperty("isElmText")){var c=e(a)(b.style.textAlign)(b.innerHTML);b.style.height=c.style.height}b.style.width=a+"px";return b}};return{text:b,image:function(a){var b=d("img");b.isElmLeaf=!0;b.onload=function(){""===b.style.width&&0<this.width&&(b.style.width=b.width=this.width+"px");""===b.style.height&&0<this.height&&(b.style.height=b.height=this.height+"px");Dispatcher.adjust()};b.src=String.toText(a);b.name=b.src;return b},video:function(b){var b=
String.toText(b),a=d("video");a.controls="controls";var c=d("source");c.src=b;c.type="video/"+b.substring(b.length-3,b.length);a.appendChild(c);a.isElmLeaf=!0;return a},audio:function(b){var b=String.toString(b),a=d("video");a.controls="controls";var c=d("source");c.src=b;c.type="audio/"+b.substring(b.length-3,b.length);a.appendChild(c);a.isElmLeaf=!0;return a},collage:function(b){return function(a){return function(c){var e=d("canvas");e.style.width=b+"px";e.style.height=a+"px";e.width=b;e.height=
a;if(e.getContext){var h=e.getContext("2d");for(h.clearRect(0,0,e.width,e.height);"Cons"===c[0];)h=c[1](h),c=c[2];return e}e.innerHTML="Your browser does not support the canvas element.";e.isElmLeaf=!0;return e}}},flow:k,layers:k(2),beside:function(b){return function(a){return k(1)(["Cons",b,["Cons",a,["Nil"]]])}},above:function(b){return function(a){return k(0)(["Cons",b,["Cons",a,["Nil"]]])}},below:function(b){return function(a){return k(3)(["Cons",b,["Cons",a,["Nil"]]])}},box:function(b){return function(a){a.style.position=
"absolute";a.style.margin="auto";var c=(b-1)%3,e=(b-1)/3;2>c&&(a.style.left=0);0<c&&(a.style.right=0);2>e&&(a.style.top=0);0<e&&(a.style.bottom=0);c=d("div");c.style.position="relative";c.appendChild(a);return c}},width:l,height:function(b){return function(a){("A"===a.tagName?a.firstChild:a).style.height=b+"px";return a}},size:function(a){return function(b){return function(c){var e="A"===c.tagName?c.firstChild:c;e.style.width=a+"px";e.style.height=b+"px";return c}}},color:function(a){return function(b){b.style.backgroundColor=
Color.Internal.extract(a);return b}},opacity:function(b){return function(a){a.style.opacity=b;return a}},link:function(b){return function(c){var e=d("a");e.href=Text.fromString(b);e.appendChild(c);return a(e)}},asText:function(b){return e(0)("left")(Value.show(b))},plainText:function(b){return e(0)("left")(String.toText(b))},justifiedText:c,centeredText:h,up:0,left:1,inward:2,down:3,right:4,outward:5}}(),Text=function(){var d=function(b){for(var a=[];"Cons"===b[0];)a.push(b[1]),b=b[2];return String.properEscape(a.join(""))},
a=function(b){return function(a){return"<"+b+">"+a+"</"+b+">"}},e=function(b,a){return function(c){return"<span style='"+b+":"+a+"'>"+c+"</span>"}},b=a("h1"),c=e("font-style","italic"),a=a("b"),h=e("text-decoration","underline"),f=e("text-decoration","overline"),g=e("text-decoration","line-through");return{fromString:d,toText:d,header:b,height:function(b){return e("font-size",b+"em")},italic:c,bold:a,underline:h,overline:f,strikeThrough:g,monospace:e("font-family","monospace"),color:function(b){return e("color",
Color.Internal.extract(b))},link:function(b){return function(a){return"<a href='"+d(b)+"'>"+a+"</a>"}}}}(),Shape=function(){var d=function(a,b,c,d){return{center:a,points:b,theta:c,scale:d}},a=function(a){return function(b){return function(c){return function(d){d.save();d.translate(c.center[0],c.center[1]);d.rotate(c.theta);d.scale(c.scale,c.scale);d.beginPath();var f=c.points;d.moveTo(f[0][0],f[0][1]);for(var g=f.length;g--;)d.lineTo(f[g][0],f[g][1]);d.closePath();a?(d.fillStyle=Color.Internal.extract(b),
d.fill()):(d.strokeStyle=Color.Internal.extract(b),d.stroke());d.restore();return d}}}};return{polygon:function(a){return function(b){for(var c=[];"Cons"===a[0];)c.push([a[1][1],a[1][2]]),a=a[2];b=[b[1],b[2]];return d(b,c,0,1)}},ngon:function(a){return function(b){return function(c){for(var h=[],f=a;f--;)h.push([b*Math.cos(2*Math.PI*f/a),b*Math.sin(2*Math.PI*f/a)]);c=[c[1],c[2]];return d(c,h,0,1)}}},rect:function(a){return function(b){return function(c){var h=[[-a/2,-b/2],[a/2,-b/2],[a/2,b/2],[-a/
2,b/2]],c=[c[1],c[2]];return d(c,h,0,1)}}},oval:function(a){return function(b){return function(c){for(var h=[],f=2*Math.PI;0<f;f-=Math.PI/50)h.push([a/2*Math.cos(f),b/2*Math.sin(f)]);c=[c[1],c[2]];return d(c,h,0,1)}}},move:function(a){return function(b){return function(c){return d([a+c.center[0],b+c.center[1]],c.points,c.theta,c.scale)}}},rotate:function(a){return function(b){return d(b.center,b.points,b.theta+2*Math.PI*a,b.scale)}},scale:function(a){return function(b){return d(b.center,b.points,
b.theta,b.scale*a)}},filled:a(!0),outlined:a(!1),customOutline:function(a){return function(b){return function(c){c.points.push(c.points[0]);return Line.customLine(a)(b)(c)}}}}}(),Line=function(){var d=function(a){return function(d){return function(b){if("string"===typeof a[0]){for(var c=[];"Cons"===a[0];)c.push(a[1]),a=a[2];a=c}0===a.length&&(a=[8,4]);return function(c){c.save();c.beginPath();c.translate(b.center[0],b.center[1]);c.rotate(b.theta);c.scale(b.scale,b.scale);var f=a,g=b.points,j=g.length-
1,i=g[j][0],k=g[j][1],l=0,m=0,n=0,o=0,p=0,r=0,t=f.length,s=!0,q=f[0];for(c.moveTo(i,k);j--;){l=g[j][0];m=g[j][1];n=l-i;o=m-k;for(p=Math.sqrt(n*n+o*o);q<=p;)i+=n*q/p,k+=o*q/p,c[s?"lineTo":"moveTo"](i,k),n=l-i,o=m-k,p=Math.sqrt(n*n+o*o),s=!s,r=(r+1)%t,q=f[r];0<p&&(c[s?"lineTo":"moveTo"](l,m),q-=p);i=l;k=m}c.strokeStyle=Color.Internal.extract(d);c.stroke();c.restore();return c}}}};return{line:function(a){for(var d=[];"Cons"===a[0];)d.push([a[1][1],a[1][2]]),a=a[2];return{center:[0,0],points:d,theta:0,
scale:1}},customLine:d,solid:function(a){return function(d){return function(b){b.save();b.beginPath();b.translate(d.center[0],d.center[1]);b.rotate(d.theta);b.scale(d.scale,d.scale);var c=d.points,h=c.length;for(b.moveTo(c[h-1][0],c[h-1][1]);h--;)b.lineTo(c[h][0],c[h][1]);b.strokeStyle=Color.Internal.extract(a);b.stroke();b.restore();return b}}},dashed:d([8,4]),dotted:d([3,3])}}(),Elm=function(){var d=function(a){this.id=Guid.guid();this.value=a;this.step=function(a,b){var d=a===this.id;d&&(this.value=
b);return d}},a=function(a,c){this.id=Guid.guid();this.value=null;c.reverse();this.recalc=function(){for(var d=a,e=c.length;e--;)d=d(c[e].value);this.value=d};this.recalc();this.step=function(a,b){if(this.hasOwnProperty(a))return!1;for(var d=!1,e=c.length;e--;)d=c[e].step(a,b)||d;d?this.recalc():this[a]=!0;return d}},e=function(a,c,d){this.id=Guid.guid();this.value=c;this.step=function(c,e){if(this.hasOwnProperty(c))return!1;var j=d.step(c,e);j?this.value=a(d.value)(this.value):this[c]=!0;return j}};
return{Input:function(a){return new d(a)},Lift:function(b,c){return new a(b,c)},Fold:function(a,c,d){return new e(a,c,d)}}}(),Dispatcher=function(){var d=null,a=function(b,c,d){d.style&&c.style&&(d.style.width=c.style.width,d.style.height=c.style.height);if(c.hasOwnProperty("isElmLeaf")&&d.hasOwnProperty("isElmLeaf"))c.id=d.id,c.isEqualNode(d)||b.replaceChild(c,d);else if("CANVAS"===c.nodeName)b.replaceChild(c,d);else{var e=c.childNodes,g=d.childNodes;if(e.length!==g.length)b.replaceChild(c,d);else for(b=
e.length;b--;)a(d,e[b],g[b])}},e=function(a){var c=a.childNodes,d=c.length;if(a.hasOwnProperty("isElmLeaf")){var c=""===a.style.width?0:a.style.width.slice(0,-2)-0,f=""===a.style.height?0:a.style.height.slice(0,-2)-0;return[c,f]}if(1===d){var g=e(c[0]);""!==a.style.width&&(g[0]=a.style.width.slice(0,-2)-0);""!==a.style.height&&(g[1]=a.style.height.slice(0,-2)-0);0!==g[0]&&(a.style.width=g[0]+"px");0!==g[1]&&(a.style.height=g[1]+"px");return g}for(var j=0,i=f=0,k=0,l=!0,m=!0;d--;)g=e(c[d]),j=Math.max(j,
g[0]),f=Math.max(f,g[1]),i+=g[0],k+=g[1],l=l&&0<g[0],m=m&&0<g[1];c=j;d=a.elmFlowDirection;"X"===d&&(c=l?i:0);"Y"===d&&(f=m?k:0);0<c&&(a.style.width=c+"px");0<f&&(a.style.height=f+"px");return[c,f]};return{initialize:function(){try{d=main()}catch(a){throw document.body.innerHTML="An Error Occured: Better Messages to come.",a;}d.hasOwnProperty("step")||(d=Elm.Input(d));var c=document.getElementById("content");c.appendChild(d.value);e(c);c=document.getElementById("widthChecker").offsetWidth;c!==window.innerWidth&&
Dispatcher.notify(Window.dimensions.id,Value.Tuple(c,window.innerHeight))},notify:function(b,c){if(d.step(b,c)){var h=document.getElementById("content");a(h,d.value,h.children[0]);e(h)}},adjust:function(){var a=document.getElementById("content");e(a)}}}(),Signal=function(){function d(a){for(var b=["Nil"],c=a.length;c--;)b=["Cons",a[c],b];return b}var a=function(){return document.addEventListener?function(a,b,c){a.addEventListener(b,c,!1)}:function(a,b,c){a.attachEvent("on"+b,c)}}(),e=function(){function b(a){var c=
0,d=0;a||(a=window.event);if(a.pageX||a.pageY)c=a.pageX,d=a.pageY;else if(a.clientX||a.clientY)c=a.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,d=a.clientY+document.body.scrollTop+document.documentElement.scrollTop;return Value.Tuple(c,d)}var c=Elm.Input(Value.Tuple(0,0)),d=Elm.Input(!1),e=Elm.Input(!1);a(document,"click",function(){Dispatcher.notify(e.id,!0);Dispatcher.notify(e.id,!1)});a(document,"mousedown",function(){Dispatcher.notify(d.id,!0)});a(document,"mouseup",function(){Dispatcher.notify(d.id,
!1)});a(document,"mousemove",function(a){Dispatcher.notify(c.id,b(a))});return{position:c,x:Elm.Lift(function(a){return a[1]},[c]),y:Elm.Lift(function(a){return a[2]},[c]),isClicked:e,isDown:d,clickedOn:function(b){var c=Elm.Input(!1);a(b,"click",function(){Dispatcher.notify(c.id,!0);Dispatcher.notify(c.id,!1)});return Value.Tuple(b,c)}}}(),b=function(){return{every:function(a){var a=1E3*a,b=Elm.Input(0),c=0;setInterval(function(){c+=a;Dispatcher.notify(b.id,c/1E3)},a);return b},after:function(a){var a=
1E3*a,b=Elm.Input(!1);setTimeout(function(){Dispatcher.notify(b.id,!0)},a);return b},before:function(a){var a=1E3*a,b=Elm.Input(!0);setTimeout(function(){Dispatcher.notify(b.id,!1)},a);return b}}}(),c=function(){var b=Elm.Input(Value.Tuple(window.innerWidth,window.innerHeight));a(window,"resize",function(){var a=document.getElementById("widthChecker").offsetWidth;Dispatcher.notify(b.id,Value.Tuple(a,window.innerHeight))});return{dimensions:b,width:Elm.Lift(function(a){return a[1]},[b]),height:Elm.Lift(function(a){return a[2]},
[b])}}(),h=function(){var a=function(a){return function(b){var c=Elm.Input(["Waiting"]),e={};window.XMLHttpRequest?e=new XMLHttpRequest:window.ActiveXObject&&(e=new ActiveXObject("Microsoft.XMLHTTP"));e.onreadystatechange=function(){4===e.readyState&&Dispatcher.notify(c.id,200===e.status?["Success",d(e.responseText)]:["Failure",e.status,d(e.statusText)])};e.open(a,String.toText(b),!0);e.send(null);return c}},b=function(a){return function(b){var c=Elm.Input(["Nothing"]),b=Elm.Lift(function(b){if("Just"!==
b[0]){try{Dispatcher.notify(c.id,["Nothing"])}catch(e){}return[]}try{Dispatcher.notify(c.id,["Just",["Waiting"]])}catch(l){c.value=["Just",["Waiting"]]}var f={};window.XMLHttpRequest?f=new XMLHttpRequest:window.ActiveXObject&&(f=new ActiveXObject("Microsoft.XMLHTTP"));f.onreadystatechange=function(){4===f.readyState&&Dispatcher.notify(c.id,["Just",200===f.status?["Success",d(f.responseText)]:["Failure",f.status,d(f.statusText)]])};f.open(a,String.toText(b[1]),!0);f.send(null);return[]},[b]);return Elm.Lift(function(a){return function(){return a}},
[c,b])}};return{get:a("GET"),post:a("POST"),gets:b("GET"),posts:b("POST")}}(),f=function(){return{inRange:function(a){return function(b){return Elm.Input(Math.floor(Math.random()*(b-a+1))+a)}},randomize:function(a){return function(b){return function(c){return Elm.Lift(function(){return Math.floor(Math.random()*(b-a+1))+a},[c])}}}}}(),g=function(){var b=function(b){b.isElmLeaf=!0;var c=Elm.Input(["Nil"]);a(b,"keyup",function(){Dispatcher.notify(c.id,d(b.value));b.focus()});return Value.Tuple(b,c)},
c=function(a){a=document.createElement(a);a.id=Guid.guid();return a},e=function(b){for(var d=c("select"),e=[];"Cons"===b[0];){var f=c("option"),g=Text.toText(b[1][1]);f.value=g;f.innerHTML=g;d.appendChild(f);e.push(b[1][2]);b=b[2]}var h=Elm.Input(e[0]);a(d,"change",function(){Dispatcher.notify(h.id,e[d.selectedIndex])});return Value.Tuple(d,h)};return{textArea:function(a){return function(d){var e=c("textarea");e.rows=d;e.cols=a;return b(e,"")}},textField:function(a){var d=c("input");d.type="text";
return b(d,a)},password:function(a){var d=c("input");d.type="password";return b(d,a)},checkbox:function(b){var d=c("input");d.type="checkbox";d.checked=b;var e=Elm.Input(b);a(d,"change",function(){Dispatcher.notify(e.id,d.checked)});return Value.Tuple(d,e)},dropDown:e,stringDropDown:function(a){return e(List.map(function(a){return Value.Tuple(a,a)})(a))},button:function(b){var d=c("input");d.type="button";d.value=Text.toText(b);var e=Elm.Input(!1);a(d,"click",function(){Dispatcher.notify(e.id,!0);
Dispatcher.notify(e.id,!1)});return Value.Tuple(d,e)}}}();return{Mouse:e,Time:b,Window:c,HTTP:h,Random:f,Input:g}}(),List=function(){function d(a){return function(b){if("Nil"===b[0])return b;"Cons"!==b[0]&&i();for(var c=["Cons",a(b[1]),["Nil"]],d=c,b=b[2];"Cons"===b[0];)d[2]=["Cons",a(b[1]),["Nil"]],b=b[2],d=d[2];return c}}function a(a){return function(b){return function(c){var d=b;if("Nil"===c[0])return d;for("Cons"!==c[0]&&i();"Cons"===c[0];)d=a(c[1])(d),c=c[2];return d}}}function e(a){return function(b){return function(c){var d=
b;if("Nil"===c[0])return d;"Cons"!==c[0]&&i();for(var e=[];"Cons"===c[0];)e.push(c[1]),c=c[2];for(c=e.length;c--;)d=a(e[c])(d);return d}}}function b(b){return function(c){var d;"Cons"!==c[0]?d=void 0:(d=c[1],c=c[2],d=a(b)(d)(c));return d}}function c(a){return function(b){return function(c){if("Nil"===c[0])return["Cons",b,["Nil"]];"Cons"!==c[0]&&i();for(var d=[b];"Cons"===c[0];)b=a(c[1])(b),d.push(b),c=c[2];for(var c=["Nil"],e=d.length;e--;)c=["Cons",d[e],c];return c}}}function h(a){return function(b){return function(){for(var c=
[function(a){return"Nil"!==a[0]?void 0:["Tuple2",["Nil"],["Nil"]]},function(b){if("Cons"===b[0]){var c=b[1],b=b[2];var d=h(a)(b);"Tuple2"!==d[0]?c=void 0:(b=d[1],d=d[2],c=a(c)?["Tuple2",["Cons",c,b],d]:["Tuple2",b,["Cons",c,d]]);return c}}],d=c.length;d--;){var e=c[d](b);if(void 0!==e)return e}}()}}function f(a){return function(){for(var b=[function(a){return"Nil"!==a[0]?void 0:["Tuple2",["Nil"],["Nil"]]},function(a){if("Cons"!==a[0])a=void 0;else if(a=["Tuple2",a[1],f(a[2])],"Tuple2"!==a[0]||"Tuple2"!==
a[1][0])a=void 0;else var b=a[1][1],c=a[1][2],a="Tuple2"!==a[2][0]?void 0:["Tuple2",["Cons",b,a[2][1]],["Cons",c,a[2][2]]];return a}],c=b.length;c--;){var d=b[c](a);if(void 0!==d)return d}}()}function g(a){return function(b){return function(){for(var c=[function(a){return"Nil"!==a[0]?void 0:["Nil"]},function(a){if("Cons"===a[0]){var b=a[1];return"Nil"!==a[2][0]?void 0:["Cons",b,["Nil"]]}},function(b){if("Cons"===b[0]){var c=b[1];if("Cons"===b[2][0]){var d=b[2][1],b=b[2][2];return["Cons",c,["Cons",
a,g(a)(["Cons",d,b])]]}}}],d=c.length;d--;){var e=c[d](b);if(void 0!==e)return e}}()}}function j(a){return function(b){return function(){for(var c=[function(a){return"Nil"!==a[0]?void 0:["Nil"]},function(a){if("Cons"===a[0]){var b=a[1];return"Nil"!==a[2][0]?void 0:b}},function(b){if("Cons"===b[0]){var c=b[1];if("Cons"===b[2][0]){var d=b[2][1],b=b[2][2];return Value.append(c,Value.append(a,j(a)(["Cons",d,b])))}}}],d=c.length;d--;){var e=c[d](b);if(void 0!==e)return e}}()}}var i=function(){throw"Function expecting a list!";
},k=a(function(a){return function(b){return["Cons",a,b]}})(["Nil"]),l=e(function(a){return function(b){return Value.append(a,b)}})(["Nil"]),m=a(function(a){return function(b){return a&&b}})(!0),n=a(function(a){return function(b){return a||b}})(!1),o=a(function(a){return function(b){return a+b}})(0),p=a(function(a){return function(b){return a*b}})(1),r=b(function(a){return function(b){return Math.max(a,b)}}),t=b(function(a){return function(b){return Math.min(a,b)}});return{head:function(a){if("Cons"!==
a[0])throw"Error: 'head' only accepts lists of length greater than one.";return a[1]},tail:function(a){if("Cons"!==a[0])throw"Error: 'tail' only accepts lists of length greater than one.";return a[2]},map:d,foldl:a,foldr:e,foldl1:b,foldr1:function(a){return function(b){var c;"Cons"!==b[0]?c=void 0:(c=b[1],b=b[2],c=e(a)(c)(b));return c}},scanl:c,scanl1:function(a){return function(b){if("Cons"!==b[0])throw"Error: 'scanl1' requires a list of at least length 1.";return c(a)(b[1])(b[2])}},filter:function(a){return function(b){if("Nil"===
b[0])return b;"Cons"!==b[0]&&i();for(var c=[];"Cons"===b[0];)a(b[1])&&c.push(b[1]),b=b[2];for(var b=["Nil"],d=c.length;d--;)b=["Cons",c[d],b];return b}},length:function(a){for(var b=0;"Cons"===a[0];)b+=1,a=a[2];return b},reverse:k,concat:l,concatMap:function(a){return function(b){return l(d(a)(b))}},and:m,or:n,forall:function(b){return a(function(a){return function(c){return c&&b(a)}})(!0)},exists:function(b){return a(function(a){return function(c){return c||b(a)}})(!1)},sum:o,product:p,maximum:r,
minimum:t,partition:h,zipWith:function(a){return function(b){return function(c){if("Nil"===b[0]||"Nil"===c[0])return b;("Cons"!==b[0]||"Cons"!==c[0])&&i();for(var d=[];"Cons"===b[0]&&"Cons"===c[0];)d.push(a(b[1])(c[1])),b=b[2],c=c[2];for(var c=["Nil"],e=d.length;e--;)c=["Cons",d[e],c];return c}}},zip:function(a){return function(b){if("Nil"===a[0]||"Nil"===b[0])return a;("Cons"!==a[0]||"Cons"!==b[0])&&i();for(var c=[];"Cons"===a[0]&&"Cons"===b[0];)c.push(["Tuple2",a[1],b[1]]),a=a[2],b=b[2];for(var b=
["Nil"],d=c.length;d--;)b=["Cons",c[d],b];return b}},unzip:f,intersperse:g,intercalate:j,sort:function(a){if("Nil"===a[0])return a;"Cons"!==a[0]&&i();for(var b=[];"Cons"===a[0];)b.push(a[1]),a=a[2];b.sort(function(a,b){return a-b});for(var a=["Nil"],c=b.length;c--;)a=["Cons",b[c],a];return a}}}(),id=function(d){return d},not=function(d){return!d},sqrt=function(d){return Math.sqrt(d)},mod=function(d){return function(a){return d%a}},abs=function(d){return Math.abs(d)},logBase=function(d){return function(a){return Math.log(a)/
Math.log(d)}},min=function(d){return function(a){return Math.min(d,a)}},max=function(d){return function(a){return Math.max(d,a)}},clamp=function(d){return function(a){return function(e){return Math.min(a,Math.max(d,e))}}},sin=Math.sin,cos=Math.cos,tan=Math.tan,asin=Math.asin,acos=Math.acos,atan=Math.atan,flip=function(d){return function(a){return function(e){return d(e)(a)}}},Just=function(d){return["Just",d]},Nothing=["Nothing"];function constant(d){return Elm.Input(d)}
function lift(d){return function(a){return Elm.Lift(d,[a])}}function lift2(d){return function(a){return function(e){return Elm.Lift(d,[a,e])}}}function lift3(d){return function(a){return function(e){return function(b){return Elm.Lift(d,[a,e,b])}}}}function lift4(d){return function(a){return function(e){return function(b){return function(c){return Elm.Lift(d,[a,e,b,c])}}}}}function foldp(d){return function(a){return function(e){return Elm.Fold(d,a,e)}}}var includeGlobal=this;
(function(){var d=function(a){for(var b in a)if("Internal"!==b)try{includeGlobal[b]=a[b]}catch(c){"length"===b&&(includeGlobal.execScript("var length;"),length=a[b])}},a=function(a){return function(b){includeGlobal[a]=includeGlobal[a]||{};for(var c in b)"Internal"!==c&&(includeGlobal[a][c]=b[c])}};d(Element);d(Text);color=Element.color;height=Element.height;show=Value.show;a("Time")(Signal.Time);a("Mouse")(Signal.Mouse);a("Window")(Signal.Window);a("HTTP")(Signal.HTTP);a("Input")(Signal.Input);a("Random")(Signal.Random);
d(Color);d(Shape);d(Line)})();