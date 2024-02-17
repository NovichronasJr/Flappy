class Game{
    constructor(canvas,context,button)
    {
        this.canvas = canvas;
        this.ctx = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.baseHeight = 720;                      //<--- we are declaring it for dynamic scaling i.e everitime the user scales the window horizontally or vertically, the game background should also scale according to it..
        this.ratio = this.height/this.baseHeight;   //<--- Declared for dynamic scaling. <----- ead above statement--->
        this.background = new Background(this);     //<--- for displaying background image objects of game--->
        this.player = new Player(this);
        this.obstacles = [];
        this.numberOfObstacles = 1000;
        this.score;  //<--- to decide scores..
        this.gameOver;
        this.timer;
        this.message1;
        this.message2;
        this.minSpeed; //<--- for player charging abilities..
        this.maxSpeed; //<--- for player charging abilities..
        this.bottomMargin = Math.floor(50 * this.ratio);
        this.resize(window.innerWidth,window.innerHeight); //<--- for first page load--->
        this.gravity;   //<--- to create gravity..
        this.speed;
        this.touchstartX;
        this.swipeDistance = 50;
        this.button = button;
      
        window.addEventListener('resize',(e)=>  //<---- this statement will work out of the constructor as well. If the window is resized this statement will be automatically triggered i.e it wont have to wait or run only during the execution of constructor.
        {                                       //<---- This block is only to make the game responsive i.e it should adapt with any screen size...
              this.resize(e.currentTarget.innerWidth,e.currentTarget.innerHeight);                    //<--- use arrow function because otherwise it wont work <---bacause arrow function do not bind their own 'this' keyword instead they inherit it from their parents.

        });

        this.canvas.addEventListener("mousedown",()=>{
          
            this.player.flap();
        });

        this.canvas.addEventListener("touchstart",(e)=>{
           this.player.flap();
            this.touchstartX = e.changedTouches[0].pageX;

        });

        this.canvas.addEventListener('touchmove',(e)=>{

               e.preventDefault();
        })


        this.canvas.addEventListener('touchend',(e)=>{

            if ( e.changedTouches[0].pageX - this.touchstartX > this.swipeDistance){
                this.player.startCharge();
               }else
               {
                this.player.flap();
               }
    
     })

        
        this.canvas.addEventListener('mousedown',(e)=>{

          this.player.flap();
     })

     this.canvas.addEventListener('mouseup',(e)=>{

        this.player.wingsup();
   })

        window.addEventListener('keydown',(e)=>{
          if(e.key === 'ArrowUp'  || e.key===' ')
          {
            this.player.flap();
            
          }

          if(e.key === 'Enter')
          {
            this.player.startCharge();
          }

          else if(e.key === 'r')
          {
            window.location.reload();
          }

        });

        this.button.addEventListener('click',()=>{
            window.location.reload();
        })
        

    }

    resize(width ,height){
            this.canvas.width = width;          //<--- we are creating a separate function for rezize so as to prevent blue canvas element from resizing when declared in the window.addEventListener method in constructor itself
            this.canvas.height = height;  
            this.ctx.fillStyle = 'red';        //<--- it is important to set fillstyle while resizing rather than calling it again and again in render(). 
            this.ctx.font = '30px Franklin Gothic Medium';
            this.ctx.textAlign = 'right';
            this.ctx.lineWidth = 3;
            this.ctx.strokeStyle = 'white';
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.ratio = this.height/this.baseHeight; //<--- to update ratio according to dynamic scaling --->
            this.gravity = 0.13 * this.ratio;  //<---- to pull each player down by value 0.15px per frame according to ratio-->
            this.speed = 3 * this.ratio;     //<--- for increasing players speed moving rightwards actually background will move to left--->
            this.minSpeed = this.speed;
            this.maxSpeed = this.speed * 5;
            this.background.resize();
            this.player.resize();  //<--- this method should be after the ratio--->
            this.createObjects();
            this.obstacles.forEach(obstacle =>{
                obstacle.resize();
            });
            this.score = 0;
            this.gameOver = false;
            this.timer = 0;
            
            
    }

    render(deltaTime){  //<--- to draw game objects ---> function is written in Player.js...
        if(!this.gameOver){this.timer += deltaTime;}   //<--- only increase the timer if game not over...
        this.background.update();
        this.background.draw();
        this.drawStatusText();
        this.player.update();
        this.player.draw();   //<--- draw() method should be written first before update method() otherwise it will not work--->
        
        this.obstacles.forEach(obstacle =>{
            obstacle.update();
            obstacle.draw();
        });
    
    }

    createObjects()  //<--- to create obstacles...
    {
        this.obstacles = [];
        const firstX = this.baseHeight * this.ratio;   //<-- to provide player a good start at first so that he will not have to deal with the obstacle as soon as the game starts..
        const obstaclespacing = 600 * this.ratio;
        for(let i = 0 ; i < this.numberOfObstacles;i++)
        {
            this.obstacles.push(new Obstacle(this, firstX + i * obstaclespacing));  //<--- crreating an array of obstacle class objects--->
        }
    }

    checkcollision(a,b)
    {
        const dx = a.collisionX - b.collisionX;
        const dy = a.collisionY - b.collisionY;
        const distance = Math.hypot(dx,dy);
        const sumofradii = a.collisionRadius + b.collisionRadius;
        return distance <= sumofradii;

    }

    formatTimer()
    {
        return (this.timer * 0.001).toFixed(2);
    }

    drawStatusText()
    {
        this.ctx.save();
        this.ctx.fillText('Score: '+ this.score,this.width - 20,30);
        this.ctx.textAlign='left';
        this.ctx.fillText('Timer: '+ this.formatTimer(), 10,30);
       
        if(this.gameOver){
            if(this.player.collided)
            {
                this.ctx.fillStyle = 'black';
                this.message1 = 'Getting Rusty?';
                this.message2 = "collision time :- "+ this.formatTimer()+'seconds!';
            }else if(this.obstacles.length <= 0 )
            {
                this.ctx.fillStyle = 'black';
                this.message1 = 'Nailed It';
                this.message2 = "Can you do it faster than "+ this.formatTimer()+'seconds?';

            }
            
            this.ctx.textAlign = 'center';
            this.ctx.font = '50px sans-serif';
            this.ctx.fillText(this.message1,this.width * 0.5,this.height*0.5 - 60);
            this.ctx.font = '30px sans-serif';
            this.ctx.fillText(this.message2,this.width * 0.5,this.height*0.5 - 10);
            this.ctx.fillText("press R to try again",this.width * 0.5,this.height*0.5 + 20);
            
        }

        if(this.player.energy <= this.player.minEnergy)
        {
            this.ctx.fillStyle = 'red';
        }
        else if(this.player.energy >= this.player.maxEnergy)
        {
            this.ctx.fillStyle = 'blue';
        }
        for(let i = 0 ; i < this.player.energy;i++)
        {
            this.ctx.fillRect(200 + i * 8 * this.ratio, 10 * this.ratio ,6,this.player.barsize); //<--- to make energy bar dynamically scalable..
        }
        this.ctx.restore();
    }
}

window.addEventListener('load',function(e){   //<---setting a canvas--><--- runs every time we load the website--->
    
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d');
    canvas.width = 720;
    canvas.height = 720;
    const button  = document.querySelector('#R');
    const game = new Game(canvas,ctx,button); 
    
    let lastTime = 0;
    function animate(timeStamp){     //<--- it will run without stopping. Like a recursive loop.
        const deltaTime = timeStamp - lastTime; //<--- important concept delta time to set timer --->
        lastTime = timeStamp;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.render(deltaTime);
                                       //<--- only animate if game not over.... if(!game.gameOver) means if gameOver is false...   //<--- game over logic written in Obstacle.js...
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);


})