$(function(){
	on_arrow();//商品列表页，品牌类型展开/折叠
	details_text_clip();//商品列表页面字符裁剪
    favourable_select(".favourable-active p");//商品详情页 优惠活动下拉框
})

/*--------------------------------收藏商品弹窗轮播--start-------------------------------*/
function collection_recommend() {
            linum = $('.collection-mainlist li').length;//图片数量
            w = linum * 120;//ul宽度
            var i=0;
            $(".collection-dot").css({"width":parseInt(linum/3)*12+"px"});
            $('.collection-mainlist').css('width', w + 'px');//ul宽度
            $('.collection_prev,.collection_next').click(function(){
                
                if(!$('.collection-mainlist').is(':animated')){
                    
                    if($('.collection-mainlist li').length>3){
                        ml = parseInt($('.collection-mainlist').css('left'));
                        btn_flog=$(this).attr("class");
                        if(ml<0&&($(this).hasClass("collection_prev"))){
                            $('.collection-mainlist').animate({left: ml + 360 + 'px'},'slow'); //向右滚动
                            i--;             
                        }else if((ml-360>-w)&&($(this).hasClass("collection_next"))){
                            $('.collection-mainlist').animate({left: ml - 360 + 'px'},'slow');//向左滚动
                            i++;
                        }
                    }
                    if(i>parseInt(linum/3)) i=parseInt(linum/3);
                    else if(i<0) i=0;
                    $(".collection-dot li").eq(i).addClass("collec-dot-selected").siblings("li").removeClass("collec-dot-selected");
                }
                
            });
            $('.collection_prev,.collection_next').hover(function(){
                    $(this).fadeTo('fast',1);
                },function(){
                    $(this).fadeTo('fast',0.4);
            })   
    }
/*--------------------------------收藏商品弹窗轮播--end-------------------------------*/

/*--------------------------------标题选项卡切换--start-------------------------------*/
function details_comment_tab(ObjSelect){
    if(ObjSelect) obj_select=ObjSelect;
    else obj_select="recommend-title-select";
    $(".recommend-title span").click(function(){
        $(this).addClass(obj_select).siblings("span").removeClass(obj_select);
        var Index=$(this).index()+1;
        $(".details-box"+Index).removeClass("dis").siblings(".details-boxs").addClass("dis");
    });
}
/*--------------------------------标题选项卡切换--end-----------------------------------*/


/*----------------------------商品列表，品牌类型展开/折叠--start---------------------------*/
function on_arrow(){
	$(".an-arrow").click(function(){
		   var vis=$(".types-brand").css("overflow-y");
			if(vis=="hidden"){
				$(".types-brand").css({height:"auto",maxHeight:"200px",overflowY:"scroll"});
				$(this).find("i").html("&#xe641;");
			}else if(vis=="scroll"){
				$(".types-brand").css({height:"60px",overflowY:"hidden"});
				$(this).find("i").html("&#xe6a3;");
			}
		});
};
/*----------------------------商品列表，品牌类型展开/折叠--end---------------------------*/


