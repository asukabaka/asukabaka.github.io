////////////////////////// PARTICLE ENGINE ////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////


//RL* This is the particle system by Louis Hoebregt.
//RL* It specializes in making Bokeh lights with no interactivity. While this can be a drawback, I found it much easier to digest than the much more
//RL* feature rich but extremely complicated particle system by Vincent Garreau.
//RL* Despite the simplicity, further examination of this particle system reveals that it relies on other Javascript libraries like EaselJS to create a specialized canvas
//RL* and TweenJS for the fancy bokeh light movements.
//RL* I was hoping to find his github again to see if there was any extra documentation but it seems hes replaced it with a new bokeh light engine made entirely out of CSS.

//RL* A variable named ParticleEngine is made that has a function.
var ParticleEngine = (function() {
	//RL* "Strict mode makes several changes to normal JavaScript semantics"
	//RL* "Eliminates some JavaScript silent errors by changing them to throw errors.
	//RL* Fixes mistakes that make it difficult for JavaScript engines to perform optimizations: 
	//RL* strict mode code can sometimes be made to run faster than identical code that's not strict mode.
	//RL* Prohibits some syntax likely to be defined in future versions of ECMAScript" -MDN
	//RL* From my research on the internet, Strict mode basically makes the Javascript much more sensitive to errors which make the code easier to detect,
	//RL* and debug for better compatability and performance.
	'use strict';

	//RL* Another function called ParticleEngine with parameter canvas_id is made and specifically targets the canvas? There is no documentation referring to canvas_id
	//RL* I'm assuming this is true because in the html the code works by declaring a canvas with an id named projector.
	//RL* The bottom of the code under the Run sectior there is a states ParticleEngine has parameter of projector.
	function ParticleEngine(canvas_id) {
		// enforces new
		//RL* not entirely sure what this code here does... googling args returns stuff about rest parameters which really seem to make sense of what im seeing here.
		//RL* the solo ! is a logical operater which states if something is not true. So if the instance of Particle Engine is not true, get new arguments??
		if (!(this instanceof ParticleEngine)) {
			return new ParticleEngine(args);
		}
		
		//RL* variable _ParticleEngine is declared as this.
		//RL* "What is “this” keyword in JavaScript. this keyword refers to an object, that object which is executing the current bit of javascript code. 
		//RL* In other words, every javascript function while executing has a reference to its current execution context, called this. 
		//RL* Execution context means here is how the function is called." - Codeburst
		//RL* In other words I think Louis uses this to make it simpler to write and understand?
		var _ParticleEngine = this;

		//RL* Again, Dot Notation is being used 
		//RL* "Property accessors provide access to an object's properties by using the dot notation or the bracket notation." -MDN
		//RL* function particleEngine accessing the properties of canvas_id
		this.canvas_id = canvas_id;
		//RL* createjs.Stage draws on EaselJS to create
		//RL* "This example creates a stage, adds a child to it, then uses {{#crossLink "Ticker"}}{{/crossLink}} to update the child
	 	//RL* and redraw the stage..."
	 	//RL* To be honest EaselJS has extremely thourough documentation but it seems really abstract and hard to understand for a layman.
	 	//RL* Reading further down the documentation though it seems a benefit of using EaselJS is that it lets you have multiple "stages" like our bokeh light stage
	 	//RL* on a single canvas. "The canvas the stage will render to. Multiple stages can share a single canvas" (Line 7926 on easeljs.js)
		this.stage = new createjs.Stage(canvas_id);
		//RL* "The Document method getElementById() returns an Element object representing the element whose id property matches the specified string."- MDN
		//RL* This is totally new... It seems hes basically declaring a bunch of different variables are equal to each other.
		//RL* Not sure why but none of the properties, parameters, or names here link to any other JS library used by this particle system.
		//RL* One thing that I do find super cool about this bokeh light system is compared to Vincent's, this one when resized, will bounce the lights all around the
		//RL* canvas, as opposed to Vincents which will just crop the resized parts out. Maybe this is why the canvas size is so heavily coded and referenced.
		this.totalWidth = this.canvasWidth = document.getElementById(canvas_id).width = document.getElementById(canvas_id).offsetWidth;
		this.totalHeight = this.canvasHeight = document.getElementById(canvas_id).height = document.getElementById(canvas_id).offsetHeight;
		//RL* google searches of compositeStyle and "lighter" reveal nothing.
		this.compositeStyle = "lighter";

		//RL* Louis makes an array here called particleSettings.
		//RL* you can change a variety of things here like color and size and population of the particles
		//RL* num refers to population, area height is how much traveling the lights do, fromX is how much side to side travel the lights do.
		this.particleSettings = [{id:"small", num:1, fromX:0, toX:this.totalWidth, ballwidth:3, alphamax:0.6, areaHeight:.5, color:"#ffe6f2", fill:false}, 
								{id:"medium", num:2, fromX:0, toX:this.totalWidth,  ballwidth:14, alphamax:0.5, areaHeight:.5, color:"#ffe6f2", fill:true}, 
								{id:"large", num:20, fromX:0, toX:this.totalWidth, ballwidth:40,  alphamax:0.2, areaHeight:.5, color:"#ffe6f2", fill:true}];
		this.particleArray = [];
		this.lights = [{ellipseWidth:300, ellipseHeight:100, alpha:0.1, offsetX:0, offsetY:400, color:"#ffe6f2"}, 
						{ellipseWidth:250, ellipseHeight:250, alpha:0.1, offsetX:-50, offsetY:400, color:"#ffe6f2"}, 
						{ellipseWidth:100, ellipseHeight:80, alpha:0.1, offsetX:80, offsetY:400, color:"#ff66ff"}];

		this.stage.compositeOperation = _ParticleEngine.compositeStyle;


		function drawBgLight()
		{
			var light;
			var bounds;
			var blurFilter;
			for (var i = 0, len = _ParticleEngine.lights.length; i < len; i++) {				
				light = new createjs.Shape();
				light.graphics.beginFill(_ParticleEngine.lights[i].color).drawEllipse(0, 0, _ParticleEngine.lights[i].ellipseWidth, _ParticleEngine.lights[i].ellipseHeight);
				light.regX = _ParticleEngine.lights[i].ellipseWidth/2;
				light.regY = _ParticleEngine.lights[i].ellipseHeight/2; 
				light.y = light.initY = _ParticleEngine.totalHeight/2 + _ParticleEngine.lights[i].offsetY;
				light.x = light.initX =_ParticleEngine.totalWidth/2 + _ParticleEngine.lights[i].offsetX;

				blurFilter = new createjs.BlurFilter(_ParticleEngine.lights[i].ellipseWidth, _ParticleEngine.lights[i].ellipseHeight, 1);
				bounds = blurFilter.getBounds();
				light.filters = [blurFilter];
				light.cache(bounds.x-_ParticleEngine.lights[i].ellipseWidth/2, bounds.y-_ParticleEngine.lights[i].ellipseHeight/2, bounds.width*2, bounds.height*2);
				light.alpha = _ParticleEngine.lights[i].alpha;

				light.compositeOperation = "screen";
				_ParticleEngine.stage.addChildAt(light, 0);

				_ParticleEngine.lights[i].elem = light;
			}

			TweenMax.fromTo(_ParticleEngine.lights[0].elem, 10, {scaleX:1.5, x:_ParticleEngine.lights[0].elem.initX, y:_ParticleEngine.lights[0].elem.initY},{yoyo:true, repeat:-1, ease:Power1.easeInOut, scaleX:2, scaleY:0.7});
			TweenMax.fromTo(_ParticleEngine.lights[1].elem, 12, { x:_ParticleEngine.lights[1].elem.initX, y:_ParticleEngine.lights[1].elem.initY},{delay:5, yoyo:true, repeat:-1, ease:Power1.easeInOut, scaleY:2, scaleX:2, y:_ParticleEngine.totalHeight/2-50, x:_ParticleEngine.totalWidth/2+100});
			TweenMax.fromTo(_ParticleEngine.lights[2].elem, 8, { x:_ParticleEngine.lights[2].elem.initX, y:_ParticleEngine.lights[2].elem.initY},{delay:2, yoyo:true, repeat:-1, ease:Power1.easeInOut, scaleY:1.5, scaleX:1.5, y:_ParticleEngine.totalHeight/2, x:_ParticleEngine.totalWidth/2-200});
		}
		
		var blurFilter;
		function drawParticles(){

			for (var i = 0, len = _ParticleEngine.particleSettings.length; i < len; i++) {
				var ball = _ParticleEngine.particleSettings[i];

				var circle;
				for (var s = 0; s < ball.num; s++ )
				{
					circle = new createjs.Shape();
					if(ball.fill){
						circle.graphics.beginFill(ball.color).drawCircle(0, 0, ball.ballwidth);
						blurFilter = new createjs.BlurFilter(ball.ballwidth/2, ball.ballwidth/2, 1);
						circle.filters = [blurFilter];
						var bounds = blurFilter.getBounds();
						circle.cache(-50+bounds.x, -50+bounds.y, 100+bounds.width, 100+bounds.height);
					}else{
						circle.graphics.beginStroke(ball.color).setStrokeStyle(1).drawCircle(0, 0, ball.ballwidth);
					}
					
					circle.alpha = range(0, 0.1);
					circle.alphaMax = ball.alphamax;
					circle.distance = ball.ballwidth * 2;
					circle.ballwidth = ball.ballwidth;
					circle.flag = ball.id;
					_ParticleEngine.applySettings(circle, ball.fromX, ball.toX, ball.areaHeight);
					circle.speed = range(2, 10);
					circle.y = circle.initY;
					circle.x = circle.initX;
					circle.scaleX = circle.scaleY = range(0.3, 1);

					_ParticleEngine.stage.addChild(circle);
					

					animateBall(circle);

					_ParticleEngine.particleArray.push(circle);
				}
			}	
		}

		this.applySettings = function(circle, positionX, totalWidth, areaHeight)
		{
			circle.speed = range(1, 3);
			circle.initY = weightedRange(0, _ParticleEngine.totalHeight , 1, [_ParticleEngine.totalHeight * (2-areaHeight/2)/4, _ParticleEngine.totalHeight*(2+areaHeight/2)/4], 0.8 );
			circle.initX = weightedRange(positionX, totalWidth, 1, [positionX+ ((totalWidth-positionX))/4, positionX+ ((totalWidth-positionX)) * 3/4], 0.6);
		}

		function animateBall(ball)
		{
			var scale = range(0.3, 1);
			var xpos = range(ball.initX - ball.distance, ball.initX + ball.distance);
			var ypos = range(ball.initY - ball.distance, ball.initY + ball.distance);
			var speed = ball.speed;
			TweenMax.to(ball, speed, {scaleX:scale, scaleY:scale, x:xpos, y:ypos, onComplete:animateBall, onCompleteParams:[ball], ease:Cubic.easeInOut});	
			TweenMax.to(ball, speed/2, {alpha:range(0.1, ball.alphaMax), onComplete:fadeout, onCompleteParams:[ball, speed]});	
		}	

		function fadeout(ball, speed)
		{
			ball.speed = range(2, 10);
			TweenMax.to(ball, speed/2, {alpha:0 });
		}

		drawBgLight();
		drawParticles();
	}

	ParticleEngine.prototype.render = function()
	{
		this.stage.update();
	}

	ParticleEngine.prototype.resize = function()
	{
		this.totalWidth = this.canvasWidth = document.getElementById(this.canvas_id).width = document.getElementById(this.canvas_id).offsetWidth;
		this.totalHeight = this.canvasHeight = document.getElementById(this.canvas_id).height = document.getElementById(this.canvas_id).offsetHeight;
		this.render();

		for (var i= 0, length = this.particleArray.length; i < length; i++)
		{
			this.applySettings(this.particleArray[i], 0, this.totalWidth, this.particleArray[i].areaHeight);
		}

		for (var j = 0, len = this.lights.length; j < len; j++) {
			this.lights[j].elem.initY = this.totalHeight/2 + this.lights[j].offsetY;
			this.lights[j].elem.initX =this.totalWidth/2 + this.lights[j].offsetX;
			TweenMax.to(this.lights[j].elem, .5, {x:this.lights[j].elem.initX, y:this.lights[j].elem.initY});			
		}
	}

	return ParticleEngine;

}());


