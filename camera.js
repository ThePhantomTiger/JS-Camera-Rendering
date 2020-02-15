
let canvas;
let camera;
let context;
let circles;
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
    context.closePath();
    context.stroke();
}

function draw ()
{
    context.clearRect(0, 0, document.querySelector("#myCanvas").width, document.querySelector("#myCanvas").height)
    
    circles.forEach(function(circle) { if(Math.abs(circle.x - camera.x) < camera.xRange && Math.abs(circle.y - camera.y) < camera.yRange){ drawCircle(circle, context)};} );
   
    window.requestAnimationFrame(draw);
    
}

const keyMap = 
{
    39 : 'right',
    37 : 'left',
    38 : 'up',
    40 : 'down'
};
function keydown(event)
{
    if(keyMap[event.keyCode] == 'left')
    {
        camera.x -= 10;
    }
    else if(keyMap[event.keyCode] == 'right')
    {
        camera.x += 10;
    }
}

window.addEventListener('keydown', keydown);
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