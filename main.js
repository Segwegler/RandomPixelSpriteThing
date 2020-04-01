var space;//the spacing between stuff, boxes,buttons etc.
var ngx;//number of images X
var ngy;//number of images Y
var boards;//array of grids ie: the class that holds the images and does life stuff
var nbx,nby;//the number of "pixles" in a grid
var bw,bh;//the height and width of the images
var active;//int to track index of box selected the image is at active-1 in boards
var select;//bool for selection

var boxy;//bool to display borders on "pixles"
var lifeLength;//number of steps to run grids through on re-roll

var extraMenuSpace;//a spacer for the menu box

var boxes;//boxes is a container class for iBox, used for selection of images

//inputs
var inputs;//array of inputs
var buttons;//array of buttons
var sliders;//array of sliders
var checks;//array of check boxes
var s0Min,s0Max;//slider 0 min/max values for Slider 0,labeld as PDX, Pixle Density X, how many pixles across the image should be
var s1Min,s1Max;//slider 1 min/max values for Slider 1,labeld as PDY, Pixle Density Y, how many pixles tall the image should be

var mainColor;//used to set the color of all the images

var pg;//used to save out the image

//random threshhold for activating "pixles"
var rt;


//p5 default funtions
function setup(){
	//randomSeed(1);
    //the math here is to fix random seperating with non fixed size
	createCanvas(floor(windowWidth/2)*2,floor(windowHeight/2)*2);
	lifeLength = 0;
	sizeOfPixle = 10;
	select = false;
	boxy = false;
	active = -1;
	s0Min = 3;
	s0Max = 56;
	
	s1Min = 3;
	s1Max = 56;
	
	rt = .65;
	nbx = 10;
	nby = 10;
	space = 20;
	extraMenuSpace = 100;
	
	boards = []
	inputs = [];
	buttons =[];
	sliders =[];
	checks = [];
	mainColor = [0,255,0,255];
	
	boxes = new Boxes();
	menuBoxes = new Boxes();
	
	buildMenu();
	build();
	spin();
	
}

function draw(){
	background(100);
	
	boxes.draw();//draws the clickable pard of the grid and the white box at the bottom
	drawMenu();//draws sliders and buttons
	for(var i=0; i<boards.length;++i){
		boards[i].draw();//draws all the images
	}
}

function mousePressed(){
	boxes.click();
}
//end of p5 default functions

//spin is used to roll random "boards" for the array boards
function spin(){
	lifeLength = sliders[3].value();//update life length
	if(select && active != -1){//wether one or all images should be re-rolled
		boards[active-1].generate();
	}else{
		for(var i=0; i<boards.length;++i){
			boards[i].generate();
		}
	}
}

//checks if values of sliders have changed if so returns true
//calculats spacing for displaying images
function buildSetup(){
	var changed = false;
	if(nbx != sliders[0].value()){
		changed = true;
		nbx = sliders[0].value();
	}
	if(nby != sliders[1].value()){
		nby = sliders[1].value();
		changed = true;
	}
	if(rt != sliders[2].value()){
		rt = sliders[2].value();
		changed = true;
	}
	ngx = floor(width/((nbx*sizeOfPixle)+(space)));
	ngy = floor((height-extraMenuSpace)/((nby*sizeOfPixle)+(space*1.5)));
	bw = nbx * sizeOfPixle;
	bh = nby * sizeOfPixle;
	return changed;
}