/*----------------------------列表页 评论页 缩略图左右滑动预览效果--start---------------------------*/
function img_slide_preview(settings){
   var defaults={
        li_width:40,//ul li的盒子宽度=width+margin+padding+border，不用带单位px
        view_width:240,//可显示区域宽度=$(".picbox").width()，包含ul的容器，不用带单位px
        view_li_num:6,//可显示区域显示图片数量,也就是li的数量,不包括隐藏的li
        slide_ul:".mainlist",//包含缩略图的ul列表选择器名称
        view_box:".picbox",//包含ul的div的选择器名称，也是显示区域容器
        slide_box:".boxbox",//滑动缩略图的所有元素的父元素，即滑动缩略图最外层的包含容器，这个容器包含了：所有缩略图，左右按钮，可视区域容器
        left_btn:".og_prev",//左边按钮选择器名称
        right_btn:".og_next",//右边按钮选择器名称
        slide_time:"slow",//滑动速度,可为：fast,slow 或者具体数值如1000单位为ms
        li_select:"li_click",//缩略图容器li选中状态类名，不带 " . "，仅限类名
        goods_view:".goods-view",//商品预览窗口容器选择器名称，做略图放大显示的容器
        all_slide_box:".goods-list>li",//n个商品滑动预览效果的容器是ul.goods-list，每个滑动预览效果的容器是li
        slide_view:false//是否启动预览窗口图片左右切换效果
    }
    var options=$.extend(defaults,settings); 
    
    /*
    *
    *
    *   缩略图左右滑动效果
    *
    *
    */
    if(!options.slide_view) goods_thumb_list();
    function goods_thumb_list(){
        var //obj,//当前缩略图列表
            w,//当前缩略图ul列表宽度
            ml,//当前缩略图列表左边距值
            deriction,//滑动方向
            Lbtn_flog,Rbtn_flog,//值为数值，判断当前点击的按钮里是否含有指定的类名，含有则返回>=0，没有则返回-1，赋值给变量，
            LRbutton;//左右按钮类名拼接
     
        options.left_btn=options.left_btn.replace(/(^[\s\xA0]+|[\s\xA0]+$)/g,'');
        options.right_btn=options.right_btn.replace(/(^[\s\xA0]+|[\s\xA0]+$)/g,'');
        LRbutton=options.left_btn+","+options.right_btn;

        button_change(options.li_width,options.view_li_num,LRbutton,options.hidden_btn);//缩略图图片数量>6则显示左右箭头，否则隐藏
        goods_view();//产品图预览切换

         $(LRbutton).click(function(){
                    
                if(!$(options.slide_ul).is(':animated')){//判断元素是否处于动画状态
                    obj=$(this).siblings(options.view_box).find(options.slide_ul);//查找当前被点击的ul
                    w=obj.width();//当前被点击ul的宽度（包括隐藏的部分）
                    ml = parseInt(obj.css('left'));//当前ul左边距
                    
                    Lbtn_flog=$(this).attr("class").indexOf(options.left_btn.substring(1));
                    Rbtn_flog=$(this).attr("class").indexOf(options.right_btn.substring(1));
                    if(Rbtn_flog>=0) deriction="left";
                    else if(Lbtn_flog>=0) deriction="right";
                    //向右滑动
                    if(ml<0&&deriction=="left"){
                        obj.animate({left: ml +options.view_width + 'px'},options.slide_time);
                    }
                    //向左滑动
                    if(((ml-options.view_width)>-w)&&deriction=="right"){
                        obj.animate({left: ml -options.view_width + 'px'},options.slide_time);  
                    } 
                 }
            });
         /*
            在预览窗口预览与缩略图对应的大图
            1、鼠标划过缩略图标为选中状态，其余兄弟元素设为未选中状态
            2、将预览窗口的图片地址换成与鼠标悬停缩略图的地址对应。本实例缩略图与预览图用的同一张图片，地址是相同的
         */
        function goods_view(){
            $(options.slide_ul+" li").hover(function(){
                if(!$(this).hasClass(options.li_select)){
                    $(this).addClass(options.li_select).siblings("li").removeClass(options.li_select);
                }
                var img_src=$(this).find("img").attr("src");
                $(this).parents(options.slide_box).siblings(options.goods_view).find("img").attr("src",img_src);
            });
        }
        /*
            判断缩略图列表左右按钮是否显示，并设置但前ul宽度
            参数：liWidth:ul li的盒子宽度=width+margin+padding+border
                  viewLiNum:可显示区域显示图片数量,也就是li的数量,不包括隐藏的li
                  LRbutton：左右按钮类名拼接
        */
        function button_change(liWidth,viewLiNum,LRbutton,HiddenBtn){
            $(options.all_slide_box).each(function(){
                var li_all_num=$(this).find(options.slide_ul+">li").length;//当前缩略图总数
                $(this).find(options.slide_ul).css('width', liWidth*li_all_num + 'px');//根据缩略图总的数量设置ul的宽度
                if(li_all_num<=viewLiNum) {//小于指定数值li_all_num时隐藏
                    $(this).find(LRbutton).addClass("dis");
                }else if($(this).find(options.goods_view).is(":visible")){ 
                    $(this).find(LRbutton).removeClass("dis");
                }
            });
        }
    };//goods_thumb_list()结束


/*---------评论页缩略图左右滑动、缩略图预览、预览图左右切换-------开始*/
    /*
    *
    *
    *   评论列表缩略图toggle事件，单击做略图显示隐藏预览窗口。
    *   预览图片绑定click事件，点击隐藏预览窗口
    *
    *
    */
    comment_sum_slide();
    function comment_sum_slide(){
        /*
        1、若预览窗口隐藏，则按钮隐藏,鼠标悬停于缩略图 显示放大镜+
        2、若预览窗口显示，则按钮显示，鼠标悬停于缩略图 显示放大镜-
        */
        $(".comment-view").each(function(){
            var obj=$(this).siblings(".comment-box");//对象div.comment-box
          if($(this).is(":hidden")){//判断预览窗口是否是隐藏状态
                $(obj).find(".comment-slide-box").css({"margin-left":"0"})//可视区域左边距为0
                .siblings(".comment-btn").addClass("dis");//按钮隐藏
            }else{
                $(obj).find(".comment-btn").removeClass("dis");//按钮显示
                $(obj).find(".comment-slide-box").css({"margin-left":"35px"})//可视区域左边距为35
                .find("li img").css({"cursor":"url(../images/list/zoom_out.cur),auto"});//显示放大镜-
            }
        });

        /*
            缩略图列表li绑定toggle事件
            1、预览窗口隐藏
                （1）可视区域左边距设为0
                （2）给缩略图添加左右滑动效果goods_thumb_list()
                （3）鼠标悬停于缩略图 显示放大镜+
            1、预览窗口可见
                （1）可视区域左边距设为35
                （2）给缩略图添加左右滑动效果goods_thumb_list()
                （3）鼠标悬停于缩略图 显示放大镜-
                （4）让按钮不可见
        */
        $(".comment-ul li").click(function(){
            var click_element=$(this).parents(".comment-box");
            var this_src=$(this).children("img").attr("src");
            $(this).addClass("comment-li-select").siblings("li").removeClass("comment-li-select");
            $(click_element).siblings(".comment-view").children("img").attr("src",this_src);
            if(!$(click_element).siblings(".comment-view").is(":animated")){//判断元素是否处于动画状态
                $(click_element).siblings(".comment-view").toggle("500",function(){
                    var flog=$(this).is(":hidden");
                    var cursor_url="";//自定义鼠标样式图片路径
                    if(flog) {//判断预览窗口是否隐藏
                        cursor_url="../images/list/zoom_in.cur";
                        comment_click_do(click_element,0,cursor_url,true);
                    }
                    else {
                        cursor_url="../images/list/zoom_out.cur";
                        $(this).parent(".comment-ul").css({"margin-left":"0"});
                        comment_click_do(click_element,35,cursor_url,false);
                    }
                });//toggle结束
            }
        });//$(".comment-ul li").click结束

        /*
            ClickElement：当前div.comment-box对象
            SlideLeft：可是区域左边距值
            CursorUrl：自定义鼠标样式图片路径
            isDis：是否隐藏按钮，true隐藏，false显示
        */
        function comment_click_do(ClickElement,SlideLeft,CursorUrl,isDis){
            $(ClickElement).children(".comment-slide-box").animate({"margin-left":SlideLeft+"px"},"200");
             goods_thumb_list();
             
            if(isDis) {
                $(ClickElement).children(".comment-btn").addClass("dis");
                $(ClickElement).find(".comment-ul").css({"left":"0"});//滑动列表ul左边距设置为0
            }

            $(ClickElement).find(".comment-ul").find("li img").css({"cursor":"url("+CursorUrl+"),auto"});
        }
        /*
            预览窗口绑定click事件
            1、预览窗口收起并隐藏
            2、按钮隐藏
            3、可视区域容器左边距为0
            4、所有缩略图标为未选中状态，鼠标悬停于缩略图 显示放大镜+
        */
        $(".comment-view img").click(function(){
            if(!$(this).parent(".comment-view").is(":animated")){
            $(this).parent(".comment-view").slideUp("1000").addClass("dis")//将当前预览窗口收起并隐藏
            .siblings(".comment-box").find(".comment-btn").addClass("dis")//将当前按钮隐藏
            .siblings(".comment-slide-box").animate({"margin-left":"0"},500)//将当前可视区域容器左边距为0
            .children(".comment-ul").css({"left":"0"})//滑动列表ul左边距设置为0
            .children("li").removeClass("comment-li-select")//将当前所有缩略图标为未选中状态
            .children("img").css({"cursor":"url(../images/list/zoom_in.cur),auto"});
            }
        });//$(".comment-view img").click()结束
    };


    /*
     *
     *   预览窗口图片左右切换效果
     *
    */
    if(options.slide_view) view_img_change();
    else $(".cursor-both").addClass("dis");//无左右切换效果时，左右箭头隐藏
    function view_img_change(){
         var sum_img_src="",//缩略图路径
            mleft,//ul滑动距离
            chang_src="";//下一张或者前一张图片路径
            mleft=options.li_width*options.view_li_num;//ul滑动距离
        /*
            预览窗口大图左右箭头click事件
            1、在预览窗口图片左右两边点击时，图片左右切换
            2、向右切换到可是区域最后一张时，ul向左滑动
            3、向左切换到可是区域第一张时，ul向右滑动
            4、预览窗口切换时，缩略图选中状态也切换成对应的
        */
        $(".cursor-both").click(function(){
            var view_obj=$(this).parents(".comment-view"),
                li_obj=$(view_obj).siblings(".comment-box").find(".comment-ul li"),
                view_img_src=$(this).siblings("img").attr("src"),//预览窗口图片路劲
                comment_lilength=$(li_obj).length,//ul中li总数量
                flog;//判断遍历的当前缩略图是不是选中状态

            if($(this).hasClass("cursor-left")){
                $(li_obj).each(function(i){

                    is_selected($(this));
                    if(view_img_src==sum_img_src&&i>0&&flog){
                        prev_next_view($(this),$(this).prev("li"),0,i,mleft);
                        return false;
                    }

                });
            }else if($(this).hasClass("cursor-right")){
               $(li_obj).each(function(i){

                    is_selected($(this));
                    if(view_img_src==sum_img_src&&(i<comment_lilength-1)&&flog){
                        prev_next_view($(this),$(this).next("li"),5,i,-mleft);
                        return false;
                    }

                });
            }

            /*
                判断当前被遍历的缩略图是不是选中状态
            */
            function is_selected(_this){
                sum_img_src=$(_this).children("img").attr("src");//获取当前被遍历的缩略图的路径
                flog=$(_this).hasClass("comment-li-select");
            }
            
            /*
                预览窗口图片切换
                1、改变预览窗口的图片路径为下一个或者前一个缩略图的路径
                2、判断可视区域是否需要缩略图左、右滑动
                3、把切换后的缩略图标记为选中状态
            */
            function prev_next_view(_this,prev_next,_prev_num,_i,_mleft){
                var ul_left,//ul属性left值
                    ul_left2,//ul属性left值的绝对值，保证是正数
                    prev_num;//ul往左边滑动了多少张缩略图

                ul_left=parseInt($(_this).parent(".comment-ul").css("left"));
                ul_left2=Math.abs(ul_left);
                prev_num=parseInt(ul_left2/options.li_width);

                change_src=$(prev_next).children("img").attr("src");
                $(view_obj).children("img").attr("src",change_src);
                $(prev_next).addClass("comment-li-select").siblings("li").removeClass("comment-li-select");
                if((prev_num+_prev_num)==_i){
                    if(!$(_this).parents(".comment-ul").is(":animated"))
                        $(_this).parents(".comment-ul").animate({"left":ul_left+_mleft+"px"},options.slide_time);
                }
            }
        });//$(".cursor-both").click结束
    }
/*---------评论页缩略图左右滑动、缩略图预览、预览图左右切换-------结束*/
};
/*----------------------------列表页 评论页 缩略图左右滑动预览效果--end---------------------------*/


