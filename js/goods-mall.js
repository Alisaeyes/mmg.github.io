/*----------------------------------------------商品详情页：商品放大镜----start-----------------------------*/
$(document).ready(function(){
    // 图片上下滚动
    var count = $("#imageMenu li").length - 3; /* 显示 4 个 li标签内容 */
    var obj=$("#imageMenu li:first");
    //每个li容器的宽度，包括编边距值
     var interval = parseInt($(obj).width(),10)+parseInt($(obj).css("border-left-width"),10)*2+parseInt($(obj).css("margin-left"),10)+parseInt($(obj).css("padding-left"),10)*2;
    var curIndex = 0;//滑动数量初始值
    $('.scrollbutton').click(function(){
        if( $(this).hasClass('disabled') ) return false;
        
        if ($(this).hasClass('smallImgUp')) curIndex=curIndex-4;//每次滑动4张图片，单位数量为4
        else curIndex=curIndex+4;
        
        $('.scrollbutton').removeClass('disabled');
        if (curIndex == 0) $('.smallImgUp').addClass('disabled');//curIndex=0时向右滑动停止
        if (curIndex >= count+1) $('.smallImgDown').addClass('disabled');//curIndex>=count+1时，向左滑动停止

        $("#imageMenu ul").stop(false, true).animate({"marginLeft" : -curIndex*interval+ "px"}, 400);//一次滑动的距离
    });
    //点击到中号图
    var midChangeHandler = null;
    
    $("#imageMenu li img").bind("click", function(){
        if ($(this).attr("id") != "onlickImg") {
            midChange($(this).attr("src").replace("small", "mid"));
            $("#imageMenu li").removeAttr("id");
            $(this).parent().attr("id", "onlickImg");
        }
    }).bind("mouseover", function(){
        if ($(this).attr("id") != "onlickImg") {
            window.clearTimeout(midChangeHandler);
            midChange($(this).attr("src").replace("small", "mid"));
            // $(this).addClass("hover-img").parents("li").siblings().children("img").removeClass("hover-img");
            $(this).parents("li").addClass("hover-img").siblings().removeClass("hover-img");
        }
    });

    function midChange(src) {
        $("#midimg").attr("src", src).load(function() {
            changeViewImg();
        });
    }

    //大视窗看图
    function mouseover(e) {
        if ($("#winSelector").css("display") == "none") {
            $("#winSelector,#bigView").show();
        }

        $("#winSelector").css(fixedPosition(e));
        e.stopPropagation();
    }


    function mouseOut(e) {
        if ($("#winSelector").css("display") != "none") {
            $("#winSelector,#bigView").hide();
        }
        e.stopPropagation();
    }


    $("#midimg").mouseover(mouseover); //中图事件
    $("#midimg,#winSelector").mousemove(mouseover).mouseout(mouseOut); //选择器事件

    var $divWidth = $("#winSelector").width(); //选择器宽度
    var $divHeight = $("#winSelector").height(); //选择器高度
    var $imgWidth = $("#midimg").width(); //中图宽度
    var $imgHeight = $("#midimg").height(); //中图高度
    var $viewImgWidth = $viewImgHeight = $height = null; //IE加载后才能得到 大图宽度 大图高度 大图视窗高度

    function changeViewImg() {
        $("#bigView img").attr("src", $("#midimg").attr("src").replace("mid", "big"));
    }

    changeViewImg();

    $("#bigView").scrollLeft(0).scrollTop(0);
    function fixedPosition(e) {
        if (e == null) {
            return;
        }
        var $imgLeft = $("#midimg").offset().left; //中图左边距
        var $imgTop = $("#midimg").offset().top; //中图上边距
        X = e.pageX - $imgLeft - $divWidth / 2; //selector顶点坐标 X
        Y = e.pageY - $imgTop - $divHeight / 2; //selector顶点坐标 Y
        X = X < 0 ? 0 : X;
        Y = Y < 0 ? 0 : Y;
        X = X + $divWidth > $imgWidth ? $imgWidth - $divWidth : X;
        Y = Y + $divHeight > $imgHeight ? $imgHeight - $divHeight : Y;

        if ($viewImgWidth == null) {
            $viewImgWidth = $("#bigView img").outerWidth();
            $viewImgHeight = $("#bigView img").height();
            if ($viewImgWidth < 200 || $viewImgHeight < 200) {
                $viewImgWidth = $viewImgHeight = 800;
            }
            $height = $divHeight * $viewImgHeight / $imgHeight;
            // $("#bigView").width($divWidth * $viewImgWidth / $imgWidth);
            // $("#bigView").height($height);
        }

        var scrollX = X * $viewImgWidth / $imgWidth;
        var scrollY = Y * $viewImgHeight / $imgHeight;
        $("#bigView img").css({ "left": scrollX * -1, "top": scrollY * -1 });
        // $("#bigView").css({ "top": 75, "left": $(".preview").offset().left + $(".preview").width() + 15 });

        return { left: X, top: Y };
    }

});
/*----------------------------------------------商品详情页：商品放大镜----end-----------------------------*/

