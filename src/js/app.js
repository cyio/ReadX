// Initialize your app
var myApp = new Framework7({
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
    }];
    popup.sites = popup.initSites;


    popup.show = function(index) {
        popup.index = index;
        var site = popup.sites[index];
        console.log(site);
        // var site = "http://www.zhihu.com/";
        var sourceData = [];
        var times = 13;

        $$.ajax({
            type: 'get',
            url: site.url,
            timeout: 10000,
            success: function(data) {
                var parsedData = $(data).find(site.selector);
                for (var i = 0; i < times; i++) {
                    var article = {
                        title: $.trim($(parsedData[i]).text()),
                        // 这时输出的地址可能不全
                        href: $(parsedData[i]).attr("href")
                    };
                    if (article.href.indexOf("http") == -1) {
                        var baseUrl = site.url.match(/http[s]?:\/\/+[\s\S]+?\//)[0].slice(0, -1);
                        if (article.href[0] != "/") {
                            baseUrl += "/"
                        }
                        article.href = baseUrl + article.href;
                    };

                    console.log(article.href);
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
            }
        };
    };
    popup.show(0);
    $$('body').on('click', '.tabs li', function(e) {
        popup.show(0);
        console.log('click');
    });
    $$('body').on('click', 'a.item-link', function(e) {
        e.preventDefault();
        chrome.tabs.create({ url: $(this).attr("href"), selected:false });
    });
};

Template7.data['page:popup']();
