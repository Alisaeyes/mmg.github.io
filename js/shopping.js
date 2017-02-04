/*   
	购物车 JavaScript
*/
var input = $(".select-commodity");
var oCommodityNum = $(".amount");
var oZj = $(".total-price b");
var nLength = $(".commodityNum b");
var allLi = $(".shopping-list-body").find("li");
var state = 0;
var oli = [];

var This = null;

//点击删除按钮，弹出弹窗
allLi.click(function(ev){
	This = $(this);
	var index = $(this).index();
	var ev = ev||window.event;
	var target = ev.target||ev.srcElement;
	
	if($(target).attr("class")=="remove-commodity fm rds cur"){
		$(".remove-popup-content-txt").html("<h4 class='core'>删除商品？</h4><p>您可以选择移到收藏，或删除商品。</p>");
		$(".remove-popup-btn1,.remove-popup-btns").show();
		removePopup();
	};
});

//删除选中的商品
$(".select-operation").click(function(){
	input.each(function(i){
		if(input[i].checked == true){
			oli.push(input.eq(i).parents("li"));
			++state;
		};
	});
	if(state==0){
		$(".remove-popup-content-txt").html("<h4 class='core'>请至少选中一件商品!</h4>");
		$(".remove-popup-btns").hide();
		removePopup();
	}else{
		$(".remove-popup-content-txt").html("<h4 class='core'>删除商品？</h4><p>您可以选择移到收藏，或删除商品。</p>");
		$(".remove-popup-btn1,.remove-popup-btns").show();
		removePopup();
		state = 0;
	};
});

//点击移到我的收藏
$(".moveCollection").click(function(){
	input.each(function(i){
		if(input[i].checked == true){
			++state;
		};
	});
	if(state==0){
		$(".remove-popup-content-txt").html("<h4 class='core'>请至少选中一件商品!</h4>");
		$(".remove-popup-btns").hide();
			removePopup();
	}else{
		$(".remove-popup-content-txt").html("<h4 class='core'>移到收藏</h4><p>移动后选中商品将不在购物车中显示。</p>");
		$(".remove-popup-btn1").hide();
		$(".remove-popup-btns").show();
		removePopup();
		state = 0;
	};
});

//关闭弹窗
$(".close-remove-popup").click(closePopup);

//初始化 购物车
oCommodityNum.each(function(i){
	var num = parseInt($(".amount").eq(i).val());
	var money = $(".shopping-list-body").find(".list-item-w2").eq(i).text();
	$(".zmoney").eq(i).html(parseFloat(num*money));//.toFixed(2)
});

//数量 +  - 计算
$(".add-sub-color1,.add-sub-color2").on("click",function(){
	addNum($(this),$(this).siblings(".amount"));
});

//输入框输入数量计算
oCommodityNum.blur(function(){
	addNum($(this));
});

//删除商品与收藏商品函数
function deleteCollection(callback){
	if(oli[0] !== undefined){
		callback&&callback(oli);
		for(var i = 0;i<oli.length;i++){
			$(oli[i]).remove();
		}
	}else{
		//This是当前这个商品元素对象
		callback&&callback(This);
		This.remove();
		This = null;
	};
	checkTrue();
	closePopup();

	//如果全选状态下商品被一个一个删除完了，就让全选按钮取消选中
	if($(".shopping-list-body li").length == 0){
		$(".select-all")[0].checked = false;
	};
};

//弹出窗函数
function removePopup(){
	$(".remove-mask,.remove-popup").show();
};

//关闭弹窗函数
function closePopup(){
	oli.length = 0;
	$(".remove-mask,.remove-popup").hide();
};

//购物车商品数量变化计算
function addNum(This,sbl){
	sbl = sbl || $(This);
	var parent = sbl.parents(".list-item-w3");
	var sibval = parseInt(sbl.val());
	var prentNodeMoney = parent.siblings(".list-item-w2").text();
	var money = parent.siblings(".list-item-w4").text(sibval*prentNodeMoney);

	if(sbl.val() <= 0){
		parent.siblings(".zmoney").text("0")
	};
	checkTrue();
};

//当复选按钮触发时选中商品，并对所有已选商品进行计算
var n = 0;
input.click(function(){
	var _this = $(this);
	if(_this[0].checked == true){
		n++;
		checkTrue();
		_this.parents("li").css("background","#f5f5f5");
	}else{
		n--;
		checkFalse($(this));
		_this.parents("li").css("background","#fff");
	};

	//判断如果所有商品是选中状态就将全选按钮设为选中，否则不选中
	if(n === input.length){
		$(".select-all")[0].checked = true;
	}else{
		$(".select-all")[0].checked = false;
	};
});

//全选，反选
$(".select-all").click(function(){
	var liLen = $(".shopping-list-body li").length;
	if(liLen == 0){
		$(this)[0].checked=false;
	}else{
		if($(this)[0].checked == true){
			input.each(function(i){
				input[i].checked = true;
				checkTrue();
				allLi.css("background","#f5f5f5");
			});
			n = input.length;
		}else{
			input.each(function(i){
				input[i].checked = false;
				checkFalse($(this));
				allLi.css("background","#fff");
			});
			n = 0;
		};
	};
});

//商品已选中函数
function checkTrue(){
	var zmoney = [];
	var num = 0;

	$(".zmoney").each(function(i){
		if(input[i].checked==true){
			num += parseFloat(oCommodityNum.eq(i).val());
			zmoney.push(parseFloat($(".zmoney").eq(i).html()));
		}
	});
	
	var zj = 0;
	for(var i = 0;i<zmoney.length;i++){
		zj += zmoney[i]
	};
	
	oZj.text(zj);//.toFixed(2)
	nLength.text(num);
};

//商品未选中函数
function checkFalse($this){
	var mony = parseFloat($this.parents("li").find(".zmoney").text());
	var nm = parseInt($this.parents("li").find(oCommodityNum).val());
	var oZjmoney = parseFloat(oZj.text()-mony); //.toFixed(2)
	var nNumber = nLength.text() - nm;

	if(nNumber<0){
		nNumber = 0;
		oZjmoney = "0.00";
	};

	oZj.text(oZjmoney);
	nLength.text(nNumber);
};