/*----------------------------------------------商品详情页：商品数量加减----start-------------------------*/
(function($) {
    
    $.fn.Spinner = function (opts) {
    
        var defaults = {value:1, min:1, len:3, max:99, name:"nums"}
        var options = $.extend(defaults, opts)
        var keyCodes = {up:38, down:40}
        return this.each(function() {
        
            var a = $('<a onselectstart="return false" class="add-sub-color1">-</a>');  //加
            var c = $('<a onselectstart="return false" class="add-sub-color1">+</a>');  //减
            var b = $('<input/>');f(b,1,"amount");cv(0);    //值
            
            $(this).append(a).append(b).append(c);
            a.click(function(){cv(-1)});
            b.keyup(function(){cv(0)});
            c.click(function(){cv(+1)});
            b.bind('keyup paste change',function(e){
                e.keyCode==keyCodes.up&&cv(+1);
                e.keyCode==keyCodes.down&&cv(-1);
            });
            
            function cv(n){
                b.val(b.val().replace(/[^\d]/g,''));
                b.attr("value",b.val());
                bv=parseInt(b.val()||options.min)+n;
                bv>=options.min&&bv<=options.max&&b.val(bv);
                if(bv<=options.min){b.val(options.min);f(a,2,"add-sub-color2","add-sub-color1");}else{f(a,2,"add-sub-color1","add-sub-color2");}
                if(bv>=options.max){b.val(options.max);f(c,2,"add-sub-color2","add-sub-color1");}else{f(c,2,"add-sub-color1","add-sub-color2");}
            }
            
        });

        function f(o,t,c,s){
            t==1&&o.addClass(c).attr({"value":options.value,"name":options.name,"autocomplete":"off","maxlength":options.len});
            t==2&&o.addClass(c).removeClass(s);
        }
    }
    
})(jQuery);
/*----------------------------------------------商品详情页：商品数量加减----end-------------------------*/

