// Initialize your app
var myApp = new Framework7({
    preprocess: function(content, url, next) {}
});

// Export selectors engine
// var $$ = Dom7;

// Add views
var leftView = myApp.addView('.view-left', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

Template7.data['page:popup'] = function(page) {
    var popup = {};
    popup.initSites = [{
        "name": "知乎 - 最新回答",
        "icon": "http://static.zhihu.com/static/favicon.ico",
        "url": "http://www.zhihu.com/",
        "selector": ".zh-summary>a.toggle-expand",
        "isShow": true
    }, 
    {
        "name": "知乎 - 最新问题",
        "icon": "http://static.zhihu.com/static/favicon.ico",
        "url": "http://www.zhihu.com/",
        "selector": ".content>h2>a",
        "isShow": true
    }, {
        "name": "微博",
        "icon": "http://u1.sinaimg.cn/upload/h5/img/apple-touch-icon.png",
        "url": "http://m.weibo.cn/",
        "selector": {
            "text": ".weibo-detail .default-content",
            "href": ".card9"
        },    
        "isShow": true
    }, {
        "name": "Hacker News",
        "icon": "https://news.ycombinator.com/favicon.ico",
        "url": "https://news.ycombinator.com/",
        "selector": ".title>a",
        "isShow": true
    }, {
        "name": "好奇心日报",
        "icon": "http://www.qdaily.com/favicon.ico",
        "url": "http://www.qdaily.com/tags/1068.html",
        "selector": {
            text: ".com-grid-banner-article",
            media: ".imgcover>img"
        },
        "title": ".title-ribbon > h1"
    }, {
        "name": "SegmentFault",
        "url": "http://segmentfault.com/blogs",
        "icon": "http://static.segmentfault.com/global/img/touch-icon.c78b1075.png",
        "selector": ".title>a",
        "isShow": true
    }, {
        "name": "简书",
        "url": "http://www.jianshu.com/trending/now",
        "icon": "http://static.jianshu.io/assets/icon114-fcef1133c955e46bf55e2a60368f687b.png",
        "selector": "h4>a",
        "isShow": false
    }, {
        "name": "Solidot",
        "icon": "http://www.solidot.org/favicon.ico",
        "url": "http://www.solidot.org/",
        "selector": ".bg_htit>h2>a",
        "isShow": true
    }, {
        "name": "V2EX",
        "icon": "http://www.v2ex.com/static/img/icon_rayps_64.png",
        "url": "http://www.v2ex.com/?tab=hot",
        "selector": "span.item_title > a",
        "isShow": true
    }, {
        "name": "湾区日报",
        "icon": "http://wanqu.co/static/images/wanqu/favicons/favicon-32x32.png",
        "url": "http://wanqu.co/issues/",
        "selector": "li.list-group-item>a",
        "isShow": true
    }, {
        "name": "最新美剧",
        "icon": "http://cili003.com/favicon.ico",
        "url": "http://cili003.com/",
        "selector": ".w > .list-item > dd > .b > a",
        "isShow": true
    }, {
        "name": "Linux - Reddit",
        "icon": "http://ww3.sinaimg.cn/large/4e5d3ea7gw1ety7g00n3nj204g056wef.jpg",
        "url": "http://www.reddit.com/r/linux",
        "selector": "#siteTable .title.may-blank",
        "isShow": true
    }, {
        "name": "JavaScript - Reddit",
        "icon": "http://ww3.sinaimg.cn/large/4e5d3ea7gw1ety7eqg2rqj204g04ggli.jpg",
        "url": "http://www.reddit.com/r/javascript",
        "selector": "#siteTable .title.may-blank",
        "isShow": true
    }, {
        "name": "精选 - 传送门",
        "icon": "http://chuansong.me/favicon.ico",
        "url": "http://chuansong.me/select",
        "selector": "a.question_link",
        "isShow": true
    }, {
        "name": "果壳科学人",
        "icon": "http://static.guokr.com/apps/minisite/images/688fdef8.i-logo.png",
        "url": "http://www.guokr.com/scientific/",
        "selector": ".article-title"
    }, {
        "name": "虎嗅看点",
        "icon": "http://www.huxiu.com/favicon.ico",
        "url": "http://www.huxiu.com/focus",
        "selector": "h3>a"
    }, {
        "name": "PingWest快讯",
        "icon": "http://www.pingwest.com/wp-content/themes/pingwest2014/images/touch-icon.png",
        "url": "http://news.pingwest.com/",
        "selector": ".demo-wall ul a"
    }, {
        "name": "极客公园",
        "icon": "http://www.geekpark.net/icons/72x72.png",
        "url": "http://www.geekpark.net/collections/%E7%BC%96%E8%BE%91%E7%B2%BE%E9%80%89",
        "selector": ".title"
    }, {
        "name": "前端开发 - 推酷",
        "icon": "http://www.tuicool.com/favicon.ico",
        "url": "http://www.tuicool.com/topics/11000079?st=0&lang=0",
        "selector": "a.article-list-title"
    }];
    // TODO: 处理外部数据
    popup.sites = popup.initSites;

    // 根据init json添加导航
    function createLeftNav(data) {
        for (var i = 0; i < popup.sites.length; i++) {
            var string = '<li><img src=' + popup.sites[i].icon + ' title=' + popup.sites[i].name + ' data-id=' + i + '></li>';
            var imgNode = $('<div/>').html(string).contents();
            $(".tabs").append(imgNode);
        }
    };

    createLeftNav();

    popup.show = function(index) {
        popup.index = index;
        var site = popup.sites[index];
        // var site = "http://www.zhihu.com/";
        var collections = [];
        var times = 10;
        $('.view-main ul').html('');
        $('.view-main ul .preloader').show('fast');
        console.log(site.name);
        $('.view-main .sliding').text(site.name);
        console.log('show');
        if (site.name.indexOf("知乎") !== -1){
            times = 8; 
        }
        $.ajax({
            type: 'get',
            url: site.url,
            timeout: 10000,
            success: function(data) {
                // 找到选择器节点，输出链接和标题
                var parsedData = $(data).find(site.selector);
                var mediaData = $(data).find(site.selector.media) || {};

                for (var i = 0; i < times; i++) {
                    var article = {
                        title: $.trim($(parsedData[i]).text()),
                        href: $(parsedData[i]).attr("href"),
                        media: $(mediaData[i]).attr("src") || ""
                    };
                    console.log(article.title);
                    if (article.href.indexOf("http") == -1) {
                        var baseUrl = site.url.match(/http[s]?:\/\/+[\s\S]+?\//)[0].slice(0, -1);
                        if (article.href[0] != "/") {
                            baseUrl += "/"
                        }
                        article.href = baseUrl + article.href;
                        // article.media = baseUrl + article.media;
                        article.media = baseUrl + article.media;
                        // console.log(article.media);
                    };
                    if (article.href.indexOf("qdaily") !== -1) {
                        article.title = $.trim($($(data).find(site.title)[i]).text())
                        // console.log(article.title);
                    }
                    if (article.href.indexOf("zhihu") !== -1) {
                        article.title = $.trim($($(data).find(site.selector)[i]).parent().text())
                    }
                    
                    // console.log(article.media);
                    collections.push(article);
                };

                createMainList(collections);
                if (!site.selector.media) {
                    $("img.item-media").hide();
                    console.log("hide");
                }
                if (article.href.indexOf("zhihu") !== -1) {
                    $('li.card a').css({
                        'white-space': 'normal'
                    });
                }

            }
        });

        // 插入页面
        function createMainList(data) {
            for (var i = 0; i < times; i++) {
                var string = '<li class="card"><div class="card-content"><div class="card-content-inner"><a href=' + data[i].href + ' target="_blank" title="' + data[i].title + '" data-view=".view-main" class="item-link external">' + data[i].title + ' <img src=' + data[i].media + ' width="100%" class="item-media"></a></div></div></li>';
                var li = $('<div/>').html(string).contents();
                var ul = $('.view-main ul');
                ul.append(li);
                // li.appendTo(ul).show('slow');
            }
            $('.view-main ul .preloader').hide();
        };

    };
    // 默认载入
    console.log(popup.sites[2].selector.href);
    
    // popup.show(0);
    $('.tabs li').eq(0).addClass('active');

    $('body').on('click', '.tabs li', function(e) {
        $('.tabs li').removeClass('active');
        $(this).addClass('active');
        var id = $(this).children('img').attr('data-id');
        var ul = $('.view-main ul');
        popup.show(id);
    });

    $('body').on('click', 'a.item-link', function(e) {
        e.preventDefault();
        chrome.tabs.create({
            url: $(this).attr("href"),
            selected: false
        });
    });
};

Template7.data['page:popup']();