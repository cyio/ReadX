// Initialize your app
var myApp = new Framework7({
    preprocess: function(content, url, next) {}
});

// Export selectors engine
var $$ = Dom7;

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
        "name": "知乎",
        "icon": "http://static.zhihu.com/static/favicon.ico",
        "url": "http://www.zhihu.com/",
        "selector": ".content>h2>a",
        "isShow": true
    }, {
        "name": "hacker news",
        "icon": "https://news.ycombinator.com/favicon.ico",
        "url": "https://news.ycombinator.com/",
        "selector": ".title>a",
        "isShow": true
    }, {
        "name": "好奇心日报",
        "icon": "http://www.qdaily.com/favicon.ico",
        "url": "http://www.qdaily.com/tags/1068.html",
        "selector": ".com-grid-banner-article",
        "media": ".imgcover>img",
        "title": ".title-ribbon > h1"
    }, {
        "name": "segmentfault",
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
        "name": "solidot",
        "icon": "http://www.solidot.org/favicon.ico",
        "url": "http://www.solidot.org/",
        "selector": ".bg_htit>h2>a",
        "isShow": true
    }, {
        "name": "v2ex",
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
        "name": "国际纵览 - 纽约时报中文网",
        "icon": "http://d2qpqq35l60wq5.cloudfront.net/favicon.ico",
        "url": "http://d2qpqq35l60wq5.cloudfront.net/",
        "selector": ".nytcn_headline a",
        "isShow": true
    }, {
        "name": "精选 - 传送门",
        "icon": "http://chuansong.me/favicon.ico",
        "url": "http://chuansong.me/select",
        "selector": "a.question_link",
        "isShow": true
    }];
    popup.sites = popup.initSites;

    // 根据init json添加导航
    function initNav(data) {
        for (var i = 0; i < popup.sites.length; i++) {
            var string = '<li><img src=' + popup.sites[i].icon + ' title=' + popup.sites[i].name + ' data-id=' + i + '></li>';
            var img = $('<div/>').html(string).contents();
            $(".tabs").append(img);
        }
    };

    initNav();

    popup.show = function(index) {
        popup.index = index;
        var site = popup.sites[index];
        console.log(index);
        console.log(site);
        // var site = "http://www.zhihu.com/";
        var sourceData = [];
        var times = 10;

        $$.ajax({
            type: 'get',
            url: site.url,
            timeout: 10000,
            success: function(data) {
                // 找到选择器节点，输出链接和标题
                var parsedData = $(data).find(site.selector);
                var mediaData = $(data).find(site.media) || {};

                for (var i = 0; i < times; i++) {
                    var article = {
                        title: $.trim($(parsedData[i]).text()),
                        href: $(parsedData[i]).attr("href"),
                        media: $(mediaData[i]).attr("src") || ""
                    };
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
                        console.log(article.title);
                    }

                    console.log(article.media);
                    sourceData.push(article);
                };

                toInsert(sourceData);
                if (!site.media) {
                    $$("img.item-media").hide();
                    console.log("hide");
                }
            }
        });

        // 插入页面
        function toInsert(data) {
            $('.view-main ul').html('');
            for (var i = 0; i < times; i++) {
                var string = '<li class="card"><div class="card-content"><div class="card-content-inner"><a href=' + data[i].href + ' target="_blank" title="' + data[i].title + '" data-view=".view-main" class="item-link external">' + data[i].title + ' <img src=' + data[i].media + ' width="100%" class="item-media"></a></div></div></li>';
                var li = $('<div/>').html(string).contents();
                var ul = $('.view-main ul');
                ul.append(li);
                // li.appendTo(ul).show(400);
            }
            $('.view-main ul .preloader').hide();
        };

    };
    // 默认载入
    popup.show(0);

    $('body').on('click', '.tabs li', function(e) {
        var id = $(this).children('img').attr('data-id');
        // console.log('id'+id);
        var ul = $('.view-main ul');
        console.log(ul.children());
        // ul.remove(ul.children());
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
