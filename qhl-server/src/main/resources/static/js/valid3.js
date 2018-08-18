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
				var yzmtxt = $('#txcode').val();
				
				if(yzmtxt == ""  || yzmtxt == "undefined" || yzmtxt == null){
					alert('请先填写图形验证码');
					//$('.ident-code button').addClass('send1').removeClass('send0').removeAttr("disabled").html("获取验证码");
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
	                    rank: code,
						token:timestamp,
			 			yzcode:yzmtxt
	                },
	                success: function(data) {
	                	if(data.status == "1"){
	                        $(".error").text("没有收到验证码？请重新发送");
	                    }else if(data.status == "3"){
							alert('图形验证码不正确');
							 clearInterval(timer);
							  $('.ident-code button').addClass('send1').removeClass('send0').removeAttr("disabled").html("获取验证码");
	                    	  sends.checked = 1;
							  return true;
						}else if(data.status == "0"){
							  timestamp = parseInt(new Date().getTime()*randomnum);
							  $('#yzimg').children('img').attr('src','/HKCIBY/hkcPhoneVerificationCode/getPicHkcPhoneVerificationCode.do?token='+timestamp);	
						}
	                },
	            });    
	            timeCountDown();
	            var timer = setInterval(timeCountDown,1000);
	    }
	}

function initData(){
	$.ajax({
        url: '/HKCIBY/hkcVehicleInfo/queryListByOwerHkcVehicleInfo.action',
        type: 'POST',
        dataType: 'json',
        data: {
            hkcVehicleOwnerInfoId: hkcVehicleOwnerInfoId
        },
        success: function(data) {
        	
        	var lis="";
        	var m=0 ;
        	$.each(data,function(i,j){
        		if(null!=j.plateNo &&""!=j.plateNo){
        			m++;
        			var li = "<li>车牌号"+m+"："+j.plateNo+"</li>" ;
        			lis = lis + li ;
        		}
        	});
        	
        	$("#lis").html("");
        	$("#lis").html(lis);
        }
    }); 
}

function submitData(){
	
	var phone = $("#phone").val().replace(/\s+/g,"");
	var code = $("#code").val().replace(/\s+/g,"");
	
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
	
	$.ajax({
        url: '/HKCIBY/hkcVehicleOwnerInfo/oldUserAuthenticationHkcVehicleOwnerInfo.action',
        type: 'POST',
        dataType: 'json',
        data: {
            phone: phone,
            code:code ,
            channel: channel,
            externalUniqueId: externalUniqueId,
            hkcVehicleOwnerInfoId:hkcVehicleOwnerInfoId
        },
        success: function(data) {
        	
        	var error_code = data.status ;
        	if(error_code=="1"){
        		alert('系统异常，请拨打<a href="tel:4006871230">4006871230联系客服！</a>');
        	}else if(error_code=="2"){
        		alert('手机号/验证码为空，请输入');
        	}else if(error_code=="3"){
        		alert('验证码不正确，请重新输入');
        	}else if(error_code=="4"){
        		var url="./index.html?hkcVehicleOwnerInfoId="+data.hkcVehicleOwnerInfoId;
        		alert23("恭喜您认证成功，请开启您的免费保养之旅吧！",url,"确定");
        	}else if(error_code=="5"){
        		alert('该手机号已被注册，请拨打<a href="tel:4006871230">4006871230联系客服！</a>');
        	}else{
        		alert('系统异常，请拨打<a href="tel:4006871230">4006871230联系客服！</a>');
        	}
        }
    }); 
	
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