SNAKE_ENGINE = {};
(function(){
	var params = {
		//params that should be configured on init!
		container : '',
		size : [20,30], //W x H
		color : 'grey',
		callback : function(f,d){},

		//constants after init
		cells : '',
		board : [],
		directionMap : {'R':[0,1],'L':[0,-1],'U':[-1,0],'D':[1,0]},
		snakeTimer : '',
		snakeSpeed : 0,
		grow : false,
		
		//variables that change state throughout the game (need reset)
		direction : 'R',
		directionArray : [],
		snakeArray : [],
		foodLocation : '',
		foodCount : 0
	};

	var methods = {
		setBoard : function(){
			var theRow = parseInt( params.size[1]/2 )-1;

			// //plot the snake on the board
			for(var i=4;i>=0;i--){
				thisCell = params.board[theRow][i];
				thisCell.style.backgroundColor = params.color;
				params.snakeArray.push([theRow,i].join());
			}

			methods.placeFood();
		},

		gameCycle : function(){
			//PULL THE NEXT DIRECTION CHANGE FROM THE ARRAY OR CONTINUE IN EXISTING DIRECTION
			params.direction = params.directionArray.shift() || params.direction;
				
			//CALCULATE NEXT CELL OR OUT OF BOUNDS
			var nextCell;
			var theHead = params.snakeArray[0].split(',');
			var incr = params.directionMap[params.direction];
			var nextDims = [parseInt(theHead[0])+incr[0],parseInt(theHead[1])+incr[1]];
			var nextRow = params.board[nextDims[0]];
			var isOutOfBounds = true;
			if(typeof nextRow !== 'undefined') {
				nextCell = nextRow[nextDims[1]];
				if(typeof nextCell !== 'undefined'){
					isOutOfBounds = false;
				}
			}

			//IS SNAKE OUT OF BOUNDS OR DID SNAKE INTERSECT WITH ITSELF?
			if(isOutOfBounds || params.snakeArray.indexOf(nextDims.join())!==-1){
				methods.endGame();
				return;
			}

			//move forward
			params.snakeArray.unshift(nextDims.join());
			nextCell.style.backgroundColor = params.color;

			//DID THE NEXT CELL CONTAIN FOOD?
			if(nextCell===params.foodLocation){
				methods.eatFood(nextCell);
			}
			
			//remove tail
			if(!params.grow){
				var tail = params.snakeArray.pop().split(',');
				params.board[tail[0]][tail[1]].style.backgroundColor = 'inherit';
			}
			params.grow = false;
		},

		placeFood : function(c){
			while(true){
				params.foodLocation = params.cells[Math.floor((Math.random() * (params.size[0]*params.size[1])))];
				if(params.foodLocation.style.backgroundColor!==params.color){
					break;
				}
			}
			params.foodLocation.innerHTML = '<span>*</span>';
		},

		eatFood : function(){
			params.grow = true;
			params.foodLocation.innerHTML = '';
			params.foodCount++;
			methods.placeFood();
			params.callback('ate',params.foodCount);
		},

		endGame : function(){
			clearInterval(params.snakeTimer);
			$ignore(document,'keydown',methods.delegate(this,methods.arrowListener));		
				
			params.callback('ended','game over');
		},

		arrowListener : function(e){
			var code = $event(e).keyCode;
			var codes = { '37':'L', '38':'U', '39':'R', '40':'D' };
			if(code in codes && [['L','R'],['U','D']][code%2].indexOf(params.direction)!==-1){
				params.directionArray[params.directionArray.length] = codes[code];
				params.direction = codes[code];
			}
		},

		delegate : function(s, f){ return function(){ f.apply(s, arguments); }; return this;},

		configure : function(obj){
			var enums = ['container','size','color','callback'];
			var key;
			for(var i=0;i<enums.length;i++){
				key = enums[i];
				if(typeof obj[key] !== 'undefined'){
					params[key] = obj[key];
				}
			}
		}
	};
	
	this.init = function(obj){ methods.configure(obj);
		var table = $element('TABLE',{'id':'board'});
		var tbody = $element('TBODY');
		var tr,td;

		//build the table
		for(var i=0;i<params.size[1];i++){
		  params.board[i] = [];
		  tr = $element('TR');
		  for(var j=0;j<params.size[0];j++){
		  	params.board[i][j] = $element('TD');
		    tr.appendChild(params.board[i][j]);
		  }
		  tbody.appendChild(tr);
		  table.appendChild(tbody);
		}
		params.cells = tbody.getElementsByTagName('TD');
			
		params.container.appendChild(table);

		methods.setBoard();
		return table;
	};

	this.start = function(key){
		params.snakeSpeed = {'slow':300,'med':200,'fast':100}[key];
		$listen(document,'keydown',methods.delegate(this,methods.arrowListener));		
		params.snakeTimer = setInterval(methods.delegate(this,methods.gameCycle),params.snakeSpeed);
	};

	this.reset = function(){

		params.foodLocation.removeChild(params.foodLocation.firstChild);
		while(params.snakeArray.length){
			var foo = params.snakeArray.pop();
			foo = foo.split(',');
			params.board[foo[0]][foo[1]].style.backgroundColor = 'inherit';
		}

		params.direction = 'R';
		params.directionArray = [];
		params.foodLocation = '';
		params.foodCount = 0;

		methods.setBoard();
	};
}).apply(SNAKE_ENGINE);