/*-------------------字符裁剪，超过指定字符长度就进行裁剪--start-------------------------------*/
function details_text_clip(){

	goods_details_text(".goods-msg p.goods-details:not(.details-clip)",45,true,"");//商品列表页面字符裁剪
	goods_details_text(".goods-msg p.details-clip",24,true,"");//商品列表页面字符裁剪
	goods_details_text(".recommed-ul li>h3",60,true,"");//商品详情，累计评价 相关推荐列表字符裁剪
	goods_details_text(".watch-ul li a>h3",26,true,"");//商品详情，累计评价 看了又看列表字符裁剪
    goods_details_text(".goods-parameters li",40,true,"...");//商品详情 商品参数字符裁剪
    goods_details_text("ul.limit-buy-parameters li",32,true,"...");//立即抢购商品详情裁剪
    goods_details_text("ul.shop-hot li a",20,true,"...");//团队抢购，店铺热卖裁剪
    goods_details_text("ul.collection-all-list li h3 a",50,true,"");//我的收藏,所有收藏
    goods_details_text(".recommed-ul li>h3.save-title",34,true,"");//猜你喜欢h3.save-title裁剪
    /*
        obj：要裁剪的对象
        char_length:裁剪长度
        isByte：是否按字节截取
        endStr：裁剪的文本后是否接指定字符串
    */
	function goods_details_text(obj,char_length,isByte,endStr){
		$(obj).each(function(){ 
			var text=subHtml($(this).html(),char_length,true);
            var text_len= str_total_length($(this).html(),isByte);
            if(text_len>char_length) text=text+endStr;
			 $(this).html(text);
		});
	}
    /*
    *oHtml 将要截取的HTML字符串
    *isByte 是否按照字节长度计算
    */
    function str_total_length(oHtml,isByte){
        if(typeof oHtml !== "string"){
            return "";
        }
        oHtml = oHtml.replace(/(^\s*)|(\s*$)/g, "").replace(/[\r\n]/g, "");
        var oStr = oHtml.replace(/<[^<^>]*>/g, "");
        var olen = isByte ? oStr.replace(/[^\x00-\xff]/g,"**").length : oStr.length;//olen 将要截取的HTML字符串长度
        return olen;//返回字符串长度，（以字符或者字节计算）
    }
};

