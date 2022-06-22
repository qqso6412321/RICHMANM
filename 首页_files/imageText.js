function initModuleImageTextGiant(moduleId, layout,linenum) {
    if ($.inArray(Number(layout), [112,103,105,106,108,107,109,104,102,111,118])>-1) {
        if ($.inArray(Number(layout), [104])>-1) {
            isIE(moduleId);
        }

        var ImageSizechange = function () {
            if ($(window).width() < 786) {
                if(layout == 109) {
                   var lgCount = $('#module_' + moduleId).find('.normal_ImgtextBox').attr('lgCount');
                    $('#module_' + moduleId).find('.normal_ImgtextBox').removeClass('col-lg-'+lgCount);
                }
                if(linenum == '2'){
                    $('#module_' + moduleId).find('.normal_ImgtextBox,.normal_ImgtextBox_contentitem,.normal_ImgtextBox_content').addClass('MobileImgtextBox')
                }
                if($.inArray(Number(layout),[105,106,104,111,118]) >-1) {
                    $('#module_' + moduleId + ' .imageTextContainer .GraphicUpper').addClass('MobileGraphicUpper')
                }else{
                   $('#module_' + moduleId + ' .imageTextContainer .GraphicUpper .TextImage').addClass('MobileTextImage')
                }
                $('#module_' + moduleId + ' .imageTextContainer .ModuleImageTextContent').addClass('ModuleMobileImageTextContent')
            } else {
                if(layout == 109) {
                    var lgCount = $('#module_' + moduleId).find('.normal_ImgtextBox').attr('lgCount');
                     $('#module_' + moduleId).find('.normal_ImgtextBox').addClass('col-lg-'+lgCount);
                 }
                if(linenum == '2'){
                    $('#module_' + moduleId).find('.normal_ImgtextBox,.normal_ImgtextBox_contentitem,.normal_ImgtextBox_content').removeClass('MobileImgtextBox')
                }
                if($.inArray(Number(layout),[105,106,104,111,118])>-1){
                    $('#module_' + moduleId + ' .imageTextContainer .GraphicUpper').removeClass('MobileGraphicUpper')
                }else{
                   $('#module_' + moduleId + ' .imageTextContainer .GraphicUpper .TextImage').removeClass('MobileTextImage')
                }
                $('#module_' + moduleId + ' .imageTextContainer .ModuleImageTextContent').removeClass('ModuleMobileImageTextContent')
            }
        }
        ImageSizechange();
        $(window).on('resize', function () {
            ImageSizechange();
        });
    }else{
        // 根据 layout，进行业务处理调度
        this['layout' + layout].call(this, moduleId, layout);
    }
      $('#module_'+moduleId+' >.module_'+moduleId).css('cssText','-webkit-transform:translate3d(0,0,0)')
}

function layout106(moduleId, layout) {
    var windowchange = function () {
        var obj = $('#module_' + moduleId).find('.normal_ImgtextBox_content');
        var num = obj.length;
        if (num > 2) {
            for (var i = 0; i < num; i++) {
                if (i % 2 != 0 && window.innerWidth > 768) {
                    if (obj.eq(i).height() > obj.eq(i - 1).height()) {
                        obj.eq(i).css('height', obj.eq(i).height());
                        obj.eq(i - 1).css('height', obj.eq(i).height());
                    } else if (obj.eq(i).height() < obj.eq(i - 1).height()) {
                        obj.eq(i).css('height', obj.eq(i - 1).height());
                        obj.eq(i - 1).css('height', obj.eq(i - 1).height());
                    }
                } else {
                    obj.eq(i).css('height', 'auto');
                }
            }
        }
    }

    var imgNum = $('#module_' + moduleId + ' .imageTextContainer .GraphicUpper .TextImage').length;
    $('#module_' + moduleId + ' .imageTextContainer .GraphicUpper .TextImage').load(function () {
        if (!--imgNum) {
            // 图片完全加载完成
            windowchange();
        }
    });

    $(window).on('resize', function () {
        windowchange();
    });
}
// layout-101 特有样式处理
function layout116(moduleId, layout) {
    // 手风琴 dom
    var accordionDom = $('#module_' + moduleId + ' .accordion-giant-main  .axxrdion-list-item');
    // 默认给第一个节点添加选中
    if (accordionDom.length >= 1) {
        accordionDom.eq(0).addClass('active');
        calcWidth('', moduleId, layout);
    }

    // 鼠标移入移出处理
    var accordionTimer
    accordionDom.on('mouseenter.accordionDom', function (event) {
        var self = $(this);
        // 淡入淡出过渡时间
        var animationDelay = 100;
        accordionTimer = setTimeout(function () {
            // 先给自己添加选中样式，然后移出其他 li 的选中样式
            self.addClass('active').siblings('li').removeClass('active');
            calcWidth(event.currentTarget, moduleId, layout);
            // 把自己的 default-view 隐藏， hover-view 显示，用 fadeIn 动画来省略掉变大时候的文字抖动
            self.children('.default-view').stop(true).hide().siblings('.hover-view').delay(animationDelay).fadeIn();
            // 删除效果
            accordionDom.not('.active').children('.default-view').delay(animationDelay).fadeIn().siblings('.hover-view').stop(true).hide();
        }, 80)
    }).on('mouseleave.accordionDom', function (event) {
        clearTimeout(accordionTimer)
    })
}

function calcWidth(targetDom, moduleId, layout) {
    // 手风琴 dom
    // 因为在swiper(幻灯片模块)中loop模式下会初始化多份slide（复制节点进行轮询），所以造成了accordionDom下dom节点的重复出现,所以在此处进行修复该bug
    var accordionDom
    if (targetDom !== '') {
        accordionDom = $(targetDom).closest('#module_' + moduleId).find('.accordion-giant-main  .axxrdion-list-item')
    } else {
        accordionDom = $('#module_' + moduleId).find('.accordion-giant-main  .axxrdion-list-item')
    }
    // 计算每个的宽度
    accordionDom.each(function () {
        var calc = 70;
        var activeCalc = 30;
        switch (accordionDom.length) {
            case 2:
                calc = 40;
                activeCalc = 60;
                break;
            case 3:
                calc = 60;
                activeCalc = 40;
                break;
            case 4:
                calc = 65;
                activeCalc = 35;
                break;
        }
        if ($(this).hasClass('active')) {
            // 选中的
            $(this).css('width', activeCalc + '%')
        } else {
            // 正常的
            var calcWidth = calc / (accordionDom.length - 1);
            $(this).css('width', calcWidth + '%')
        }
    })
}

/**IE兼容 */
function isIE(moduleId) {
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        //获取宽度
        var itemWidth = $('#module_' + moduleId + ' .normal_ImgtextBox_content');

        itemWidth.width( itemWidth.width() - 0.5 );
    }
}
