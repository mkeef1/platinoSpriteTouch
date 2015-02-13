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
    
    var world = platino.createSprite({
    	image: 'images/world.png',
    	width: 100,
    	height: 100
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
    
    scene.add(bg);
    scene.add(world);
    scene.add(hello);
    
    touchables.push(world);
    
    world.addEventListener('touchstart', function(e){
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
    				obj.fireEvent(eventType, {x: x, y: y});
    			}
    		}else{
    			if(obj.hasTouch){
    				obj.fireEvent(eventType, {x: x, y: y});
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