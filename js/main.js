//顶部地区定位
$(".position-item").click(function(){
	var txt = $(this).text();
	$(this).addClass('item-on').siblings().removeClass('item-on');
	$(".set-position").text(txt);
});

/**************************** Banner start ************************************/
//index Banner
var index = 0;
var bannerLi = $(".banner-item");
var bannerBtn = $(".banner-index-btn").find("span");
var zIndex = 1100;
var timer = setInterval(playBanner,3000);
var obtn = true;//定义一个开关，在当前图片切换完毕之后才能切换下一张图片

cleartimer($(".banner-index-btn,.prevBtn,.nextBtn"));

$(".prevBtn").click(function(){
	if(obtn){
		obtn = false;
		--index;
		if(index<0){
			index = bannerLi.length-1;
		};
		tabFn();
	};
});

$(".nextBtn").click(function(){
	if(obtn){
		obtn = false;
		++index;
		if(index>bannerLi.length-1){
			index = 0;
		};
		tabFn();
	};
});

bannerBtn.mouseover(function(){
	if(obtn){
		obtn = false;
		++zIndex;
		index = $(this).index();
		tabFn();
	};
});

//图片，按钮  切换函数
function tabFn(){
	bannerBtn.eq(index).addClass("on").siblings().removeClass("on");
	bannerLi.eq(index).css("zIndex",zIndex).stop(true,true).fadeIn(800,function(){
		obtn = true;
	}).siblings().stop(true,true).fadeOut(800);
};

//自动播放
function playBanner(){
	++index;
	if(index>bannerLi.length){
		index = 0;
	};
	tabFn();
};

//停止自动播放
function cleartimer(obj){
	obj.stop(true,true).hover(function(){
		clearInterval(timer);
	},function(){
		timer = setInterval(playBanner,3000);
	});
};

/**************************** Banner end ************************************/

/************************************* 分类菜单,二级栏目 start ********************************************/
//分类菜单,二级栏目
$(".nav-menu").find("li").hover(function(){
	var index = $(this).index();
	$(this).css({background:"#fff",color:"#333"}).siblings().css({background:"transparent",color:"#fff"});;
	$(this).find(".nav-menu-list a").css({background:"#fff",color:"#333"}).parent().parent().siblings().find(".nav-menu-list a").css({background:"transparent",color:"#fff"});;

	$(".wo-level-menu").eq(index).css({
		"top":45+"px"
	}).show();

	$(this).find(".level-menu-mask").css({
		"top":0,
		"right":"-2px"
	}).show();
},function(){
	$(this).css({background:"transparent",color:"#fff"});
	$(this).find(".nav-menu-list a").css({background:"transparent",color:"#fff"});

	$(".wo-level-menu").hide();
	$(this).find(".level-menu-mask").hide();
});

$(".wo-level-menu").hover(function(){
	var index = $(this).index();
	$(this).show();
	$(".nav-menu").find("li").eq(index).find(".level-menu-mask").show();
	$(".nav-menu").find("li").eq(index).css({background:"#fff",color:"#333"}).siblings().css({background:"transparent",color:"#fff"});
	$(".nav-menu").find("li").eq(index).find(".nav-menu-list a").css({background:"#fff",color:"#333"}).parent().parent().siblings().find(".nav-menu-list a").css({background:"transparent",color:"#fff"});
},function(){
	var index = $(this).index();
	$(this).hide();
	$(".nav-menu").find("li").eq(index).css({background:"transparent",color:"#fff"});
	$(".nav-menu").find("li").eq(index).find(".nav-menu-list a").css({background:"transparent",color:"#fff"});
	$(".nav-menu").find("li").eq(index).find(".level-menu-mask").hide();
});

/************************************* 分类菜单,二级栏目 end ********************************************/


/***************************** 限时抢购 start ***************************************/
//倒计时下架商品
/*
	天，时，分，秒 封装函数

	elarr  :  数组，第一个是天，第二个是时，第三个是分，第四个是秒
	end    :  活动结束的时间
	callback :  活动结束后的回调函数
 */
function countDown(elarr,endTime,callback){
	var endTime = formattingTime(endTime);

	init();
	var times = setInterval(function(){
		init();
	},500);

	//时间初始化函数
	function init(){
		var time = new Date();
		var newTime = new Date(endTime);
		var countdownTime = parseInt((newTime.getTime() - time.getTime())/1000);
		var tim = timeConversion(countdownTime);
		if(tim.day==00&&tim.time==00&&tim.branch==00&&tim.second==00){
			callback&&callback();
			clearInterval(times);
		};

		elarr[0].text(tim.day);
		elarr[1].text(tim.time);
		elarr[2].text(tim.branch);
		elarr[3].text(tim.second);
	};
};

