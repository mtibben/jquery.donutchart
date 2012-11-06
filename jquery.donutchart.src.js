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
 * If you need to re-animate the chart or update to a new percentage, you can pass
 * a method name and optionally a start value, and it will re-animate to the same
 * 'data-percent'.
 * ####Exposed methods:
 * * animate(start_value)
 * 
 * @changelog	0.2 -	fixed a small bug related to percentage values being parsed as strings; now stores newly created DOM elements as data on the original element
 * 
 * @example		See example.html
 * @class		DonutChart
 * @name		DonutChart
 * @version		0.2
 * @author		Derek Rosenzweig <derek.rosenzweig@gmail.com, drosenzweig@riccagroup.com>
 */
(function($) {
	
	/**
     * Constructor. Creates the new canvas element and the percentage text element,
     * adds them to the DOM.
     *
     * @throws		DonutChart exception
     * @access		public
     * @memberOf	DonutChart
     * @since		0.1
     * @updated		0.2
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
		 * @updated		0.2
		 */
		this.default_options = {
			background_color : '#ccc',				// Fill color of the donut background. Optional. Default #ccc
			color : 'red',							// Fill color of the filled donut foreground. Optional. Default red
			size : 160,								// Full height and width of the canvas element, in pixels. Optional. Default 160.
			donut_width: 40,						// Thickness of the arc that makes the donut, in pixels. Optional. Default 40.
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
		 * @updated		0.2
		 */
		this.options = {};
		
		/**
		 * Contains the actual <canvas> element which draws the donut.
		 *
		 * @access		public
		 * @type		HTMLElement
		 * @memberOf	DonutChart
		 * @since		0.1
		 * @updated		0.2
		 * @default		null
		 */
		this.canvas = null;
		
		/**
		 * Contains the 2d <canvas> element context.
		 *
		 * @access		public
		 * @type		HTMLElement
		 * @memberOf	DonutChart
		 * @since		0.2
		 * @default		null
		 */
		this.canvas_context = null;
		
		/**
		 * Element which displays the percent text value.
		 *
		 * @access		public
		 * @type		HTMLElement
		 * @memberOf	DonutChart
		 * @since		0.1
		 * @updated		0.2
		 * @default		null
		 */
		this.percentage_text_div = null;
		
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
		 * @access		public
		 * @memberOf	DonutChart
		 * @since		0.1
		 * @updated		0.2
		 */
		this.initDonutChart = function() {
			// Set up the new widget elements...
			$(this).css({position : "relative",
						 width : this.options.size+"px",
						 height : this.options.size+"px"});
			this.canvas = $("<canvas></canvas>").attr({width : this.options.size,
													   height : this.options.size,
													   id : $(this).prop('id')+"_Canvas"});
			this.percentage_text_div = $("<div></div>")
											.addClass('percentage_text')
											.css({position:'absolute',
												  top:'0px',
												  left:'0px',
												  width:this.options.size+"px",
												  lineHeight:this.options.size+"px",
												  textAlign:'center',
												  fontFamily:'Arial,sans-serif',
												  fontSize:this.options.font_size+"px",
												  fontWeight:'bold'});
			
			// ...and add them to the DOM
			$(this).append(this.canvas).append(this.percentage_text_div);
			
			// excanvas support
			if (typeof(G_vmlCanvasManager) != "undefined") {
				G_vmlCanvasManager.initElement(this.canvas.get(0));
			}
			
			this.canvas_context = this.canvas.get(0).getContext('2d');
			
			// Add the current options as data on the original element
			$(this).data('donut_chart_options', this.options);
			$(this).data('canvas', this.canvas);
			$(this).data('canvas_context', this.canvas_context);
			$(this).data('percentage_text_div', this.percentage_text_div);
			
			if (this.options.animate) {
				this.animate(0);
			}
			else {
				this.fillToPercentage(parseInt($(this).attr("data-percent")));
			}
		}
		
		/**
		 * Draws the background of the donut (the part indicating the total 100%)
		 * on the canvas.
		 *
		 * @access		public
		 * @memberOf	DonutChart
		 * @since		0.1
		 * @updated		0.2
		 */
		this.drawBg = function() {
			var arc_size = this.options.size/2;
			
			this.canvas_context.clearRect(0, 0, this.options.size, this.options.size);
			this.canvas_context.beginPath();
			this.canvas_context.fillStyle = this.options.background_color;
			this.canvas_context.arc(arc_size, arc_size, arc_size, 0, 2*Math.PI, false);
			this.canvas_context.arc(arc_size, arc_size, arc_size - this.options.donut_width, 0, 2*Math.PI, true);
			this.canvas_context.fill();
		}
		
		/**
		 * Draws the foreground of the donut (the part indicating the percentage)
		 * on the canvas.
		 *
		 * @access		public
		 * @memberOf	DonutChart
		 * @since		0.1
		 * @updated		0.2
		 *
		 * @param		percent				integer					The percent value to fill in. Required.
		 */
		this.drawFg = function(percent) {
			var arc_size = this.options.size/2;
			var ratio = (percent/100) * 360;
			var startAngle = Math.PI * (-90/180);
			var endAngle = Math.PI * ((-90+ratio)/180);
			
			this.canvas_context.beginPath();
			this.canvas_context.fillStyle = this.options.color;
			this.canvas_context.arc(arc_size, arc_size, arc_size, startAngle, endAngle, false);
			this.canvas_context.arc(arc_size, arc_size, arc_size - this.options.donut_width, endAngle, startAngle, true);
			this.canvas_context.fill();
		}
		
		/**
		 * Draws the background of the donut on the canvas.
		 *
		 * @access		public
		 * @memberOf	DonutChart
		 * @since		0.1
		 * @updated		0.2
		 *
		 * @param		start_value				integer					The value to start the animation at. Optional. Default null.
		 */
		this.animate = function(start_value) {
			var percentage = parseInt($(this).attr("data-percent"));
			var animation_iteration = parseInt($(this).attr("data-animation-iteration") != null ? $(this).attr("data-animation-iteration") : 0);
			if (start_value != null) {
				if (isNaN(start_value)) {
					throw 'DonutChart widget: \'start_value\' param is not a valid number';
				}
				animation_iteration = parseInt(start_value);
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
		
		/**
		 * Draws the background and foreground of the canvas element, and updates
		 * the percentage text element.
		 *
		 * @access		public
		 * @memberOf	DonutChart
		 * @since		0.1
		 * @updated		0.2
		 *
		 * @param		percentage				integer					The value to set the foreground donut and percentage text. Required.
		 */
		this.fillToPercentage = function(percentage) {
			this.drawBg();
			this.drawFg(percentage);
			this.percentage_text_div.text(percentage+"%");
		}
		
		/********* Initialize the donut chart or call a specific function *********/
		if (typeof options_or_method == "string") {
			this.options = $(this).data('donut_chart_options');
			this.canvas = $(this).data('canvas');
			this.canvas_context = $(this).data('canvas_context');
			this.percentage_text_div = $(this).data('percentage_text_div');
			
			if (this.canvas == null) {
				throw 'DonutChart widget not initialized - cannot proceed';
			}
			
			switch (options_or_method) {
				case 'animate':
					if (method_params == null) {
						this.animate();
					}
					else {
						if (isNaN(method_params)) {
							throw 'DonutChart widget: \'method_params\' is not a valid number';
						}
						this.animate(method_params);
					}
					break;
				default :
					throw 'DonutChart widget: invalid method called';
					break;
			}
		}
		else {
			/* Initialize the DonutChart */
			this.options = $.extend(this.default_options, options_or_method);
			this.initDonutChart();
		}
		
		/********* Return the newly extended element for chaining *********/
		return this;
	}
})(jQuery);