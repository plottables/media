class ZoomArea
{
  constructor(x,y,w,h)
  {
    this.pos = createVector(x,y);
    this.dim = createVector(w,h);
    this.strokeColorRect = "#FF0000";
    this.strokeColorRect_ = "#FF000033";
    
    this.strokeColor      = "#000000";

    this.posClickRel = createVector();
    this.bDragged = false;
    this.bSelected = false;
    this.scale = 1.0;
    
    this.resetStrokes();
  }
  
  unselect()
  {
    this.select(false);
  }
  
  select(is)
  {
    this.bSelected = is;
  }
  
  setScale(s)
  {
    this.scale = s;
  }
  
  resetStrokes()
  {
    this.strokes = [];
    this.strokeCurrent = undefined;
  }
  
  draw(renderer)
  {
    if (this.bDragged)
    {
      this.pos.set( mouseX-this.posClickRel.x,mouseY-this.posClickRel.y );
    }
    
    renderer.noFill();
    renderer.strokeWeight(1);
    renderer.stroke(this.bSelected ? this.strokeColorRect : this.strokeColorRect_);
    renderer.rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
    
    renderer.stroke(this.strokeColor);
    renderer.push();
    renderer.translate(this.pos.x,this.pos.y);
    renderer.scale(this.scale);
    renderer.strokeWeight(1/this.scale);
    //drawStrokeCurrent(sketch);
    if (this.strokeCurrent)
      drawStroke(this.strokeCurrent,rendererP5); // TODO : bof :/ 
    this.drawStrokes(rendererP5)
    
    renderer.pop();
  }
  
  drawStrokes(renderer)
  {
    if (this.strokes)
      this.strokes.forEach( stroke => drawStroke(stroke,renderer) );
  }
  
  isInside(x,y)
  {
    if (
        (this.pos.x <= x && x <= (this.pos.x+this.dim.x)) && 
        (this.pos.y <= y && y <= (this.pos.y+this.dim.y))
       )
      return true;
    return false;         
  }
  
  mouseMoved()
  {
      cursor(this.isInside(mouseX,mouseY) ? MOVE : ARROW);
  }
  
  mousePressed()
  {
    if (this.isInside(mouseX,mouseY))
    {
      this.posClickRel.set( mouseX-this.pos.x, mouseY-this.pos.y);
      this.bDragged = true;
      this.bSelected = true;

      return true;
    } 
    
    return false;
  }

  mouseReleased()
  {
    this.bDragged = false;
  }
  
  
}