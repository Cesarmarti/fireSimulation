var data = []
var data_next = []
var DIM = 100;
var objContext;
var step;
function init(){
    var objCanvas = document.getElementById("myCanvas");
    objContext = objCanvas.getContext("2d");
    step = objCanvas.width/DIM;

    for(var i = 0;i<DIM;i++){
        data[i] = []
        for(var j = 0;j<DIM;j++){
            //data[i][j] = parseInt(Math.random()*4+1);
            data[i][j] = 2;
        }
    }
    for(var i = 0;i<DIM;i++){
        data_next[i] = []
        for(var j = 0;j<DIM;j++){
            //data_next[i][j] = data[i][j];
            data_next[i][j] = 2;
        }
    }

    objCanvas.addEventListener('mousemove', function(e) {
        handleMouseMove(objCanvas, e)
    })
    window.requestAnimationFrame(simulate);
}


function handleMouseMove(objCanvas,e) {
    if(e.which==1){
        var mousePos = getMousePosition(objCanvas, e);
        var y = parseInt(mousePos.y/objCanvas.height*DIM);
        var x = parseInt(mousePos.x/objCanvas.width*DIM);
        data[y][x] = 3;
        data_next[y][x] = 3;
    }else if(e.which==2){
        var mousePos = getMousePosition(objCanvas, e);
        var y = parseInt(mousePos.y/objCanvas.height*DIM);
        var x = parseInt(mousePos.x/objCanvas.width*DIM);
        data[y][x] = 1;
        data_next[y][x] = 1;
    }

}
function getMousePosition(canvas, e) {
    var boundary = canvas.getBoundingClientRect();
     return {
       x: e.clientX - boundary.left,  
       y: e.clientY - boundary.top
     };
 }

var do_simulation = false;
document.body.onkeyup = function(e) {
    if (e.key == " " ||
        e.code == "Space" ||      
        e.keyCode == 32      
    ) {
        do_simulation = !do_simulation;
    }
}

var sim_anim = 0;
var iteration = 0;
function simulate(timestamp) {    
    //simulate
    if(do_simulation && sim_anim > 10){
        var cur = [data,data_next][iteration%2];
        var nex = [data_next,data][iteration%2];
        for(var i = 0;i<DIM;i++){
            for(var j = 0;j<DIM;j++){
                nex[i][j] = fire_spread(cur,i,j); 
            }
        }
        iteration++;
    }

    //draw
    for(var i = 0;i<DIM;i++){
        for(var j = 0;j<DIM;j++){
            if(data_next[i][j]==1){
                objContext.fillStyle='rgb(10, 10, 10)';
            }else if(data_next[i][j]==2){
                objContext.fillStyle='rgb(0, 240, 0)';
            }else if(data_next[i][j]==3){
                objContext.fillStyle='rgb(255, 40, 0)';
            }else if(data_next[i][j]==4){
                objContext.fillStyle='rgb(100, 100, 100)';
            }
            objContext.fillRect(j*step, i*step, step, step);
        }
    }
    if(do_simulation&&sim_anim>10){
        sim_anim = 0;
    }
    sim_anim++;       
    window.requestAnimationFrame(simulate);
    
}

function cloneArray(a){
    return a.map(e => Array.isArray(e) ? cloneArray(e) : e);
};

function fire_spread(cur,i,j){
    if(cur[i][j]==1)
		return 1;
	else if(cur[i][j]==4)
		return 4;
	else if(cur[i][j]==3 && Math.random() < 0.6)
		return 4;
	else if(cur[i][j]==2){
		var di, dj;
		for (di = -1; di < 2; di++)
			for (dj = -1; dj < 2; dj++)
				if (di != 0 || dj != 0){
					if(cur[(i + di + DIM) % DIM][(j + dj + DIM) % DIM]==3){
						var pburn = 0.58;
						if(Math.random() < pburn){
                            return 3;
                        }
							
					}
				}
        return 2;
	}else{
		return new Number(cur[i][j]);
	}
}
  
window.onload = function(){
    init()
}
