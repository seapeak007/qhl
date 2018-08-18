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


function submitData(){
	
	var phone = $("#phone").val().replace(/\s+/g,"");
	var code = $("#code").val().replace(/\s+/g,"");
	var username = ToCDB($("#username").val().replace(/\s+/g,""));
	
	
	
	

	
	if(null==channel ||""==channel ||"undefined"==channel || null==uid ||""==uid ||"undefined"==uid){
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
	 
		if(!/^[0-9][0-9][0-9][0-9]$/.test(code)){
	        alert('请填写正确的验证码！');
	        return ;
	    }
	 
	 if(null==username ||""==username||"undefined"==username){
		 alert('请填写用户名！');
	     return ;
	 }
	 
     if(!/^[\u4E00-\u9FA5\.]{2,23}$/.test(username)){
        alert('请填写正确的用户名！');
        return ;
     }
	
     
//	plateNo = ToCDB(plateNo.replace(/\s/ig,'')) ;
//	var regPartton=/^[\u4e00-\u9fa5]{1}[a-zA-Z_0-9]{6}$/;
//    var regPartton1=/^[\u4e00-\u9fa5]{1}[a-zA-Z_0-9]{5}[\u4e00-\u9fa5]{1}$/;
//	if(!regPartton.test(plateNo)&&(!regPartton1.test(plateNo))){
//		 alert('请填写正确的车牌号！');
//		return;
//	}
	
	$.ajax({
        url: '/HKCIBY/hkcVehicleOwnerInfo/checkPhoneHkcVehicleOwnerInfo.action',
        type: 'POST',
        dataType: 'json',
        data: {
        	 phone: phone,
             channel: channel,
             uid:uid,
             code:code,
             username:username
        	 
        },
        success: function(data) {
        	
        	var error_code = data.status ;
        	if(error_code=="0"){
        		var url="./index.html?hkcVehicleOwnerInfoId="+data.vehicleOwnerId;
        		//var vehicleOwnerId = data.vehicleOwnerId;
        		alert23("恭喜您认证成功，请开启您的免费保养之旅吧！",url,"确定");
        	}else if(error_code=="1"){
        		alert('手机号已被注册');
        	}else if(error_code=="4"){
        		alert('验证码不正确，请重新输入');
        	}else if(error_code=="3"){
        		alert('您的手机号已经被多次认证。请拨打400');
        	}
	        else if(error_code=="7"){
	        	alert('该手机号已经在其他渠道注册，不能在此注册登录！');
	        }
        	else if(error_code=="2"){
        		//跳转到绑定页面
        		var vehicleOwnerId = data.vehicleOwnerId;
        		
        		var par = formatePar('channel',channel,'');
        		par = formatePar('uid',uid,par);
        		par = formatePar('phone',phone,par);
        		par = formatePar('vehicleOwnerInfoId',vehicleOwnerId,par);
        		par = formatePar('username',username,par);
        		
        		var url="valid2.html"+par;
        		
        		window.location.href=url;
        		//alert('跳转到绑定页面 + '+vehicleOwnerId);
        	}else if(error_code=="999"){
        		alert('程序异常');
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