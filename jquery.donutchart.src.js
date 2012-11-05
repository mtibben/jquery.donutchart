/**
 * jQuery Donut Chart widget Plugin
 * ================================
 * 
 * Generates a pie/donut chart widget using HTML5 `<canvas>` element.
 * 
 * Cross-platform Compatibility
 * ----------------------------
 * 
 * * Firefox 2+
 * * Google Chrome 4.0+
 * * Safari 3.10+
 * * Opera 9.0+
 * * Internet Explorer 9+
 * 
 * Requirements
 * ------------
 * 
 * * jQuery 1.7.0+
 * 
 * Feature Overview
 * ----------------
 *
 * Dynamically generates a circular chart, with a 'donut hole' in the middle, that
 * fills in the foreground to the percentage specified by the 'data-percent' data
 * value stored on the element on which this is being run.
 *
 * By default, animates the percentage from 0 to the value specified.
 * 
 * Usage
 * =====
 *
 * Create a `<div>` element. On page DOM load/ready, call the donutchart() with or
 * without any overridden options.
 *
 * If you need to re-animate the chart, you can pass a method name and optionally
 * a start value, and it will re-animate to the same 'data-percent'.
 * ####Exposed methods:
 * * animate(start_value)
 * 
 * @example		See example.html
 * @class		DonutChart
 * @name		DonutChart
 * @version		0.1
 * @author		Derek Rosenzweig <derek.rosenzweig@gmail.com, drosenzweig@riccagroup.com>
 */
