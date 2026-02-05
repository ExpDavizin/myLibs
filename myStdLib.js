function $(selector) {
	return document.querySelector(selector);
}

function $$(selector) {
	return document.querySelectorAll(selector);
}

/* Credits to: Web Dev Simplified */
function debounce(cb, delay = 1000) {
	let timeout;

	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			cb(...args);
		}, delay);
	};
}

function throttle(cb, delay = 1000) {
	let shouldWait = false;
	let waitingArgs;
	const timeoutFunc = () => {
		if (waitingArgs == null) {
			shouldWait = false;
		} else {
			cb(...waitingArgs);
			waitingArgs = null;
			setTimeout(timeoutFunc, delay);
		}
	};

	return (...args) => {
		if (shouldWait) {
			waitingArgs = args;
			return;
		}

		cb(...args);
		shouldWait = true;

		setTimeout(timeoutFunc, delay);
	};
}
/* End of credits */

Object.defineProperties((Function.prototype),{
  "wrap": {
    value: function (args) {
      return (args.length === 1 && Array.isArray(args)) ? args[0] : args;
    }
  }
});

const Root = document.documentElement.style;
Object.defineProperties((Root),{
  "setProperties": {
    value: function () {
      if(arguments.length%2){
        console.warn("Missing values.");
        return;
      }
      for(let i = 0;i <= Math.ceil(arguments.length/2);i++){
        this.setProperty(arguments[2*i],arguments[2*i + 1]);
      }
    }
  }
});

Object.defineProperties((Math),{
  "clamp": {
    value: function (x, min, max) {
    	return Math.min(Math.max(x,min),max);
    }
  },
  "between": {
    value: function (x, num1, num2) {
      return x >= Math.min(num1,num2) && x <= Math.max(num1,num2);
    }
  }
});

Object.defineProperties((Array.prototype),{
  "min": {
    get: function () {
      return Math.min.apply(null,this);
    }
  },
  "max": {
    get: function () {
      return Math.max.apply(null,this);
    }
  },
  "last": {
    get: function () {return this[this.length - 1]},
    set: function (newValue) {this[this.length - 1] = newValue}
  },
  "remove": {
    value: function (index) {
      return this.splice(index,1);
    }
  },
  "insert": {
    value: function (index, newValue) {
      this.splice(index,0,newValue);
      return newValue;
    }
  },
  "x": {
    get: function () {
      return this[0] ? this[0] : 0;
		},
		set: function (newValue) {
      this[0] = newValue;
      return newValue;
    }
	},
	"y": {
    get: function () {
      return this[1] ? this[1] : 0;
		},
		set: function (newValue) {
      this[1] = newValue;
      return newValue;
    }
	},
	"z": {
    get: function () {
      return this[2] ? this[2] : 0;
		},
		set: function (newValue) {
      this[2] = newValue;
      return newValue;
    }
	},
	"norm": {
	  get: function () {
      return Math.sqrt(this.reduce((acc,cur) => {
  			return isNaN(cur) ? acc : acc + Math.pow(parseFloat(cur),2);
  		}, 0));
	  }
	},
	"versor": {
	  get: function () {
	    return this.norm === 0 ? null : this.map(e => isNaN(e) ? e : parseFloat(e)/this.norm);
	  }
	},
	"scale": {
	  value: function (factor,apply = 0) {
	    if(!apply){
	      return this.map(e => isNaN(e) ? e : parseFloat(e)*factor);
	    }
	    this.forEach((e,i) => {
	      this[i] = isNaN(e) ? e : parseFloat(e)*factor;
	    });
	    return scale;
	  }
	}
});

Object.defineProperties((DOMRect.prototype),{
  "ratio": {
    get: function () {
      return this.width/this.height;
    }
  },
  "relativeX": {
    value: function (e) {
      return e.x - this.x;
    }
  },
  "relativeY": {
    value: function (e) {
      return e.y - this.y;
    }
  },
  "percentX": {
    value: function (e) {
      return this.relativeX(e)/this.width;
    }
  },
  "percentY" : {
    value: function (e) {
      return this.relativeY(e)/this.height;
    }
  }
});

Object.defineProperties((Element.prototype),{
  "rect": {
    value: Element.prototype.getBoundingClientRect
  },
  "setAttributes": {
    value: function () {
      [...arguments].forEach((a,i) => {
        // if(a instanceof NamedNodeMap){
        //   a = [...a];
        // }
        if(!(a instanceof Array)){
          return;
        }
        // if(a.length % 2){
        //   return;
        // }
        for(let i = 0;i <= a.length/2;i++){
          this.setAttribute(a[2*i],a[2*i+1]);
        }
      });
    }
  },
  "new": {
    value: function (type) {
    	console.log(this.prototype);
    	this.appendChild(document.createElement(type));
    	return this.lastElementChild;
    }
  }
});

