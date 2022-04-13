class Relation
{
  xOff =  0;
  yOff = 0;
  dw = gridSize / 2;
  isMoving = false;
  selected = false;
  
  constructor(mem1Index, mem2Index){
    this.mem1 = mem1Index;
    this.mem2 = mem2Index;
    this.dotted = false;
  }

  setOffset(x, y){
    this.xOff = x;
    this.yOff = y;
  }

  setWeight(w)
  {
    this.dw = w;
  }

  draw(canvas){
    var x1 = members[this.mem1].x + Member.width / 2;
    var x2 = members[this.mem2].x + Member.width / 2;
    var y1 = members[this.mem1].y + Member.height / 2;
    var y2 = members[this.mem2].y + Member.height / 2;
    var midX = x1/ 2 + x2 / 2;
    var midY = y1/ 2 + y2 / 2;
    var xLen = Math.abs(x1 - x2);
    var yLen = Math.abs(y1 - y2);
    
    if(x1 == x2){
      if(this.xOff == 0){
        if(this.selected)
        {
          line(canvas,x1, y1,x2, y2, COLOR_PALETTE.SELECTED, this.dw + BorderSize * 2);
        }
        line(canvas,x1, y1,x2, y2, COLOR_PALETTE.RELATION, this.dw);
      }
      else if(this.xOff != 0){
        if(this.selected)
        {
          ULine(canvas, x1,y1,x2,y2,this.xOff,0,COLOR_PALETTE.SELECTED, this.dw + BorderSize * 2);
        }
        ULine(canvas, x1,y1,x2,y2,this.xOff,0,COLOR_PALETTE.RELATION, this.dw);
      }
    }
    else if(y1 == y2){
      if(this.yOff === 0){
        if(this.selected)
        {
          line(canvas, x1, y1,x2, y2, COLOR_PALETTE.SELECTED, this.dw + BorderSize * 2);
        }
        line(canvas, x1, y1,x2, y2, COLOR_PALETTE.RELATION, this.dw);
      }
      else if(this.yOff != 0){
        if(this.selected)
        {
          ULine(canvas, x1,y1,x2,y2,0,this.yOff,COLOR_PALETTE.SELECTED, this.dw + BorderSize * 2);
        }
        ULine(canvas, x1,y1,x2,y2,0,this.yOff,COLOR_PALETTE.RELATION, this.dw);
      }
    }
    else if(xLen > yLen){
      if(this.selected)
      {
        stepLine(canvas,x1,y1,x2,y2,midX,0, COLOR_PALETTE.SELECTED, this.dw + BorderSize * 2);
      }
      stepLine(canvas,x1,y1,x2,y2,midX,0, COLOR_PALETTE.RELATION, this.dw);
    }else{
      if(this.selected)
      {
        stepLine(canvas,x1,y1,x2,y2,0,midY, COLOR_PALETTE.SELECTED, this.dw + BorderSize * 2);
      }
      stepLine(canvas,x1,y1,x2,y2,0,midY, COLOR_PALETTE.RELATION, this.dw);
    }
  }

  isHovering(mx, my){
    
    var x1 = (members[this.mem1].x + Member.width / 2 - cameraX) * scale ;
    var y1 = (members[this.mem1].y + Member.height / 2 - cameraY) * scale;
    var x2 = (members[this.mem2].x + Member.width / 2 - cameraX)* scale;
    var y2 = (members[this.mem2].y + Member.height / 2 - cameraY) * scale;
    var midX = x1 / 2 + x2 / 2;
    var midY = y1/ 2 + y2 / 2;
    var xLen = Math.abs(x1 - x2);
    var yLen = Math.abs(y1 - y2);

    if ( inBounds(mx , x1, x2, this.dw * scale) && inBounds(my, y1, y2, this.dw * scale) ){
      if(x1 == x2){
        if(this.xOff != 0){
          return false;
        }else{
          return pointOnLine(mx, my, x1, y1, x2, y2, this.dw * scale);
        }
      }
      else if (y1 == y2){
        if(this.yOff != 0){
          return false;
        }else{
          return pointOnLine(mx, my, x1, y1, x2, y2, this.dw * scale);
        }
      }
      else if(xLen > yLen){
        return pointOnLine(mx,my,x1,y1,midX,y1, this.dw * scale) || pointOnLine(mx,my,midX,y1,midX,y2, this.dw * scale) || pointOnLine(mx,my,midX,y2,x2,y2, this.dw * scale);
      }else if(yLen > xLen){
        return pointOnLine(mx,my,x1,y1,x1,midY, this.dw * scale) || pointOnLine(mx,my,x1,midY,x2,midY, this.dw * scale) || pointOnLine(mx,my,x2,midY,x2,y2, this.dw * scale);
      }

    }
    return false
  }

  update(mouseX, mouseY,movementX,movementY)
  {
      if(this.isMoving)
      {
        if(movementX > movementY){
          this.xOff += movementX
        }
        else{
          this.yOff += movementY
        }
        //same as the member move except that we are changing the xOff, yOff, or midOff
        //based off of how which movement is larger movementX or movementY
        //what is a better way to handle movements ? mousemove/pressed/released per mem or relation? 
      }
  }
}