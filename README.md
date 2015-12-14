# ReadX 年轻人的热帖订阅神器

Inspired by [十阅 wtser/tenread](https://github.com/wtser/tenread/)

[Chrome扩展下载](https://github.com/cyio/ReadX/raw/master/ReadX.crx)，需手动安装。

我只是想了解下外面的世界， 
却要花很多时间切换网站， 
忍受网站的难用和大量干扰， 
越来越多的软文、二逼帖子， 
肉眼过滤，已力不从心， 
ReadX，让你翻身做主人。

特性：
1. 支持V2EX、简书、HackerNews等主流订阅源，
2. 单个订阅源最多显示10条

![](http://ww3.sinaimg.cn/bmiddle/4e5d3ea7jw1ex8pc04rq6j20gv0p5whz.jpg)


~~ReadX 信息焦虑患者的解放工具~~（原slogan）， 被认为太灰暗已放弃。

继RSS衰落、Google Reader关闭、信息大爆炸后，从各个网站获取对自己有用的信息越难了，到处充斥软广、硬广、无脑水文，在各大网站首页间穿梭备感疲惫。

“十阅”是我用过解决上述问题的最awesome的应用，Chrome必装扩展。一两分钟闲暇功夫，就可以把过去常逛网站的头条，扫描一遍。如果没有什么吸引你的title，就接着干正事。这个项目有些bug，原作者也很久不更新了。
 
ReadX支持图文混排、知乎等订阅源。

这是个新手练手项目，欢迎看官提issue赐教、拍砖。

## 工具、框架

* 样式预编译器：SCSS
* 包管理：Bower
* 自动化构建工具：fis3
* 应用框架：[Framework7](http://www.idangero.us/framework7/) + Zepto

## 其他

订阅源要求订阅内容能从HTML中获取，比如bilibili就不能。