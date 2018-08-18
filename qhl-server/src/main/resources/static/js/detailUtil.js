var detailUtil = {
    details : { "qiaopai": {"type": "jiyou", "title": "壳牌机油", "count":4},
                "cihu": {"type": "jiyou", "title": "磁护", "count":4},
                "jihu": {"type": "jiyou", "title": "极护", "count":4},
                "jinjiahu": {"type": "jiyou", "title": "金嘉护", "count":4},
                "dalishi": {"type": "jiyou", "title": "聚能大力士", "count":3},
                "HX5": {"type": "jiyou", "title": "壳牌机油", "count":4},
                "boshi": {"type": "jilv", "title": "博世滤清器", "count":5},
                "male": {"type": "jilv", "title": "马勒滤清器", "count":4},
                "suofeima": {"type": "jilv", "title": "索菲玛滤清器", "count":6},
                "manpai": {"type": "jilv", "title": "曼牌滤清器", "count":4}
                },
    htmlArray : ['<div id="idHtml">',
                    '<header class="header">',
                        '<div class="navbar">',
                            '<a onclick="hidePage()"><span>返回</span></a>',
                        '</div>',
                        'titleHtml',
                    '</header>',
                    '<div class="main-page">',
                        'imageHtml',
                    '</div>',
                '</div>'],
    help : ['<div id="help">',
                '<header class="header">',
                    '<div class="navbar">',
                        '<a onclick="hidePage()"><span>返回</span></a>',
                    '</div>',
                    '使用说明',
                '</header>',
                '<div class="main-page">',
                    '<img src="images/help1.png" width="100%"/>', 
                    '<img src="images/help2.png" width="100%"/>', 
                    '<img src="images/help3.png" width="100%"/>', 
                    '<img src="images/help4.png" width="100%"/>', 
                    '<img src="images/help5.png" width="100%"/>',
                    '<img src="images/help6.png" width="100%"/>', 
                    '<img src="images/help8.png" width="100%"/>', 
                    '<img src="images/help9.png" width="100%"/>', 
                    '<img src="images/help10.png" width="100%"/>',
                    '<img src="images/help11.png" width="100%"/>', 
                    '<div class="bottom-btn">',
                         '<input type="button" onclick="hidePage()" class="btn btn-orange btn-block btn-round" value="确定">',
                    '</div>',
                '</div>',
            '</div>'],
    toHtml: function (id){
        if(id == "help"){
            return this.help.join('');
        }
        var detail = this.details[id];
        var count = detail.count;
        var imageHtml = '';
        var html = '';

        for(var i=1; i<=count; i++){
            var name = detail.type == "jiyou" ? id + i : detail.type + '_' + id + i;
            imageHtml += '<img src="images/' + detail.type +'/'+ name + '.png">';
        }

        html = this.htmlArray.join('').replace('idHtml', id).replace('titleHtml', detail.title).replace('imageHtml', imageHtml);

        return html;
    }
} 