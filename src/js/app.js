// Initialize your app
var myApp = new Framework7({
    preprocess: function (content, url, next) {
        }
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
    }];
    popup.sites = popup.initSites;

    // 根据init json添加导航
    function initNav(data) {
        for (var i = 0; i < popup.sites.length; i++) {
            $$(".tabs img").eq(i).attr({
                "src": popup.sites[i].icon,
                "title": popup.sites[i].name
            });
        }
    };

    initNav();

    popup.show = function(index) {
        popup.index = index;
        var site = popup.sites[index];
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
                var mediaData = $(data).find(site.media)||{};                
                if (!site.media) {
                    $$("img.item-media").hide();
                    console.log("hide");
                }
                for (var i = 0; i < times; i++) {
                    var article = {
                        title: $.trim($(parsedData[i]).text()),
                        // 这时输出的地址可能不全
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
                    if (article.href.indexOf("qdaily") !== -1){
                        article.title = $.trim($($(data).find(site.title)[i]).text())
                        console.log(article.title);
                    }

                    console.log(article.media);
                    sourceData.push(article);
                };

                toInsert(sourceData);
            }
        });

        // 插入页面
        function toInsert(data) {
            for (var i = 0; i < times; i++) {
                $$(".item-link").eq(i).attr({
                    "href": data[i].href,
                    "title": data[i].title
                });
                $("a.item-link").eq(i).text(data[i].title);
                $(".item-media").eq(i).attr("src", data[i].media);
            }
        };

    };
    // 默认载入
    popup.show(0);

    $('body').on('click', '.tabs li', function(e) {
        popup.show(0);
        console.log('click');
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
