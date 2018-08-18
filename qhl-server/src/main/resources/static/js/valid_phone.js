var vehicleOwnerId=getGetPar("hkcVehicleOwnerInfoId");
var vehicleId =getGetPar("hkcVehicleInfoId");
var from = getGetPar("from");
var count = 60;
function validPhone(){
    var phone = $("#phone").val();
    if(!/^1[0-9]{10}$/.test(phone)){
        $("#validButton").addClass("btn-invalid").off("click");
        return false;
    }else{
        $("#validButton").removeClass("btn-invalid").on("click", sendSMS);
        $(".error").text("");
        return true;
    }
}
function sendSMS(){
    $("#validButton").addClass("btn-invalid").attr('disabled',"true");
    countDown();

    var phone = $.trim($("#phone").val());
    var code ="" ;
    for (var i = 0; i < 4; i++) {  
        code += parseInt(Math.random() * 9).toString();  
    } 

    $.get("/HKCIBY/hkcPhoneVerificationCode/sendHkcPhoneVerificationCode.action", 
          {phone: phone,
           rank: code},
           function (data){
            if(data.status == "1"){
                $(".error").text("没有收到验证码？请重新发送");
                count = 0;
            }   
        });

}
function countDown(){
    if(count > 0){
        count--;
        $("#validButton").val(count + " S");
        setTimeout(function (){
            countDown();
        }, 1000);
    }else{
        $("#validButton").val("验证").removeClass("btn-invalid").removeAttr("disabled");
    }   
}
function readyLogin(){
    if(/\d*/.test($("#code").val()) && $("#code").val().length ==4 && $("#cb").is(":checked")){
        $("#loginButton").removeClass("btn-invalid").on("click", login);
    }else{
        $("#loginButton").addClass("btn-invalid").off("click", login);
    }
}
function login(){
    var name = $("#userName").val();
    var phone = $("#phone").val();
    if(!/^1[0-9]{10}$/.test(phone)){
        alert('请填写正确的手机号！');
        return;
    }
    if($.trim(name)==""){
        alert('请填写车主姓名！');
        return;
    }else{
        if($.trim(name).length>10 || !/^[\u4e00-\u9fa5a-zA-Z]+$/.test(name)){
            alert('请输入10以内的中文或英文');
            return ;
        }
    }

    $.post("/HKCIBY/hkcVehicleOwnerInfo/newRegistHkcVehicleOwnerInfo.action",
           {phone: $("#phone").val(),
            rank: $("#code").val(),
            hkcVehicleOwnerInfoId: vehicleOwnerId,
            userName: name,
            access_token: ""},
            function (data){
                var state = data.status;
                if(state == 0){
                    $(".error").text("验证成功");
                    setTimeout(loginSuccess, 1000);                   
                }else{
                    var error = {"100":"无效车主id","101":"无效access_token","102":"手机号错误","103":"验证码错误","104":"手机号重复，请更换手机号或联系客服","999": "未知错误","105":"该手机号已被注册，请更换手机号"};
                    if(data.error_code == "100" || data.error_code == "101" || data.error_code == "999"){
                        $(".error").text("登录异常，请联系客服");
                    }else{
                        $(".error").html(error[data.error_code]);
                    }
                   
                }
            });
}
function loginSuccess(){
    if(typeof callback != "undefined"){
        callback();
        return;
    }
    if(from == "index"){
        if(vehicleId){
            window.location.href = "mycar.html?from=" + from + "&hkcVehicleOwnerInfoId="+vehicleOwnerId+"&hkcVehicleInfoId="+vehicleId;
        }else{
             window.location.href = "car_brand.html?from=" + from +"&hkcVehicleOwnerInfoId="+vehicleOwnerId+"&hkcVehicleInfoId="+vehicleId;
        } 
    }else{
        window.location.href = from + ".html?hkcVehicleOwnerInfoId="+vehicleOwnerId+"&hkcVehicleInfoId="+vehicleId;
    }
}
readyLogin();