//this is my image holding life having array flippin class
class grid{
	//x,y: Xpos,Ypos
	//bh,bh: block width, block height
	//nbx,nby: number of blocks x-axis, number of blocks y-axix
	constructor(x,y,bw,bh,nbx,nby){
		var root = self;
		this.x = x;
		this.y = y;
		this.bw = bw;
		this.bh = bh;
		this.nbx = nbx;
		this.nby = nby;
		this.colors = [];
		this.colors[0] = color(0,255,0);//fgColor
		this.colors[1] = color(255,0);//bgColor
		this.colors[2] = color(0);//border color
		this.w = this.bw*this.nbx;
		this.h = this.bh*this.nby;
		this.blocks = [];
		this.fill(0,0,this.nbx,this.nby,0);
		this.boxy = false;
		
		//print(this.blocks.length);
		
	}
	
	//runs one step of life
	live(){
		this.border(false);
		this.aFill(1,1,floor((this.nbx/2))-1,this.nby-2,live(this.out(1,1,floor((this.nbx/2))-1,this.nby-2),floor((this.nbx/2))-1,this.nby-2,1));
		this.flip();
		this.border();
	}
	
	//generates a random image, will run life steps if lifeLength is > 0
	generate(b){
		this.clear();
		this.fill(1,1,(this.nbx/2)-1,this.nby-2,"r");
		this.aFill(1,1,floor((this.nbx/2))-1,this.nby-2,live(this.out(1,1,floor((this.nbx/2))-1,this.nby-2),floor((this.nbx/2))-1,this.nby-2,lifeLength),"l");
		this.flip();
		this.border();
	}
	
	//makes the image empty
	clear(){
		for(var i=0; i<this.blocks.length; ++i){
			this.blocks[i] = 1;
		}
	}
	
	//fills the given area with the colorcode passed
	fill(x,y,w,h,cc){
		if(!cc){
			cc = 0;
		}
		if(cc=="r"){
			this.clear();
			cc=0;
			for(var i=0; i<h; ++i){
				for(var j=0; j<w; ++j){
					if(random()>rt)
						this.blocks[(this.nbx*(i+y))+(j+x)] = cc;
				}	
			}
			return;
		}
		for(var i=0; i<h; ++i){
			for(var j=0; j<w; ++j){
				this.blocks[(this.nbx*(i+y))+(j+x)] = cc;
			}
		}
	}
	
	//sets the "pixel" to the color code cc [0,1,2] = [fg,bg,border]
	pixel(x,y,cc){
		if(!cc){
			return this.blocks[(this.nbx*y)+x];
		}
		this.blocks[(this.nbx*y)+x] = cc;
	}
	
	//fills in the specified area with the array provided
	aFill(x,y,w,h,a,m){
		if(a.length != w*h){
			print("array is the wrong size: "+m);
			return "array is the wrong size";
		}
		for(var i=0; i<h; ++i){
			for(var j=0; j<w; ++j){
				this.blocks[(this.nbx*(i+y))+(j+x)] = a[(w*i)+j];
			}
		}
	}
	
	//flips the half of the grid that lives and generates to the other half
	//should work with odd widths
	flip(){
		var a = this.out(1,1,floor(this.nbx/2)-1,this.nby-2)
		var b = arrayFlip(a,floor(this.nbx/2)-1,this.nby-2);
		if(this.nbx%2==0){
			this.aFill(floor(this.nbx/2),1,floor(this.nbx/2)-1,this.nby-2,b);
		}else{
			this.aFill(floor(this.nbx/2)+1,1,floor(this.nbx/2)-1,this.nby-2,b);
		}
	}
	
	//outputs the array within the box specified
	out(x,y,w,h){
		if(x == 0 && y == 0 && w == this.nbx && h == this.nby){
			return this.blocks;
		}else{
			var temp = [];
			for(var i=0; i<h; ++i){
				for(var j=0; j<w; ++j){
					temp[(w*i)+j] = this.blocks[(this.nbx*(i+y))+(j+x)];
				}
			}
			return temp;
		}	
	}
	
	//adds or removes the border; false removes it
	border(b=true){
		if(b){
			for(var i=0; i<this.nby; ++i){
				for(var j=0; j<this.nbx; ++j){
					if(this.blocks[(this.nbx*(i))+(j)] == 1 && (0 == this.blocks[(this.nbx*(i))+(j-1)] || 0 == this.blocks[(this.nbx*(i))+(j+1)] || 0 == this.blocks[(this.nbx*(i+1))+(j)] || 0 == this.blocks[(this.nbx*(i-1))+(j)])){
						this.blocks[(this.nbx*(i))+(j)] = 2;
					}
				}
			}
		}else{
			for(var i=0; i<this.blocks.length;++i){
				if(this.blocks[i] == 2){
					this.blocks[i] = 1;
				}
			}
		}
	}
	
	//draw function for the grid
	draw(){
		this.update();
		push();
		if(boxy){
			stroke(255);
		}else{
			stroke(0,0);
		}
		for(var i=0; i<this.nby;++i){
			for(var j=0; j<this.nbx; ++j){
				//print((i*this.nbx)+j)
				fill(this.colors[this.blocks[(i*this.nbx)+j]]);
				rect(this.x+this.bw*j,this.y+this.bh*i,this.bw,this.bh);
			}
		}
		if(boxy){
			stroke(color(255,0,0))
			line(this.x+this.w/2,this.y,this.x+this.w/2,this.y+this.h);
		}
		pop();
	}
	
	//draws the image to a graphics object
	drawTo(g){
		this.update();
		g.push();
		g.stroke(0,0);
		for(var i=0; i<this.nby;++i){
			for(var j=0; j<this.nbx; ++j){
				g.fill(this.colors[this.blocks[(i*this.nbx)+j]]);
				g.rect(this.bw*j,this.bh*i,this.bw,this.bh);
			}
		}
		g.pop();
	}
	
	//updates fg color to the current maincolor global
	update(){
		this.colors[0] = color(mainColor);
	}
}

//helper to reverse the array in 2d instead of 1d
function arrayFlip(a,w,h){
	var tArr = [];
	for(var y=0;y<h;++y){
		for(var x=0;x<w;++x){
			tArr[aPos(x,y,w)] = a[aPos(w-x,y,w)-1];
		}
	}
	return tArr;
}

//geth the index for 2d cords
function aPos(x,y,w){
	return (w*y)+x
}

//returns the x,y cords from a 1d index
function aPosI(i,w,h){
	return {x:i%w,y:floor(i/h)}
}

//life function 
//recurses down to 0
function live(a,w,h,s){
	if(s <= 0){
		return a;
	}
	var temp = [];
	for(var i = 0;i<w; ++i){
		for(var j = 0; j <h; ++j){
			temp[aPos(i,j,w)] = rules(a[aPos(i,j,w)],a[aPos(i,j-1,w)],a[aPos(i+1,j,w)],a[aPos(i,j+1,w)],a[aPos(i-1,j,w)])
		}
	}
	return live(temp,w,h,s-1);
}

//checks the rules for the life function
//0 = live
//1 = dead
//checks the number alive and kills revives based on that
//I didnt realy check that this works but it seems like it does
function rules(t,n,e,s,w){
	var nl = 0;
	n ? 0: nl++;
	e ? 0: nl++;
	s ? 0: nl++;
	w ? 0: nl++;
	if(t == 0){
		if(nl == 2 || nl == 3){
			return 0;
		}
		return 1;
	}else if(t == 1){
		if(nl == 0 || nl == 1){
			return 0;
		}
		return 1;
	}
	//print(nl);
	return t;
}