//格式化时间
function formattingTime(str){
	return str.replace(/-/g,"/");
};

//时间转换
function timeConversion(countdownTime){
	return {
		day:timeZero(parseInt(countdownTime/86400)),//转换为天
		time:timeZero(parseInt(countdownTime%86400/3600)),//转换为时
		branch:timeZero(parseInt(countdownTime%86400%3600/60)),//转换为分
		second:timeZero(parseInt(countdownTime%60))//转换为秒
	};
};

//时间补零
function timeZero(time){
	if(time<0){
		time = 0;
	};
	if(time<10){
		return "0"+time
	}else{
		return time;
	};
};

//限时抢购

/*
	时，分，秒，毫秒 封装函数

	elarr  :  数组，第一个是时，第二个是分，第三个是秒，第四个毫秒
	end    :  活动结束的时间
	callback :  活动结束后的回调函数
 */
function flashSale(elarr,end,callback){
	end = formattingTime(end);

	limit();
	var clearTime = setInterval(function(){
		limit();
	},30);

	//限时抢购时间函数
	function limit(){
		var currentTime = new Date();
		var endTime = new Date(end);

		var countDown = parseInt((endTime.getTime()- currentTime.getTime()) / 1000);
		var newTime = timeConversion(countDown);
		
		if(newTime.time == 00&&newTime.branch== 00 &&newTime.second== 00 ){
			callback&&callback();
			clearInterval(clearTime);
		};

		elarr[0].text(newTime.time);
		elarr[1].text(newTime.branch);
		elarr[2].text(newTime.second);
		elarr[3] && elarr[3].text(newTime.millisecond);

		function timeConversion(countdownTime){
			return {
				time:timeZero(parseInt(countdownTime/3600)),//转换为时
				branch:timeZero(parseInt(countdownTime%86400%3600/60)),//转换为分
				second:timeZero(parseInt(countdownTime%60)),//转换为秒
				millisecond:timeZero(new Date().getMilliseconds())//转换为毫秒秒
			};
		};
	};
};
window.countDown = countDown;
window.flashSale = flashSale;
/***************************** 限时抢购 end ***************************************/


/************************** 猜你喜欢、加载更多 start *******************************/
var oLi = "";
var data = {
	"data":[{
		"src":"images/link1.jpg",
		"name":"轻松小熊猫甜点纱布纯棉浴巾",
		"money":"108积分"
	},{
		"src":"images/link2.jpg",
		"name":"漫威2.5英寸人物赛车套装",
		"money":"108积分"
	},{
		"src":"images/link3.jpg",
		"name":"轻松熊毛绒抱枕熊公仔懒熊",
		"money":"210积分"
	},{
		"src":"images/link4.jpg",
		"name":"轻松熊毛绒玩偶蜂蜜小熊",
		"money":"298积分"
	},{
		"src":"images/link5.jpg",
		"name":"12英寸白色情缘KT系列",
		"money":"299积分"
	},{
		"src":"images/link1.jpg",
		"name":"轻松小熊猫甜点纱布纯棉浴巾",
		"money":"108积分"
	},{
		"src":"images/link2.jpg",
		"name":"漫威2.5英寸人物赛车套装",
		"money":"108积分"
	},{
		"src":"images/link3.jpg",
		"name":"轻松熊毛绒抱枕熊公仔懒熊",
		"money":"210积分"
	},{
		"src":"images/link4.jpg",
		"name":"轻松熊毛绒玩偶蜂蜜小熊",
		"money":"298积分"
	},{
		"src":"images/link5.jpg",
		"name":"12英寸白色情缘KT系列",
		"money":"299积分"
	}]
};

$(".guess-link-more span").click(addData);

//加载更多
function addData(){
	$.each(data,function(index, data) {
		for( var i in data){
			oLi += '<li class="hot-recommend-item guess-link-list-item fl">'+
					'<a class="hot-recommend-img" href="javascript:;">'+
						'<img src="'+data[i].src+'">'+
					'</a>'+
					'<p class="hot-recommend-name ov">'+
						'<a href="javascript:;">'+data[i].name+'</a>'+
					'</p>'+
					'<span class="hot-recommend-money">'+data[i].money+'</span>'+
				'</li>';
		};
	});

	$(".guess-link-more").html("<img src='images/load.gif'>");

	setTimeout(function(){
		$(".guess-link-list").append(oLi);
		$(".guess-link-more").html("<span class='cur'>加载更多</span>");
		$(".guess-link-more span").click(addData);
	},2000);
};

/************************** 猜你喜欢、加载更多 end *******************************/