/*----------------------------------------------商品详情页：配送地址-----star-----------------------------*/
function SelCity(obj,e) {
    var ths = obj;
    var dal = '<div class="_citys"><span title="关闭" id="cColse" class="close-dis">×</span><ul id="_citysheng" class="_citys0"><li class="citySel ProvinceName"><b>省份</b><i></i> </li><li class="CityName"><b>城市</b><i></i> </li><li class="CountyName"><b>区县</b><i></i></li></ul><div id="_citys0" class="_citys1"></div><div style="display:none" id="_citys1" class="_citys1"></div><div style="display:none" id="_citys2" class="_citys1"></div></div>';
    Iput.show({ id: ths, event: e, content: dal,width:"470"});
    $("#cColse").click(function () {
        Iput.colse();
    });
    var tb_province = [];
    var b = province;
    for (var i = 0, len = b.length; i < len; i++) {
        tb_province.push('<a data-level="0" data-id="' + b[i]['id'] + '" data-name="' + b[i]['name'] + '">' + b[i]['name'] + '</a>');
    }
    $("#_citys0").append(tb_province.join(""));
    $("#_citys0 a").click(function () {
        var g = getCity($(this));
        $("#_citys1 a").remove();
        $("#_citys1").append(g);
        $("._citys1").hide();
        $("._citys1:eq(1)").show();
        $("#_citys0 a,#_citys1 a,#_citys2 a").removeClass("AreaS");
        $(this).addClass("AreaS");
        var lev = $(this).data("name");

        // 获取省
        // ths.value = $(this).data("name");//将省写入带有value属性的标签input
        // $(ths).html($(this).data("name"));//将省写入标签
        $("li.ProvinceName b").html($(this).data("name"));

        if (document.getElementById("hcity") == null) {
            var hcitys = $('<input>', {
                type: 'hidden',
                name: "hcity",
                "data-id": $(this).data("id"),
                id: "hcity",
                val: lev
            });
            $(ths).after(hcitys);
        }
        else {
            $("#hcity").val(lev);
            $("#hcity").attr("data-id", $(this).data("id"));
        }
        $("#_citys1 a").click(function () {
            $("#_citys1 a,#_citys2 a").removeClass("AreaS");
            $(this).addClass("AreaS");
            var lev =  $(this).data("name");
            if (document.getElementById("hproper") == null) {
                var hcitys = $('<input>', {
                    type: 'hidden',
                    name: "hproper",
                    "data-id": $(this).data("id"),
                    id: "hproper",
                    val: lev
                });
                $(ths).after(hcitys);
            }
            else {
                $("#hproper").attr("data-id", $(this).data("id"));
                $("#hproper").val(lev);
            }
            var bc = $("#hcity").val();

            // 获取市
            // ths.value = bc+ "-" + $(this).data("name");//将市写入带有value属性的标签input
            // $(ths).html(bc+$(this).data("name"));  //将市写入标签
            $("li.CityName b").html($(this).data("name"));

            var ar = getArea($(this));
            $("#_citys2 a").remove();
            $("#_citys2").append(ar);
            $("._citys1").hide();
            $("._citys1:eq(2)").show();

            $("#_citys2 a").click(function () {
                $("#_citys2 a").removeClass("AreaS");
                $(this).addClass("AreaS");
                var lev = $(this).data("name");
                if (document.getElementById("harea") == null) {
                    var hcitys = $('<input>', {
                        type: 'hidden',
                        name: "harea",
                        "data-id": $(this).data("id"),
                        id: "harea",
                        val: lev
                    });
                    $(ths).after(hcitys);
                }
                else {
                    $("#harea").val(lev);
                    $("#harea").attr("data-id", $(this).data("id"));
                }
                var bc = $("#hcity").val();
                var bp = $("#hproper").val();

                // 获取区县
                // ths.value = bc + "-" + bp + "-" + $(this).data("name");//input表单值
                $(ths).html(bc + bp+ $(this).data("name"))  ;
                $("li.CountyName b").html($(this).data("name"));
                /*
                    Iput.colse()
                    当省市区选择完之后，关闭弹出的选项卡，不用点击关闭按钮
                */
                Iput.colse();
            });

        });
    });
    $("#_citysheng li").click(function () {
        $("#_citysheng li").removeClass("citySel");
        $(this).addClass("citySel");
        var s = $("#_citysheng li").index(this);
        $("._citys1").hide();
        $("._citys1:eq(" + s + ")").show();
    });
    // 选向卡弹窗出现时，.select-city下拉框border-bottom颜色改为白色，恢复灰色在Popt.js中的colse:function(){}中
     $(".select-city").css({"border-bottom":"1px solid #fff"});
}

