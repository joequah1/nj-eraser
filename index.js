export default class Eraser {
	constructor (options) {
		console.log(options)
        this.init(options)
    }

    init (options) {

    	this.ele = options.ele
    	this.width = this.ele.naturalWidth
    	this.height = this.ele.naturalHeight
    	this.completeRatio = options.completeRatio || 0.3
    	this.completeFunction = options.completeFunction || null
    	this.startFunction = options.startFunction || null

    	this.started = false
    	this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext("2d");
        this.canvas.id = "eraser";
        this.canvas.className = "canvas";                  
        this.canvas.width = this.width;                       
        this.canvas.height = this.height;

        this.size = 40 
        this.colParts = Math.floor(this.width / this.size)
		this.numParts = this.colParts * Math.floor(this.height / this.size)
        this.parts = []
        this.complete = false
        this.ratio = 0
        this.adjustment = 1

		let n = this.numParts

        while(n--) this.parts.push(1)

        this.ctx.drawImage(this.ele, 0, 0);        
        this.ele.parentNode.insertBefore(this.canvas, this.ele);    
        setTimeout(()=>{
        	this.ele.parentNode.removeChild(this.ele)
        }, 100)
        
        this.events()
    }

    events () {
        this.isPress = false;
        this.old = null;
        this.canvas.addEventListener('mousedown', this.start.bind(this), true);
        this.canvas.addEventListener('mousemove', this.move.bind(this), true);
        this.canvas.addEventListener('mouseup', this.end.bind(this), true);

        this.canvas.addEventListener('touchstart', this.start.bind(this), true);
        this.canvas.addEventListener('touchmove', this.move.bind(this), true);
        this.canvas.addEventListener('touchend', this.end.bind(this), true);
    }

    start (e) {
    	e.preventDefault()
    	this.isPress = true;
    	this.rect = e.target.getBoundingClientRect()
		this.old = {x: e.offsetX || e.targetTouches[0].clientX, y : e.offsetY || e.targetTouches[0].clientY};

		if (!this.started && this.startFunction != null) {
			this.started = true
			this.startFunction()
		}
    }

    move (e) {
    	e.preventDefault()
    	if (this.isPress && !this.complete) {
    		this.rect = e.target.getBoundingClientRect()
            var x = e.offsetX || e.targetTouches[0].clientX;
            var y = e.offsetY || e.targetTouches[0].clientY;
            this.ctx.globalCompositeOperation = 'destination-out';

            this.ctx.beginPath();
            this.ctx.arc(x, y, 20, 0, 20 * Math.PI);
            this.ctx.fill();

            this.ctx.lineWidth = 40;
            this.ctx.beginPath();
            this.ctx.moveTo(this.old.x, this.old.y);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();

            this.old = {x: x, y: y};

            this.evaluatePoint(x, y)
		}
    }

    end (e) {
    	e.preventDefault()
    	this.isPress = false;
    	console.log('end')
    }

    remove () {
    	console.log('remove')

        this.canvas.removeEventListener('mousedown', this.start, true);
        this.canvas.removeEventListener('mousemove', this.move, true);
        this.canvas.removeEventListener('mouseup', this.end, true);

        this.canvas.removeEventListener('touchstart', this.start, true);
        this.canvas.removeEventListener('touchmove', this.move, true);
        this.canvas.removeEventListener('touchend', this.end, true);
    }

    evaluatePoint (x, y) {
		var p = Math.floor(x/this.size) + Math.floor( y / this.size ) * this.colParts;

		if ( p >= 0 && p < this.numParts ) {
			this.ratio += this.parts[p];
			this.parts[p] = 0;
			if (!this.complete) {
				p = this.ratio/this.numParts;
				console.log(p)
				if ( p >= this.completeRatio ) {
					this.complete = true;

					this.remove()

					if ( this.completeFunction != null ) this.completeFunction();
				} else {
					if ( this.progressFunction != null ) this.progressFunction(p);
				}
			}
		}

    }
}