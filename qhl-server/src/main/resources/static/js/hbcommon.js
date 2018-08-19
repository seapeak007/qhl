/**
 * 格式化参数字符串 par 参数名 val 参数值 searchStr 参数字符串 可以通过location.search获取
 * FOR EXAMPLE
 * searchStr = ?aaa=bbb&ccc=ddd par=eee val=fff 返回 ?aaa=bbb&ccc=ddd&eee=fff
 * searchStr = ?aaa=bbb&ccc=ddd par=aaa val=zzz 返回 ?aaa=zzz&ccc=ddd
 */
function formatePar(par,val,searchStr){
    if(searchStr == null || searchStr.trim() == "") return "?"+par+"="+val;
    searchStr = searchStr.trim();
    searchStr.trim();
    searchStr = searchStr.replace("?","");
    var parStr = searchStr.split('&');
    var parMap = new Object;
    $.each(parStr,function(i,j){
        var p =  j.split('=');
        parMap[p[0]]=p[1];
    });
    var needAdd = true;
    $.each(parMap,function(i,j){
       if(i == par){
           parMap[i]=val;
           needAdd = false;
       }
    });
    var ret = '?';
    var first = true;
    $.each(parMap,function(i,j){
        if(!first){
            ret = ret + '&';
        }else{
            first = false;
        }
       ret = ret+i+'='+j;
    });
    if(needAdd){
        if(!first){
            ret = ret + '&';
        }else{
            first = false;
        }
        ret =ret+par+'='+val;
    }
    return ret;
}



function getGetPar(key){
	var searchStr = location.search;
    if(searchStr == null || searchStr.trim() == "") return "";
    searchStr = searchStr.trim();
    searchStr.trim();
    searchStr = searchStr.replace("?","");
    var parStr = searchStr.split('&');
    var parMap = new Object;
    $.each(parStr,function(i,j){
        var p =  j.split('=');
        parMap[p[0]]=p[1];
    });
    var ret = parMap[key]==null || parMap[key]=="undefined" ?"":parMap[key];
    
    return ret;
}




/**
 * 为页面添加head并提供返回的功能 titleName为标题的名称
 */
function addHeader(titleName){
	var headerHtml = '';
	headerHtml += '<header class="header">';
	headerHtml += '<div class="navbar"><a href="javascript:history.go(-1);"><span>返回</span></a></div>'+titleName+'</header>';
	headerHtml += '<div style="height:45px;"></div>';
	$('body').prepend(headerHtml);
}

function addHeaderNoBack(titleName){
    var headerHtml = '';
    headerHtml += '<header class="header">';
    headerHtml += '<div class="navbar"></div>'+titleName+'</header>';
    headerHtml += '<div style="height:45px;"></div>';
    $('body').prepend(headerHtml);
}

function addHeaderWithHref(titleName,href){
	var headerHtml = '';
	headerHtml += '<header class="header">';
	headerHtml += '<div class="navbar"><a href="'+href+'"><span>返回</span></a></div>'+titleName+'</header>';
	headerHtml += '<div style="height:45px;"></div>';
	$('body').prepend(headerHtml);
}
function addHeaderWithBtn(titleName,href){
	var headerHtml = '';
	headerHtml += '<header class="header">';
	headerHtml += '<div class="navbar"><a href="javascript:void(0)" onclick="'+href+'"><span>返回</span></a></div>'+titleName+'</header>';
	headerHtml += '<div style="height:45px;"></div>';
	$('body').prepend(headerHtml);
}

/**
 * 格式化整数
 * @param number:number 要格式化的整数
 * @param fmt:string 整数格式
 */
function formatNumber(number, fmt) {
    number = number + '';
    if (fmt.length > number.length) {
        return fmt.substring(number.length) + number;
    }
    return number;
}