(function($) {
	
	/**
     * Constructor. Creates the new canvas element and the percentage text element,
     * adds them to the DOM.
     *
     * @access		public
     * @memberOf	DonutChart
     * @since		0.1
     *
     * @param		options_or_method	mixed				An object containing various options, or a string containing a method name.
     * 															Valid method names: 'animate'
     * @param		method_params		mixed				Arguments to be passed onto a method name. Optional. Default null.
     *
     * @returns		this				jQuery				The jQuery element being extended gets returned for chaining purposes
     */
	$.fn.donutchart = function(options_or_method, method_params) {
		//--------------------------------------------------------------------------
		//
		//  Variables and get/set functions
		//
		//--------------------------------------------------------------------------
		
		/**
		 * Default options for the widget. Overwrite by including individual
		 * options in the 'options' map object when extending the DonutChart widget.
		 *
		 * @access		public
		 * @type		Object
		 * @memberOf	DonutChart
		 * @since		0.1
		 */
		var default_options = {
			background_color : '#ccc',				// Fill color of the donut background. Optional. Default #ccc
			color : 'red',							// Fill color of the filled donut foreground. Optional. Default red
			size : 160,								// Full height and width of the canvas element, in pixels. Optional. Default 160.
			donut_width: 40,						// Height and width of the "hole" that makes the donut, in pixels. Optional. Default 40.
			font_size : 16,							// Font size, in pixels. Optional. Default 16.
			animate : true							// Flag indicating whether the widget should animate automatically after initializing. Optional. Default true.
		};
		
		/**
		 * The actual final set of extended options that will be used in creating
		 * the replacement DonutChart widget.
		 *
		 * This will be stored on the replacement DonutChart widget as 'donut_chart_options'
		 * data for easy retrieval and use when the 'options_or_method' var is a string
		 * indicating a function to be run.
		 *
		 * @access		public
		 * @type		Object
		 * @memberOf	DonutChart
		 * @since		0.1
		 */
		var options = {};
		
		/**
		 * Contains the actual <canvas> element which draws the donut.
		 *
		 * @access		public
		 * @type		HTMLElement
		 * @memberOf	DonutChart
		 * @since		0.1
		 * @default		null
		 */
		var canvas = null;
		
		/**
		 * Element which displays the percent text value.
		 *
		 * @access		public
		 * @type		HTMLElement
		 * @memberOf	DonutChart
		 * @since		0.1
		 * @default		null
		 */
		var percentage_text_div = null;
		
		//--------------------------------------------------------------------------
		//
		//  Methods
		//
		//--------------------------------------------------------------------------
		
		/**
		 * Initializes the donut chart widget.
		 *
		 * If the required options are not present, throws an exception.
		 *
		 * @throws		DonutChart exception
		 * @access		public
		 * @memberOf	DonutChart
		 * @since		0.1
		 */
		this.initDonutChart = function() {
			// Set up the new widget elements...
			$(this).css({position : "relative",
						 width : options.size+"px",
						 height : options.size+"px"});
			canvas = $("<canvas></canvas>").attr({width : options.size,
												  height : options.size,
												  id : $(this).prop('id')+"_Canvas"});
			percentage_text_div = $("<div></div>")
									.addClass('percentage_text')
									.css({position:'absolute',
										  top:'0px',
										  left:'0px',
										  width:options.size+"px",
										  lineHeight:options.size+"px",
										  textAlign:'center',
										  fontFamily:'Arial,sans-serif',
										  fontSize:options.font_size+"px",
										  fontWeight:'bold'});
			
			// ...and add them to the DOM
			$(this).append(canvas).append(percentage_text_div);
			
			// excanvas support
			if (typeof(G_vmlCanvasManager) != "undefined") {
				G_vmlCanvasManager.initElement(canvas.get(0));
			}
			
			// Add the current options as data on the original element
			$(this).data('donut_chart_options', options);
			
			if (options.animate) {
				this.animate(0);
			}
			else {
				this.fillToPercentage($(this).attr("data-percent"));
			}
		}
		
		/**
		 * Draws the background of the donut (the part indicating the total 100%)
		 * on the canvas.
		 *
		 * @access		public
		 * @memberOf	DonutChart
		 * @since		0.1
		 */
		this.drawBg = function() {
			var arc_size = options.size/2;
			var canvas_context = canvas.get(0).getContext('2d');
			canvas_context.clearRect(0,
									 0,
									 options.size,
									 options.size);
			canvas_context.beginPath();
			canvas_context.fillStyle = options.background_color;
			canvas_context.arc(arc_size,
							   arc_size,
							   arc_size,
							   0,
							   2*Math.PI,
							   false);
			canvas_context.arc(arc_size,
							   arc_size,
							   arc_size-options.donut_width,
							   0,
							   2*Math.PI,
							   true);
			canvas_context.fill();
		}
		
		/**
		 * Draws the foreground of the donut (the part indicating the percentage)
		 * on the canvas.
		 *
		 * @access		public
		 * @memberOf	DonutChart
		 * @since		0.1
		 *
		 * @param		percent				integer					The percent value to fill in. Required.
		 */
		this.drawFg = function(percent) {
			var arc_size = options.size/2;
			var ratio = (percent/100) * 360;
			var startAngle = Math.PI * (-90/180);
			var endAngle = Math.PI * ((-90+ratio)/180);
			var canvas_context = canvas.get(0).getContext('2d');
			
			canvas_context.beginPath();
			canvas_context.fillStyle = options.color;
			canvas_context.arc(arc_size,
							   arc_size,
							   arc_size,
							   startAngle,
							   endAngle,
							   false);
			canvas_context.arc(arc_size,
							   arc_size,
							   arc_size-options.donut_width,
							   endAngle,
							   startAngle,
							   true);
			canvas_context.fill();
		}
		
		/**
		 * Draws the background of the donut on the canvas.
		 *
		 * @access		public
		 * @memberOf	DonutChart
		 * @since		0.1
		 *
		 * @param		start_value				integer					The value to start the animation at. Optional. Default null.
		 */
		this.animate = function(start_value) {
			if (canvas.get(0).getContext) {
				var percentage = $(this).attr("data-percent");
				var animation_iteration = $(this).attr("data-animation-iteration") != null ? $(this).attr("data-animation-iteration") : 0;
				if (start_value != null) {
					if (isNaN(start_value)) {
						throw 'DonutChart widget: \'start_value\' param is not a valid number';
					}
					animation_iteration = start_value;
				}
				this.fillToPercentage(animation_iteration);
				if (animation_iteration < percentage) {
					$(this).attr("data-animation-iteration", ++animation_iteration);
					var original_widget = $(this);
					setTimeout(function() {
						original_widget.donutchart('animate');
					}, 20);
				}
			}
		}
		
		/**
		 * Draws the background and foreground of the canvas element, and updates
		 * the percentage text element.
		 *
		 * @access		public
		 * @memberOf	DonutChart
		 * @since		0.1
		 *
		 * @param		percentage				integer					The value to set the foreground donut and percentage text. Required.
		 */
		this.fillToPercentage = function(percentage) {
			this.drawBg();
			this.drawFg(percentage);
			percentage_text_div.text(percentage+"%");
		}
		
		/********* Initialize the donut chart or call a specific function *********/
		if (typeof options_or_method == "string") {
			canvas = $(this).find('canvas');
			if (canvas.length == 0) {
				throw 'DonutChart widget not initialized';
			}
			
			percentage_text_div = $(this).find('div.percentage_text');
			options = $(this).data('donut_chart_options');
			
			if (options_or_method == 'animate') {
				if (method_params == null) {
					this.animate();
				}
				else {
					if (isNaN(method_params)) {
						throw 'DonutChart widget: \'method_params\' is not a valid number';
					}
					this.animate(method_params);
				}
			}
		}
		else {
			/* Initialize the DonutChart */
			options = $.extend(default_options, options_or_method);
			this.initDonutChart();
		}
		
		/********* Return the newly extended element for chaining *********/
		return this;
	}
})(jQuery);