(function(o){
    /**
     * 判断数组中是否包含某个元素
     */
    Array.prototype.inArray = function(v){
        for(i=0; i < this.length; i++) {
            if(this[i] == v){
                return true;
            }
        }
        return false;
    }
     
    /**
     * 将HTML字符串里面的文本字符检出
     */
    o.toText = function(oHtml){
        if(typeof oHtml === "string"){
            return oHtml.replace(/(^\s*)|(\s*$)/g, "").replace(/<[^<^>]*>/g, "").replace(/[\r\n]/g, "");
        } else {
            return "";
        }
    };
     
    /**
     * 截取带HTML样式的字符串，并保留并自动补齐HTML标签
     * oHtml  将要截取的HTML字符串
     * nlen   截取后的长度，包含标签之间的空格
     * isByte 是否按照字节长度截取
     */
    o.subHtml = function(oHtml, nlen, isByte){
        var rgx1 = /<[^<^>^\/]+>/;      //前标签(<a>的href属性中可能会有“//”符号，先移除再判断)
        var rgx2 = /<\/[^<^>^\/]+>/;    //后标签
        var rgx3 = /<[^<^>^\/]+\/>/;    //自标签
        var rgx4 = /<[^<^>]+>/;         //所有标签
        var selfTags = "hr,br,img,input,meta".split(",");
        if(typeof oHtml !== "string"){
            return "";
        }
        oHtml = oHtml.replace(/(^\s*)|(\s*$)/g, "").replace(/[\r\n]/g, "");
        var oStr = oHtml.replace(/<[^<^>]*>/g, "");
        var olen = isByte ? oStr.replace(/[^\x00-\xff]/g,"**").length : oStr.length;
        if(!/^\d+$/.test(nlen) || olen <= nlen){
            return oHtml;
        }
        var tStr = oHtml;
        var index = 0;
        var matchs = new Array();
        while(rgx4.test(tStr)){
            var m = new Object();
            m.index = index + tStr.search(rgx4);
            m.string = tStr.match(rgx4).toString();
            var len = tStr.search(/<[^<^>]+>/)+tStr.match(/<[^<^>]+>/)[0].length;
            tStr = tStr.substr(len);
            index += len;
            matchs.push(m);
        }
        if(isByte){
            var i=0;
            for(var z = 0; z < oStr.length; z++){
                i += (oStr.charCodeAt(z) > 255) ? 2 : 1;
                if(i >= nlen){
                    tStr=oStr.slice(0,(z + 1));
                    break;
                }
            }
        } else {
            tStr = oStr.substr(0, nlen);
        }
        var startTags = new Array();
        for(var i = 0; i < matchs.length; i++){
            if(tStr.length <= matchs[i].index){
                //tStr += matchs[i].string;
                matchs = matchs.slice(0, i);
                break;
            } else {
                tStr = tStr.substring(0, matchs[i].index) + matchs[i].string + tStr.substr(matchs[i].index);
                if(rgx1.test(matchs[i].string.replace(/(\/\/)/g, ""))){
                    var name = matchs[i].string.replace(/[<>]/g, "").split(" ");
                    if(name.length > 0){
                        name = name[0];
                        if(!selfTags.inArray(name)){
                            startTags.push(name);
                        }
                    }
                } else if(rgx2.test(matchs[i].string)){
                    var name = matchs[i].string.replace(/[<\/>]/g, "");
                    if(startTags.length > 0 && startTags[startTags.length - 1] === name){
                        startTags.pop();
                    }
                }
            }
        }
        if(startTags.length > 0){
            for(var i = startTags.length - 1; i >=0; i--){
                tStr += '</' + startTags[i] + '>';
            }
        }
        return tStr;
    }
}(window));
/*----------------字符裁剪，超过指定字符长度就进行裁剪--end---------------------*/


/*----------------商品详情页 优惠活动下拉框------start---------------*/
function favourable_select(obj){
    var arrow_direction=$(obj).find("i");//方向箭头元素
    // 单击元素显示选项列表
   $(obj).click(function(){
        $(this).siblings("dl.favourable-dl").removeClass("dis");//显示选项列表
        remove_add_class(arrow_direction,"down-arrow","up-arrow");//方向箭头向下
    });
   // 选项列表单击、悬停事件
    $("dl.favourable-dl dd").hover(function(){
            $(this).not(".dd-select").append("<i></i>");//添加节点i
        },function(){
            $(this).not(".dd-select").children("i").remove();//删除节点i
    }).click(function(){
        remove_add_class(arrow_direction,"up-arrow","down-arrow");//方向箭头向上
        $(this).addClass("dd-select").siblings("dd").removeClass("dd-select").children("i").remove();//被点击元素为选中状态并删除节点i
        $(this).parent("dl").addClass("dis");//隐藏选项列表
    });
    // 删除并添加类
     function remove_add_class(obj,remove_class,add_class){
        $(obj).removeClass(remove_class).addClass(add_class);
     }
}
/*----------------商品详情页 优惠活动下拉框------end---------------*/