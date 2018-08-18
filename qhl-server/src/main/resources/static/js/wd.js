var vehicleOwnerId=getGetPar("hkcVehicleOwnerInfoId");
var vehicleId =getGetPar("hkcVehicleInfoId");
var nowVehicleId =getGetPar("nowVehicleInfoId");
var openId =getGetPar("openId");
var carPlateNo = decodeURI(getGetPar("carPlateNo"));

var plateNo= getGetPar("plateNo");
var lock = true;
// 保存未开通保养卡网点
function addDealerCode(dealerCode){
    $.ajax({
        type : "POST",
        url : "/HKCIBY/hkcDepositDealerInfo/addHkcDepositDealerInfo.do",
        data:{'hkcDepositDealerInfo.dealerCode':dealerCode},
        success : function(msg) {
            if(msg!=null){
            }
        }
    });
}

//根据网点编号判断是否授权
function getOrgName(dealerCode){ 
    $.ajax({
        type : "POST",
        async: false ,
        url : "/HKCIBY/hkcDealerInfo/checkRecommendCodeHkcDealerInfo.action",
        data:{'recommend_code':dealerCode},
        success : function(data) {
            if(data.status == "0"){
                saveWD(dealerCode, data.dealerInfoId, data.dealerName);
            }else if(data.status=="1" && data.error_code=="104"){ 
                addDealerCode(dealerCode);
                alert('很抱歉，未授权此网点销售保养卡，请重新输入！');
            }else if(data.status == "1" && data.error_code == "103"){
                alert("无效网点代码");
            }else{
                alert("程序异常，请稍后重试");
            }
        }
    });
}
function bindWD(){
    var dealerCode=$('#dealerCode').val();
    var regParttonNo=/^\d{7}$/;
    if(dealerCode==''||dealerCode==null){
          hidePage();
    }else{
        if(!regParttonNo.test(dealerCode)){
            alert('您输入网点代码不存在，请重新输入');
            return;
        }
        getOrgName(dealerCode);      
    }        
}
function saveWD(dealerCode, dealerInfoId, dealerName){
    if(dealerCode!=''&&dealerCode!=null){
        $.ajax({
            type : "POST",
            url : "/HKCIBY/hkcCustomerDepositInfo/bindDealerHkcCustomerDepositInfo.action",
            data: {"vehicle_owner_id": vehicleOwnerId,
                   "vehicle_info_id": nowVehicleId ? nowVehicleId : vehicleId,
                   "dealer_code": dealerCode,
                   "dealer_name": dealerName,
                   "dealer_info_id": dealerInfoId,
                   "car_plate_number": carPlateNo
            },
            success : function(data) {
                if(data.status == "0"){
                    alert('绑定网点成功！');
                    if(callback){
                        callback();
                        return;
                    }
                    $(".bottom-gray").hide();
                    hidePage();
                }else{
                    alert("程序异常，请稍后重试");              
                } 
            },
            error: function(){
                //请求出错处理    
            } 
        });
    }else{
//      alert("车牌号为空！");
    }
}