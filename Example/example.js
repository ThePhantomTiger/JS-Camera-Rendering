
import {getRelativeCoords, keyMap, Camera } from '../src/camera.js';


let canvas;
let camera;
let context;
let circles;

class Circle{
    constructor(xCenter, yCenter, radius){
        this.x = xCenter;
        this.y = yCenter;
        this.radius = radius;
    }
}

setup();
console.log("Test");



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
    camera = new Camera(0,0);
    
    window.addEventListener('keydown', function(e){camera.keyDown(e)});
    window.addEventListener('keyup', function(e){camera.keyUp(e)});
    


    window.requestAnimationFrame(draw)
}


//Main Update Function
//Draws Circles And Updates Camera
function draw ()
{
    context.clearRect(0, 0, document.querySelector("#myCanvas").width, document.querySelector("#myCanvas").height)
    let count = 0;
    circles.forEach(function(circle) {
         if(Math.abs(circle.x - camera.x) < camera.xRange && Math.abs(circle.y - camera.y) < camera.yRange){ drawCircle(circle, context); count++;}
         
        } );

    camera.update();
        
    

    window.requestAnimationFrame(draw);
    
}

//Draws The Circles Themselves.
//Gets A Circle Object, And The Drawing Context.
function drawCircle(circle, context)
{
    context.beginPath();

    let coords = getRelativeCoords(circle.x, circle.y, camera);
    let x = coords.x;
    let y = coords.y;
    
    

    context.arc(x,y, circle.radius * camera.zoomScale, 0, 2 * Math.PI);
    let xChange = Math.random() < 0.5 ? -1: 1;
    let yChange = Math.random() < 0.5 ? -1: 1;
    circle.y += xChange;
    circle.x += yChange;
    context.fill();
    context.closePath();
    context.stroke();
}