function formatDate(datetime, format) {
    var cfg = {
                MMM : ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
                MMMM : ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
            },
            values = {
                y : datetime.getFullYear(),
                M : datetime.getMonth(),
                d : datetime.getDate(),
                H : datetime.getHours(),
                m : datetime.getMinutes(),
                s : datetime.getSeconds(),
                S : datetime.getMilliseconds()
            };
    /*用正则表达式拆分日期格式各个元素*/
    var elems = format.match(/y+|M+|d+|H+|m+|s+|S+|[^yMdHmsS]/g);
//将日期元素替换为实际的值
    for (var i = 0; i < elems.length; i++) {
        if (cfg[elems[i]]) {
            elems[i] = cfg[elems[i]][values[elems[i].charAt(0)]];
        } else if (values[elems[i].charAt(0)]) {
            elems[i] = formatNumber(values[elems[i].charAt(0)], elems[i].replace(/./g, '0'));
        }
    }

    return elems.join('');
}


/**
 * 弹出框
 */
function alert(msg){
	var alert_html = '';
	alert_html += '<div class="alertInfo">';
	alert_html += '<div class="infoContent"><table width="100%" height="100"><tr><td>'+msg+'</td></tr></table></div>';
	alert_html += '<div class="alertOk" onclick="closeMask()">确认</div>';
	alert_html += '</div>';
	alert_html += '<div class="mask0"></div>';	
	
	$('body').append(alert_html);
}

function closeMask(){
	$('.alertInfo5').remove();
	$('.alertInfo').remove();
	$('.alertInfoTwo').remove();
	$('.mask0').remove();
}

function alertReload(msg){
	var alert_html = '';
	msg = msg || '程序异常，点击确认刷新';
	alert_html += '<div class="alertInfo">';
	alert_html += '<div class="infoContent"><table width="100%" height="100"><tr><td>'+msg+'</td></tr></table></div>';
	alert_html += '<div class="alertOk" onclick="reload()">确认</div>';
	alert_html += '</div>';
	alert_html += '<div class="mask0"></div>';	
	
	$('body').append(alert_html);
	$(".mask0").show();
}
function reload(){
	window.location.reload();
}

function alert2(msg){
	var alert_html = '';
	alert_html += '<div class="alertInfo">';
	alert_html += '<div class="infoContent"><table width="100%" height="100"><tr><td>'+msg+'</td></tr></table></div>';
	alert_html += '<div class="alertOk" onclick="closeMask()">取消</div>';
	alert_html += '</div>';
	alert_html += '<div class="mask0"></div>';	
	
	$('body').append(alert_html);	
}
/**
 * 一个带跳转的btn弹框
 */
function alert23(msg,url1,btn1){
	var alert_html = '';
	alert_html += '<div class="alertInfo">';
	alert_html += '<div class="infoContent"><table width="100%" height="100"><tr><td>'+msg+'</td></tr></table></div>';
	alert_html += '<a class="alertOk" href="'+url1+'">'+btn1+'</a>';
	alert_html += '</div>';
	alert_html += '<div class="mask0"></div>';	
	
	$('body').append(alert_html);
}
/**
 * 一个带button的btn弹框
 */