Object.defineProperties((SVGSVGElement.prototype),{
  "new": {
    value: function (type) {
    	this.appendChild(document.createElementNS("http://www.w3.org/2000/svg",type));
    	return this.lastElementChild;
    }
  },
  "centerX": {
    get: function () {
      return this.viewBox.baseVal.x + this.viewBox.baseVal.width/2;
    }
  },
  "centerY": {
    get: function () {
      return this.viewBox.baseVal.y + this.viewBox.baseVal.height/2;
    }
  },
  "positionX": {
    value: function (e) {
      return this.viewBox.baseVal.x + this.rect().percentX(e)*this.viewBox.baseVal.width;
    }
  },
  "positionY": {
    value: function (e) {
      return this.viewBox.baseVal.y + this.rect().percentY(e)*this.viewBox.baseVal.height;
    }
  },
  "resizeX": {
    value: function () {
      this.attributes.viewBox.baseVal = `${this.centerX - this.viewBox.baseVal.height*this.rect().ratio/2} ${this.viewBox.baseVal.y} ${this.viewBox.baseVal.width} ${this.viewBox.baseVal.height}`;
    }
  },
  "resizeY": {
    value: function () {
      this.attributes.viewBox.baseVal = `${this.viewBox.baseVal.x} ${this.centerY - this.viewBox.baseVal.width/this.rect().ratio/2} ${this.viewBox.baseVal.width} ${this.viewBox.baseVal.height}`;
    }
  }
});

Object.defineProperties((SVGGElement.prototype),{
  "new": {
    value: function (type) {
    	this.appendChild(document.createElementNS("http://www.w3.org/2000/svg",type));
    	return this.lastElementChild;
    }
  }
});

Object.defineProperties((SVGPathElement.prototype),{
  "d": {
    get: function () {return this.attributes.d.value},
    set: function (newValue) {this.attributes.d.value = newValue}
  },
  "length": {
    get: function () {return this.commands.length}
  },
  "commands": {
    get: function () {
      return this.d.split(" ");
    }
  },
  "setCommand": {
    value: function (index,newValue) {
      this.d = this.d.split(" ").map((e,i) => i === index ? newValue : e).join(" ");
    }
  },
  "delete": {
    value: function (index) {
      this.d = this.commands.splice(index,1).join(" ");
      return this.d;
    }
  },
  "pop": {
    value: function (){
      this.d = this.command.pop().join(" ");
      return this.d;
    }
  },
  "push": {
    value: function (val) {
      this.d = this.d+" "+val;
      return this.d;
    }
  },
  "insert": {
    value: function (index,val) {
      this.d = this.commands.insert(index,val).join(" ");
      return this.d;
    }
  },
  "parse": {
    get: function () {
      function asCoord(string){
        return string.slice(1).split(",").map(n => Number(n));
      }
      
      const verticesBuffer = [], midsBuffer = [];
      this.commands.forEach((s,i) => {
        switch(s[0]){
          case 'M':
            verticesBuffer.push([]);      
          case 'L':
            verticesBuffer.last.push({"value":asCoord(s),"ownerElement":this,"index":i});
            break;
          case 'Z':
            verticesBuffer.last.push(verticesBuffer.last[0]);
            break;
          default:
            break;
        }
      });
      
      verticesBuffer.forEach(array => {
        for(let i = 0;i < array.length - 1;i++){
          midsBuffer.push({"value":[(array[i].value[0] + array[i+1].value[0])/2,(array[i].value[1] + array[i+1].value[1])/2],"ownerElement":this,"index":i});
        }
      });
      
      return [verticesBuffer,midsBuffer];
    }
  },
  "continuous": {
    get: function (){
      return this.d.match(/[Mm]/g).length === 1;
    }
  },
  "split": {
    value: function (){
      // if(this.continuous){
      //   return;
      // }
      
      for(let i = 1;i < this.d.split("M").length;i++){
        this.parentElement.new("path").setAttributes(['d',`M${this.d.split("M")[i]}`]);
      }
      
      this.remove();
    }
  }
});

class Vector {
  static dim (...args) {
    return Function.wrap(args).reduce((acc,cur) => {
			return Math.max(acc,cur.length);
		},0);
  }
  
  static add (...args) {
    const buffer = [];
    Function.wrap(args).forEach((v) => v.forEach((e,i) => {
      if(buffer[i]){
        buffer[i] += isNaN(e) ? e : parseFloat(e);
      }
      else{
        buffer[i] = isNaN(e) ? e : parseFloat(e);
      }
    }));
    return buffer;
  }
  
  static dist (v1, v2) {
    return Vector.add(v1,v2.scale(-1)).norm;
  }
  
  static dot (v1, v2) {
    let buffer = 0;
    for(let i = 0; i < Vector.dim(v1, v2); i++){
      buffer += (v1[i] ? v1[i] : 0) * (v2[i] ? v2[i] : 0);
    }
    return buffer;
  }
  
  static vec (v1, v2) {
    return [v1.y*v2.z - v1.z*v2.y, v1.z*v2.x - v1.x*v2.z, v1.x*v2.y - v1.y*v2.x];
  }
  
  static cos (v1, v2) {
    return Vector.dot(v1, v2)/(v1.norm*v2.norm);
  }
  
  static ang (v1, v2) {
    return Math.acos(Vector.cos(v1, v2));
  }
  
  static proj (v1, v2) {
    return v2.scale(Vector.dot(v1, v2)/Vector.dot(v2, v2));
  }
}
