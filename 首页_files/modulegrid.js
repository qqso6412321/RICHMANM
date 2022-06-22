function initGridGiant(ModuleID, options) {
	options = options || {};
	replaceVideo(ModuleID);
	$(document).ready(function () {
		if (options.isFloat == 1){
			ModuleGridFloat(ModuleID, options);
		}
		//有视频背景的  要根据视频高度设置分栏高度
		window['initFunc' + ModuleID] = function () {
			var bgVideo = $('#module_' + ModuleID + ' .gridBgVideo');
			if (!bgVideo.hasClass('noBgVideo')) {
				replaceVideo(ModuleID);
				if (bgVideo.find('.bgVideo').length > 0 && bgVideo.find('.bgVideo').attr('src')) {
					//resize 的时候 视频已经加载完成了 所以 进不去canplaythrough事件
					var videoH = bgVideo.height();
					$('#module_' + ModuleID).css({ height: videoH });
					//视频加载完成之后再获取高度
					$('#module_' + ModuleID + ' .gridBgVideo video.bgVideo').on('canplaythrough', function () {
						var videoH = bgVideo.height();
						$('#module_' + ModuleID).css({ height: videoH });
					})

				} else {
					$('#module_' + ModuleID).css({ height: 'auto' });
				}

			} else {
				$('#module_' + ModuleID).css({ height: 'auto' });
			}
		}
		$(window).off('resize.grid' + ModuleID).on('resize.grid' + ModuleID, function () {
			window['initFunc' + ModuleID]();
		});
		window['initFunc' + ModuleID]();

	});
}

//替换视频链接
function replaceVideo(ModuleID) {
	if (!$('#module_' + ModuleID + ' .gridBgVideo').hasClass('noBgVideo')) {
		var winWidth = $(window).width(),
			video = $('#module_' + ModuleID + ' .gridBgVideo .bgVideo');
		if (winWidth <= 769) {
			//手机端 使用图片背景 替换视频
			if (video.length > 0) {
				var videoSrc = video.attr('vsrc'),
					imageSrc = video.attr('imgsrc');
				$('#module_' + ModuleID + ' .ModuleSubContainer').css({
					'background-image': 'url("' + imageSrc + '")',
				});
				video.attr('src', '');
				$('#module_' + ModuleID + ' .gridBgVideo').hide();
			}
		} else {
			if (video.length > 0) {
				video.prop('muted', 'muted');
			}
			if (!video.attr('src')) video.attr('src', video.attr('vsrc'));
			$('#module_' + ModuleID + ' .ModuleSubContainer').css({
				'background-image': 'none',
			});
			$('#module_' + ModuleID + ' .gridBgVideo').show();
		}
	}
}
//分栏悬浮的操作
function ModuleGridFloat(ModuleID, options) {

	var grid = $('#module_' + ModuleID);
	grid.css('transition','unset')
	//window[grid] = options
	var floattop = options.floatpagetype == 0 || (window.Page == "YouZhan.SiteFront.HomeIndex" && options.floatpagetype == 1) ? options.floattop : 0;
	grid.attr("floattype", options.floattype);
	grid.attr("floattop", floattop);
	grid.attr("floatbgtype", options.floatbgtype);
	grid.attr("floatbgcolor", options.floatbgcolor);
	grid.attr("floatheight", options.floatheight);
	grid.attr("floatheighttype", options.floatheighttype);
	grid.attr("floatpagetype", options.floatpagetype);

	if (grid.length > 0) {
		// 如果是置底悬浮
		if (grid.find('.GridCanFloatBottom').length > 0) {
			// 当前是产品详情页就不显示悬浮模块
			if (!grid.parent().hasClass('BodyMain1Zone') && $('#BodyMain1Zone').find('.ModuleProductDetailGiant').length > 0) {
				grid.hide();
				return;
			}
			grid.addClass('GridFloatBottom');
			function initGridFloatBottom() {
				setTimeout(function () {
					if (window.CanDesign != "False") {
						if ($('body').find('#GridFloatBottomBox').length < 1) $('body').append('<div id="GridFloatBottomBox"></div>')
						$('#GridFloatBottomBox').css('height', ($('.GridCanFloatBottom').height() > 400 ? 400 : $('.GridCanFloatBottom').height()) + 'px');
					}
					// 窗口加载完后检测是否有底部导航，有的话，重设置底分栏的bottom
					if ($("#MobileFootNav:visible").length > 0) grid.css("cssText", "bottom:" + $("#MobileFootNav:visible").height() + "px !important");
				}, 500);
			}
			// document任何节点发生变化时触发
			$(document).on('DOMNodeInserted', function () {
				initGridFloatBottom();
			});
			initGridFloatBottom();
		} else {
			if (options.floattype == 1) {
				if (window.CanDesign != "True") {
						grid.addClass("GridFloat")
						grid.css("cssText", "top:" + floattop + "px !important;");
				}
			} else if(options.floattype == 2){	//悬浮
				if (window.CanDesign != "True") {
					grid.removeClass("GridFloat")
					grid.css("cssText","position: absolute;top:"+floattop+"px !important;z-index:300;left: 0;")
				}
			} else {
				grid.removeClass("GridFloat")
			}
			var mainOffsetTop = grid.offset().top - floattop;
			var mainHeight = grid.height();
			var winHeight = $(window).height();
			options.mainOffsetTop = mainOffsetTop
			options.mainHeight = mainHeight
			options.ModuleID = ModuleID
			options.floattop = floattop
			window['#module_' + ModuleID] = options

			//导航的特殊处理
			var navFloat = $('#module_' + ModuleID + '.GridCanFloat .ModuleNavGiant');
			var navid = '';
			if (navFloat.length > 0) {
				navid = navFloat.closest('.ModuleItem');
				navid = navid.attr('id');
			}
			$(document).off('scroll').on('scroll', function (event) {
				//if (window.CanDesign == "True")  return false
				var floatlist =  $($(event.target).find('.GridCanFloat'))
				for (let index = 0; index < floatlist.length; index++) {
					var ModuleItem = $($(floatlist[index]).closest('.ModuleItem'))
					options = window['#'+ModuleItem.attr('id')]
					//console.log(grid.attr('id'),options)
					//或者不能悬浮时 $HeaderZone
					//if ($('#module_' + ModuleID).length < 1 || $('#module_' + ModuleID + ' .GridCanFloat').length < 1) return false;
					//悬浮时 如果滚动页面 并且 二级菜单显示 要强制隐藏二级菜单
					if (navid != '') $('#' + navid + '.moduleNavFloatSubMenu').remove();
					var mainOffsetTop = options.mainOffsetTop;
					var mainHeight = options.mainHeight;
					//滚动的时候
					var winScrollTop = $(window).scrollTop();
					//找一下是否在内容区
					if(ModuleItem.parent().hasClass('BodyMain1Zone')){
						ModuleItemtmp = $($(floatlist[0]).closest('.ModuleItem'))
						optionsBody = window['#'+ModuleItem.attr('id')]
						mainHeight = optionsBody.mainHeight - mainHeight
						floatset(optionsBody,mainHeight,winScrollTop,winHeight)
						//ModuleItem.css('transition','inherit')
						if(winScrollTop > (mainOffsetTop - mainHeight)){
							if(!ModuleItem.hasClass('GridFloat')){
								floatset(optionsBody,mainHeight,winScrollTop,winHeight)
								if(options.floattype != 2) ModuleItem.addClass("GridFloat")
							}
						}else{
							if(ModuleItem.hasClass('GridFloat')){
								//恢复原来的位置
								floatset(optionsBody,optionsBody.mainHeight,winScrollTop,winHeight)
							}
						}
					}else{
						floatset(options,mainHeight,winScrollTop,winHeight)
					}
				}
			});
		}
	}
}

