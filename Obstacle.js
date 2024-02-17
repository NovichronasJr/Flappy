class Obstacle
{
    constructor(game,x)
    {
        this.game = game;
        this.spritewidth = 120;
        this.spriteheight = 120;
        this.scaleWidth = this.spritewidth * this.game.ratio;
        this.scaleHeight = this.spriteheight * this.game.ratio;
        this.x = x;
        this.y = Math.random() * (this.game.height - this.scaleHeight);
        this.collisionX;                        //<--- for collisions between player and obstacles...
        this.collisionY;                        //<--- for collisions between player and obstacles...
        this.collisionRadius = this.scaleWidth * 0.5 * 0.5  //<--- for collisions between player and obstacles...
        this.speedY = Math.random()< 0.5 ? -1 * this.game.ratio : 1 * this.game.ratio ;  //<---- this will create each obstacle in obstacle array to move randomly and not in the same manner...
        this.markedForDeletion = false;
        this.image = document.getElementById('obstacle');
        this.frameX = Math.floor(Math.random() * 4);  //<--- to get different obstacles all the time randomly...
    }

    update()
    {
        this.x -= this.game.speed;
        this.y += this.speedY;
        this.collisionX = this.x + this.scaleWidth*0.5;
        this.collisionY = this.y + this.scaleHeight*0.5;
        if(!this.game.gameOver)   //<--- make the obstacles floating till game is not over..
        {
            if(this.y <= 0 || this.y >= this.game.height - this.scaleHeight)   //<---- to create bouncing obstacles--->
        {
            this.speedY *= -1;    //<---- look carefully <--- this is done to create bouncing obstacles---->
        }
        }

        else{      //<--- make all obstacles fall if game not over. 
            this.speedY += 1;
        }
        

        if(this.isOffScreen())
        {
            this.markedForDeletion = true;
            this.game.obstacles = this.game.obstacles.filter(obstacle=>{    //<--- to keep only those obstacles in array whose marked for deletion is false as they have not gone offscreen <--- this can be used to decide scores...
                return obstacle.markedForDeletion!==true;
            });
            //this.game.score ++;
            if(!this.game.gameOver)
            {
                this.game.score = 1000 - this.game.obstacles.length;
            }
            if(this.game.obstacles.length <= 0)
            {
                this.game.gameOver = true;
            }
        }

        if(this.game.checkcollision(this,this.game.player))
        {
            this.game.gameOver = true;
            this.game.player.collided = true;
            this.game.player.stopCharge();

        }
    }

    draw()
    {
        
        this.game.ctx.drawImage(this.image,this.frameX * this.spritewidth ,0,this.spritewidth,this.spriteheight,this.x,this.y,this.scaleWidth,this.scaleHeight );
        this.game.ctx.beginPath();
        this.game.ctx.arc(this.collisionX,this.collisionY,this.collisionRadius,0,Math.PI*2);
        // this.game.ctx.stroke();   //<--- the above statements arc and beginpath will not directly render on canvas therefore we need to call stroke mathod..
    }

    resize()
    {

        this.scaleWidth = this.spritewidth * this.game.ratio ;
        this.scaleHeight = this.spriteheight * this.game.ratio;

    }

    isOffScreen()
    {
        return this.x < -this.scaleWidth || this.y > this.game.height;
    }

    
}