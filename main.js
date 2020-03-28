var space;
var ngx;
var ngy;
var boards = [];
var bw,bh;
var nbx,nby;

var extraMenuSpace;
var mStart;

var boxes;

//inputs
var inputs;
var buttons;
var sliders;
var s0Min,s0Max;
var s1Min,s1Max;

var mainColor;

var pg;

//random threshhold for activating "pixles"
var rt = .65;


//p5 default funtions
function setup(){
	randomSeed(1);
	createCanvas(windowWidth,windowHeight)
	sizeOfPixle = 10;
	s0Min = 3;
	s0Max = 56;
	
	s1Min = 3;
	s1Max = 56;
	
	nbx = 10;
	nby = 10;
	space = 20;
	extraMenuSpace = 100;
	//print(windowWidth/((nbx*sizeOfPixle+space)),floor(windowWidth/((nbx*sizeOfPixle+space))),windowWidth,nbx)
	
	
	
	inputs = [];
	buttons =[];
	sliders =[];
	mainColor = [0,255,0,255];
	
	boxes = new Boxes();
	
	//createCanvas((bw*ngx)+(space*(ngx+1)),(bh*ngy)+(space*(ngy+1))+extraMenuSpace);
	buildMenu();
	build();
	spin();
	
	//board.fill(1,1,4,8,"r");
	//board.flip();
	
}

function draw(){
	background(100);
	
	boxes.draw();
	drawMenu();
	for(var i=0; i<boards.length;++i){// b in boards){
		boards[i].draw();
	}
	//fill(color(255,0,0))
	///rect(space,height-(extraMenuSpace+space),width-space*2,extraMenuSpace)
}

function mousePressed(){
	boxes.click();
}
//end of p5 default functions

//spin is used to roll random "boards" for the array boards
function spin(){
	if(false){}
	for(var i=0; i<boards.length;++i){
		boards[i].generate();
	}
}

function buildSetup(){
	nbx = sliders[0].value();
	nby = sliders[1].value();
	rt = sliders[2].value();
	ngx = floor(width/(nbx*sizeOfPixle+space*2-1));
	ngy = floor((height-extraMenuSpace)/(nby*sizeOfPixle+space*2));
	bw = nbx * sizeOfPixle;
	bh = nby * sizeOfPixle;
	//mStart = (bh*ngy)+(space*(ngy+1));
	mstart = (height-(extraMenuSpace+space));
	
}

//rebuild changes the size of the grid 
function build(){
	buildSetup();
	//resizeCanvas((bw*ngx)+(space*(ngx+1)),(bh*ngy)+(space*(ngy+1))+extraMenuSpace);
	for(var i=0; i<boards.length; ++i){
		boxes.remove("grid"+i);
	}
	boards = [];
	
	var xOff = (width-((ngx*(nbx*sizeOfPixle))+(space*(ngx+1))))/2;
	var yOff = ((height-(extraMenuSpace+space))-((ngy*(nby*sizeOfPixle))+(space*(ngy+1))))/2;
	for(var i=0; i<ngy; ++i){
		for(var j=0;j<ngx;++j){
			//print("i :",i*ngx+j);
			boards[i*ngx+j] = new grid((bw*j)+(space*(j+1))+xOff,(bh*i)+(space*(i+1))+yOff,sizeOfPixle,sizeOfPixle,nbx,nby);
			boxes.add((bw*j)+(space*(j+1))+xOff,(bh*i)+(space*(i+1))+yOff,bw,bh,"grid"+((i*ngx)+j),((i*ngx)+j));
			boxes.get("grid"+((i*ngx)+j)).colors[0] = color(0,0);
			boxes.get("grid"+((i*ngx)+j)).f = saveThis;
			boxes.get("grid"+((i*ngx)+j)).customBorder = function(x,y,w,h){
				push();
				fill(this.colors[0]);
				if(this.mouseOver() && this.highlight){
					stroke(color(100,100,255));
					fill(color(50,100,255,150));
					strokeWeight(3);
					rect(this.x,this.y,this.w,this.h);
					stroke(color(0,0,255));
					strokeWeight(1);
					rect(this.x,this.y,this.w,this.h);
				}else{
					stroke(color(0,0,255));
					strokeWeight(1);
					rect(this.x,this.y,this.w,this.h);
				}
				pop();
			}
		}
	}
	spin();
	
}

function buildMenu(){
	
	boxes.remove("menu");
	boxes.add(space,height-(extraMenuSpace+space),width-space*2,extraMenuSpace,"menu");
	boxes.get("menu").highlight = false;
	boxes.get("menu").f = function(){return 0;};
	
	var tw = textWidth("255");
	
	inputs = [];
	
	inputs[0] = createInput();
	inputs[0].position(boxes.get("menu").x+5,boxes.get("menu").y+5);
	inputs[0].size(tw+2);
	inputs[0].value(mainColor[0]);
	
	inputs[1] = createInput();
	inputs[1].position(inputs[0].x+inputs[0].width+2,inputs[0].y);
	inputs[1].size(tw+2);
	inputs[1].value(mainColor[1]);
	
	inputs[2] = createInput();
	inputs[2].position(inputs[1].x+inputs[1].width+2,inputs[1].y);
	inputs[2].size(tw+2);
	inputs[2].value(mainColor[2]);
	
	inputs[3] = createInput();
	inputs[3].position(inputs[1].x+inputs[1].width+2,inputs[1].y);
	inputs[3].size(tw+2);
	inputs[3].value(mainColor[2]);
	
	buttons = [];
	
	buttons[0] = createButton("Set Color");
	buttons[0].position(inputs[2].x+inputs[2].width+2, inputs[0].y);
	buttons[0].mousePressed(function(){for(var i=0;i<3;++i){mainColor[i] = inputs[i].value();}});
	
	buttons[1] = createButton("Re-Roll");
	buttons[1].position((boxes.get("menu").x+boxes.get("menu").w-buttons[1].width)-5, inputs[0].y);
	buttons[1].mousePressed(build);
	
	sliders = [];
	
	sliders[0] = createSlider(s0Min,s0Max,nbx);
	sliders[0].position(inputs[0].x,inputs[0].y+20);
	
	sliders[1] = createSlider(s1Min,s1Max,nby);
	sliders[1].position(sliders[0].x,sliders[0].y+25);
	
	sliders[2] = createSlider(.1,1,.5,.01);
	sliders[2].position(sliders[1].x,sliders[1].y+25);
	
}

function drawMenu(){
	text("PDX: "+sliders[0].value(),sliders[0].x+sliders[0].width+10,sliders[0].y+sliders[0].height/2+5);
	text("PDY: "+sliders[1].value(),sliders[1].x+sliders[1].width+10,sliders[1].y+sliders[1].height/2+5);
	text("RT: "+sliders[2].value(),sliders[2].x+sliders[2].width+10,sliders[2].y+sliders[2].height/2+5);
}

function saveThis(){
	pg = createGraphics(boards[this.number].w,boards[this.number].h);
	print(boards,this.number);
	boards[this.number].drawTo(pg);
	//var it = get(this.x,this.y,this.w,this.h);
	save(pg,"file.png");
	pg.remove();
}