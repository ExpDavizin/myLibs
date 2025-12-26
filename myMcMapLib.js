SVGSVGElement.prototype.startValues = function(world) {
	let vb = this.getViewBox();

	if(this.aspectRatio() > 1) {
		this.setViewBox({"vbW": world.sizeX, "vbH": world.sizeX/this.aspectRatio()});
	}
	else {
		this.setViewBox({"vbW": world.sizeY*this.aspectRatio(), "vbH": world.sizeY});
	}

	vb = this.getViewBox();
	this.setViewBox({"vbX": world.center.x - vb.vbW/2, "vbY": world.center.y - vb.vbH/2});
};

SVGElement.prototype.snapToVertices = function(e){
        const tolerance = 0.1*Math.max(this.rect().width, this.rect().height);
        
        let linesInRange = this.asArray().filter(line => line.hasPointer(e,tolerance)).map(path => path.parseLine());
        // console.log("1:",linesInRange);
        
        let verticies = [];
        linesInRange.forEach(line => verticies = verticies.concat(line));
        // console.log("2:",verticies);
        
        let minDist = Infinity;
        verticies.forEach(v => {
          v.dist = dist(map.pos(e),map.pointPos(v));
          minDist = Math.min(v.dist, minDist);
        });
        
        let closestVerticies = verticies.filter(v => v.dist <= tolerance && v.dist === minDist);
        // console.log("3:",closestVerticies);
        // console.log("minDist:",minDist);
        
        return closestVerticies;
      };
      
      SVGElement.prototype.snapToLines = function(e){
        const tolerance = 0.1*Math.max(this.rect().width, this.rect().height);
        
        const linesInRange = this.asArray().filter(line => line.hasPointer(e,tolerance)).map(path => path.parseLine());
        // console.log("1:",linesInRange);
        
        let verticeTuples = [];
        
        linesInRange.forEach(l => {
          for(let i = 0; i < l.length - 1; i++){
            // client screen coordinates
            verticeTuples.push({"A":map.pointPos(l[i]),"B":map.pointPos(l[i+1]), "path":l[0].path, "indexA": l[i].index, "indexB": l[i+1].index});
          }
        });
        // console.log("2:",verticeTuples);
        
        verticeTuples = verticeTuples.filter(t => dist(t.A,map.pos(e)) + dist(t.B,map.pos(e)) - dist(t.A,t.B) <= tolerance/2);
        // console.log("3:",verticeTuples);
        
        let minDist = Infinity;
        verticeTuples.forEach(t => {
          const P = map.pos(e);
          const AB = {"x":t.B.x-t.A.x,"y":t.B.y-t.A.y};
          const AP = {"x":P.x-t.A.x,"y":P.y-t.A.y};
          const k = (AP.x*AB.x + AP.y*AB.y)/(dist(AB)**2);
          
          let distPath = {"x": AP.x - k*AB.x, "y": AP.y - k*AB.y};
          const signs = {"x": Math.sign(distPath.x), "y": Math.sign(distPath.y)};
          
          distPath = map.coord(client(Math.abs(distPath.x),Math.abs(distPath.y)));
          
          t.distPath = {"x": distPath.x*signs.x, "y": distPath.y*signs.y}
          t.dist = dist(t.distPath);
          minDist = Math.min(t.dist, minDist);
        });
        
        const closestTuples = verticeTuples.filter(t => t.dist === minDist);
        // console.log("4:",closestTuples);
        // console.log("minDist:",minDist);
        
        return closestTuples;
      };