function alert24(msg,url1,btn1){
	var alert_html = '';
	alert_html += '<div class="alertInfo">';
	alert_html += '<div class="infoContent"><table width="100%" height="100"><tr><td>'+msg+'</td></tr></table></div>';
	alert_html += '<a class="alertOk" href="javascript:void(0)" onclick="'+url1+'"1>'+btn1+'</a>';
	alert_html += '</div>';
	alert_html += '<div class="mask0"></div>';	
	
	$('body').append(alert_html);
}
//左链接右链接
function alert3(btn1,btn2,msg,url1,url2){
	var alert_html = '';
	alert_html += '<div class="alertInfo">';
	alert_html += '<div class="infoContent"><table width="100%" height="100"><tr><td>'+msg+'</td></tr></table></div>';
	if(url1 == 0){
		alert_html += '<a href="javascript:void(0)" onclick="closeMask()"  class="alertOka">'+btn1+'</a>';	
	}else{
		alert_html += '<a href="'+url1+'" class="alertOka">'+btn1+'</a>';	
	}
	if(url2 == 0){
		alert_html += '<a href="javascript:void(0)" onclick="closeMask()"  class="alertOkb">'+btn2+'</a>';	
	}else{
		alert_html += '<a href="'+url2+'" class="alertOkb">'+btn2+'</a>';	
	}

	alert_html += '</div>';
	alert_html += '<div class="mask0"></div>';	
	
	$('body').append(alert_html);		
}
//左button右button
function alert4(btn1,btn2,msg,url1,url2){
	var alert_html = '';
	alert_html += '<div class="alertInfo">';
	alert_html += '<div class="infoContent"><table width="100%" height="100"><tr><td>'+msg+'</td></tr></table></div>';
	if(url1 == 0){
		alert_html += '<a href="javascript:void(0)" onclick="closeMask()"  class="alertOka">'+btn1+'</a>';	
	}else{
		alert_html += '<a href="javascript:void(0)" onclick="'+url1+'"  class="alertOka">'+btn1+'</a>';	
	}
	if(url2 == 0){
		alert_html += '<a href="javascript:void(0)" onclick="closeMask()"  class="alertOkb">'+btn2+'</a>';	
	}else{
		alert_html += '<a href="javascript:void(0)" onclick="'+url2+'"  class="alertOkb">'+btn2+'</a>';	
	}

	alert_html += '</div>';
	alert_html += '<div class="mask0"></div>';	
	
	$('body').append(alert_html);		
}
//左链接右button
function alert5(btn1,btn2,msg,url1,url2){
	var alert_html = '';
	alert_html += '<div class="alertInfo">';
	alert_html += '<div class="infoContent"><table width="100%" height="100"><tr><td>'+msg+'</td></tr></table></div>';
	if(url1 == 0){
		alert_html += '<a href="javascript:void(0)" onclick="closeMask()"  class="alertOka">'+btn1+'</a>';	
	}else{
		alert_html += '<a href="'+url1+'" class="alertOka">'+btn1+'</a>';	
	}
	if(url2 == 0){
		alert_html += '<a href="javascript:void(0)" onclick="closeMask()"  class="alertOkb">'+btn2+'</a>';	
	}else{
		alert_html += '<a href="javascript:void(0)" onclick="'+url2+'"  class="alertOkb">'+btn2+'</a>';	
	}

	alert_html += '</div>';
	alert_html += '<div class="mask0"></div>';	
	
	$('body').append(alert_html);		
}
//2个按钮都是橘黄色 左方法右链接
function alert55(btn1,btn2,msg,url1,url2){
    var alert_html = '';
    alert_html += '<div class="alertInfo">';
    alert_html += '<div class="infoContent"><table width="100%" height="100"><tr><td>'+msg+'</td></tr></table></div>';
    if(url1 == 0){
        alert_html += '<a href="javascript:void(0)" onclick="closeMask()"  class="alertOka">'+btn1+'</a>';  
    }else{
        alert_html += '<a href="javascript:void(0)" onclick="'+url1+'" class="alertOka">'+btn1+'</a>';   
    }
    if(url2 == 0){
        alert_html += '<a href="javascript:void(0)" onclick="closeMask()"  class="alertOkb">'+btn2+'</a>';  
    }else{
        alert_html += '<a href="'+url2+'"  class="alertOkb bgorange">'+btn2+'</a>'; 
    }

    alert_html += '</div>';
    alert_html += '<div class="mask0"></div>';  
    
    $('body').append(alert_html);       
}
/**
 * 专为地图页面设计的按钮
 * @param btn1
 * @param btn2
 * @param msg
 * @param url1
 * @param url2
 */
function alert6(btn1,btn2,msg,url1,url2){
	var alert_html = '';
	alert_html += '<div class="alertInfo5">';
	alert_html += '<div class="infoContent5"><table width="100%" height="100"><tr><td>'+msg+'</td></tr></table></div>';
	if(url1 == 0){
		alert_html += '<a href="javascript:void(0)" onclick="closeMask()"  class="alertOkaa">'+btn1+'</a>';	
	}else{
		alert_html += '<a href="javascript:void(0)" onclick="'+url1+'"  class="alertOkaa">'+btn1+'</a>';	
	}
	if(url2 == 0){
		alert_html += '<a href="javascript:void(0)" onclick="closeMask()"  class="alertOkbb">'+btn2+'</a>';	
	}else{
		alert_html += '<a href="javascript:void(0)" onclick="'+url2+'"  class="alertOkbb">'+btn2+'</a>';	
	}

	alert_html += '</div>';
	//alert_html += '<div class="mask"></div>';	
	
	$('body').append(alert_html);		
}



