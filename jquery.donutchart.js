(function(a){a.fn.donutchart=function(e,d){var g={background_color:"#ccc",color:"red",size:160,donut_width:40,font_size:16,animate:true};var c={};var b=null;var f=null;this.initDonutChart=function(){a(this).css({position:"relative",width:c.size+"px",height:c.size+"px"});b=a("<canvas></canvas>").attr({width:c.size,height:c.size,id:a(this).prop("id")+"_Canvas"});f=a("<div></div>").addClass("percentage_text").css({position:"absolute",top:"0px",left:"0px",width:c.size+"px",lineHeight:c.size+"px",textAlign:"center",fontFamily:"Arial,sans-serif",fontSize:c.font_size+"px",fontWeight:"bold"});a(this).append(b).append(f);if(typeof(G_vmlCanvasManager)!="undefined"){G_vmlCanvasManager.initElement(b.get(0))}a(this).data("donut_chart_options",c);if(c.animate){this.animate(0)}else{this.fillToPercentage(a(this).attr("data-percent"))}};this.drawBg=function(){var i=c.size/2;var h=b.get(0).getContext("2d");h.clearRect(0,0,c.size,c.size);h.beginPath();h.fillStyle=c.background_color;h.arc(i,i,i,0,2*Math.PI,false);h.arc(i,i,i-c.donut_width,0,2*Math.PI,true);h.fill()};this.drawFg=function(m){var k=c.size/2;var l=(m/100)*360;var j=Math.PI*(-90/180);var i=Math.PI*((-90+l)/180);var h=b.get(0).getContext("2d");h.beginPath();h.fillStyle=c.color;h.arc(k,k,k,j,i,false);h.arc(k,k,k-c.donut_width,i,j,true);h.fill()};this.animate=function(j){if(b.get(0).getContext){var h=a(this).attr("data-percent");var i=a(this).attr("data-animation-iteration")!=null?a(this).attr("data-animation-iteration"):0;if(j!=null){if(isNaN(j)){throw"DonutChart widget: 'start_value' param is not a valid number"}i=j}this.fillToPercentage(i);if(i<h){a(this).attr("data-animation-iteration",++i);var k=a(this);setTimeout(function(){k.donutchart("animate")},20)}}};this.fillToPercentage=function(h){this.drawBg();this.drawFg(h);f.text(h+"%")};if(typeof e=="string"){b=a(this).find("canvas");if(b.length==0){throw"DonutChart widget not initialized"}f=a(this).find("div.percentage_text");c=a(this).data("donut_chart_options");if(e=="animate"){if(d==null){this.animate()}else{if(isNaN(d)){throw"DonutChart widget: 'method_params' is not a valid number"}this.animate(d)}}}else{c=a.extend(g,e);this.initDonutChart()}return this}})(jQuery);