function floatset(options,mainHeight,winScrollTop,winHeight){
	var grid = $('#module_' + options.ModuleID);
	if (options.floattype == 1) {
		var visibility = $('#module_' +  options.ModuleID ).css('visibility')
		var nimationname = $('#module_' +  options.ModuleID).css('animation-name')
		var nimationduration = $('#module_' +  options.ModuleID).css('animation-duration')
		//到顶部的时候
		if (winScrollTop <= 0) {
			if (window.CanDesign != "True") {
				grid.addClass("GridFloat")
				grid.css("cssText", "top:" + options.floattop + "px !important;visibility:"+visibility+";animation-name:"+nimationname+";animation-duration:"+nimationduration+"");
			} else {
				grid.removeClass("GridFloat")
				if (grid.hasClass('StaticModule')) {
					grid.css('position', 'static');
				}
			}
			if (options.floatbgtype == 1) {
				$('#module_' +  options.ModuleID + ' .BodyCenter.BodyCenter' +  options.ModuleID).css('background-color', '')
			}
		} else {
			if (options.floatbgtype == 1) {
				$('#module_' +  options.ModuleID + ' .BodyCenter.BodyCenter' +  options.ModuleID).css('background-color', options.floatbgcolor)
			}
			if (window.CanDesign != "True") {
				grid.css("cssText", "top:0px !important;visibility:"+visibility+";animation-name:"+nimationname+";animation-duration:"+nimationduration+"");
			} else {
				grid.addClass("GridFloat")
				grid.css("cssText", "top:0px !important;visibility:"+visibility+";animation-name:"+nimationname+";animation-duration:"+nimationduration+"");
			}
		}
	}
	else if(options.floattype == 2){
	}
	else {
		if (!grid.hasClass('GridFloat') && (winScrollTop > (options.mainOffsetTop + mainHeight) || winScrollTop < (options.mainOffsetTop - winHeight))) {
			grid.addClass('GridFloat');
		} else if (grid.hasClass('GridFloat') && winScrollTop <= options.mainOffsetTop) {
			grid.removeClass('GridFloat');
			if (grid.hasClass('StaticModule')) {
				grid.css('position', 'static');
			}
		}
	}
}