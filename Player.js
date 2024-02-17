class Player{
    constructor(game)
    {
        this.game = game;
        this.x = 20;
        this.y;
        this.spriteWidth = 200;   //<--- players width is available in spritesheets which we will be using for game..
        this.spriteHeight = 200;   //<----//<--- players height is available in spritesheets which we will be using for game..
        this.width;
        this.height;
        this.speedY ;
        this.flapspeed; 
        this.collisionX;
        this.collisionY;
        this.collisionRadius;
        this.collided;
        this.energy = 30;  //<--- to make the player charge ...
        this.maxEnergy = this.energy * 2;
        this.minEnergy = 15;
        this.charging = false;
        this.barsize;
        this.image = document.getElementById('player');
        this.frameY;
    }
 
    draw()
    {
        this.game.ctx.drawImage(this.image,0,this.frameY * this.spriteHeight,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
        this.game.ctx.beginPath();
        this.game.ctx.arc(this.collisionX,this.collisionY,this.collisionRadius,0,Math.PI*2);
        //this.game.ctx.stroke();
        
    }

    update()
    {
            this.HandleEnergy();
            this.y += this.speedY;
            this.collisionY = this.y + this.height*0.5;
            if(this.speedY >= 0){
                this.wingsup();
            }
            
           if(!this.isTouchingBottom() && (!this.charging)) //<--- for giving gravity---> game height and player height is fixed but position increases to bottom along y axis till it reaches the bottom where ----> the position becomes equal to (gameheight - playerheight)
           {
                this.speedY+=this.game.gravity;          //<--- game physics --><----- READ ABOVE STATEMENT till the END -->
           }
           else{
            this.speedY = 0;
           }

           if(this.isTouchingBottom())
           {

                this.y = this.game.height-this.height-this.game.bottomMargin;
                if(!this.charging)
                this.wingsIdle(); 

           }
    }

    resize()   //<M--- we are creating this method for dynamic scaling because players width and height is fixed in spritesheets but we will need to adjust it to particular ratio when window is resized.
    {
        this.width = this.spriteWidth * this.game.ratio;
        this.height = this.spriteHeight * this.game.ratio;
        this.y = this.game.height * 0.5 - this.height * 0.5;
        this.speedY = -4 * this.game.ratio;
        this.flapspeed = 7 * this.game.ratio;
        this.collisionRadius = this.width * 0.5 * 0.5*0.5   ;
        this.collisionX = (this.x+60) + this.width * 0.5 ;
        this.collisionY = this.y + this.height * 0.5;
        this.collided = false;
        this.barsize = 20 * this.game.ratio;
        this.frameY = 0;
        this.charging = false;

    }

    isTouchingBottom()   //<--- custom function  which returns true if player reaches bottom----> <---- to be passed in second if statement in update() function --->
    {
        return this.y >= this.game.height-this.height - this.game.bottomMargin;
    }


    isTouchingTop()
    {
        return this.y <= 0;
    }

    flap()
    {
        this.stopCharge();
        
        if(!this.isTouchingTop())
    {
        this.speedY = -this.flapspeed;
        this.wingsdown();
    }

    }

    HandleEnergy()   //<--- if energy is less than max energy then it will keep on increasing by 0.1 per animation frame.
    {
        if(this.energy < this.maxEnergy)
        {
            this.energy += 0.1;
        }
        if(this.charging)
        {
            this.energy -= 1;
            if(this.energy <= 0)
        {
            this.energy = 0;
            this.stopCharge();
        }
        }
        
    }

    startCharge()   //<--- to deplete energy while player charges
    {
        if(this.energy>=this.minEnergy)
        {
            this.charging = true;
            this.game.speed = this.game.maxSpeed;
            this.wingsCharge();
        }

    }

    stopCharge()  //<--- to not allow player to charge if energy is less than energy required to charge(this.energy).
    {
        this.charging = false;
        this.game.speed = this.game.minSpeed;
       
    }

    wingsIdle()            //<--- for animating player... by manipulating frameY variable.. 
    {
        this.frameY = 0;
    }

    wingsdown()            //<--- for animating player... by manipulating frameY variable..
    {
        if(!this.charging) this.frameY = 1;
    }

    wingsup()             //<--- for animating player... by manipulating frameY variable..
    {
        if(!this.charging) this.frameY = 2;
    }
    wingsCharge()         //<--- for animating player... by manipulating frameY variable..  
    {
        this.frameY = 3;  
    }
}