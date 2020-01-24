////////////////////////// PARTICLE ENGINE ////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////


//RL* This is the particle system by Louis Hoebregt.
//RL* It specializes in making Bokeh lights with no interactivity. While this can be a drawback, I found it much easier to digest than the much more
//RL* feature rich but extremely complicated particle system by Vincent Garreau.
//RL* Despite the simplicity, further examination of this particle system reveals that it relies on other Javascript libraries like EaselJS to create a specialized canvas
//RL* and TweenMax for the fancy bokeh light movements.
//RL* EaselJS describes itself as "A JavaScript library that makes working with the HTML5 Canvas element easy. 
//RL* Useful for creating games, generative art, and other highly graphical experiences." - EaselJS website
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
	 	//RL* "A stage is the root level Container for a display list. Each time its tick method is called, it will render its display list to its target canvas." - EaselJS
		this.stage = new createjs.Stage(canvas_id);
		//RL* "The Document method getElementById() returns an Element object representing the element whose id property matches the specified string."- MDN
		//RL* This is totally new... It seems hes basically declaring a bunch of different variables are equal to each other.
		//RL* Not sure why but none of the properties, parameters, or names here link to any other JS library used by this particle system.
		//RL* One thing that I do find super cool about this bokeh light system is compared to Vincent's, this one when resized, will bounce the lights all around the
		//RL* canvas, as opposed to Vincents which will just crop the resized parts out. Maybe this is why the canvas size is so heavily coded and referenced.
		this.totalWidth = this.canvasWidth = document.getElementById(canvas_id).width = document.getElementById(canvas_id).offsetWidth;
		this.totalHeight = this.canvasHeight = document.getElementById(canvas_id).height = document.getElementById(canvas_id).offsetHeight;
		//RL* google searches of compositeStyle and "lighter" reveal nothing.
		//RL* Correction - under MDN documentation for CompositeOperation 
		//RL* "lighter  Where both shapes overlap the color is determined by adding color values." -MDN
		this.compositeStyle = "lighter";

		//RL* Louis makes an array here called particleSettings.
		//RL* you can change a variety of things here like color and size and population of the particles
		//RL* num refers to population, area height is how much traveling the lights do, fromX is how much side to side travel the lights do.
		this.particleSettings = [{id:"small", num:5, fromX:0, toX:this.totalWidth, ballwidth:3, alphamax:0.4, areaHeight:.5, color:"#ffe6f2", fill:false}, 
								{id:"medium", num:15, fromX:0, toX:this.totalWidth,  ballwidth:14, alphamax:0.5, areaHeight:.5, color:"#ffe6f2", fill:true}, 
								{id:"large", num:30, fromX:0, toX:this.totalWidth, ballwidth:70,  alphamax:0.6, areaHeight:.5, color:" #bac2ff ", fill:true}];
		//RL* A second array is made. This is array is used further down the script in function draw particles which actually makes the particles.
		//RL* It is also in use for when the canvas resizes.
		this.particleArray = [];
		//RL* Values for the soft gradient lights in that float in the background.
		this.lights = [{ellipseWidth:300, ellipseHeight:100, alpha:0.2, offsetX:0, offsetY:400, color:"#ffe6f2"}, 
						{ellipseWidth:250, ellipseHeight:250, alpha:0.3, offsetX:-50, offsetY:400, color:"#ffe6f2"}, 
						{ellipseWidth:100, ellipseHeight:80, alpha:0.4, offsetX:80, offsetY:400, color:"#ff66ff"}];

		//RL* "type is a String identifying which of the compositing or blending mode operations to use."-MDN
		//RL* compositeOperation is an API in Javascript that allows for different types of blending modes.
		//RL* This is string here basically statles that the stage compositeOperation is the same as _ParticleEngine's
		this.stage.compositeOperation = _ParticleEngine.compositeStyle;


		//RL* This is the function that draws the background light.
		function drawBgLight()
		{
			//RL* Variables are made. I'm assuming light is the bokeh lights, bounds is the travel animation and blurfilter is what the name suggests.
			var light;
			var bounds;
			var blurFilter;
			//RL* A for loop is made. It says if i is less than len, it will incriment.
			//RL* Honestly I have no idea how this works...
			//RL* the .length property usually means how long a string is. But running the code in the browser shows that the lights have varied lifespans.
			//RL* so "len" cant be a static number. Maybe the fact that "len" does not have a hard value declared anywhere mean its random?
			for (var i = 0, len = _ParticleEngine.lights.length; i < len; i++) {		
				//RL* create.js again refersto easeljs library to create these shapes.
				//RL* The variable light declared above is having its properties accessed below. And the properties are getting its values from the array above.
				//RL* It seems that anything with [i] is pretty much data from the array above where we declared all our settings.
				//RL* Maybe the reason why these shapes have all these special functions is because the shapes being made from the easeljs library have all these functions coded in?
				//RL* "A Shape allows you to display vector art in the display list. It composites a Graphics instance which exposes all of the vector drawing methods. 
				//RL* The Graphics instance can be shared between multiple Shape instances to display the same vector graphics with different positions or transforms."-EaselJS
				light = new createjs.Shape();
				//RL* This code takes the data from the array to input data for the function.
				//RL* the _ParticleEngine was "this" and the array was "this.lights"
				light.graphics.beginFill(_ParticleEngine.lights[i].color).drawEllipse(0, 0, _ParticleEngine.lights[i].ellipseWidth, _ParticleEngine.lights[i].ellipseHeight);
				light.regX = _ParticleEngine.lights[i].ellipseWidth/2;
				light.regY = _ParticleEngine.lights[i].ellipseHeight/2; 
				light.y = light.initY = _ParticleEngine.totalHeight/2 + _ParticleEngine.lights[i].offsetY;
				light.x = light.initX =_ParticleEngine.totalWidth/2 + _ParticleEngine.lights[i].offsetX;

				//RL* another new createjs shape is made. This time, the BlurFilter property is accessed.
				//RL* "Applies a box blur to DisplayObjects in context 2D and a Gaussian blur in webgl. Note that this filter is fairly intensive, particularly if the quality is set higher than 1." - EaselJS
				blurFilter = new createjs.BlurFilter(_ParticleEngine.lights[i].ellipseWidth, _ParticleEngine.lights[i].ellipseHeight, 1);
				//RL* The getBounds property is described by easeljs as being used to account for the expanded boundry that occurs when the blur filter is applied.
				bounds = blurFilter.getBounds();
				//RL* An array is made for blurFilter.
				light.filters = [blurFilter];
				//RL* cache is described in EaselJS as "A cached object will not visually update until explicitly told to do so with a call to update, much like a Stage. 
				//RL* If a cache is being updated every frame it is likely not improving rendering performance. Cache are best used when updates will be sparse." - EaselJS
				light.cache(bounds.x-_ParticleEngine.lights[i].ellipseWidth/2, bounds.y-_ParticleEngine.lights[i].ellipseHeight/2, bounds.width*2, bounds.height*2);
				light.alpha = _ParticleEngine.lights[i].alpha;

				//RL* composite operation screen is another layering effect just like "lighter"
				light.compositeOperation = "screen";
				//RL* the .addChildAt property is described in EaselJS (Line 7365)
				//RL* "Adds a child to the display list at the specified index, bumping children at equal or greater indexes up one, and
				//RL* setting its parent to this Container." - EaselJS
				_ParticleEngine.stage.addChildAt(light, 0);

				_ParticleEngine.lights[i].elem = light;
			}

			//RL* TweenMax library is used here to animate the movement of the bokeh lights.
			//RL* .fromTo is "Static method for creating a TweenMax instance that allows you to define both the starting and ending values " - GreenSock Doc
			//RL* This is the syntax given on Green sock "TweenMax.fromTo([element1, element2], 1, {x:0}, {x:100});"
			//RL* Beginning values are declared. Towards the tail end of the string some variables declared above like ParticleEngine.TotalWidth etc are used as the end of the tween.
			//RL* fromTo will animate back and forthe between the two.
			TweenMax.fromTo(_ParticleEngine.lights[0].elem, 10, {scaleX:1.5, x:_ParticleEngine.lights[0].elem.initX, y:_ParticleEngine.lights[0].elem.initY},{yoyo:true, repeat:-1, ease:Power1.easeInOut, scaleX:2, scaleY:0.7});
			TweenMax.fromTo(_ParticleEngine.lights[1].elem, 12, { x:_ParticleEngine.lights[1].elem.initX, y:_ParticleEngine.lights[1].elem.initY},{delay:5, yoyo:true, repeat:-1, ease:Power1.easeInOut, scaleY:2, scaleX:2, y:_ParticleEngine.totalHeight/2-50, x:_ParticleEngine.totalWidth/2+100});
			TweenMax.fromTo(_ParticleEngine.lights[2].elem, 8, { x:_ParticleEngine.lights[2].elem.initX, y:_ParticleEngine.lights[2].elem.initY},{delay:2, yoyo:true, repeat:-1, ease:Power1.easeInOut, scaleY:1.5, scaleX:1.5, y:_ParticleEngine.totalHeight/2, x:_ParticleEngine.totalWidth/2-200});
		}
		
		//RL* Im not entirely sure why this variable is declared twice.
		var blurFilter;

		//RL* function draw particles is made.
		//RL* This function draws both the bokeh lights and the small tiny circles as well. 
		function drawParticles(){

			//RL* Another for loop is made. Same way as previously. I think this is a for loop to keep the for loop running? I can't seem to find any documentation about this
			//RL* on Easel JS. I feel like I'm missing a pretty big part of this picture. There is no variable for legnth being declared either.
			//RL* "The length property returns the length of a string (number of characters)." - W3Schools but what does it have to do with our particle system?
			for (var i = 0, len = _ParticleEngine.particleSettings.length; i < len; i++) {
				var ball = _ParticleEngine.particleSettings[i];
				//RL* Variable circle is made. A for loop using the numbers we declared above will make s increment until it is greater.
				var circle;
				for (var s = 0; s < ball.num; s++ )
				{
					//RL* Again, EaselJS library in action with different functions pulling data from the array we made upstairs.
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
					
					//RL* Data is being used from the array above where we declared all the settings.
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

		//RL* particleEngine propterty apply sttings is basically function with parameters (circle, positionX, totalWidth, areaHeight)
		//RL* These are the settings to tell how fast and how far up and down the bokeh lights can move. 
		//RL* by weighted range they limit how low and how high the balls can move.
		this.applySettings = function(circle, positionX, totalWidth, areaHeight)
		{
			circle.speed = range(1, 3);
			circle.initY = weightedRange(0, _ParticleEngine.totalHeight , 1, [_ParticleEngine.totalHeight * (2-areaHeight/2)/4, _ParticleEngine.totalHeight*(2+areaHeight/2)/4], 0.8 );
			circle.initX = weightedRange(positionX, totalWidth, 1, [positionX+ ((totalWidth-positionX))/4, positionX+ ((totalWidth-positionX)) * 3/4], 0.6);
		}

		//RL* function animateBall is made with parameter (ball). The parameter refers to variable ball being declared in line 157.
		//RL* While the chunk of code up there was to actually make the bokeh lights, this chunk here actually animates it via TweenMax.
		function animateBall(ball)
		{
			var scale = range(0.3, 1);
			var xpos = range(ball.initX - ball.distance, ball.initX + ball.distance);
			var ypos = range(ball.initY - ball.distance, ball.initY + ball.distance);
			var speed = ball.speed;
			//RL* TweenMax.to is "[static] Static method for creating a TweenMax instance that animates to the specified destination values (from the current values)." - TweenMax documentation
			//RL* Syntax - "TweenMax.to( target:Object, duration:Number, vars:Object )"
			//RL* Target object (or array of objects) whose properties should be affected. Duration in seconds (or frames). 
			//RL* An object defining the end value for each property that should be tweened as well as any special properties likeonComplete, ease, etc.
			TweenMax.to(ball, speed, {scaleX:scale, scaleY:scale, x:xpos, y:ypos, onComplete:animateBall, onCompleteParams:[ball], ease:Cubic.easeInOut});	
			TweenMax.to(ball, speed/2, {alpha:range(0.1, ball.alphaMax), onComplete:fadeout, onCompleteParams:[ball, speed]});	
		}	

		//RL* This function is to animate the bokeh lights fading in and out by the same methods as above. 
		function fadeout(ball, speed)
		{
			ball.speed = range(2, 10);
			TweenMax.to(ball, speed/2, {alpha:0 });
		}

		//RL* the two lines below run both functions that were made above.
		drawBgLight();
		drawParticles();
	}

	//RL* Not sure what .prototype is but googling it gave a MDN stating,
	//RL* avaScript is often described as a prototype-based language 
	//RL* — to provide inheritance, objects can have a prototype object, which acts as a template object that it inherits methods and properties from.
	//RL* I guess that makes sense but im not sure what the function of that is here. 
	ParticleEngine.prototype.render = function()
	{
		this.stage.update();
	}

	//RL*Particle Engine uses prototype as well here.
	//RL* Obviously this code is used to make the canvas resizable and scaleable.
	//RL* While I don't understand how this works - it is very easy to see it in action. Everytime the canvas is resized, the bokeh lights all adjust and bounce around.
	//RL* particle.js does not have his same effect.
	ParticleEngine.prototype.resize = function()
	{
		//RL* again a bunch of values we declared at the beginning of the code is being used. These values make the javascript response because the values are all
		//RL* tied to a bunch of document.getElementByID which is accessing the size through the .width and .height.
		this.totalWidth = this.canvasWidth = document.getElementById(this.canvas_id).width = document.getElementById(this.canvas_id).offsetWidth;
		this.totalHeight = this.canvasHeight = document.getElementById(this.canvas_id).height = document.getElementById(this.canvas_id).offsetHeight;
		this.render();

		//
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


//RL* This code is used to change the behavior of the movement of the lights.
//RL* For example, on lines 202 and 203 they values being put into the movement of the lights are parameters of function weightedRange.
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

//RL* A new function is made that ties the particle system here to the canvas id "projector"
var particles
(function(){
	particles = new ParticleEngine('projector');
	createjs.Ticker.addEventListener("tick", updateCanvas);
	//RL* An event window is added  to constantly check to see if the window is changed and the Javascript will respond.
	window.addEventListener('resize', resizeCanvas, false);

	function updateCanvas(){
		//RL* There is no .prototype for these versions of the function but these are the same lines of code as the ones above.
		//RL* I'm assuming as the canvas updates the particles keep rendering.
		particles.render();
	}

	function resizeCanvas(){
		//RL* Again, no .prototype here but im guessing as the canvas resizes the particles execute the resize code made above.
		particles.resize();
	}
}());

//RL* TLDR - Louis Hoebregt has created a compelling and dynamic particle system that not only has dynamic and fluid animation, but also responsive interactivity.
//RL* The Bokeh particle system first relies heavily of the EaselJS and TweenMax libraries. (examples Line 54 and 141)
//RL* An Array is created for the user to input different values so change the behaviors of the bokeh lights (Line 70)
//RL* Two functions are made to create both the glowing/pulshing background gradient and bokeh lights via EaselJS (Line 88 and 151)
//RL* Two functions are created to animate the particles via TweenMax. Because the gradient animation is simple it is inside the light function itself. (line 151)
//RL* The particle animation is much more dynamic and reacts to canvas resizing and is in a separate function. (line 208)
//RL* A function is made that has event listeners checking for the resizing of the canvas is made. This alerts the code to reanimate the bokeh lights on resize (Line247)
//RL* The particle engine function as a whole made in the beginning of the Javascript code is made and tied to the 'projector' canvas ID.