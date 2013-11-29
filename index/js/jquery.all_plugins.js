// ColorBox v1.3.15 - a full featured, light-weight, customizable lightbox based on jQuery 1.3+
// Copyright (c) 2010 Jack Moore - jack@colorpowered.com
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php

(function($){
    HtmlSlidePlayer = function(object,config){
        this.obj = object;
        this.n =0;
        this.j =0;
        this.first_show = 1;
        var _this = this;
        var _obj = this.obj;
        var t;
        var defaults = {fontsize:12,right:10,bottom:15,time:5000,autosize:0,slidearrow:false};
        this.config = $.extend(defaults,config);
        this.count = $(_obj + " li").length;



        this.factory = function(){
            //元素定位
            $(_obj).css({position:"relative",zIndex:"0",overflow:"hidden", height: $(_obj + " ul").height() + "px" });
            $(_obj).prepend("<div class='slide_control'></div>");

            $(_obj + " ul").css({position:"relative",zIndex:"0",margin:"0",padding:"0",overflow:"hidden", width:"100%" })
            $(_obj + " li").css({position:"absolute",top:"0",left:"0",width:"100%",height: "100%" ,overflow:"hidden"}).hide().each(function(i){
                $(_obj + " .slide_control").append("<a>"+(i+1)+"</a>");
            });

            this.resetclass(_obj + " .slide_control a",0);
            
            //第一张图片lazyload
            var img_li = $(_obj + " li").first();
            var f_img=$("img[lazyload]",img_li);
            //商城第一帧图片不止一张所以这里要用数组
            $.each(f_img,function(i){
                $(this).attr("src",$(this).attr("lazyload")).removeAttr("lazyload");
            });
            if ( img_li.length > 0 && !!img_li.attr('lazyload') ){
                img_li.css('background-image','url('+img_li.attr('lazyload')+')').removeAttr("lazyload");
            }

            
            this.slide();
            this.slidearrow();

            t = setInterval(this.autoplay,this.config.time);
            //force the first slide to show
            $(_obj + " .slide_control a").eq(0).triggerHandler('mouseover');

        };
        //加一个上一页下一页的按钮
        this.slidearrow = function(){
            if(this.config.slidearrow){
                var prev_button = $('<em class="slidearrow slidearrow_l"><</em>');
                var next_button = $('<em class="slidearrow slidearrow_r">></em>');
                $(_obj).append(prev_button).append(next_button);
                next_button.bind('click',function(){
                    if(_this.n == _this.count-1){
                        $(_obj + " .slide_control a").eq(0).triggerHandler('mouseover');
                    }else{
                        $(_obj + " .slide_control a").eq(_this.n+1).triggerHandler('mouseover');
                    }
                });
                prev_button.bind('click',function(){
                    if(_this.n == 0){

                        $(_obj + " .slide_control a").eq(_this.count-1).triggerHandler('mouseover');
                    }else{
                        $(_obj + " .slide_control a").eq(_this.n-1).triggerHandler('mouseover');
                    }

                });

            }
        }
        //图片渐影
        this.slide = function(){

            $(_obj + " .slide_control a").lazyhover(function(){
                _this.j = $(this).text() - 1;
                _this.n = _this.j;
                if (_this.j >= _this.count){return;}

                //防止闪一下
                if(_this.first_show) {
                    _this.first_show = 0;
                    $(_obj + " li:eq(" + _this.j + ")").show().siblings("li").hide();
                }else {
                    var li =$(_obj + " li:eq(" + _this.j + ")");
                    var next_li ;
                    if ( _this.count >= _this.j + 1 ){
                        next_li = $(_obj + " li:eq(" + (_this.j+1) + ")");
                    }
                    
                    li.fadeIn("200").siblings("li").fadeOut("200");
                    //添加图片延迟加载
                    var img=$("img[lazyload]",li);
                    $.each(img,function(i){
                        $(this).attr("src",$(this).attr("lazyload")).removeAttr("lazyload");
                    });
                    //背景图延迟加载
                    var bg_src = li.attr("lazyload");
                    if(bg_src!=undefined){
                        li.css('background-image','url('+bg_src+')').removeAttr("lazyload");
                        
                        if ( next_li != undefined && next_li.length >= 1 ){
                            var next_bg_src = next_li.attr("lazyload");
                            if ( next_bg_src != undefined ){
                                next_li.css('background-image','url('+next_bg_src+')').removeAttr("lazyload");
                            }
                            
                        }
                        
                    }

                };
                _this.resetclass(_obj + " .slide_control a",_this.j);
            },200,500);
        };


        //滑过停止
        $(_obj)[0].onmouseover=function(){
            clearInterval(t);
        };
        $(_obj)[0].onmouseout=function(){
            t = setInterval(_this.autoplay,_this.config.time)
        };


        //自动播放
        this.autoplay = function(){
            _this.n = _this.n >= (_this.count - 1) ? 0 : ++_this.n;
            $(_obj + " .slide_control a").eq(_this.n).triggerHandler('mouseover');
        }
        //翻页函数
        this.resetclass =function(obj,i){
            $(obj).removeClass('mall_dot_hover').addClass('mall_dot');
            $(obj).eq(i).addClass('mall_dot_hover');
            if($.browser.msie && $.browser.version == 6.0){
                $('.img_slider_trigger').css("zoom","1");
            }
        };
        this.factory();
    }
})(jQuery);


$(function(){
    $.fn.lazyhover = function(fuc_on, de_on, de_out) {
        var self = $(this);
        var flag = 1;
        var h;
        var handle = function(elm){
            clearTimeout(h);
            if(!flag) self.removeData('timer');
            return flag ? fuc_on.apply(elm) : null;
        };
        var time_on  = de_on  || 0;
        var time_out = de_out || 500;
        var timer = function(elm){
            h && clearTimeout(h);
            h = setTimeout(function() { handle(elm);  }, flag ? time_on : time_out);
            self.data('timer', h);
        }
        self.hover(
            function(){
                flag = 1 ;
                timer(this);
            },
            function(){
                flag = 0 ;
                timer(this);
            }
        );
    }
});

(function($) {
    $.fn.hoverLazy = function(option) {
        var s = $.extend({
                current: "hover",
                delay: 20

            },
            option || {});
        $.each(this,
            function() {
                var timer1 = null,
                    timer2 = null,
                    flag = false;
                $(this).bind("mouseover",
                    function() {

                        if (flag) {
                            clearTimeout(timer2);
                        } else {
                            var _this = $(this);
                            timer1 = setTimeout(function() {
                                    _this.addClass(s.current);

                                    flag = true;
                                },
                                s.delay);
                        }
                    }).bind("mouseout",
                    function() {

                        if (flag) {

                            var _this = $(this);
                            timer2 = setTimeout(function() {
                                    _this.removeClass(s.current);

                                    flag = false;
                                },
                                s.delay);
                        } else {
                            clearTimeout(timer1);
                        }
                    })
            })
    }
})(jQuery);

