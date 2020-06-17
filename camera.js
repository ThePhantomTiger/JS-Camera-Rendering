
let canvas;
let camera;
let context;
let circles;

//Setup For The Main Method.
function setup()
{
    console.log('hello');
    canvas = document.createElement('canvas');
    canvas.id = 'myCanvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; 
    document.body.appendChild(canvas);
    
    main();
}

//Creates The Circles, Adds Event Listeners And Begins The Main Update Loop.
function main()
{
    canvas = document.querySelector('#myCanvas');
    context = canvas.getContext('2d');

    circles = [];
    for (let index = 0; index < 5000; index++) {
        let x =  Math.floor((Math.random() * 4000) - 2000 );
        let y =  Math.floor((Math.random() * 1000) - 1000); 
        let radius =  Math.floor((Math.random() * 10) + 1); 
        circles.push(new Circle(x,y,radius));
        
    }
    camera = new Camera();
    
    window.addEventListener('keydown', function(e){camera.keyDown(e)});
    window.addEventListener('keyup', function(e){camera.keyUp(e)});
    


    window.requestAnimationFrame(draw)
}

//Draws The Circles Themselves.
//Gets A Circle Object, And The Drawing Context.
function drawCircle(circle, context)
{
    context.beginPath();

    let x = Math.abs(camera.xMin - circle.x);
    x = (x*window.innerWidth)/camera.xRange;
    let y = Math.abs(camera.yMin - circle.y);
    y = (y*window.innerHeight)/camera.yRange;
    
    

    context.arc(x,y, circle.radius * camera.zoomScale, 0, 2 * Math.PI);
    let xChange = Math.random() < 0.5 ? -1: 1;
    let yChange = Math.random() < 0.5 ? -1: 1;
    circle.y += xChange;
    circle.x += yChange;
    context.fill();
    context.closePath();
    context.stroke();
}

//Main Update Function
//Draws Circles And Updates Camera
function draw ()
{
    console.log("Camera Pos: " + "X: " + camera.x + " Y: " + camera.y );
    context.clearRect(0, 0, document.querySelector("#myCanvas").width, document.querySelector("#myCanvas").height)
    let count = 0;
    circles.forEach(function(circle) {
         if(Math.abs(circle.x - camera.x) < camera.xRange && Math.abs(circle.y - camera.y) < camera.yRange){ drawCircle(circle, context); count++;}
         
        } );

    camera.update();
    
    

    
    

    window.requestAnimationFrame(draw);
    
}

//KeyMap Translates Keys To Actions.
const keyMap = 
{
    "KeyD" : 'Right',
    "ArrowRight" : 'Right',
    "ArrowLeft" : 'Left',
    "KeyA" : 'Left',
    
    "KeyW" : 'Up',
    "ArrowUp" : 'Up',
    "KeyS" : 'Down',    
    "ArrowDown" : 'Down',
    "Minus" : "ZoomOut",
    "Add" : "ZoomIn",
    "Equal" : "ZoomIn"
};


class Circle{
    constructor(xCenter, yCenter, radius){
        this.x = xCenter;
        this.y = yCenter;
        this.radius = radius;
    }
}

class Camera {

    speed = 50;
    actionBuffer = [];
    controlStates = {"Up" : false, "Right" : false, "Down" : false, "Left" : false};
    
    constructor(){
        this.x = 0;
        this.y = 0;
        this.xRange = 500;
        this.yRange = window.innerHeight;
        this.zoomScale = 1;
        
        this.xMin = this.x - this.xRange;
        this.xMax = this.x + this.xRange;
        this.yMin = this.y - this.yRange;
        this.yMax = this.y + this.yRange;
    
    }

    

    keyUp(event)
    {
        //Update State To Say Key Is No Longer Being Pressed
        if(!keyMap[event.code])
        {
            return;
        }
        else if(keyMap[event.code] == 'Up')
        {
            this.controlStates["Up"] = false;
        }
        else if(keyMap[event.code] == 'Right')
        {
            this.controlStates["Right"] = false;
        }
        else if(keyMap[event.code] == 'Down')
        {
            this.controlStates["Down"] = false;
        }
        else if(keyMap[event.code] == 'Left')
        {
            this.controlStates["Left"] = false;
        }
        return;
    }
    keyDown(event)
    {
        //Process The Input
        //Check If Key In Key Map
        //Update State To Say Key Is Being Pressed And Add Action To actionBuffer.
        if(!keyMap[event.code])
        {
            return;
        }
        else if(keyMap[event.code] == 'Up')
        {
            this.actionBuffer.push("Up");
            this.controlStates["Up"] = true;
        }
        else if(keyMap[event.code] == 'Right')
        {
            this.xMin = this.x - this.xRange;
            this.controlStates["Right"] = true;
        }
        else if(keyMap[event.code] == 'Down')
        {
            this.actionBuffer.push("Down");
            this.controlStates["Down"] = true;
        }
        else if(keyMap[event.code] == 'Left')
        {
            this.actionBuffer.push("Left");
            this.controlStates["Left"] = true;
        }
        else if(keyMap[event.code] == "ZoomOut")
        {
            this.zoomScale -= this.zoomScale * 0.1;

            this.xRange += this.xRange * 0.1;
            this.yRange += this.yRange * 0.1
        }
        else if(keyMap[event.code] == "ZoomIn")
        {
            this.zoomScale += this.zoomScale * 0.1;
            
            this.xRange -= this.xRange * 0.1;
            this.yRange -= this.yRange * 0.1
            
        }
        return;
    }
    update()
    {
            //Move Camera Based On If Correct Button Is Held Down Right Now.
            this.x += (this.controlStates["Right"] ? this.speed*(1/this.zoomScale) : 0);
            this.x += (this.controlStates["Left"] ? -this.speed*(1/this.zoomScale) : 0);
            this.y += (this.controlStates["Up"] ? -this.speed*(1/this.zoomScale) : 0);
            this.y += (this.controlStates["Down"] ? this.speed*(1/this.zoomScale) : 0);

        //Move Camera Based On If Button Was Pressed In Between Draw Calls.
        let action;
        while((action = this.actionBuffer.shift()))
        {
            this.x += (action == "Right" ? this.speed*(1/this.zoomScale) : 0);
            this.x += (action == "Left" ? -this.speed*(1/this.zoomScale) : 0);
            this.y += (action == "Up" ? -this.speed*(1/this.zoomScale) : 0);
            this.y += (action == "Down" ? this.speed*(1/this.zoomScale) : 0);
        }
        
        //Update The Minimum X And Y Values To Be Drawn On Screen.
        this.xMin = this.x - this.xRange;
        this.yMin = this.y - this.yRange;

    }
    switchCamera()
    {
        //Clean Up The State Of The Camera Before Switching To A Different One.
        this.controlStates["Up"] = false;
        this.controlStates["Right"] = false;
        this.controlStates["Down"] = false;
        this.controlStates["Left"] = false;
        //Remove Event Listeners.
        window.removeEventListener('keydown', function(e){this.keyDown(e)});
        window.removeEventListener('keyup', function(e){this.keyUp(e)});
        
    }

}