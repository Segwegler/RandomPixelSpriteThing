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
		this.fill(0,0,this.nbx,this.nby,1);
		this.boxy = false;
		
		//print(this.blocks.length);
		
	}
	
	generate(){
		this.fill(1,1,(this.nbx/2)-1,this.nby-2,"r");
		this.flip();
		this.border();
	}
	
	clear(){
		var a;
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
	
	pixel(x,y,cc){
		
		this.blocks[(this.nbx*y)+x] = cc;
	}
	
	aFill(x,y,w,h,a){
		if(a.length != w*h){
			print("array is the wrong size");
			return "array is the wrong size";
		}
		for(var i=0; i<h; ++i){
			for(var j=0; j<w; ++j){
				this.blocks[(this.nbx*(i+y))+(j+x)] = a[(w*i)+j];
			}
		}
	}
	
	flip(){
		//print(this.w/2-1,this.h/2-1,this.nbx/2-1,this.nby-2)
		var a = this.out(1,1,floor(this.nbx/2)-1,this.nby-2)
		var b = arrayFlip(a,floor(this.nbx/2)-1,this.nby-2);
		if(this.nbx%2==0){
			this.aFill(floor(this.nbx/2),1,floor(this.nbx/2)-1,this.nby-2,b);
		}else{
			this.aFill(floor(this.nbx/2)+1,1,floor(this.nbx/2)-1,this.nby-2,b);
		}
	}
	
	out(x,y,w,h){
		///print("size: ",w*h);
		var count = 0
		if(x == 0 && y == 0 && w == this.nbx && h == this.nby){
			return this.blocks;
		}else{
			var temp = [];
			for(var i=0; i<h; ++i){
				for(var j=0; j<w; ++j){
					//print((w*i)+j)
					count++;
					temp[(w*i)+j] = this.blocks[(this.nbx*(i+y))+(j+x)];
				}
			}
			//print("count: ",count);
			return temp;
		}	
	}
	
	border(){
		for(var i=0; i<this.nby; ++i){
			for(var j=0; j<this.nbx; ++j){
				if(this.blocks[(this.nbx*(i))+(j)] == 1 && (0 == this.blocks[(this.nbx*(i))+(j-1)] || 0 == this.blocks[(this.nbx*(i))+(j+1)] || 0 == this.blocks[(this.nbx*(i+1))+(j)] || 0 == this.blocks[(this.nbx*(i-1))+(j)])){
					this.blocks[(this.nbx*(i))+(j)] = 2;
				}
			}
		}
	}
	
	draw(b){
		this.update();
		if(!b){
			b=true;
		}
		push();
		if(this.boxy){
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
		if(this.boxy && b){
			stroke(color(255,0,0))
			line(this.x+this.w/2,this.y,this.x+this.w/2,this.y+this.h);
		}
		pop();
	}
	
	drawTo(g){
		this.update();
		//print("hello");
		g.push();
		g.stroke(0,0);
		for(var i=0; i<this.nby;++i){
			for(var j=0; j<this.nbx; ++j){
				//print((i*this.nbx)+j)
				g.fill(this.colors[this.blocks[(i*this.nbx)+j]]);
				
				g.rect(this.bw*j,this.bh*i,this.bw,this.bh);
			}
		}
		g.pop();
	}
	update(){
		this.colors[0] = color(mainColor);
	}
}

function arrayFlip(a,w,h){
	var tArr = [];
	for(var y=0;y<h;++y){
		for(var x=0;x<w;++x){
			tArr[aPos(x,y,w)] = a[aPos(w-x,y,w)-1];
		}
	}
	return tArr;
}

function aPos(x,y,w){
	return (w*y)+x
}