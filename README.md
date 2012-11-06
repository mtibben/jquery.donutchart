jQuery Donut Chart widget Plugin
================================

Generates a pie/donut chart widget using HTML5 `<canvas>` element.

See https://github.com/ozzyogkush/jquery.donutchart.

Cross-platform Compatibility
----------------------------

* Firefox 2+
* Google Chrome 4.0+
* Safari 3.10+
* Opera 9.0+
* Internet Explorer 9+

Requirements
------------

* jQuery 1.7.0+

Feature Overview
----------------

Dynamically generates a circular chart, with a 'donut hole' in the middle, that
fills in the foreground to the percentage specified by the 'data-percent' data
value stored on the element on which this is being run.

By default, animates the percentage from 0 to the value specified.

Usage
=====

Create a `<div>` element. On page DOM load/ready, call the donutchart() with or
without any overridden options.

If you need to re-animate the chart or update to a new percentage, you can pass a method name and optionally
a start value, and it will re-animate to the same 'data-percent'.
####Exposed methods:
* animate(start\_value)

@changelog	0.2 - fixed a small bug related to percentage values being parsed as strings; now stores newly created DOM elements as data on the original element

Example
-------
	<button id="re_animate_btn">Re-animate</button><br /><br />
	
	<div id="donutchart1" data-percent="50"></div>
	<div id="donutchart2" data-percent="65"></div>
	<div id="donutchart3" data-percent="85"></div>
	
	<script type="text/javascript">
		$(document).ready(function() {
			$("#donutchart1").donutchart({});
			$("#donutchart2").donutchart({size:200,
										  color:'blue',
										  animate:false});
			$("#donutchart3").donutchart({size:300,
										  color:'green',
										  donut_width:90,
										  background_color:"#888"});
			
			if ($.ui !== undefined) {
				$('#re_animate_btn').button();
			}
			$('#re_animate_btn').on('click', function() {
				$("#donutchart1").donutchart('animate');
				$("#donutchart2").donutchart('animate', 30);
				$("#donutchart3").donutchart('animate', 10);
			});
		});
	</script>