
let canvas;
let camera;
let context;
let circles;
const speed = 50;

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

function main()
{
    canvas = document.querySelector('#myCanvas');
    context = canvas.getContext('2d');

    circles = [];
    for (let index = 0; index < 1000; index++) {
        let x =  Math.floor((Math.random() * 4000) - 2000 );
        let y =  Math.floor((Math.random() * 1000) + 1); 
        let radius =  Math.floor((Math.random() * 10) + 1); 
        circles.push(new Circle(x,y,radius));
        
    }
    camera = new Camera();
    


    window.requestAnimationFrame(draw)
}

function drawCircle(circle, context)
{
    context.beginPath();
    let x = circle.x - camera.x;
    let y = circle.y - camera.y;
    context.arc(x,y, circle.radius, 0, 2 * Math.PI);
    let xChange = Math.random() < 0.5 ? -1: 1;
    let yChange = Math.random() < 0.5 ? -1: 1;
    circle.y += xChange;
    circle.x += yChange;
    context.fill();
    context.closePath();
    context.stroke();
}

function draw ()
{
    context.clearRect(0, 0, document.querySelector("#myCanvas").width, document.querySelector("#myCanvas").height)
    let count = 0;
    circles.forEach(function(circle) {
         if(Math.abs(circle.x - camera.x) < camera.xRange && Math.abs(circle.y - camera.y) < camera.yRange){ drawCircle(circle, context); count++;}
         
        } );
    console.log("Circles Drawn: " + count);
    camera.x += (cameraControlStates["Right"] ? speed : 0);
    camera.x += (cameraControlStates["Left"] ? -speed : 0);
    camera.y += (cameraControlStates["Up"] ? -speed : 0);
    camera.y += (cameraControlStates["Down"] ? speed : 0);

    
    

    window.requestAnimationFrame(draw);
    
}
let cameraControlStates = 
{
    "Up": false,
    "Left" : false,
    "Down" : false,
    "Right" : false
};
const keyMap = 
{
    "KeyD" : 'Right',
    "ArrowRight" : 'Right',
    "ArrowLeft" : 'Left',
    "KeyA" : 'Left',
    
    "KeyW" : 'Up',
    "ArrowUp" : 'Up',
    "KeyS" : 'Down',    
    "ArrowDown" : 'Down'
};
function keyDown(event)
{
    console.log("KeyDown")
    cameraControlStates["Up"] = keyMap[event.code] == 'Up' ? true : cameraControlStates["Up"];
    cameraControlStates["Right"] = keyMap[event.code] == 'Right' ? true : cameraControlStates["Right"];
    cameraControlStates["Down"] = keyMap[event.code] == 'Down' ? true : cameraControlStates["Down"];
    cameraControlStates["Left"] = keyMap[event.code] == 'Left' ? true : cameraControlStates["Left"];
}
function keyUp(event)
{
    console.log("KeyUp");
    cameraControlStates["Up"] = keyMap[event.code] == 'Up' ? false : cameraControlStates["Up"];
    cameraControlStates["Right"] = keyMap[event.code] == 'Right' ? false : cameraControlStates["Right"];
    cameraControlStates["Down"] = keyMap[event.code] == 'Down' ? false : cameraControlStates["Down"];
    cameraControlStates["Left"] = keyMap[event.code] == 'Left' ? false : cameraControlStates["Left"];
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
class Circle{
    constructor(xCenter, yCenter, radius){
        this.x = xCenter;
        this.y = yCenter;
        this.radius = radius;
    }
}

class Camera {
    constructor(){
        this.x = 0;
        this.y = 0;
        this.xRange = window.innerWidth;
        this.yRange = window.innerHeight;
    }
}