function getCity(obj) {
    var c = obj.data('id');
    var e = province;
    var f;
    var g = '';
    for (var i = 0, plen = e.length; i < plen; i++) {
        if (e[i]['id'] == parseInt(c)) {
            f = e[i]['city'];
            break
        }
    }
    for (var j = 0, clen = f.length; j < clen; j++) {
        g += '<a data-level="1" data-id="' + f[j]['id'] + '" data-name="' + f[j]['name'] + '" title="' + f[j]['name'] + '">' + f[j]['name'] + '</a>'
    }
    $("#_citysheng li").removeClass("citySel");
    $("#_citysheng li:eq(1)").addClass("citySel");
    return g;
}
function getArea(obj) {
    var c = obj.data('id');
    var e = area;
    var f = [];
    var g = '';
    for (var i = 0, plen = e.length; i < plen; i++) {
        if (e[i]['pid'] == parseInt(c)) {
            f.push(e[i]);
        }
    }
    for (var j = 0, clen = f.length; j < clen; j++) {
        g += '<a data-level="1" data-id="' + f[j]['id'] + '" data-name="' + f[j]['name'] + '" title="' + f[j]['name'] + '">' + f[j]['name'] + '</a>'
    }

    $("#_citysheng li").removeClass("citySel");
    $("#_citysheng li:eq(2)").addClass("citySel");
    return g;
}

