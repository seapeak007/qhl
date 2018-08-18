//验证手机号是否合法
function checkphone(s) {
    var patrn = /^1[0-9]{10}$/;
    if (!patrn.exec(s)) return false ;
    return true ;
}

var sends = {
	    checked:1,
	    send:function(){
	            var phone = $("#phone").val().replace(/\s+/g,"");
	            if (!checkphone(phone)) {
	                alert('请填写正确的手机号！');
	                return false;
	            } 
	            var time = 60;
	            function timeCountDown(){
	                if(time==0){
	                    clearInterval(timer);
	                    $('.ident-code button').addClass('send1').removeClass('send0').removeAttr("disabled").html("获取验证码");
	                    sends.checked = 1;
	                    return true;
	                }
	                $('.ident-code button').attr('disabled',"true").html(time+"秒后可重新获取");
	                time--;
	                return false;
	                sends.checked = 0; 
	            }
	            $('.ident-code button').addClass('send0').removeClass('send1').removeAttr("disabled");
	            
	            var code ="" ;
	            for (var i = 0; i < 4; i++) {  
	                code += parseInt(Math.random() * 9).toString();  
	            } 
	            
	            $.ajax({
	                url: '/HKCIBY/hkcPhoneVerificationCode/sendHkcPhoneVerificationCode.action',
	                type: 'POST',
	                dataType: 'json',
	                data: {
	                    phone: phone,
	                    rank: code
	                },
	                success: function(data) {
	                	if(data.status == "1"){
	                        $(".error").text("没有收到验证码？请重新发送");
	                    }
	                },
	            });    
	            timeCountDown();
	            var timer = setInterval(timeCountDown,1000);
	    }
	}


function submitData(){
	
	var phone = $("#phone").val().replace(/\s+/g,"");
	var code = $("#code").val().replace(/\s+/g,"");
	var plateNo = $("#plateNo_index").html()+ $("#plateNo").val().toUpperCase();
	
	if(null==channel ||""==channel ||"undefined"==channel || null==externalUniqueId ||""==externalUniqueId ||"undefined"==externalUniqueId){
		alert('网络异常，请重新进入！');
		return;
	}
	
	 if (!checkphone(phone)) {
	     alert('请填写正确联系电话！');
	     return ;
	 }
	
	 if(null==code ||""==code||"undefined"==code){
		 alert('请填写验证码！');
	     return ;
	 }
	 
	plateNo = ToCDB(plateNo.replace(/\s/ig,'')) ;
	var regPartton=/^[\u4e00-\u9fa5]{1}[a-zA-Z_0-9]{6}$/;
    var regPartton1=/^[\u4e00-\u9fa5]{1}[a-zA-Z_0-9]{5}[\u4e00-\u9fa5]{1}$/;
	if(!regPartton.test(plateNo)&&(!regPartton1.test(plateNo))){
		 alert('请填写正确的车牌号！');
		return;
	}
	
	$.ajax({
        url: '/HKCIBY/hkcVehicleOwnerInfo/userAuthenticationHkcVehicleOwnerInfo.action',
        type: 'POST',
        dataType: 'json',
        data: {
            phone: phone,
            code:code ,
            plateNo: plateNo,
            channel: channel,
            externalUniqueId: externalUniqueId
        },
        success: function(data) {
        	
        	var error_code = data.status ;
        	if(error_code=="1"){
        		alert('系统异常，请拨打<a href="tel:4006871230">4006871230联系客服！</a>');
        	}else if(error_code=="2"){
        		alert('手机号/验证码/车牌号为空，请输入');
        	}else if(error_code=="3"){
        		alert('验证码不正确，请重新输入');
        	}else if(error_code=="4"){
        		alert('您输入的手机号与该车辆预留手机号不一致，请拨打<a href="tel:4006871230">4006871230</a>联系客服！');
        	}else if(error_code=="5"){
        		alert('您输入的手机号与该车辆预留手机号不一致，请拨打<a href="tel:4006871230">4006871230</a>联系客服！');
        	}else if(error_code=="6"){
        		var url="./index.html?hkcVehicleOwnerInfoId="+data.hkcVehicleOwnerInfoId;
        		alert23("恭喜您认证成功，请开启您的免费保养之旅吧！",url,"确定");
        	}else if(error_code=="7"){
        		var url1="./index.html?hkcVehicleOwnerInfoId="+data.hkcVehicleOwnerInfoId;
				//var url2="zbjr();";
				alert55("修改车牌号","确定","亲~未查询到该车牌号信息，可先进入系统完善信息后进行预约！",0,url1);
        	}else if(error_code=="8"){ 
        		var url1="./index.html?hkcVehicleOwnerInfoId="+data.hkcVehicleOwnerInfoId;
				//var url2="zbjr();";
				alert55("修改车牌号","确定","亲~未查询到该车牌号信息，可先进入系统完善信息后进行预约！",0,url1);
        	}else if(error_code=="9"){ 
        		var url1="./index.html?hkcVehicleOwnerInfoId="+data.hkcVehicleOwnerInfoId;
				//var url2="zbjr();";
				alert55("修改车牌号","确定","亲~未查询到该车牌号信息，可先进入系统完善信息后进行预约！",0,url1);
        	}else if(error_code=="10"){ 
				alert('该车牌号已被认证，请更换车牌号或拨打<a href="tel:4006871230">4006871230</a>联系客服！');
        	}else{
        		alert('系统异常，请拨打<a href="tel:4006871230">4006871230联系客服！</a>');
        	}
        	
        }
    }); 
	
}

function zbjr(){
	$('#ljyy').attr("style","");
	$('#ljyy').attr("value","确定");
	$('#ljyy').attr("onclick","submitData();");
	$('.alertInfo').remove();
	$('.alertInfoTwo').remove();
	$('.mask').remove();
}

function upperCase(x){
    var y=document.getElementById(x).value ;
    document.getElementById(x).value=y.toUpperCase() ;
}
//全角转换为半角函数 
function ToCDB(str){ 
	var tmp = ""; 
	for(var i=0;i<str.length;i++)  { 
		if(str.charCodeAt(i)>65248&&str.charCodeAt(i)<65375){ 
			tmp += String.fromCharCode(str.charCodeAt(i)-65248); 
		} else { 
			tmp += String.fromCharCode(str.charCodeAt(i)); 
		} 
	} 
		return tmp ;
}