//rebuild changes the size of the grid 
function build(){
	if(buildSetup()){//check for changes
		select = false;//turns select off if there was a change
		
		for(var i=0; i<boards.length; ++i){
			boxes.remove("grid: "+(i));//clears boxes (not the menu box)
		}
		boards = [];//clears boards
	
		var xOff = (width-((ngx*(nbx*sizeOfPixle))+(space*(ngx+1))))/2;
		var yOff = ((height-(extraMenuSpace+space))-((ngy*(nby*sizeOfPixle))+(space*(ngy+1))))/2;
		for(var i=0; i<ngy; ++i){
			for(var j=0;j<ngx;++j){
				//print("i :",i*ngx+j);
				boards[i*ngx+j] = new grid((bw*j)+(space*(j+1))+xOff,(bh*i)+(space*(i+1))+yOff,sizeOfPixle,sizeOfPixle,nbx,nby);
				boxes.add((bw*j)+(space*(j+1))+xOff,(bh*i)+(space*(i+1))+yOff,bw,bh,"grid: "+((i*ngx)+j),((i*ngx)+j));
				boxes.get("grid: "+((i*ngx)+j)).colors[0] = color(0,0);
				boxes.get("grid: "+((i*ngx)+j)).f = function(){{select = true;active=boxes.setActive(this.number); if(active == -1){select = false;}} return 0;};//each box has a function to call when clicked that changes the active box
				//boxes.get("grid"+((i*ngx)+j)).clickable = true;
				boxes.get("grid: "+((i*ngx)+j)).customBorder = function(x,y,w,h){//start custom draw
					push();
					fill(this.colors[0]);
					if((this.mouseOver() || this.active) && this.highlight){
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
				}//end custom draw
			}//end for loop j
		}//end for loop i
	
	}//if buildsetup()
	spin();
	
}

function buildMenu(){
	
	boxes.remove("menu");
	boxes.add(space,height-(extraMenuSpace+space),width-space*2,extraMenuSpace,"menu");
	boxes.get("menu").highlight = false;
	boxes.get("menu").f = function(){ return 0;};
	
	var tw = textWidth("255");
	
	inputs = [];
	
	inputs[0] = createInput();//uesd for Red input 0-255
	inputs[0].position(boxes.get("menu").x+5,boxes.get("menu").y+5);
	inputs[0].size(tw+2);
	inputs[0].value(mainColor[0]);
	
	inputs[1] = createInput();//uesd for Green input 0-255
	inputs[1].position(inputs[0].x+inputs[0].width+2,inputs[0].y);
	inputs[1].size(tw+2);
	inputs[1].value(mainColor[1]);
	
	inputs[2] = createInput();//uesd for Blue input 0-255
	inputs[2].position(inputs[1].x+inputs[1].width+2,inputs[1].y);
	inputs[2].size(tw+2);
	inputs[2].value(mainColor[2]);
	
	buttons = [];
	
	buttons[0] = createButton("Set Color");//changes the color of the forground
	buttons[0].position(inputs[2].x+inputs[2].width+2, inputs[0].y);
	buttons[0].mousePressed(function(){for(var i=0;i<3;++i){mainColor[i] = inputs[i].value();}});
	
	buttons[1] = createButton("Re-Roll");//regenerates the images randomly
	buttons[1].position((boxes.get("menu").x+boxes.get("menu").w-buttons[1].width)-5, inputs[0].y);
	buttons[1].mousePressed(build);
	//buttons 2&3 are after checks
	
	sliders = [];
	
	sliders[0] = createSlider(s0Min,s0Max,nbx);//number of "pixles" across
	sliders[0].position(inputs[0].x,inputs[0].y+20);
	
	sliders[1] = createSlider(s1Min,s1Max,nby);//number of "pixles" tall
	sliders[1].position(sliders[0].x,sliders[0].y+25);
	
	sliders[2] = createSlider(.1,1,.5,.01);//the threshold where "pixles" activate durring random gen
	sliders[2].position(sliders[1].x,sliders[1].y+25);
	
	sliders[3] = createSlider(0,50,lifeLength);//how many steps to take in the life cycle (50 is way over kill)
	sliders[3].position((buttons[1].x-(sliders[3].width/2)-10),buttons[1].y+sliders[3].height);
	
	checks = [];
	
	checks[0] = createCheckbox('Select one',select);//used for individual image selection
	checks[0].position(buttons[1].x-250,buttons[1].y);
	checks[0].changed(function(){select = this.checked(); if(!select){boxes.setActive(-1);active = -1;}})
	
	checks[1] = createCheckbox('Boxy',boxy);//used to show borders on "pixles"
	checks[1].position(checks[0].x,checks[0].y+space);
	checks[1].changed(function(){boxy = this.checked();})
	
	buttons[2] = createButton("live");//runs 1 step in the life cycle of the active or all images
	buttons[2].position(buttons[1].x-buttons[2].width-space,buttons[1].y);
	buttons[2].mousePressed(doLife)
	
	buttons[3] = createButton("save");//saves the selected image, does nothing with none selected
	buttons[3].position(checks[1].x,checks[1].y+space);
	buttons[3].mousePressed(saveThis)
	
}

//draws text for menu and updates the select one box
function drawMenu(){
	checks[0].checked(select);
	text("PDX: "+sliders[0].value(),sliders[0].x+sliders[0].width+10,sliders[0].y+sliders[0].height/2+5);
	text("PDY: "+sliders[1].value(),sliders[1].x+sliders[1].width+10,sliders[1].y+sliders[1].height/2+5);
	text("RT: "+sliders[2].value(),sliders[2].x+sliders[2].width+10,sliders[2].y+sliders[2].height/2+5);
	text("Life Length: "+sliders[3].value(),sliders[3].x+10,sliders[3].y+sliders[3].height+15);
}

//saves an image, wont save them all
function saveThis(){
	if(select && active != -1){
		pg = createGraphics(boards[active-1].w,boards[active-1].h);
		//print(boards,this.number);
		boards[active-1].drawTo(pg);
		//var it = get(this.x,this.y,this.w,this.h);
		save(pg,"file.png");
		pg.remove();
	}
}

//runs one life step for all or the active image
function doLife(){
	if(select && active!= -1){
		boards[active-1].live();
	}else{
		for(var i=0; i<boards.length; ++i){
			boards[i].live();
		}
	}
}