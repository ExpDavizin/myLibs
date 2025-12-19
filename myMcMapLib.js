SVGSVGElement.prototype.startValues = function(world){
  let vb = this.getViewBox();
  
  if(this.aspectRatio() > 1){
    this.setViewBox({"vbW": world.sizeX, "vbH": world.sizeX/this.aspectRatio()});
  }
  else{
    this.setViewBox({"vbW": world.sizeY*this.aspectRatio(), "vbH": world.sizeY});
  }
  
  vb = this.getViewBox();
  this.setViewBox({"vbX": world.center.x - vb.vbW/2, "vbY": world.center.y - vb.vbH/2});
};
