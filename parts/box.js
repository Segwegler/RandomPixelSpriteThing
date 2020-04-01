//Class iBox
//used for menu boxes 
class iBox{
	//provide numbers for position and width/height
	constructor(x,y,w,h,name,number,imgn){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.name = name;
		this.number = number;
		this.imgnumber = imgn;
		this.highlight = true;
		this.active = false;
		
		this.colors = [];
		this.colors[0] = color(255);
		this.colors[1] = color(0);
		this.colors[2] = color(255,0,0);
		
		this.f = function(){
			print(this.name+" was clicked!","default function");
		}
		this.customBorder = function(){
			return 0;
		}
	}
	
	//returns true if the mouse is over the box
	//could be updated to not require mouse pos input but then i would have th change all the calls (could also be usefull if detecting if somthing else is over it?)
	mouseOver(mX,mY){
		if(!mX){
			mX = mouseX;
			mY = mouseY;
		}
		if(mX > this.x && mX < this.x+this.w){
			if(mY > this.y && mY < this.y+this.h){
				return true;
			}
		}
		return false;
	}
	
	click(){
		if(this.mouseOver(mouseX,mouseY)){
			this.f();
			return true;
		}
	}
	
	//draws the box
	//input h=bool: if h is true the border will highlight if the mouse is over the box
	draw(){
		push();
		fill(this.colors[0]);
		if(this.mouseOver() && this.highlight){
			stroke(this.colors[2]);
		}else{
			stroke(this.colors[1]);
		}
		
		
		rect(this.x,this.y,this.w,this.h);
		pop();
		this.customBorder(this.x,this.y,this.w,this.h);//i dont know why I did this
	}
}

//container for iBox-es
class Boxes{
	constructor(){
		this.boxes = [];
		this.active = -1;
	}
	
	add(x,y,w,h,name,imgn){
		//print("Added: ",name,"number ",number)
		this.boxes[this.boxes.length] = new iBox(x,y,w,h,name,this.boxes.length,imgn);
		
	}
	
	draw(){
		for(var i=0; i<this.boxes.length; ++i){
			this.boxes[i].draw();
			
		}
	}
	
	click(){

		for(var i=0; i<this.boxes.length; ++i){
			this.boxes[i].click();
		}
	}
	
	//n = the sting name
	//returns the iBox
	get(n){
		for(var i=0; i<this.boxes.length; ++i){
			if(this.boxes[i].name == n){
				return this.boxes[i];
			}
		}
		return -1;
	}
	
	//n = string name
	//return the index of the box
	getI(n){
		for(var i=0; i<this.boxes.length; ++i){
			if(this.boxes[i].name == n){
				return i;
			}
		}
		return -1;
	}
	
	//sets the active box
	//the logic is bad but it works so far
	setActive(i){
		if(i == -1){
			if(this.active != -1){
				this.boxes[this.active].active = false;
				this.active = -1;
			}
			return this.active;
		}
		if(this.active == -1 && i != -1){
			this.active = i;
			this.boxes[this.active].active = true;
		}else if(i != -1){
			this.boxes[this.active].active = false;
			if(this.active == i){
				this.active = -1
			}else{
				this.active = i;
				this.boxes[this.active].active = true;
			}
		}else{
			this.boxes[this.active].active = false;
			this.active = i;
		}
		return this.active;
	}
	
	//removes the a iBox
	remove(n){
		var i = this.getI(n);
		if(i<0){
			return false;	
		}
		this.boxes.splice(i,1);
		return "removed i: "+i;
	}
	
}