Array.prototype.unique = function () {//去数组重复
    return this.sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g, "$1$2$4").replace(/,,+/g, ",").replace(/,$/, "").split(",");
}
var Iput = {
    confg: {
        hand: "0", //0对像位置1鼠标位置divID滚动位置
        idIframe: "PoPx", //默认可不用改
        idBox: "PoPy", //默认可不用改
        content: "", //传过来的内容
        ok: null, //弹出框之后执行的函数
        id: null, //不能为空一般传this对像而不是对像ID
        event: window.event, //这个必写一般为e就可以了
        top: 0, //顶部偏移位置
        left: 0, //左部偏移位置
        bodyHeight: 0, //在被position:absolute元素下得到HTML真实高度
        bodyWidth: 0,
        width: 0,
        soll: null,
        pop: null //指定ID点击时不关闭
    },
    get: function (obj) { return document.getElementById(obj); },
    lft: function (e) {
        var l = 0;
        while (e) { l += e.offsetLeft; e = e.offsetParent; }
        return l
    },
    ltp: function (e) {
        var t = 0;
        while (e) { t += e.offsetTop; e = e.offsetParent; }
        return t
    },
    clear: function () {
        Iput.confg.hand = "0"; Iput.confg.ok = null; Iput.confg.top = 0; Iput.confg.left = 0; Iput.confg.bodyHeight = 0; Iput.confg.bodyWidth = 0; Iput.confg.width = 0; Iput.confg.pop = null;
    },
    stopBubble: function (e) {
        if (e && e.stopPropagation) {
            e.stopPropagation();    //w3c
        } else {
            window.event.cancelBubble = true; //IE
        }
    },
    pop: function () {
        var $a = document.getElementsByTagName("body").item(0);
        var $c = document.createElement("iframe");
        var $b = document.createElement("div");
        $c.setAttribute('id', Iput.confg.idIframe);
        $c.setAttribute("src", "about:blank");
        $c.style.zindex = '100';
        $c.frameBorder = "0";
        $c.style.width = "0px";
        $c.style.height = "0px";
        $c.style.position = 'absolute';
        $b.setAttribute('id', Iput.confg.idBox);
        $b.setAttribute('align', 'left');
        $b.style.position = 'absolute';
        // $b.style.background = 'transparent';
        // $b.style.zIndex = '20000';//层级
        if ($a) {
            if (Iput.get(Iput.confg.idIframe)) {
                Iput.colse();
            }
            $a.appendChild($c);
            if ($c) {
                // $c.ownerDocument.body.appendChild($b);
                document.getElementById("choose-address").appendChild($b);
            }
            Iput.get(Iput.confg.idBox).innerHTML = Iput.confg.content;
            Iput.drice(Iput.confg.event);
        }

        if (!document.all) {
            window.document.addEventListener("click", Iput.hide, false);
        }
        else {
            window.document.attachEvent("onclick", Iput.hide);
        }
    },
    drice: function (e) {
        var bodyHith = Iput.confg.bodyHeight == 0 ? document.body.scrollHeight : Iput.confg.bodyHeight;
        var bodywidth = Iput.confg.bodyWidth == 0 ? document.body.scrollWidth : Iput.confg.bodyWidth;
        if (!e) e = window.event;
        var top = 0, left = 0;
        var a = Iput.get(Iput.confg.idBox);
        var b = Iput.get(Iput.confg.idIframe);
        var c = Iput.confg.id.offsetHeight;
        var d = Iput.confg.id.offsetWidth;
        var w = 0;
        var st = 0;
        var sl = 0;
        if (Iput.confg.soll != null) {
            st = document.getElementById(Iput.confg.soll).scrollTop;
            sl = document.getElementById(Iput.confg.soll).scrollLeft;
        }
        if (Iput.get(Iput.confg.idIframe)) {
            /*if (Iput.confg.hand == "1") {
                top = Iput.confg.top + document.body.scrollTop + document.documentElement.scrollTop + e.clientY;
                left = Iput.confg.left + e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                if (a.offsetHeight + top > bodyHith) { top = top - a.offsetHeight + Iput.get(Iput.confg.idBox).firstChild.offsetHeight; }
                if (a.offsetWidth + left > bodywidth) { left = left - a.offsetWidth + Iput.get(Iput.confg.idBox).firstChild.offsetWidth; }
                a.style.top = top - st + "px";
                b.style.top = top - st + "px";
                a.style.left = left - sl + "px";
                b.style.left = left - sl + "px";
            }
            else if (Iput.confg.hand == "0") {
                w = Iput.confg.id.offsetWidth + "px";
                a.style.width = w;
                b.style.width = w;
                height = c;
                top = Iput.confg.top + Iput.ltp(Iput.confg.id);
                left = Iput.confg.left + Iput.lft(Iput.confg.id);
                if (a.firstChild.offsetHeight + top + c > bodyHith) { top = top - a.firstChild.offsetHeight - c; }
                if (a.firstChild.offsetWidth + left > bodywidth) { left = left - a.firstChild.offsetWidth + d; }
                b.style.top = top - st + "px";
                a.style.top = top - st + height + "px";
                b.style.left = left - sl + "px";
                a.style.left = left - sl + "px";
            }
            else {
                height = c;
                top = Iput.confg.top - Iput.get(Iput.confg.hand).scrollTop + Iput.ltp(Iput.confg.id);
                left = Iput.confg.left - Iput.get(Iput.confg.hand).scrollLeft + Iput.lft(Iput.confg.id);

                if (a.offsetHeight + top > bodyHith) { top = top - a.offsetHeight - c; }
                if (a.offsetWidth + left > bodywidth) { left = left - a.offsetWidth - d; }

                b.style.top = top - st + height + "px";
                a.style.top = top - st + height + "px";
                b.style.left = left - sl + "px";
                a.style.left = left - sl + "px";
            }*/
                // b.style.top =25+ "px";
                // a.style.top = 25+ "px";
                // b.style.left = 0 + "px";
                // a.style.left = 0 + "px";
        }
    },
    show: function () {
        var config = arguments[0]; var that = Iput.confg;
        Iput.clear();
        for (var i in that) { if (config[i] != undefined) { that[i] = config[i]; } };
        Iput.pop();
        if (Iput.confg.ok != null) {
            Iput.action(Iput.confg.ok());
        }
    },
    colse: function () {
        if (Iput.get(Iput.confg.idIframe)) {
            // document.body.removeChild(Iput.get(Iput.confg.idBox));
            // 隐藏选项卡弹窗时，删除节点
            document.getElementById("choose-address").removeChild(Iput.get(Iput.confg.idBox))
            document.body.removeChild(Iput.get(Iput.confg.idIframe));
        }
        if (Iput.get(Iput.confg.pop)) {
            Iput.get(Iput.confg.pop).style.display = "none";
        }
        /* 选向卡弹窗隐藏时，.select-city下拉框border-bottom颜色改为灰色，设为白色在citySet.js中function SelCity(obj,e) {}的末尾*/
        $(".select-city").css({"border-bottom":"1px solid #ccc"});
        //关闭弹窗时，改变箭头方向，使之朝上
        $(".select-city i").removeClass("up-arrow").addClass("down-arrow");
    },
    $colse: function () { Iput.colse(); },
    hide: function (e) {//点击任何处关闭层
        e = window.event || e;
        var srcElement = e.srcElement || e.target;
        if (Iput.confg.event == undefined) {//输入时用,般在没传入Iput.confg.event请况下使用
            Iput.colse();
        }
        else {
            var a = Iput.confg.event.srcElement || Iput.confg.event.target;
            var b = Iput.get(Iput.confg.pop);
            if (a != srcElement) { Iput.colse(); }
            if (b != null) {
                if (b != srcElement && a != srcElement) { Iput.colse(); }
            }
        }
        if (Iput.get(Iput.confg.idIframe)) {
            Iput.get(Iput.confg.idIframe).onclick = function (e) { Iput.stopBubble(e); };
            Iput.get(Iput.confg.idBox).onclick = function (e) { Iput.stopBubble(e); };
        }
        if (Iput.get(Iput.confg.pop)) {
            Iput.get(Iput.confg.pop).onclick = function (e) { Iput.stopBubble(e); };
        }

    },
    action: function (obj) {
        eval(obj);
    },
    cookie: {
        Set: function (name, val) {
            var Days = 30;                          //此 cookie 将被保存 30 天
            var exp = new Date();                  //new Date("December 31, 9998");
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(val) + ";expires=" + exp.toGMTString() + "; path=/";
        },
        Get: function (name) {
            var start = document.cookie.indexOf(name);
            var end = document.cookie.indexOf(";", start);
            return start == -1 ? null : unescape(document.cookie.substring(start + name.length + 1, (end > start ? end : document.cookie.length)));
        },
        Del: function (name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = this.GetCookie(name);
            if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    },
    ischeck: function (bol) {
        var objs = form1.getElementsByTagName("input");
        if (bol) {
            for (var i = 0; i < objs.length; i++) { if (objs[i].type.toLowerCase() == "checkbox") { objs[i].checked = true; } }
        }
        else {
            for (var i = 0; i < objs.length; i++) { if (objs[i].type.toLowerCase() == "checkbox") { objs[i].checked = false; } }
        }
    },
    contains: function (star, end, isIgnoreCase) {
        if (isIgnoreCase) {
            star = star.toLowerCase();
            end = end.toLowerCase();
        }
        var startChar = end.substring(0, 1);
        var strLen = end.length;
        for (var j = 0; j < star.length - strLen + 1; j++) {
            if (star.charAt(j) == startChar)//如果匹配起始字符,开始查找
            {
                if (star.substring(j, j + strLen) == end)//如果从j开始的字符与str匹配，那ok
                {
                    return true;
                }
            }
        }
        return false;
    },
    gData: function (name, value) {
        var top = window.top, cache = top['_CACHE'] || {};
        top['_CACHE'] = cache;
        return value ? cache[name] = value : cache[name];
    },
    rData: function (name) {
        var cache = window.top['_CACHE'];
        if (cache && cache[name]) delete cache[name];
    }
}
/*----------------------------------------------商品详情页：配送地址------end-----------------------------*/
