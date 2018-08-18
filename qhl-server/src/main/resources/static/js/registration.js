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
	                     $("#qjphone").val(data.phone);
	                 	 $("#qjvertify").val(data.code);
	                },
	            });    
	            timeCountDown();
	            var timer = setInterval(timeCountDown,1000);
	    }
	}

function initDatas(){
	
	var hkcVehicleOwnerInfoId = $.query.get("hkcVehicleOwnerInfoId")==true?"":$.query.get("hkcVehicleOwnerInfoId");
	var brandid = $.query.get("brandid")==true?"":$.query.get("brandid");
    var brandname = $.query.get("brandname")==true?"":$.query.get("brandname");
    var firmid = $.query.get("firmid")==true?"":$.query.get("firmid");
    var firmname = $.query.get("firmname")==true?"":$.query.get("firmname");
    var seriesid = $.query.get("seriesid")==true?"":$.query.get("seriesid");
    var seriesname = $.query.get("seriesname")==true?"":$.query.get("seriesname");
    var yearid = $.query.get("yearid")==true?"":$.query.get("yearid");
    var yearname = $.query.get("yearname")==true?"":$.query.get("yearname");
    var datas = $.query.get("datas")==true?"":$.query.get("datas");
   
    var brandSeriesName = $.query.get("brandSeriesName")==true?"":$.query.get("brandSeriesName");
    var typeName = $.query.get("typeName")==true?"":$.query.get("typeName");
    
    if(hkcVehicleOwnerInfoId !=""){
    	$("#hkcVehicleOwnerInfoId").val(hkcVehicleOwnerInfoId);
    }
    
    var obj = eval('(' + datas + ')');
    
    if(obj.hkcVehicleOwnerInfoId !=""){
    	$("#hkcVehicleOwnerInfoId").val(obj.hkcVehicleOwnerInfoId);
    }
    
    $("#qjphone").val(obj.qjphone);
	$("#qjvertify").val(obj.qjvertify);
    $("#name").val(obj.name);
	$("#phone").val(obj.phone);
	$("#code").val(obj.vertify);
	$("#plateNo_index").html(obj.plateNo_index);
	$("#plateNo").val(obj.plateNo);
	
	$("#car-type").attr("brand",brandname);
	$("#car-type").attr("firm",firmname);
	$("#car-type").attr("series",seriesname);
	$("#car-type").attr("year",yearid);
	$("#car-type").attr("typeName",typeName);
	$("#car-type").attr("brandSeriesName",brandSeriesName);
	
	if(!(brandid==""||"undefined"==brandid||null==brandid)){
		$("#car-type").val(brandname+"-"+seriesname);
	}
}

