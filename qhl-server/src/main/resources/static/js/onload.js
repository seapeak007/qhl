$(function(){
    var dealerInfoId = $.query.get("dealerInfoId");
    $.ajax({
        url:'/HKCIBY/hkcDealerInfo/queryByIdHkcDealerInfo.action',
        type:'POST',
        data:{
            'dealerInfoId':dealerInfoId
        },
        success:function(data){
            var images = data.imglist;
            /*<li><img src="images/sample.png"></li>*/
            var imgStr = '';
            var olStr = '<ol>';

            if(images.length < 1){
                imgStr = '<li><img src="images/default_wd.png"></li>';
                $(".swipe-wrap").html(imgStr);
                $("#banner_box").css({'visibility':'visible'});
                return;
            }
            for(var i=0; i< images.length; i++){
                imgStr += '<li><img src="' + images[i] + '"></li>';
                olStr += '<li></li>';
            }

            olStr += '</ol>';
            $(".swipe-wrap").html(imgStr);
            $("#banner_box").append(olStr);

            new Swipe(document.getElementById('banner_box'), {
                speed:500,
                auto:3000,
                callback: function(){
                    var lis = $(this.element).next("ol").children();
                    lis.removeClass("on").eq(this.index).addClass("on");
                }
            });

            $("#banner_box").css({'visibility':'visible'});
        }
    });
});