function alert66(btn1,btn2,msg,url1,url2){
	var alert_html = '';
	alert_html += '<div class="alertInfo5">';
	alert_html += '<a href="javascript:void(0)" onclick="closeMask()" style="position:absolute; right:-12px;top:-10px; "><img src="images/mapdel.png" style="width:34px;"></a>';
	alert_html += '<div class="infoContent5"><table width="100%" height="100"><tr><td>'+msg+'</td></tr></table></div>';
	if(url1 == 0){
		alert_html += '<a href="javascript:void(0)" onclick="closeMask()"  class="alertOkaa">'+btn1+'</a>';	
	}else{
		alert_html += '<a href="javascript:void(0)" onclick="'+url1+'"  class="alertOkaa">'+btn1+'</a>';	
	}
	if(url2 == 0){
		alert_html += '<a href="javascript:void(0)" onclick="closeMask()"  class="alertOkbb">'+btn2+'</a>';	
	}else{
		alert_html += '<a href="javascript:void(0)" onclick="'+url2+'"  class="alertOkbb">'+btn2+'</a>';	
	}

	alert_html += '</div>';
	//alert_html += '<div class="mask"></div>';	
	
	$('body').append(alert_html);		
}




function onBridgeReady(){
	  WeixinJSBridge.call('hideOptionMenu');
	}

if (typeof WeixinJSBridge == "undefined"){
    if( document.addEventListener ){
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    }else if (document.attachEvent){
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }
}else{
    onBridgeReady();
}

function showPage(){
	$(".page").height($(document).height()).show();
}

function hidePage(){
	$(".page").hide();
}
function loading(){
	$('body').append("<div class='overlay'><div class='load'></div></div>");
	$(".overlay").height($(window).height()).show();
}
function closeLoading(){
	$('.overlay').remove();
}
function showDialog(){
	$(".mask").height($(document).height()).show();
    $(".dialog").css({"top": (150 + $(document).scrollTop()) + "px"}).show();
}
function hideDialog(){
	$('.mask').hide();
	$('.dialog').hide();
}

$.ajaxSetup({
	dataType: "json",
	beforeSend: function (){
        loading();
    },
    complete: function (){
    	closeLoading();
    },
    error: function (){
    	// alertReload();
    },
    statusCode: {
	    // 404: function() {
	    //     alert("程序异常，请稍后重试");
	    // }
    }
});
jQuery.ajaxSetup({
	dataType: "json",
	beforeSend: function (){
        loading();
    },
    complete: function (){
    	closeLoading();
    },
    error: function (){
    	// alertReload();
    },
    statusCode: {
	    // 404: function() {
	    //     alert("程序异常，请稍后重试");
	    // }
    }
});

var config = {"domain" : "http://101.201.62.210:8080"};

//growingio
var _vds = _vds || [];
window._vds = _vds;
(function(){
    _vds.push(['setAccountId', 'a2303f8f4885fb2a']);
    (function() {
          var vds = document.createElement('script');
          vds.type='text/javascript';
          vds.async = true;
          vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js';
          var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(vds, s);
    })();
})();