/* ****************** 注册验证 start *************************** */
//验证手机号码
$(".reg-phone").focus(function(){
	var phoneNum = /^1[3578]\d{9}$/g.test($(this).val());
	focusFn($(this),phoneNum,"请输入11位有效手机号码");
}).blur(function(){
	var phoneNum = /^1[3578]\d{9}$/g.test($(this).val());
	blurFn($(this),phoneNum,"手机号不能为空！","您输入的手机号码有误！");
});

//验证密码
$(".reg-password").focus(function(){
	var psw = /^[\w\+\-\.\,\?\:\;'"<>()=~&@#%`\[\]\{\}\!\$\^\*\|\\\/]{6,18}$/g.test($(this).val());
	focusFn($(this),psw,"密码长度须6-18位字符，可以是数字，字母或特殊符号，推荐设置字母数字符号组合。");
}).blur(function(){
	var psw = /^[\w\+\-\.\,\?\:\;'"<>()=~&@#%`\[\]\{\}\!\$\^\*\|\\\/]{6,18}$/g.test($(this).val());
	blurFn($(this),psw,"密码不能为空！","您输入的密码验证不通过！");
	var val = $(this).val();
	var $this = $(this);

	if($(".repeat-psw").val() == ""){
		return false;
	}else{
		if(val.length>=6){
			if(val === $(".repeat-psw").val()){
				passwordSuccess($this);
				passwordSuccess($(".repeat-psw"));
			}else{
				passwordError($this,$(".repeat-psw"),$(".repeat-psw"));
			};
		}else{
			states($this,"success remind","error",'remind-txt',"error-txt","密码长度须6-18位字符。");
		};
	};

});

//重复密码验证
$(".repeat-psw").focus(function(){
	var val = $(this).val();
	var $this = $(this);
	if($this.val()==""){
		states($this,"success error","remind",'error-txt',"remind-txt","请重复输入密码。");
	};
}).blur(function(){
	var val = $(this).val();
	var $this = $(this);

	if(val == ""){
		$this.attr("success","0");
		states($this,"success remind","error",'remind-txt',"error-txt","重复密码不能为空。");
	}else{
		if(val.length>=6){
			if(val === $(".reg-password").val()){
				passwordSuccess($this);
				passwordSuccess($(".reg-password"));
			}else{
				passwordError($this,$(".reg-password"));
			};
		}else{
			states($(this),"success remind","error",'remind-txt',"error-txt","密码长度须6-18位字符。");
		};
	};
});

//获取焦点，提示信息
function focusFn($this,reg,ts_text){
	if(reg){
		return false;
	}else{
		states($this,"success error","remind",'error-txt',"remind-txt",ts_text);
	};
};

//失去焦点进行验证，给予反馈
function blurFn($this,reg,nullText,errorText){
	if($this.val() == ""){
		$this.attr("success","0");
		states($this,"success remind","error",'remind-txt',"error-txt",nullText);
	}else{
		if(reg){
			//验证成功返回状态"1"至当前节点上面
			$this.attr("success","1");

			$this.siblings(".reg-prompt-icon").removeClass("error remind").addClass("success");
			$this.siblings(".reg-prompt").fadeOut(200);
		}else{
			//验证失败，返回状态"0"至当前节点上面
			$this.attr("success","0");
			if($this.val().length>=6){
				states($this,"success remind","error",'remind-txt',"error-txt",errorText);
			}else{
				states($this,"success remind","error",'remind-txt',"error-txt","密码长度须6-18位字符。");
			};
		};
	};
};

//密码验证成功
function passwordSuccess($this){
	//验证成功状态为 1
	$this.attr("success","1");
	$(".reg-password").attr("success","1");
	$this.siblings(".reg-prompt-icon").removeClass("error remind").addClass("success");
	$this.siblings(".reg-prompt").fadeOut(200);
	$(".reg-password").siblings(".reg-prompt-icon").removeClass("error remind").addClass("success");
	$(".reg-password").siblings(".reg-prompt").fadeOut(200);
};

//密码验证失败
function passwordError($this,oEl,_this){
	//验证失败状态为 0
	_this = _this||$this;
	$this.attr("success","0");
	oEl.attr("success","0");
	states(_this,"success remind","error",'remind-txt',"error-txt","您两次输入的密码不一致！");
};

var zIndex = 10;
//验证状态操作
function states($this,ic_rmClass,ic_addClass,ts_rmClass,ts_addClass,ts_text){
	++zIndex;
	//console.log(zIndex);
	$this.siblings(".reg-prompt-icon").removeClass(ic_rmClass).addClass(ic_addClass);
	$this.siblings(".reg-prompt").css("z-index",zIndex).removeClass(ts_rmClass).addClass(ts_addClass).fadeIn(200).find("p").text(ts_text);
	$this.parent().css("z-index",zIndex);
};

/* ****************** 注册验证 end *************************** */