//验证手机号是否合法
function checkphone(s) {
    var patrn = /^1[0-9]{10}$/;
    if (!patrn.exec(s)) return false ;
    return true ;
}

// var sends = {
// 	    checked:1,
// 	    send:function(){
// 	            var phone = $("#phone").val().replace(/\s+/g,"");
// 	            if (!checkphone(phone)) {
// 	                alert('请填写正确的手机号！');
// 	                return false;
// 	            }
// 	            var time = 60;
// 	            function timeCountDown(){
// 	                if(time==0){
// 	                    clearInterval(timer);
// 	                    $('.ident-code button').addClass('send1').removeClass('send0').removeAttr("disabled").html("获取验证码");
// 	                    sends.checked = 1;
// 	                    return true;
// 	                }
// 	                $('.ident-code button').attr('disabled',"true").html(time+"秒后可重新获取");
// 	                time--;
// 	                return false;
// 	                sends.checked = 0;
// 	            }
// 	            $('.ident-code button').addClass('send0').removeClass('send1').removeAttr("disabled");
//
// 	            var code ="" ;
// 	            for (var i = 0; i < 4; i++) {
// 	                code += parseInt(Math.random() * 9).toString();
// 	            }
//
// 	            $.ajax({
// 	                url: '/HKCIBY/hkcPhoneVerificationCode/sendHkcPhoneVerificationCode.action',
// 	                type: 'POST',
// 	                dataType: 'json',
// 	                data: {
// 	                    phone: phone,
// 	                    rank: code
// 	                },
// 	                success: function(data) {
// 	                     $("#qjphone").val(data.phone);
// 	                 	 $("#qjvertify").val(data.code);
// 	                },
// 	            });
// 	            timeCountDown();
// 	            var timer = setInterval(timeCountDown,1000);
// 	    }
// 	}

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
function submitData(){
	
	var name = $("#name").val();
	var phone = $("#phone").val().replace(/\s+/g,"");
    var grade = $("#grade").val();
    var email = $("#email").val();
    var companyName = $("#companyName").val();
    var companyAddress = $("#companyAddress").val();
    var remark = $("#remark").val();
	
	if($.trim(name)==""||name=="姓名"){
		alert('请填写姓名！');
		return;
	}else{
		
		if($.trim(name).length>10){
			alert('请填写正确的姓名！');
			return ;
		}
	}
	
	 if (!checkphone(phone)) {
	     alert('请填写正确手机号！');
	     return ;
	 }

    if($.trim(grade)==""||grade=="职务"){
        alert('请填写职务！');
        return;
    }

    if($.trim(email)==""||email=="邮箱"){
        alert('请填写邮箱！');
        return;
    }

    if($.trim(companyName)==""||companyName=="单位名称"){
        alert('请填写单位名称！');
        return;
    }

    var business ={
        "name" :name ,
        "phone": phone,
        "grade" :grade ,
        "email": email,
        "companyName": companyName,
        "companyAddress" :companyAddress ,
        "remark": remark
    }
	$.ajax({
        url: '/business/1/join',
        type: 'POST',
		dataType:'json' ,
        contentType: 'application/json;charset=utf-8',
		data: JSON.stringify(business),
        success: function(data) {
        	var status = data.rpco ;
        	if(status == 200){
        		alert('报名成功！');
        	}else{
        		alert(data.msg);
			}
        }
    }); 
	
}