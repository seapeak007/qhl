/*---------------------------------------------------------/

 ☀ 唐明明20151015 ☀

 /---------------------------------------------------------*/

var x;
var y;
$(document).ready(function() {
// 点击redbutton按钮时执行以下全部
	$('.redbutton').click(function() {
	// 在带有red样式的div中添加shake-chunk样式
		$('.red').addClass('shake-chunk');
		// 点击按钮每205毫秒执行以下操作
		//领取新手券测试入口
		x = setInterval('checkNew();', 1400);
		try{
			y = setTimeout('g_timeout();',4500);
		}catch(rst){
			
		}
	});
});

function g_timeout(){
	clearInterval(x);
	alert('现有优惠券已领完，请稍后领取。');
};

//车主id
var hvoi_id;

//检查是否领取过新手券测试
function checkNew() {
	//根据url获取车主id
	var src = window.location.href;
	var tag = 'hkcVehicleOwnerInfoId=';
	var tag2 = '&';
	var c = src.substring(src.indexOf(tag)+tag.length);
	var h = c.indexOf(tag2);
	if(h>-1){
		c = c.substring(0,h);
	}else{
		c = c.substring(0);
	}
	hvoi_id = c;
	var d = {access_token:'xxx',vehicle_owner_id:hvoi_id};
	$.ajax( {
		url : '/HKCIBY/api/search_coupon_new_user.action',
		type : "get",
		dataType : "json",
		data:d,
		success : function(rst) {
			if(rst.status==0){
				if(rst.data[0].result==1){
					clearInterval(x);
					clearTimeout(y);
					alert_x('您已经领取该优惠券，请不要重复领取');
					
				}else{
					getCoupon();
				}
			}else{
				clearInterval(x);
				clearTimeout(y);
				alert("领取失败");
			}
		}
	});
};

function alert_x(msg){
	var alert_html = '';
	alert_html += '<div class="alertInfo">';
	alert_html += '<div class="infoContent"><table width="100%" height="100"><tr><td>'+msg+'</td></tr></table></div>';
	alert_html += '<div class="alertOk" onclick="closeMask_x()">确认</div>';
	alert_html += '</div>';
	alert_html += '<div class="mask"></div>';	
	
	$('body').append(alert_html);
}

function closeMask_x(){
	window.history.go(-1);
}

//领取新手券测试
function getCoupon(){
	var m = {access_token:'xxx',vehicle_owner_id:hvoi_id,consum_way:1};
	$.ajax( {
		url : '/HKCIBY/api/get_coupon.action',
		type : "get",
		dataType : "json",
		data:m,
		success : function(rst) {
			if(rst.status==0){
				if(rst.count>0){
					clearInterval(x);
					clearTimeout(y);
					var code = rst.data[0].money;
					$('.coupon-money').html(code);
					$('#jump_my').attr('href','my_coupon.html?hkcVehicleOwnerInfoId='+hvoi_id);
					var end_time = rst.data[0].end_time;
					$('#end_time').html(end_time);
					show_d();
				}
			}else{
				clearInterval(x);
				clearTimeout(y);
				alert("领取失败");
			}
		}
	});
};

function show_d() {
	// 在带有red样式的div中删除shake-chunk样式
	$('.red').removeClass('shake-chunk');
	// 将redbutton按钮隐藏
	$('.redbutton').css("display", "none");
	// 修改red 下 span   背景图
	$('#hb1').css("background-image", "url(images/hb21.png)");
	// 修改red-jg的css显示方式为块
	$('.red-jg').css("display", "block");
	$('#hb2').css("display", "block");
	$('.coupon').show();
};

