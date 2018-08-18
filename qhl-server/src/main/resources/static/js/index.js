var plateNo=getQueryString("plateNo");
var brands = $.query.get("brands");
var orderNumber = $.query.get("orderNumber");
var depositMoney = $.query.get("depositMoney");
var openid = $.query.get("openid");


$('.foot-nav-list a ').on('click',function(event) {
	alert(this.id);
	$(this).attr('href',this.id+'.html?palteNo=abc');
	
});


//获取url后带的参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
}





























