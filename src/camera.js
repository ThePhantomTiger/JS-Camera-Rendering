
export {getRelativeCoords, keyMap, Camera };



function getRelativeCoords(x, y, camera)
{
    let xTemp = Math.abs(camera.xMin - x);
    let yTemp = Math.abs(camera.yMin - y);
    xTemp = (xTemp*window.innerWidth)/camera.xRange;
    yTemp = (yTemp*window.innerHeight)/camera.yRange;
    return {x : xTemp, y : yTemp};
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



class Camera {

    speed = 50;
    actionBuffer = [];
    controlStates = {"Up" : false, "Right" : false, "Down" : false, "Left" : false};
    
    constructor(x, y){
        this.x = x;
        this.y = y;
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