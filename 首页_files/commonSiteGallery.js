function initCommonSiteGalleryGiant(moduleId, layout, option,isclick, forlay) {
    //swiper组件有缺陷，当放在display=none的容器中时，初始化会有问题，导致无法正常工作，在我们系统中，在此模块可能会放在
    //标签模块中，当某标签默认不显示时，swiper就会无法工作，所以都要加上 window["initSwiperFunc" + moduleId] 这个函数，以
    //便在全局中可以遍历 window 对象，对 swiper 进行重新初始化；目前，在 jscript.js 中的 initModuleTabContainer() 方法中对标签模块所以处理，其它的暂时未处理，后面看情况酌情处理
    //请copy以下句子进入--window["initSwiperFunc" + moduleId] = function(){initCommonSiteGalleryGiant(moduleId, layout, option,isclick)};
    if($.inArray(layout,['101','104','102']) > -1){
        isIE(moduleId)
    }

    if (window["initSwiperFunc" + moduleId] && parseInt(layout) == 102 && !forlay) {

        return false
    }

    window["initSwiperFunc" + moduleId] = function(){
        // 可能是执行速度太快了，没初始化到高度
        setTimeout(function(){
        initCommonSiteGalleryGiant(moduleId, layout, option,isclick,false)
        })
    };
    var moduleIdSelector = "#module_" + moduleId;
    if($.inArray(layout,['101','104','107','108','105']) > -1){
        var IsExpandDir = option.IsExpandDir;
        // console.log(option,IsExpandDir,11)
        loadStyleSheet('/scripts/wookmark/css/lightgallery.min.css');
        addScript('/scripts/wookmark/lightgallery.js',function(){
            addScript('/scripts/wookmark/lg-fullscreen.min.js');
            addScript('/scripts/wookmark/lg-thumbnail.min.js');
            addScript('/scripts/wookmark/lg-zoom.min.js');
            $(moduleIdSelector + ' .gallery-list').imagesLoaded(function(){
                $(moduleIdSelector + ' .gallery-list').masonry({
                    itemSelector: '.grid-item',
                    fitWidth:true
                });
            });
            //等于0是加载的
            if(IsExpandDir == 0){
                getimagelist(moduleIdSelector);
                window["initFunc" + moduleId] = function(option){
                    resetHeight(moduleIdSelector,layout);
                    option = option || '';
                    var newitems = option.newitems || '';
                    if(typeof($(moduleIdSelector + ' .gallery-list').data('lightGallery')) != 'undefined'){
                        $(moduleIdSelector + ' .gallery-list').data('lightGallery').destroy(true);
                    }
                    $(moduleIdSelector + ' .gallery-list').lightGallery({
                        showThumbByDefault:false,
                        download:true,
                        thumbnail: true,
                        fullScreen:false
                    });
                    $(moduleIdSelector + ' .gallery-list').imagesLoaded(function () {
                        $(moduleIdSelector + ' .gallery-list').masonry('appended', newitems);
                    });
                    getimagelist(moduleIdSelector);
                }
            }else{
                if(isclick == 0){
                    $(moduleIdSelector + ' .gallery-list').lightGallery({
                        showThumbByDefault:false,
                        download:true,
                        thumbnail: true,
                        fullScreen:false
                    });
                }
                window["initFunc" + moduleId] = function(option){
                    resetHeight(moduleIdSelector,layout);
                    option = option || '';
                    var newitems = option.newitems || '';
                    if(typeof($(moduleIdSelector + ' .gallery-list').data('lightGallery')) != 'undefined'){
                        $(moduleIdSelector + ' .gallery-list').data('lightGallery').destroy(true);
                    }
                    if(isclick == 0){
                        $(moduleIdSelector + ' .gallery-list').lightGallery({
                            showThumbByDefault:false,
                            download:true,
                            thumbnail: true,
                            fullScreen:false
                        });
                    }
                    $(moduleIdSelector + ' .gallery-list').imagesLoaded(function () {
                        if(newitems){
                            $(moduleIdSelector + ' .gallery-list').masonry('appended', newitems);
                        }
                        $(moduleIdSelector + ' .gallery-list').masonry('layout');
                    });
                }
            }
            resetHeight(moduleIdSelector,layout);
        });

    }
    if(layout=='102'){
        Phonlayout102(moduleId,isclick);
        window["initFunc" + moduleId] = function(){
            Phonlayout102(moduleId,isclick);
        }
    };
    if(layout=='103'){
        Phonlayout103(moduleId,isclick);
    };
    if (layout == '106') {
        Phonlayout106(moduleId, option);
        setTimeout(function () {
            addScript('/scripts/MultiEllipsis.js', function () {
                new MultiEllipsis({"targetCls": '#module_' + moduleId + ' .layout-106 .desc', "limitLineNumber": 3, "isCharLimit": false});
            });
        }, 100)
        // 当尺寸变化时，重新执行方法
        $(window).off('resize.module' + moduleId).on('resize.module' + moduleId, function () {
            Phonlayout106(moduleId, option);
            setTimeout(function () {
                new MultiEllipsis({"targetCls": '#module_' + moduleId + ' .layout-106 .desc', "limitLineNumber": 3, "isCharLimit": false});
            }, 100)
        });
    };
    if(layout=='108'){
        $("#module_" + moduleId+' .grid-item').hover(function(){
            $(this).addClass('active').siblings().removeClass('active');
        },function(){
            $(this).removeClass('active');
        })
    }
}
function Phonlayout102(moduleId,isclick) {
    var moduleIdSelector ="#module_"+ moduleId;
    var windowwidth = $(window).width();
    var galleryTop;
    if(windowwidth>767){
        $(moduleIdSelector+' .bgpicbox').attr('style',' ');
    }else{
        $(moduleIdSelector+' .bgpicbox').each(function(idx,el){
            var url = $(el).find('.pc_pic').attr('src');
            $(el).css({'background-image':'url('+url+')','background-repeat':'no-repeat','background-position': 'center','background-size':'contain'});
        })
    };
    $(moduleIdSelector+' .gallery-thumbs .explain').html($(moduleIdSelector+' .gallery-top').find('.swiper-slide').eq(0).find('.explain').html());
    if(galleryTop){
        galleryTop.destroy()
    };
    galleryTop = new Swiper(moduleIdSelector + ' .gallery-top', {
        // autoplay:3000,
        paginationClickable: true,
        mode : "horizontal",
        speed:1000,
        preventClicks:isclick == 0 ? true : false,
        nextButton: moduleIdSelector+' .swiper-slideshow-1-prev',
        prevButton: moduleIdSelector+' .swiper-slideshow-1-next',
        onSlideChangeStart:function(swiper){
            $(moduleIdSelector+' .gallery-thumbs').find('.swiper-slide').eq(swiper.activeIndex).click();
            $(moduleIdSelector+' .gallery-thumbs .explain').html($(moduleIdSelector+' .gallery-top').find('.swiper-slide').eq(swiper.activeIndex).find('.explain').html());
        }

    });
    var swiper2 = new Swiper(moduleIdSelector+' .gallery-thumbs .swiper-container', {
        slidesPerView: 7,
        // paginationClickable: true,
        spaceBetween: 10
    });
    galleryTop.params.control = swiper2;
    swiper2.params.control = galleryTop;
    $(moduleIdSelector+' .gallery-thumbs').off('click').on('click','.swiper-slide',function(){
        $(moduleIdSelector+' .gallery-thumbs .swiper-slide').removeClass('active');
        $(this).addClass('active');
        galleryTop.slideTo($(this).index(),200,true);
    });
    $(moduleIdSelector+' .gallery-thumbs').find('.swiper-slide').eq(0).click();
    //缩略图显示掩藏
    $(moduleIdSelector+' .showbtn').on('click',function(){
        var _this = $(this);
        var thumbs_bttom ='-'+(_this.closest('.gallery-thumbs').find('.explain').outerHeight(true)+_this.closest('.gallery-thumbs').find('.swiper-slt').outerHeight(true));
        if($(window).width()<=767){
            thumbs_bttom -= 10;
        }
        if(_this.attr('show')!='true'){
            $(this).closest('.gallery-thumbs').animate({
                    'bottom': 0},
                200,
                function(){
                    _this.attr('show','true');
                    _this.removeClass('show_btn');
                    _this.addClass('close_btn');
                }
            );
        }else{
            $(this).closest('.gallery-thumbs').animate({
                    'bottom': thumbs_bttom+'px'},
                200,
                function(){
                    _this.attr('show','false');
                    _this.removeClass('close_btn');
                    _this.addClass('show_btn');
                }
            );
        }
    });

    $(moduleIdSelector+' .showbtn').attr('show','true');
    $(moduleIdSelector+' .showbtn').removeClass('show_btn');
    $(moduleIdSelector+' .showbtn').addClass('close_btn');
    $(moduleIdSelector+' .showbtn').click();

    $(window).off('resize.'+moduleId).on('resize.'+moduleId,function(){
        var windowwidth = $(window).width();
        if(windowwidth>767){
            $(moduleIdSelector+' .bgpicbox').attr('style',' ');
        }else{
            $(moduleIdSelector+' .bgpicbox').each(function(idx,el){
                var url = $(el).find('.pc_pic').attr('src');
                $(el).css({'background-image':'url('+url+')','background-repeat':'no-repeat','background-position': 'center','background-size':'contain'});
            })
        };
        if(windowwidth<768){
            var thumbs_bttom ='-'+( $(moduleIdSelector+' .gallery-thumbs').find('.explain').outerHeight()+$(moduleIdSelector+' .gallery-thumbs').find('.swiper-slt').outerHeight(true));
            if(windowwidth<=768){
                thumbs_bttom-=20;
            };
            $(moduleIdSelector+' .showbtn').attr('show','true');
            $(moduleIdSelector+' .showbtn').removeClass('show_btn');
            $(moduleIdSelector+' .showbtn').addClass('close_btn');
            $(moduleIdSelector+' .showbtn').click();
        }
        setTimeout(function () {}, 500)
    })
}
function Phonlayout103(moduleId,isclick){
    var moduleIdSelector = '#module_'+moduleId;
    init();
    $(window).off('resize.'+moduleId).on('resize.'+moduleId,init);
    function init(){
        var windowwidth = $(window).width();
        if(windowwidth>=768){
            $(moduleIdSelector+' .bgpicbox').attr('style',' ');
            $(moduleIdSelector+' .gallery_thumbs').css('left','0')
        }else{
            $(moduleIdSelector+' .gallery_thumbs').css('left','-121px')
            $(moduleIdSelector+' .bgpicbox').each(function(idx,el){
                $(el).css({'background':'url('+$(el).find('.pc_pic').attr('src')+') no-repeat center','background-size':'contain'})
            })
        };
    }
    function count_scroll(idx,el){
        var gallery_thumbs = el.find('ul');
        var len = gallery_thumbs.find('li').length;
        var gallery_thumbs_height = el.height();
        var currentimg = gallery_thumbs.find('li').eq(idx);
        var currentscrolltop = gallery_thumbs.position().top;
        //计算当前的位置
        //debugger
        if(currentimg[0] != undefined){
            var currentscroll = currentimg[0].offsetTop+currentimg.outerHeight(true);
            if(currentscroll>gallery_thumbs_height){
                gallery_thumbs.animate({
                        'top': gallery_thumbs_height-currentimg[0].offsetTop-currentimg.outerHeight(true)},
                    200);
            }else if(Math.abs(currentimg[0].offsetTop)<=Math.abs(currentscrolltop)){
                gallery_thumbs.animate({
                        'top': -currentimg[0].offsetTop},
                    200);
            }
        }

    };

    var startY = 0;
    var cha = 0;
    var curren = 0;
    var endY = 0;
    var movey = 0;
    var st;
    function touchstart(e){
        e = window.event || e;
        //endY = e.changedTouches[0].clientY;
        // startX=e.targetTouches[0].clientX;
        if (e.touches) {
            startY = e.targetTouches[0].clientY;
        } else {
            startY = e.clientY;
        };
        st = Date.now();
        $(moduleIdSelector+' .thumbs_list').off('mousemove').on('mousemove', touchmove)
    }
    function touchmove(e) {
        e.preventDefault();
        //防止出现滚动条
        e = window.event || e;
        if (!IsPC()) {
            //移动端
            cha = e.targetTouches[0].clientY - startY;
            movey =  (cha+curren);
            $(this).css('top',movey);
            //this.style.transform = 'translateX('+cha+'px)';
        } else {
            //pc端
            cha = e.clientY - startY;
            movey =  (cha+curren);
            $(this).css('top',movey);
        };
    }
    function touchend(e){
        var blo = IsPC();
        var mintop = $(moduleIdSelector+' .gallery_thumbs').height()-$(this).height();
        //if (Date.now() - st < 150){
        if (!blo) {
            endY =e.originalEvent.changedTouches[0].clientY;
        } else {
            endY = e.clientY;
            $(moduleIdSelector+' .thumbs_list').off('mousemove');
        };

        curren = movey;//记录最后的位置
        var _this = $(this);
        if(Date.now() - st>150){
            if(curren>0 || $(this).height()<$(moduleIdSelector+' .gallery_thumbs').height()){
                //回到zui,
                $(this).stop().animate({'top':0});
                curren = 0;
            }else if(curren<mintop){
                $(this).stop().animate({'top':mintop-10});
                curren = mintop-10;
            }
        };
        $(moduleIdSelector+' .thumbs_list').off('mousemove');
    }
    function IsPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }
    $(moduleIdSelector+' .thumbs_list').off('touchstart').on('touchstart', touchstart)
    $(moduleIdSelector+' .thumbs_list').off('touchmove').on('touchmove', touchmove);
    $(moduleIdSelector+' .thumbs_list').off('touchend').on('touchend', touchend);

    $(moduleIdSelector+' .thumbs_list').off('mousedown').on('mousedown', touchstart);
    $(moduleIdSelector+' .thumbs_list').off('mouseup').on('mouseup', touchend);
    var swiper;
    if(swiper){
        swiper.destroy()
    };
    swiper = new Swiper(moduleIdSelector+' .swiper-container', {
        speed: 10000,
        pagination: moduleIdSelector+' .swiper-pagination',
        nextButton: moduleIdSelector+' .swiper-button-next',
        prevButton: moduleIdSelector+' .swiper-button-prev',
        paginationClickable: true,
        preventClicks:isclick == 0 ? true : false,
        centeredSlides: true,
        //autoplay: 2500,

        autoplayDisableOnInteraction: false,
        onSlideChangeStart:function(swiper){
            $(moduleIdSelector+' .gallery_thumbs').find('li').eq(swiper.activeIndex).click();
            count_scroll(swiper.activeIndex,$(moduleIdSelector+' .gallery_thumbs'));
        }
    });
    //移动端显示隐藏按钮
    $(moduleIdSelector+' .showbtn').off('click').on('click',function(){
        var _this = $(this);
        var windowwidth = $(window).width();
        if(_this.attr('show')=='false' && windowwidth<=768){
            $(this).closest('.gallery_thumbs').stop().animate({'left': '-121px'},200,function(){
                _this.attr('show','true');
                _this.removeClass('show');
                _this.addClass('close');
            });

        }else{
            $(this).closest('.gallery_thumbs').stop().animate({'left': '0'},200,function(){
                _this.attr('show','false')
                _this.removeClass('close');
                _this.addClass('show');
            });

        }
    })
    //给缩略图绑定事件
    $(moduleIdSelector+' .gallery_thumbs').off('click').on('click','li',function(event){
        event.stopPropagation();
        // 修复在标签模块时第0个点击无效的bug
        if($(this).index() == 0){
            var index = $(event.delegateTarget).find('li.active').index();
            swiper.slideTo(index,200,false);
        }
        swiper.slideTo($(this).index(),200,false);
        $(moduleIdSelector+' .gallery_thumbs').find('li').removeClass('active');
        $(this).addClass('active');
        var gallery_thumbs_height = $(moduleIdSelector+' .gallery_thumbs').height();
        var listheight = $(this).closest('.thumbs_list');
        var listheight_height = $(this).closest('.thumbs_list').height();
        var currentop = listheight.position().top;
        var min_top = -(listheight_height-gallery_thumbs_height);
        //自动上去缩略图的高度大于父级的高度时
        if(gallery_thumbs_height<listheight_height&&currentop<=0){
            var maxtop = gallery_thumbs_height-listheight_height;
            var windowwidth = $(window).width();
            var speed=39;
            if(windowwidth>=768){
                speed=92
            }else{
                speed=39
            }
            //到了倒数第二个
            if(this.offsetTop+currentop>=speed*3){
                if(currentop-speed<maxtop-10){
                    listheight.animate({
                        'top': maxtop-10,
                    });
                    curren = maxtop-10;//记录最后的位置
                }else{
                    listheight.animate({
                        'top': currentop-speed,
                    });
                    curren = currentop-speed;//记录最后的位置
                };
            }else if(this.offsetTop+currentop<=speed){

                if($(this).index()>3&&min_top<=currentop){
                    listheight.animate({
                        'top': currentop+speed,
                    });
                    curren = currentop+speed;//记录最后的位置
                }else if(!(min_top<=currentop)){
                    listheight.animate({
                        'top': min_top,
                    });
                    curren = min_top;
                }else{
                    listheight.animate({
                        'top': 0,
                    });
                    curren = 0;//记录最后的位置
                };
            };
        };
    })
    $(moduleIdSelector+' .gallery_thumbs').off('touchmove').on('touchmove',function(e){
        e.preventDefault();
    });
}
function Phonlayout106 (moduleID, options) {
    // 显示个数
    var showViewLimit = parseInt(options.LgItemCount);
    var xsItemCount = options.xsItemCount;
    var MdItemCount = options.MdItemCount;
    var SmItemCount = options.SmItemCount;
    // if (window.innerWidth < 1200) showViewLimit = parseInt(MdItemCount);
    // if (window.innerWidth < 992) showViewLimit = parseInt(SmItemCount);
    if (window.innerWidth < 768) showViewLimit = parseInt(xsItemCount);

    // 当前模块主容器区域
    var moduleIdSelector = '#module_' + moduleID;
    // 是否显示隐藏
    var showOrHide = 'none';
    // swiper 自动滚动
    var autoplaySwiper = 0;
    // 单个 item 项的边距
    var spaceBetween = 25;
    // pc 跟横向平板都是 4 个
    if ($(window).width() > 767) {
        // 如果个数大于 4, 才允许出现上下翻页
        if ($(moduleIdSelector + ' .swiper-slide').length > 4) {
            showOrHide = 'block';
        }
    // } else if ($(window).width() >= 768 && $(window).width() <= 991) {
    //     showOrHide = 3
    //     showOrHide = 'none';
    //     autoplaySwiper = 3000
    } else if ($(window).width() <= 767) {
        showOrHide = 'none';
        autoplaySwiper = 3000;
        spaceBetween = 12;
    }

    // 对上下页进行隐藏/显示
    $(moduleIdSelector + ' .iconfont').css('display', showOrHide);
    // 实例化 swiper
    new Swiper(moduleIdSelector + ' .gallery-top', {
        autoplay: 3000,
        speed: 1000,
        spaceBetween : spaceBetween,
        effect: 'slide',
        slidesPerView: showViewLimit,
        prevButton: moduleIdSelector + ' .swiper-prev',
        nextButton:moduleIdSelector + ' .swiper-next',
        loop : true,
        loopAdditionalSlides : 2,
        loopedSlides:showViewLimit,
        autoplayDisableOnInteraction: false
    });
}
function getimagelist(moduleIdSelector){
    $(moduleIdSelector + " .grid-cont").off('click').click(function () {
        var gallerySelector = $(this);
        var galleryid = $(this).attr('galleryid') || '';
        if(gallerySelector.data('dynamicEl') != '' && gallerySelector.data('dynamicEl') != undefined){
            gallerySelector.lightGallery({
                dynamic: true,
                thumbnail: true,
                fullScreen:false,
                dynamicEl:JSON.parse(gallerySelector.data('dynamicEl')) || []
            });
        }else {
            $.ajax({
                url: "/index.php?c=front/Gallery&a=GetImageList&id=" + galleryid,
                async: false,
                dataType: "json",
                success: function (json) {
                    if (json.success) {
                        gallerySelector.data('dynamicEl',JSON.stringify(json.list))
                        gallerySelector.lightGallery({
                            dynamic: true,
                            thumbnail: true,
                            fullScreen:false,
                            dynamicEl:json.list || []
                        });
                        return false;

                    } else {
                        alert("出错了：" + json.msg);
                    }
                    3
                }
            });
        }
        return false;
    });
}
function resetHeight(moduleIdSelector,layout){
    var mobile_picBox = $(moduleIdSelector + ' .mobile_picBox');
    if(mobile_picBox)mobile_picBox.height(mobile_picBox.eq(0).width()+2);
    if(layout=='107'){
        mobile_picBox.height(mobile_picBox.eq(0).width()*(9/16));
    }
}
/**IE、edge 下calc无法多级运算 */
function isIE(moduleId) {
	var userAgent = navigator.userAgent + ''; //取得浏览器的userAgent字符串

	if (!!window.ActiveXObject || "ActiveXObject" in window || userAgent.indexOf('Edge') > -1) {
        $('#module_' + moduleId + ' .col-lg-3').css('cssText', 'width:32% !important;margin-bottom:2%;margin-right:2%')
        $('#module_' + moduleId + ' div:nth-child(3n+3).grid-item.col-lg-3').css('cssText', 'margin:0 !important')
        $('#module_' + moduleId + ' .col-lg-5').css('cssText', 'width:18.4% !important;margin-bottom:2%;margin-right:2%')
        $('#module_' + moduleId + ' div:nth-child(5n+5).grid-item.col-lg-5').css('cssText', 'margin:0 !important')
	}
}