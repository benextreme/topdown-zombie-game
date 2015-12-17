var UP = 4;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var cell = 0;
var celldown = 0;
var cellup = 0;
var cellleft = 0;
var cellright = 0;


var Enemy = function(x, y)
{
	this.position = new Vector2();
	this.position.set(x, y);
	
	this.direction = UP;
	
	this.pause = 0;
	
	this.width = 16;
	this.height = 16;
	
	this.image = document.createElement("img");
	this.image.src ="enemy.png";
	
	this.velocity = new Vector2(-1,0);
	this.speed = 1;
	
}

Enemy.prototype.update = function(deltaTime)
{
	var ddx = 0; // acceleration
	var ddy = 0; // was GRAVITY to simulate going down

	// calculate the new position and velocity:
	
	

	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	var nx = (this.position.x)%TILE; // true if player overlaps right
	var ny = (this.position.y)%TILE; // true if player overlaps below
	
	
	cell = cellAtTileCoord(LAYER_ENEMY_PATHING, tx, ty);
	
	cellright = cellAtTileCoord(LAYER_ENEMY_PATHING, tx + 1, ty);
	celldown = cellAtTileCoord(LAYER_ENEMY_PATHING, tx, ty + 1);
	cellleft = cellAtTileCoord(LAYER_ENEMY_PATHING, tx - 1, ty);
	cellup = cellAtTileCoord(LAYER_ENEMY_PATHING, tx, ty - 1);
	
	if (tx == this.oldtx && ty == this.oldty)
	{
		// if still in same tile, move.
		this.position.y += (deltaTime * this.velocity.y);
		this.position.x += (deltaTime * this.velocity.x);
	}
	// if enemy is in a new tile
	else
	{
		this.oldtx = tx;
		this.oldty = ty;
		
		switch(this.direction)
		{
			case UP:
				if (cellup && !cellleft && !cellright)
				{
					this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
					this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
				}
				else
					this.chooseDirection();
			break;
			
			case LEFT:
				if (cellleft && !cellup && !celldown)
				{
					this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
					this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));	
				}
				else
					this.chooseDirection();
			break;
			
			case DOWN:
				if (celldown && !cellleft && !cellright)
				{
					this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
					this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
				}
				else
					this.chooseDirection();
			break;
			
			case RIGHT:
				if (cellright && !cellup && !celldown)
				{
					this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
					this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
				}
				else
					this.chooseDirection();
			break;
		}
	}
	
	
	
	// If the player has vertical velocity, then check to see if they have hit a platform
	// below or above, in which case, stop their vertical velocity, and clamp their
	// y position:
	/*
	if ((!celldown && cell)) 
	{
		this.position.y = tileToPixel(ty);
		this.velocity.y = 0; // stop downward velocity
		this.down = 0;
	}
	else
		this.down = 1;


	if ((!cellup && cell)) 
	{
		// clamp the y position to avoid jumping into platform above
		this.position.y = tileToPixel(ty + 1);
		this.velocity.y = 0; // stop upward velocity
		this.up = 0;
	}
	else
		this.up = 1;

	if ((!cellright && cell)) 
	{
		// clamp the x position to avoid moving into the platform we just hit
		this.position.x = tileToPixel(tx);
		this.velocity.x = 0; // stop horizontal velocity
		this.right = 0;
	}
	else
		this.right = 1;


	if ((!cellleft && cell)) 
	{
		// clamp the x position to avoid moving into the platform we just hit
		this.position.x = tileToPixel(tx + 1);
		this.velocity.x = 0; // stop horizontal velocity
		this.left = 0;
	}
	else
		this.left = 1;
	
	this.totalPaths = this.up + this.down + this.left + this.right;
	
	switch(this.direction)
	{
	case UP:
		if (cellup && !cellleft && !cellright)
		{
			this.position.y -= 1;
		}
		else
			this.chooseDirection();
	break;
	
	case LEFT:
		if (cellleft && !cellup && !celldown)
		{
			this.position.x -= 1;
		}
		else
			this.chooseDirection();
	break;
	
	case DOWN:
		if (celldown && !cellleft && !cellright)
		{
			this.position.y += 1;
		}
		else
			this.chooseDirection();
	break;
	
	case RIGHT:
		if (cellright && !cellup && !celldown)
		{
			this.position.x += 1;
		}
		else
			this.chooseDirection();
	break;
	
	default:
		this.chooseDirection();
	break;
	}
	*/
		this.lineOfSight();

	
}

Enemy.prototype.chooseDirection = function()
{		
	number = Math.random();
	number *= 4;
	number = Math.floor(number);
	number += 1;
	
	this.direction = number;
	switch(this.direction)
	{
		case UP:
			this.velocity.x = 0;
			this.velocity.y = -60;
			if (!cellup)
				this.chooseDirection();
		break;
		
		case LEFT:
			this.velocity.x = -60;
			this.velocity.y = 0;
			if (!cellleft)
				this.chooseDirection();
		break;
		
		case DOWN:
			this.velocity.x = 0;
			this.velocity.y = 60;
			if (!celldown)
				this.chooseDirection();
		break;
		
		case RIGHT:
			this.velocity.x = 60;
			this.velocity.y = 0;
			if (!cellright)
				this.chooseDirection();
		break;
		
		default:
		break;
	}
	
}

Enemy.prototype.lineOfSight = function()
{
	var objectDistance = Math.sqrt(Math.pow(this.position.x - player.position.x,2)+Math.pow(this.position.y - player.position.y,2))
	
	if (objectDistance < 500)
	{
		var m = (this.position.y - player.position.y) / (this.position.x - player.position.x);
		var c = player.position.y - m * player.position.x;
		var domain =  player.position.x - this.position.x;
		var range = player.position.y - this.position.y;
		
		for (var i =0; i<50; i++)
		{
			var x = i * (domain/50) + this.position.x;
			
			// IF STATEMENT as if the two objects have the same x coord, therefore the line is vertical. vertical lines have infinite gradients and y intercepts. 
			// If line is vertical, simply spread boxes out vertically instead of based on a formula of a line.
			if (this.position.x != player.position.x)
			var y = (m * x + c);
			else
			var y = i *(range/50) + this.position.y; // multiplied by i instead of x as when line is vertical, x will be 0 essentially and fuck everything
			
			var tx = pixelToTile(x);
			var ty = pixelToTile(y);
			
			context.fillStyle = "black"
			if (cellAtTileCoord(LAYER_PLATFORMS, tx, ty))
			context.fillStyle = "red"
			
			context.fillRect(tx*TILE - camera.worldOffsetX,ty*TILE - camera.worldOffsetY,TILE,TILE)
			context.fillStyle = "yellow"
			
			context.fillRect(x - camera.worldOffsetX,y - camera.worldOffsetY,5,5)
		}
	}
}

Enemy.prototype.draw = function(deltaTime)
{
	context.drawImage(this.image, this.position.x - camera.worldOffsetX - this.width/2, this.position.y - camera.worldOffsetY - this.height/2)

}