function getKey(){
    return "jqDRKRdGmG0CznGBzkv2kWkBHYiwRgbU";
    //return "83cb721236dcdee29ead895234828146";
    // var keys = {
    //     "7": "Atlq6CjGY3vOwdtap1inI5Gx",
    //     "8": "sWVzgNAZxT658pLQF4LoB4zwpe1DlBk0",
    //     "9": "2bef39cbadb0e835087a345547188125",
    //     "10": "83cb721236dcdee29ead895234828146",
    //     "11": "dc91ntqzRd1aFAkQgegWQOXZTdedSv0A",
    //     "12": "jhA7FrvtgYaIbVRbCZgp9YTWfQCDd5zf",
    //     "13": "pTeOHcUjyi6e0qpaEivOXdutenkyAKvk",
    //     "14": "S2XahpIZgArKvIKeKmSxAURtgtWX3DAN",
    //     "15": "IlWl0zah47N906rIpBd88oTUtmfUXyEU",
    //     "16": "ryTGI0B48DggMLloUspeUAevA161kVbh",
    //     "17": "HUq0pfTfuWaGzNmdQIbsboYWgtOUONBY",
    //     "18": "wOLSbqna0iQX8vzKFYB0MfcDitegWoPO",
    //     "19": "glaUDV8H3NX0OxG8m2tUFr9etysB9d1t",
    //     "20": "myUzDNGe5QkS8kiZbFZ2jMvFtC7koT7Y",
    //     "21": "GLTcME8X1zXHIIy7TCPw7QpvwXyt2EvN",
    //     "22": "GLTcME8X1zXHIIy7TCPw7QpvwXyt2EvN",
    //     "23": "GLTcME8X1zXHIIy7TCPw7QpvwXyt2EvN",
    //     "0": "GLTcME8X1zXHIIy7TCPw7QpvwXyt2EvN",
    //     "1": "GLTcME8X1zXHIIy7TCPw7QpvwXyt2EvN",
    //     "2": "GLTcME8X1zXHIIy7TCPw7QpvwXyt2EvN",
    //     "3": "GLTcME8X1zXHIIy7TCPw7QpvwXyt2EvN",
    //     "4": "GLTcME8X1zXHIIy7TCPw7QpvwXyt2EvN",
    //     "5": "GLTcME8X1zXHIIy7TCPw7QpvwXyt2EvN",
    //     "6": "GLTcME8X1zXHIIy7TCPw7QpvwXyt2EvN"
    // };
    // var h = new Date().getHours();
    // return keys[h];
}
var first = getGetPar("first");
var vehicleOwnerId=getGetPar("hkcVehicleOwnerInfoId");
var vehicleId =getGetPar("hkcVehicleInfoId");
var channel = first == 1 ? getGetPar("channel") : getCookie("channel");
var externalUniqueId = first == 1 ? getGetPar("externalUniqueId") : getCookie("externalUniqueId");

if(first == 1){
    setCookie("channel", channel, 1);
    setCookie("externalUniqueId", externalUniqueId, 1);
}

function setCookie(c_name,value,expiredays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString()+";path=/");
}

//取回cookie
function getCookie(c_name){
    if (document.cookie.length>0){
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1){ 
            c_start=c_start + c_name.length+1;
            c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        } 
    }
    return "";
}
$(document).ready(function (){
    // if($("body").attr("nohome") == "1") return;
    //
    // var oDiv = document.createElement("div");
    // oDiv.id = "home-btn";
    // oDiv.innerText = "首页";
    //
    // var disX,moveX,L,T,starX,starY,starXEnd,starYEnd;
    //
    // oDiv.addEventListener('touchstart',function(e){
    //     disX = e.touches[0].clientX - this.offsetLeft;
    //     disY = e.touches[0].clientY - this.offsetTop;
    //     //手指按下时的坐标
    //     starX = e.touches[0].clientX;
    //     starY = e.touches[0].clientY;
    //     //console.log(disX);
    // });
    // oDiv.addEventListener('touchmove',function(e){
    //     e.preventDefault();//阻止触摸时页面的滚动，缩放
    //     L = e.touches[0].clientX - disX ;
    //     T = e.touches[0].clientY - disY ;
    //     //移动时 当前位置与起始位置之间的差值
    //     starXEnd = e.touches[0].clientX - starX;
    //     starYEnd = e.touches[0].clientY - starY;
    //     //console.log(L);
    //     if(L<0){//限制拖拽的X范围，不能拖出屏幕
    //             L = 0;
    //     }else if(L > document.documentElement.clientWidth - this.offsetWidth){
    //             L=document.documentElement.clientWidth - this.offsetWidth;
    //     }
    //
    //     if(T<0){//限制拖拽的Y范围，不能拖出屏幕
    //             T=0;
    //     }else if(T>document.documentElement.clientHeight - this.offsetHeight){
    //             T = document.documentElement.clientHeight - this.offsetHeight;
    //     }
    //     moveX = L + 'px';
    //     moveY = T + 'px';
    //     //console.log(moveX);
    //     this.style.left = moveX;
    //     this.style.top = moveY;
    // });
    // oDiv.addEventListener('click',function(e){
    //     window.location.href = 'index.html?hkcVehicleOwnerInfoId='+vehicleOwnerId+'&hkcVehicleInfoId='+vehicleId;
    // });

    // $("body").append(oDiv);
})