////////////////////////UTILS//////////////////////////////////////
//////////////////////////////////////////////////////////////////

function range(min, max)
{
	return min + (max - min) * Math.random();
}
		
function round(num, precision)
{
   var decimal = Math.pow(10, precision);
   return Math.round(decimal* num) / decimal;
}

function weightedRange(to, from, decimalPlaces, weightedRange, weightStrength)
{
	if (typeof from === "undefined" || from === null) { 
	    from = 0; 
	}
	if (typeof decimalPlaces === "undefined" || decimalPlaces === null) { 
	    decimalPlaces = 0; 
	}
	if (typeof weightedRange === "undefined" || weightedRange === null) { 
	    weightedRange = 0; 
	}
	if (typeof weightStrength === "undefined" || weightStrength === null) { 
	    weightStrength = 0; 
	}

   var ret
   if(to == from){return(to);}
 
   if(weightedRange && Math.random()<=weightStrength){
	  ret = round( Math.random()*(weightedRange[1]-weightedRange[0]) + weightedRange[0], decimalPlaces )
   }else{
	  ret = round( Math.random()*(to-from)+from, decimalPlaces )
   }
   return(ret);
}

///////////////// RUN CODE //////////////////////////
//////////////////////////////////////////////////////

var particles
(function(){
	particles = new ParticleEngine('projector');
	createjs.Ticker.addEventListener("tick", updateCanvas);
	window.addEventListener('resize', resizeCanvas, false);

	function updateCanvas(){
		particles.render();
	}

	function resizeCanvas(){
		particles.resize();
	}
}());