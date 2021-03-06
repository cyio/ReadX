// Initialize your app
var myApp = new Framework7({
    init: false
});

// myApp作为域
(function(context){

    // Export selectors engine
    var $$ = Dom7,
        listItemHandler,
        listItems,
        isWideScreen,
        isDark,
        mySite;
    
    // Add views
    var leftView = myApp.addView('.view-left', {
        // Because we use fixed-through navbar we can enable dynamic navbar
        dynamicNavbar: true
    });
    var mainView = myApp.addView('.view-main', {
        // Because we use fixed-through navbar we can enable dynamic navbar
        dynamicNavbar: true
    });
    
    myApp.init();
    
    // 必须手动路由加载
    mainView.router.loadPage('popup.html');
    // mainView.router.back();

    Template7.data['page:popup'] = function(data) {
        var popup = {};
        popup.initSites = [ {
            "name": "知乎 - 最新问题",
            "icon": "http://static.zhihu.com/static/favicon.ico",
            "url": "http://www.zhihu.com/",
            "selector": ".content>h2>a",
            "isShow": true
        }, {
            "name": "知乎 - 最新回答",
            "icon": "http://static.zhihu.com/static/favicon.ico",
            "url": "http://www.zhihu.com/",
            "selector": ".zh-summary>a.toggle-expand",
            "isShow": true
        }, {
            "name": "Hacker News",
            "icon": "https://news.ycombinator.com/favicon.ico",
            "url": "https://news.ycombinator.com/",
            "selector": ".title>a",
            "isShow": true
        }, {
            "name": "简书",
            "url": "http://www.jianshu.com/trending/now",
            "icon": "http://static.jianshu.io/assets/icon114-fcef1133c955e46bf55e2a60368f687b.png",
            "selector": "h4>a",
            "isShow": false
        }, {
            "name": "V2EX",
            "icon": "http://www.v2ex.com/static/img/icon_rayps_64.png",
            "url": "http://www.v2ex.com/?tab=hot",
            "selector": "span.item_title > a",
            "isShow": true
        }, {
            "name": "前端开发 - 推酷",
            "icon": "http://www.tuicool.com/favicon.ico",
            "url": "http://www.tuicool.com/topics/11000079?st=0&lang=0",
            "selector": "a.article-list-title"
        }];
        // TODO: 处理外部数据
        // popup.sites = popup.initSites;
        popup.sites = JSON.parse(localStorage.getItem("sites")) || [];
        if (popup.sites.length == 0) {
            popup.sites = popup.initSites;
            localStorage.setItem("sites", JSON.stringify(popup.sites));
        }

        function createLeftNav(data) {
            for (var i = 0; i < popup.sites.length; i++) {
                var string = '<li><div class="item-content"><div class="item-media"><img src=' + popup.sites[i].icon + ' title=' + popup.sites[i].name + ' data-id=' + i + '></div></div><div class="sortable-handler"></div></li>'
                var navNode = $('<div/>').html(string).contents();
                // console.log(navNode);
                $(".left-nav").append(navNode);
            }

            localStorage.setItem('nav', $(".left-nav").html());
        };

        var navList = localStorage.getItem('nav');

        // 导航：非首次运行时，从缓存中加载
        if (navList) {
            if ($(".left-nav li").length > 3) return;
            $(".left-nav").append(navList);
            console.log($(".left-nav img"));
            var dataID = $(".left-nav img").attr("data-id");
            localStorage.setItem('dataID', dataID);

            isWideScreen = localStorage.getItem("isWideScreen");
            if (isWideScreen === "true") {
                $("body").addClass('w-800');
                $('#isWideScreen').click();
            }
            isDark = localStorage.getItem("isDark");
            if (isDark === "true") {
                $("body").addClass('layout-dark');
                $('#isDark').click();
            }
        } else {
            createLeftNav();
        }

        // 导航：支持并记忆用户手动排序
        $$('.toggle-sortable').on('click', function() {
            if ($$('.toggle-sortable').attr("open") == "true") {
                localStorage.setItem('nav', $(".left-nav").html());
                var navList = localStorage.getItem('nav');
                $$('.toggle-sortable').attr("open", false);
                $$('.left-nav li').removeClass('onsort');
            } else {
                $$('.toggle-sortable').attr('open', true);
                $$('.left-nav li').addClass('onsort');
            }
        });

        popup.show = function(index) {
            popup.index = index;
            var site = popup.sites[index];
            // var site = "http://www.zhihu.com/";
            var collections = [];
            var times = 10;
            $('.view-main ul').html('');
            $('.view-main ul .preloader').show();
            // console.log(site.name);
            $('.view-main .sliding').text(site.name);
            console.log('show');

            $.ajax({
                type: 'get',
                url: site.url,
                timeout: 10000,
                success: function(data) {
                    // 找到选择器节点，输出链接和标题等
                    //console.log(data);
                    var parsedData = $(data).find(site.selector);
                    console.log(parsedData);
                    var mediaData = $(data).find(site.media) || {};

                    // 去除知乎问题中的重复项，并对个别订阅源作条目限制
                    if (site.name.indexOf("最新回答") !== -1) {
                        times = 5;
                    } else if (site.name.indexOf("ONE") !== -1) {
                        times = 9;
                    } else if (site.name.indexOf("最新问题") !== -1) {
                        parsedData = unique(parsedData);
                    }

                    for (var i = 0; i < times; i++) {
                        // console.log("ajax: " + i + parsedData);
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
                            article.media = baseUrl + article.media;
                        };
                        console.log("debug: " + article.media);
                        // 部分订阅源需要单独指定文章标题
                        if (article.href.indexOf("qdaily") !== -1) {
                            article.title = $.trim($($(data).find(site.title)[i]).text())
                        }
                        if (article.href.indexOf("wufazhuce") !== -1) {
                            article.title = $.trim($($(data).find(site.title)[i]).text())
                        }
                        if (article.href.indexOf("zhihu") !== -1) {
                            article.title = $.trim($(parsedData[i]).parent().text())
                        }

                        // console.log(data);
                        collections.push(article);
                    };

                    createMainList(collections);

                    if (!site.media) {
                        $("img.item-media").hide();
                    }
                    if (site.name.indexOf("最新回答") !== -1 || site.name.indexOf("ONE - 图片") !== -1) {
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
                // rotate('left');
            };

        };

        // 打开应用时，加载第一个订阅源
        var listInit = function() {
            if ($('.view-main ul li').length > 3) return;
            var dataID = localStorage.getItem('dataID') || "1";
            //console.log("ID" + dataID);
            popup.show(dataID);
            $('.left-nav li').eq(dataID).addClass('active');
        }();

        $('body').on('click', '.left-nav li', function(e) {
            $('.left-nav li').removeClass('active');
            $(this).addClass('active');
            var id = $(this).find('img').attr('data-id');
            var ul = $('.view-main ul');
            popup.show(id);
        });

        // 设定后台打开链接
        // 必须委托绑定，否则 chrome.tabs 设定会失效
        $('body').off('click', '.card a.item-link', listItemHandler);
        listItemHandler = function(e) {
            e.preventDefault();
            chrome.tabs.create({
                url: $(this).attr("href"),
                selected: false
            });
        };
        $('body').on('click', '.card a.item-link', listItemHandler);

        // 滚动时，隐藏上方navbar，并显示gotop按钮
        $(".view-main .page-content").on("scroll", function(e) {
            $(this).scrollTop() >= 100 ? $$(".view-main .navbar").hide(800) : $$(".view-main .navbar").show(800);
            $(this).scrollTop() >= 200 ? $$('.gotop').show(400) : $$('.gotop').hide(400);
        });
        // var result = {
        //     id: 'fi'
        // };
        // result.id = "popup";
        // return result;
    };

    $(document).on('pageInit', function(e) {
        // Get page data from event data
        var page = e.detail.page;

        if (page.name === 'popup') {
            // Following code will be executed for page with data-page attribute equal to "about"
            //myApp.alert('Here comes About page');
            Template7.data['page:popup']();
        }
    })
    
    myApp.onPageInit('popup', function (page){
        console.log('page init ' + page.name);
        console.log('page context ' + page.context);
        
        new Vue({
            el: '#main',
            data: {
                message: 'Hello Vue.js!'
            }
        })
    })

    function rotate(direction) {
        var dire = 'rotate-' + direction
        $('.list-block ul li').addClass(dire);
    }

    function cacheCurrent() {
        var dataID = $(".left-nav img").attr("data-id");
        listItems = $(".view-main ul").html();
        localStorage.setItem('listItems', listItems);
    }

    $('body').on('touchstart click', '.gotop', function() {
        $$('.view-main .page-content').scrollTop(0, 800);
    });

    function unique(array) {
        var n = [];
        var m = [];
        for (var i = 0; i < array.length; i++) {
            var title = $.trim($(array[i]).text());

            if (m.indexOf(title) == -1) {
                m.push(title);
                n.push(array[i]);
                // console.log(m);
            };
        }
        return n;
    }

    function getOptionList() {
        var optionList = {};
        optionList.domain = 'http://git.oschina.net/cyio/tenread/raw/master/data/';
        $$.getJSON(optionList.domain + 'catalog.json', function(d) {
            optionList.catalogs = d;
            optionList.slug = d[0].slug;
            //console.log(optionList.slug);
        });

        optionList.show = function(slug) {
            optionList.slug = slug;
            $$.getJSON(optionList.domain + slug + '.json', function(d) {
                optionList.currentSites = d;
            });
        };
    };

    getOptionList();

    $('#isWideScreen').click(function() {
        myApp.closePanel();

        if (this.checked) {
            $("body").addClass('w-800');
        } else {
            $("body").removeClass('w-800');
        }
        // myApp.alert(this.checked);
        localStorage.setItem("isWideScreen", this.checked);
    });

    $('#isDark').click(function() {
        myApp.closePanel();

        if (this.checked) {
            $("body").addClass('layout-dark');
        } else {
            $("body").removeClass('layout-dark');
        }

        localStorage.setItem("isDark", this.checked);
    });

    $('#submit').click(function() {
        myApp.closePanel();
        var val = $('#addSite').val()
        site = localStorage.getItem("mySite");
        if (val) {
            site = val;
            localStorage.setItem("mySite", site);
        } else if (!site) {
            myApp.alert('input');
        }
        var siteNode = '<iframe src=' + site + '></iframe>'
        $(".view-main .page-content").replaceWith(siteNode);
        $('.view-left').hide();
        $('.view-main .navbar').hide();
        $('.view-main').css('width', '100%');
        // $('.navbar').css('background', 'transparent').css('background-image', '-webkit-gradient(linear, 0% 0%, 0% 100%, from(rgba(76, 76, 76, 0.5)), to(rgba(50, 205, 104, 0.1))) transparent;');
        // $('.main-title').text("");
    });
    
    var optionListHandler = function(){
        var optionList = {};
        optionList.domain = 'http://git.oschina.net/cyio/tenread/raw/master/data/';      
        optionList.sites = JSON.parse(localStorage.getItem("sites")) || [];
        optionList.show = function(slug){
            optionList.slug = slug;
            $$.getJSON(optionList.domain + slug + '.json', function (d) {
                console.log(d);
                optionList.currentSites = d;
            });
            
        };
        optionList.subscribe = function(){};
        
        $$.getJSON(optionList.domain + 'catalog.json', function (d) {
            console.log(d);
            optionList.catalogs = d;
            optionList.slug = d[0].slug;
            optionList.show(optionList.slug);
        });
    };
    console.log();
    optionListHandler();
})(myApp);