function checkUserByOwnerId(){
	var hkcVehicleOwnerInfoId = $.query.get("hkcVehicleOwnerInfoId")==true?"":$.query.get("hkcVehicleOwnerInfoId");
	if(hkcVehicleOwnerInfoId ==""||hkcVehicleOwnerInfoId==null||hkcVehicleOwnerInfoId=="undefined"){
		hkcVehicleOwnerInfoId = $("#hkcVehicleOwnerInfoId").val();
    }
	if(hkcVehicleOwnerInfoId ==""||hkcVehicleOwnerInfoId==null||hkcVehicleOwnerInfoId=="undefined"){
		alert('程序异常，请联系管理员！');
		return;
    }
	$.ajax({
        url: '/HKCIBY/hkcVehicleOwnerInfo/checkUserByOwnerIdHkcVehicleOwnerInfo.action',
        type: 'POST',
        dataType: 'json',
        async: false ,
        data: {
        	hkcVehicleOwnerInfoId:hkcVehicleOwnerInfoId
        },
        success: function(data) {
        	if("goIndex"==data.rtnFlag){
        		window.location.href = "index.html?hkcVehicleOwnerInfoId="+data.hkcVehicleOwnerInfoId+"&hkcVehicleInfoId="+data.hkcVehicleInfoId;
        	}
        },
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
function checkVertify(phone,code){
	var trnFlag = "1";
	$.ajax({
        url: '/HKCIBY/hkcPhoneVerificationCode/checkHkcPhoneVerificationCode.action',
        type: 'POST',
        dataType: 'json',
        async: false ,
        data: {
            phone: phone,
            rank: code
        },
        success: function(data) {
        	if("0000"==data.code){
        		trnFlag ="2";
        	}else{
        		trnFlag ="1";
        	}
        },
    });
	if(trnFlag=="2"){
		return true ;
	}else{
		return false ;
	}
	
}
function checkPlateNoAndPhone(phone,plateNo,hkcVehicleOwnerInfoId){
	var trnFlag = "1";
	$.ajax({
        url: '/HKCIBY/hkcVehicleOwnerInfo/checkPlateNoHkcVehicleOwnerInfo.action',
        type: 'POST',
        dataType: 'json',
        async: false ,
        data: {
            phone: phone,
            plateNo: plateNo,
            hkcVehicleOwnerInfoId:hkcVehicleOwnerInfoId
        },
        success: function(data) {
        	if("0000"==data.code){
        		trnFlag ="2";
        	}else{
        		trnFlag ="1";
        	}
        },
    });
	if(trnFlag=="2"){
		return true ;
	}else{
		return false ;
	}
	
}
function submitData(){
	
	var name = $("#name").val();
	var phone = $("#phone").val().replace(/\s+/g,"");
	var vertify = $("#code").val();
	var brand = $("#car-type").attr("brand");
	var firm = $("#car-type").attr("firm");
	var series = $("#car-type").attr("series");
	var year =  $("#car-type").attr("year");
	var plateNo = $("#plateNo_index").html()+ $("#plateNo").val().toUpperCase();
	var hkcVehicleOwnerInfoId = $("#hkcVehicleOwnerInfoId").val();
	var qjphone = $("#qjphone").val();
	var qjvertify = $("#qjvertify").val();
	
	var brandSeriesName =  $("#car-type").attr("brandSeriesName");
	var typeName =  $("#car-type").attr("typeName");
	
	if(null==hkcVehicleOwnerInfoId ||""==hkcVehicleOwnerInfoId ||"undefined"==hkcVehicleOwnerInfoId ){
		alert('程序异常，请联系管理员！');
		return;
	}
	
	if($.trim(name)==""||name=="车主姓名")
	{
		alert('请填写车主姓名！');
		return;
	}else{
		
		if($.trim(name).length>10){
			alert('请填写正确的车主姓名！');
			return ;
		}
	}
	
	 if (!checkphone(phone)) {
	     alert('请填写正确联系电话！');
	     return ;
	 }
//	 if(!checkVertify(phone,vertify)){
//		 alert('验证码不匹配，请填写正确的短信验证码！');
//	     return ;
//	 }
	
	plateNo = ToCDB(plateNo.replace(/\s/ig,'')) ;
	var regPartton=/^[\u4e00-\u9fa5]{1}[a-zA-Z]{1}[a-zA-Z_0-9]{5}$/;
	var regPartton1=/^[\u4e00-\u9fa5]{1}[a-zA-Z]{1}[a-zA-Z_0-9]{4}[\u4e00-\u9fa5]{1}$/;
	if(!regPartton.test(plateNo)&&(!regPartton1.test(plateNo))){
		 alert('请填写正确的车牌号！');
		return;
	}
	
	if(!checkPlateNoAndPhone(phone,plateNo,hkcVehicleOwnerInfoId)){
		 alert('车牌号已被注册！');
	     return ;
	 }
	
	if(""==brand ||"undefined"==brand ||null==brand){
		 alert('请选择车型年款！');
		return;
	}
	
	if(!$('#chek').is(':checked')){
		alert('请确认您已阅读并同意惠开车用户协议！');
		return;
	}
	
	$.ajax({
        url: '/HKCIBY/hkcVehicleOwnerInfo/registHkcVehicleOwnerInfo.action',
        type: 'POST',
        dataType: 'json',
        data: {
        	name :name ,
            phone: phone,
            brand :brand ,
            firm: firm,
            series: series,
            year :year ,
            plateNo: plateNo,
            hkcVehicleOwnerInfoId: hkcVehicleOwnerInfoId,
            brandSeriesName:brandSeriesName,
            typeName:typeName
        },
        success: function(data) {
        	var status = data.status ;
        	if(status != "1"){
        		alert('程序异常，请联系管理员！');
        	}else{
        		var openid = data.openid ;
        		var freeFlag = data.freeFlag ;//1
        		var hkcVehicleInfoId = data.hkcVehicleInfoId ;
        		var newhkcVehicleOwnerInfoId = data.hkcVehicleOwnerInfoId ;
        		if(freeFlag=="1"){
        			
        			var url1= "index.html?hkcVehicleOwnerInfoId="+newhkcVehicleOwnerInfoId+"&hkcVehicleInfoId="+hkcVehicleInfoId;
        			var url2= "serviceslist.html?hkcVehicleOwnerInfoId="+newhkcVehicleOwnerInfoId+"&hkcVehicleInfoId="+hkcVehicleInfoId;
        			alert3('确定','立即预约','恭喜您已加入全年免费保养计划！',url1,url2);
        			
        		}else{
        			
        			var url1 = "bzjadd.html?hkcVehicleOwnerInfoId="+newhkcVehicleOwnerInfoId+"&hkcVehicleInfoId="+hkcVehicleInfoId+"&openid="+openid;
        			var url2= "index.html?hkcVehicleOwnerInfoId="+newhkcVehicleOwnerInfoId+"&hkcVehicleInfoId="+hkcVehicleInfoId;
        			alert3("立即加入","暂不加入","亲~您还没有加入全年免费保养计划！",url1,url2);

//        			window.location.href="bzjadd.html?hkcVehicleOwnerInfoId="+newhkcVehicleOwnerInfoId+"&hkcVehicleInfoId="+hkcVehicleInfoId+"&openid="+openid;
        		}
        	}
        }
    }); 
	
}