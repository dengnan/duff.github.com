 $(function(){
		var sliders = $(".img_slider","body");
        if( sliders.length > 0 ){
            sliders.each(function(i){
                var self = $(this),
                    parent = self.parent(),
                    id = "img_slider_"+i;
                parent.attr("id",id);

                var slider = new HtmlSlidePlayer("#"+id,{autosize:0,fontsize:12,time:5000});
            });
        }
	});