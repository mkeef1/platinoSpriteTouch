(function(){
	var platino = require('co.lanica.platino');
	var _W = Ti.Platform.displayCaps.platformWidth;
	var _H = Ti.Platform.displayCaps.platformHeight;
	
    var win = Ti.UI.createWindow();
    var game = platino.createGameView();
    var scene = platino.createScene();
    var touchables = [];
    
    var bg = platino.createSprite({
    	width: _W,
    	height: _H
    });
    //white background
    bg.color(1, 1, 1);
    
    var snapArea = platino.createSprite({
    	width: 100,
    	height: 120,
    	// alpha: 0.2
    });
    snapArea.color(1, 0, 0);
    
    snapArea.center = {
    	x: _W - (snapArea.width * 0.5),
    	y: _H - (snapArea.height * 0.5)
    };
    
    var world = platino.createSprite({
    	image: 'images/world.png',
    	width: 100,
    	height: 100
    });
    
    var world2 = platino.createSprite({
    	image: 'images/world.png',
    	width: 100,
    	height: 100,
    	// alpha: 0.2
    });
    
    var hello = platino.createTextSprite({
    	text: 'hello ',
    	fontSize: 18,
    	textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
    });
    
    //move world to center screen
    world.move(
    	_W * 0.5 - (world.width * 0.5),
    	_H * 0.5 - (world.height * 0.5)
    );
    
     hello.move(
    	_W * 0.5 - (hello.width * 0.5),
    	_H * 0.5 - (hello.height * 0.5) - 80
    );
    
    world2.move(
    	_W * 0.5 - (world.width * 0.5),
    	_H * 0.5 - (world.height * 0.5) - 100
    );
    
    scene.add(bg);
    scene.add(snapArea);
    scene.add(world);
    scene.add(world2);
    // scene.add(hello);
   
   	snapArea.addEventListener('checkDistance', function(e){
   		var x = this.center.x,
   			y = this.center.y,
   			distance = Math.sqrt(
   				((x - e.x) * (x - e.x)) + ((y - e.y) * (y - e.y))
   			),
   			threshold = 90;
   		if(distance <= threshold){
   			e.src.center = {
   				x: this.center.x,
   				y: this.center.y
   			};
   		}
   	});
    
    touchables.push(world);
    touchables.push(world2);
    
    world.addEventListener('touchstart', function(e){
    	scene.add(this);
    	
    	touchables.splice(e.index, 1);
    	touchables.push(this);
    	
    	this.diffX = e.x - this.center.x;
    	this.diffY = e.y - this.center.y;
    	this.hasTouch = true;
    });
    
    world.addEventListener('touchmove', function(e){
    	if(this.hasTouch){
    		this.center = {
    			x: e.x - this.diffX,
    			y: e.y - this.diffY
    		};
    	};
    });
     
    world.addEventListener('touchend', function(e){
    	snapArea.fireEvent('checkDistance', {
    		src: this,
    		x: this.center.x,
    		y: this.center.y
    	});
    	if(this.hasTouch){
    		this.hasTouch = false;
    	}
    });
    
    world2.addEventListener('touchstart', function(e){
    	scene.add(this);
    	
    	touchables.splice(e.index, 1);
    	touchables.push(this);
    	
    	this.diffX = e.x - this.center.x;
    	this.diffY = e.y - this.center.y;
    	this.hasTouch = true;
    });
    
    world2.addEventListener('touchmove', function(e){
    	if(this.hasTouch){
    		this.center = {
    			x: e.x - this.diffX,
    			y: e.y - this.diffY
    		};
    	};
    });
     
    world2.addEventListener('touchend', function(e){
    	snapArea.fireEvent('checkDistance', {
    		src: this,
    		x: this.center.x,
    		y: this.center.y
    	});
    	if(this.hasTouch){
    		this.hasTouch = false;
    	}
    });
    
    function handleTouches(e){
    	var i = touchables.length,
    		obj,
    		touched,
    		eventType = e.type,
    		x = e.x,
    		y = e.y;
    	while(i--){
    		obj = touchables[i];
    		touched = obj.contains(x, y);
    		if(eventType === 'touchstart'){
    			if(touched){
    				obj.fireEvent(eventType, {x: x, y: y, index: i});
    				return true;
    			}
    		}else{
    			if(obj.hasTouch){
    				obj.fireEvent(eventType, {x: x, y: y, index: i});
    				return true;
    			}
    		}
    	}
    }
    
    game.addEventListener('touchstart', handleTouches);
    game.addEventListener('touchmove', handleTouches);
    game.addEventListener('touchend', handleTouches);
    
    game.addEventListener('onload', function(e){
    	var self = e.source,
    		SCREEN = {
    			width: 320,
    			height: 568
    		},
    		scale = self.size.height / SCREEN.height;
    
    	self.screen = {
    		width: self.size.width / scale,
    		height: self.size.height / scale
    	};
    	
    	self.touchScaleX = self.screen.width / self.size.width;
    	self.touchScaleY = self.screen.height / self.size.height;
    	
    	self.pushScene(scene);
    	
    	//starts the game engine
    	self.start();
    });
    
    win.add(game);
    win.open();
})();