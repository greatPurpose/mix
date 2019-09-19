ampUi.FiltersGraph = function(controllersContext) {
	var _controllersContext = controllersContext; // Global context
	var _graphContext = this;
	this.containerJq =  $("#" + ampUi.filtersGraphSettings.htmlContainerId);
	this.containerWidth = $(this.containerJq).width(); // Overall width and height
	this.containerHeight = $(this.containerJq).height();
	this.konvaStage = new Konva.Stage({ // Main konva stage 
		container: ampUi.filtersGraphSettings.htmlContainerId,
		width: _graphContext.containerWidth,
		height: _graphContext.containerHeight
    });
    console.log('stage = 7');
	this.scaleLayer = new Konva.FastLayer();
	this.konvaStage.add(this.scaleLayer);
	this.circleSize = this.containerHeight * (ampUi.filtersGraphSettings.circleSizeCoefficient / 100); // Circle with number diameter
	this.circleMargin = this.circleSize / 2 + ampUi.filtersGraphSettings.circleStrokeWidth / 4; // Margin to draw a grid that circle would reach all the values 
	// ++ Frequency scale map (X axis)
	this.frequencyScaleBeginningPixel = this.circleMargin;
	this.frequencyScaleEndingPixel = this.containerWidth - this.circleMargin - ampUi.filtersGraphSettings.gainScaleWidth;
	this.frequencyScaleMap = ampUi.math.createLogarithmicMap(
		this.containerWidth, 
		this.frequencyScaleBeginningPixel, 
		this.frequencyScaleEndingPixel,
		ampUi.filtersGraphSettings.minFrequency,
		ampUi.filtersGraphSettings.maxFrequency);
	// -- Frequency scale map (X axis)
	// ++ Gain scale map (Y axis)
	this.gainScaleBeginningPixel = this.circleMargin;
	this.gainScaleEndingPixel = this.containerHeight - this.circleMargin - ampUi.filtersGraphSettings.frequencyScaleHeight;
	this.gainScaleMap = ampUi.math.createLinearMap_Inverted(
		this.containerHeight, 
		this.gainScaleBeginningPixel, 
		this.gainScaleEndingPixel,
		ampUi.filtersGraphSettings.minGain,
		ampUi.filtersGraphSettings.maxGain);
	// -- Gain scale map (Y axis)
	// ++ Map converters 
	this.frequencyToX = function(frequency) { return Number(ampUi.math.getIndexOfClosestToInArray_Sequential(frequency, _graphContext.frequencyScaleMap)); };
	this.xToFrequency = function(x) { return _graphContext.frequencyScaleMap[x]; };
	this.gainToY = function(gain) { return Number(ampUi.math.getIndexOfClosestToInArray_Sequential(gain, _graphContext.gainScaleMap)); };
	this.yToGain = function(y) { return _graphContext.gainScaleMap[Math.round(y)]; }
	// -- Map converters  
	// ++ Frequency grid
	this.createFrequencyGrid = function() {
		var gridStops = ampUi.filtersGraphSettings.gridAtFrequency;
		for(var i = 0; i < gridStops.length; i++) {
			var x = _graphContext.frequencyToX(gridStops[i]) - 0.5;
			var frequencyLine = new Konva.Line({
				points: [x, _graphContext.gainScaleBeginningPixel, x, _graphContext.gainScaleEndingPixel],
				stroke: ampUi.colors.equalizerGrid,
				strokeWidth: ampUi.filtersGraphSettings.gridStrokeWidth,
				listening: false
			});
			_graphContext.scaleLayer.add(frequencyLine);
		}
	};
	// -- Frequency grid
	// ++ Gain grid
	this.createGainGrid = function() {
		var gridStops = ampUi.filtersGraphSettings.gridAtGain;
		for(var i = 0; i < gridStops.length; i++) {
			var y = _graphContext.gainToY(gridStops[i]) - 0.5;
			var gainLine = new Konva.Line({
				points: [_graphContext.frequencyScaleBeginningPixel, y, _graphContext.frequencyScaleEndingPixel, y],
				stroke: ampUi.colors.equalizerGrid,
				strokeWidth: ampUi.filtersGraphSettings.gridStrokeWidth
			});
			_graphContext.scaleLayer.add(gainLine);
		}
	};
	// -- Gain grid
	// ++ Frequency scale  
	this.createFrequencyScale = function() {
		var scaleStops = ampUi.filtersGraphSettings.scaleNumbersAtFrequency;
		var y = _graphContext.containerHeight -  ampUi.filtersGraphSettings.frequencyScaleHeight / 2 - ampUi.filtersGraphSettings.scaleNumberHeight / 2;
		var itemColor = "";
		var itemText = "";
		for(var i = 0; i < scaleStops.length; i++) {
			if(i == 0) { // First scale item is "Hz" sign 
				itemText = ampUi.globalSettings.frequencyMark;
				itemColor = ampUi.colors.frequencyScaleLabel;
			} else if(scaleStops[i] >= 1000) { // Thousands are shortened to *k
				itemText = (scaleStops[i] / 1000) + ampUi.globalSettings.thousandsMark;
				itemColor = ampUi.colors.frequencyScaleNumber;
			} else {
				itemText = scaleStops[i]; // Other values are as usual 
				itemColor = ampUi.colors.frequencyScaleNumber;
			}
			var x = _graphContext.frequencyToX(scaleStops[i]) - 0.5;
			var frequencyScaleItem = new Konva.Text({
				x: x, 
				y: y,
				text: itemText,
				fill: itemColor,
				fontSize: ampUi.filtersGraphSettings.scaleNumberHeight,
				fontFamily: ampUi.globalSettings.fontOrdinary 
			});
			frequencyScaleItem.offsetX(frequencyScaleItem.width() / 2);
			_graphContext.scaleLayer.add(frequencyScaleItem);
		}
	};
	// -- Frequency scale 
	// ++ Gain scale 
	this.createGainScale = function() {
		var scaleStops = ampUi.filtersGraphSettings.scaleNumbersAtGain;
		var x = _graphContext.containerWidth -  ampUi.filtersGraphSettings.gainScaleWidth / 2;
		var itemColor = "";
		var itemText = "";
		for(var i = 0; i < scaleStops.length; i++) {
			if(scaleStops[i] == 0) { // 0 scale item is "dB" sign 
				itemText = ampUi.globalSettings.gainMark;
				itemColor = ampUi.colors.gainScaleLabel;
			} else {
				itemText = scaleStops[i]; // Other values are as usual 
				itemColor =  ampUi.colors.gainScaleNumber;
			}
			var y = _graphContext.gainToY(scaleStops[i])  - ampUi.filtersGraphSettings.scaleNumberHeight / 2;
			var gainScaleItem = new Konva.Text({
				x: x, 
				y: y ,
				text: itemText,
				fill: itemColor,
				fontSize: ampUi.filtersGraphSettings.scaleNumberHeight,
				fontFamily: ampUi.globalSettings.fontOrdinary 
			});
			gainScaleItem.offsetX(gainScaleItem.width() / 2);
			_graphContext.scaleLayer.add(gainScaleItem);
		}
	};
	// -- Gain scale  
	// ++ Logo 
	this.createLogo = function() { // Here some pixel art was performed 
		var leftX = Math.round(_graphContext.containerWidth - ampUi.filtersGraphSettings.logoSide);
		var topY = Math.round(_graphContext.containerHeight - ampUi.filtersGraphSettings.logoSide) - 0.5;
		var rectangles = [];
		rectangles.push(new Konva.Rect({ x: leftX + 1.5, y: topY,  width: 3, height: 26, fill: ampUi.colors.logoFill, stroke: ampUi.colors.logoStroke, strokeWidth: 1 })); // Long
		rectangles.push(new Konva.Rect({ x: leftX + 10.5, y: topY,  width: 3, height: 26, fill: ampUi.colors.logoFill, stroke: ampUi.colors.logoStroke, strokeWidth: 1 }));
		rectangles.push(new Konva.Rect({ x: leftX + 19.5, y: topY,  width: 3, height: 26, fill: ampUi.colors.logoFill, stroke: ampUi.colors.logoStroke, strokeWidth: 1 }));
		rectangles.push(new Konva.Rect({ x: leftX + 28.5, y: topY,  width: 3, height: 26, fill: ampUi.colors.logoFill, stroke: ampUi.colors.logoStroke, strokeWidth: 1 }));
		rectangles.push(new Konva.Rect({ x: leftX - 0.5, y: topY + 7,  width: 7, height: 9, fill: ampUi.colors.logoFill, stroke: ampUi.colors.logoStroke, strokeWidth: 1 })); // Short
		rectangles.push(new Konva.Rect({ x: leftX + 8.5, y: topY + 13,  width: 7, height: 9, fill: ampUi.colors.logoFill, stroke: ampUi.colors.logoStroke, strokeWidth: 1 }));
		rectangles.push(new Konva.Rect({ x: leftX + 17.5, y: topY + 2,  width: 7, height: 9, fill: ampUi.colors.logoFill, stroke: ampUi.colors.logoStroke, strokeWidth: 1 }));
		rectangles.push(new Konva.Rect({ x: leftX + 26.5, y: topY + 14,  width: 7, height: 9, fill: ampUi.colors.logoFill, stroke: ampUi.colors.logoStroke, strokeWidth: 1 }));
		for(var i = 0; i < rectangles.length; i++) {
			_graphContext.scaleLayer.add(rectangles[i]);
		}
	};
	// -- Logo 
	
	// ++ Lines layer
	this.linesLayer = new Konva.FastLayer({
        clip: { // Clipping to avoid drawing on coordinates that exceed top / bottom limits 
          x: _graphContext.frequencyScaleBeginningPixel + ampUi.filtersGraphSettings.partialCurveStrokeWidth * 2,
          y: _graphContext.gainScaleBeginningPixel + ampUi.filtersGraphSettings.partialCurveStrokeWidth * 2,
          width: _graphContext.frequencyScaleEndingPixel - _graphContext.frequencyScaleBeginningPixel - ampUi.filtersGraphSettings.partialCurveStrokeWidth * 4,
          height: _graphContext.gainScaleEndingPixel - _graphContext.gainScaleBeginningPixel - ampUi.filtersGraphSettings.partialCurveStrokeWidth * 4
	}});
	this.konvaStage.add(this.linesLayer);
	// -- Lines layer
	// ++ Matrix
	this.matrixLength = ampUi.globalSettings.equalizerPairs;
	this.matrixStep = (this.frequencyScaleEndingPixel - this.frequencyScaleBeginningPixel) / this.matrixLength;
	this.frequencyMatrixMap = new Array(this.matrixLength);
	this.matrix = {}; // Index is corresponding to mapped frequency value, number is gain amount 
	this.updateMatrix = {};
	this.matrixResulting = new Array(ampUi.globalSettings.equalizerPairs);
	this.matrixResulting.fill(0);
	this.addFilterMatrixToResulting = function(filterMatrix) { // Add a matrix of some filter to resulting
		for(var i = this.matrixLength; --i;) {
			this.matrixResulting[i] += filterMatrix[i];
		}
		this.matrixResulting[0] += filterMatrix[0];
	};
	this.subtractFilterMatrixFromResulting = function(filterMatrix) { // Subtract a matrix of some filter to resulting
		for(var i = this.matrixLength; --i;) {
			this.matrixResulting[i] -= filterMatrix[i];
		}
		this.matrixResulting[0] -= filterMatrix[0];
	};
	// -- Matrix
	// ++ Line matrix
	this.lineMatrix = {}; // Sequence in form of [x,y,x,y,x...] for line drawing 
	this.updateLineMatrix = {};
	this.lineMatrixResulting = new Array(ampUi.globalSettings.equalizerPairs * 2);
	this.updateLineMatrixResulting = function() { // Update line matrix (for drawing) according to core matrix 
		var matrix = this.matrixResulting;
		var lineMatrix = this.lineMatrixResulting;
		var xOffset = this.frequencyScaleBeginningPixel;
		var step = this.matrixStep;
		var gainToY = this.gainToY;
		for(var i = matrix.length; --i;) { 
			lineMatrix[i * 2] = xOffset + (i + 1) * step; // X
			lineMatrix[i * 2 + 1] = gainToY(matrix[i]); // Y
		}
		lineMatrix[0] = xOffset + step; // X
		lineMatrix[1] = gainToY(matrix[0]); // Y
	};
	// -- Line matrix
	// ++ Konva lines
	this.konvaLine = {}; // Lines to draw
	this.setLineSelected = {};
	this.setLineUnselected = {};
	this.redrawLine = {};
	this.konvaLineResulting = new Konva.Line({ strokeWidth: ampUi.filtersGraphSettings.leadingCurveStrokeWidth, stroke: ampUi.colors.filterSumLine, tension: 0.40 });
	this.linesLayer.add(this.konvaLineResulting);
	// -- Konva lines
	
	// ++ Circles 
	this.circleRadius = this.circleSize / 2; 
	this.dragGroupMinX = Math.ceil(this.frequencyScaleBeginningPixel);
	this.dragGroupMaxX = Math.floor(this.frequencyScaleEndingPixel);
	this.dragGroupMinY = Math.ceil(this.gainScaleBeginningPixel);
	this.dragGroupMaxY = Math.floor(this.gainScaleEndingPixel);
	// -- Circles 
	
	this.circlesLayer = new Konva.Layer(); // Separate layer for draggable circles 
	this.konvaStage.add(this.circlesLayer);
	
	this.konvaDraggableGroup = {}; // Draggable controls 
	this.onKonvaGroupSeleced = {};
	this.konvaCircle = {};
	this.setCircleUnselected = {};
	this.setCircleSelected = {};
	this.updateCirclePosition = {};
	this.redrawCircle = {};
	
	this.konvaNumber = {}; 
	this.dragBoundFunc = function(cursorPosition) { 
		var x = cursorPosition.x;
		var y = cursorPosition.y;
		if(x < _graphContext.dragGroupMinX) x = _graphContext.dragGroupMinX;
		else if(x >  _graphContext.dragGroupMaxX) x = _graphContext.dragGroupMaxX;
		if(y < _graphContext.dragGroupMinY) y = _graphContext.dragGroupMinY;
		else if(y > _graphContext.dragGroupMaxY) y = _graphContext.dragGroupMaxY;
		return { x: x, y: y };
	}
	
	this.filterValueChanged = {};
	//this.selectedController = null;
	
	
	
	

	
	this.extend = function(index) {
		var controller = _controllersContext.controllers[index];
		// ++ Filter matrix
		this.matrix[index] = new Array(ampUi.globalSettings.equalizerPairs); // Instantiate matrix 
		this.updateMatrix[index] = function(isInitial) { // Update core matrix according to current filter values
			var matrix = _graphContext.matrix[index]; // Link matrix 
			if(controller.data.active && !isInitial) _graphContext.subtractFilterMatrixFromResulting(matrix); // Subtract it from resulting matrix before updating
			var matrixMap = _graphContext.frequencyMatrixMap;
			BiQuadFilter.create( 
				BiQuadFilter[controller.settings.biQuadAlias], 
				controller.data.frequency, 
				ampUi.filtersGraphSettings.sampleRate, 
				controller.data.quality, 
				controller.data.gain);
			for(var i = matrix.length; --i;) { // Update matrix 
				matrix[i] = BiQuadFilter.log_result(matrixMap[i]);
			}
			matrix[0] = BiQuadFilter.log_result(matrixMap[i]);
			if(controller.data.active) _graphContext.addFilterMatrixToResulting(matrix); // Add it to resulting matrix after updating
		};
		this.updateMatrix[index](true); // Initial matrix fill 
		// -- Filter matrix
		
		// ++ Konva line matrix
		this.lineMatrix[index] = new Array(ampUi.globalSettings.equalizerPairs * 2); // Instantiate line matrix  
		this.updateLineMatrix[index] = function() { // Update line matrix (for drawing) according to core matrix 
			var matrix = _graphContext.matrix[index];
			var lineMatrix = _graphContext.lineMatrix[index];
			var xOffset = _graphContext.frequencyScaleBeginningPixel;
			var step = _graphContext.matrixStep;
			var gainToY = _graphContext.gainToY;
			for(var i = matrix.length; --i;) { 
				lineMatrix[i * 2] = xOffset + (i + 1) * step; // X
				lineMatrix[i * 2 + 1] = gainToY(matrix[i]); // Y
			}
			lineMatrix[0] = xOffset + step; // X
			lineMatrix[1] = gainToY(matrix[0]); // Y
			if(controller.data.active) _graphContext.updateLineMatrixResulting(); // Refresh resulting line matrix every time some other changes
		};
		// -- Konva line matrix
		// ++ Konva line drawing 
		this.konvaLine[index] = new Konva.Line({ strokeWidth: ampUi.filtersGraphSettings.partialCurveStrokeWidth, tension: 0 });
		this.linesLayer.add(this.konvaLine[index]); // Add new line to lines layer 
		this.konvaLine[index].zIndex(controller.settings.orderNumber - 1); // Set proper z-index to it 
		this.konvaLineResulting.zIndex(controller.settings.orderNumber); // Resulting line is always one step upper than last added
		
		this.setLineSelected[index] = function() {
			var line = _graphContext.konvaLine[index];
			line.opacity(ampUi.filtersGraphSettings.partialCurveSelectedOpacity);
			if(controller.data.active) {
				line.stroke(controller.settings.color);
			} else {
				line.stroke(ampUi.colors.filterInactiveLine);
			}
			_graphContext.linesLayer.draw();
		};
		this.setLineUnselected[index] = function() {
			var line = _graphContext.konvaLine[index];
			line.opacity(ampUi.filtersGraphSettings.partialCurveUnselectedOpacity);
			if(controller.data.active) {
				line.stroke(controller.settings.color);
			} else {
				line.stroke(ampUi.colors.filterInactiveLine);
			}
			_graphContext.linesLayer.draw();
		};
		this.redrawLine[index] = function(isMatrixUpdateRequired) {
			if(isMatrixUpdateRequired) {
				_graphContext.updateMatrix[index](false);
				_graphContext.updateLineMatrix[index]();
				_graphContext.konvaLine[index].points(_graphContext.lineMatrix[index]); // Assign line matrix to konva line 
				_graphContext.konvaLineResulting.points(_graphContext.lineMatrixResulting);
			}
			_graphContext.linesLayer.draw();
		};
		// -- Konva line drawing
			

		// ++ Draggable circles   
		this.konvaDraggableGroup[index] = new Konva.Group({ draggable: true, dragBoundFunc: _graphContext.dragBoundFunc });
		this.konvaDraggableGroup[index].controller = controller;
		this.circlesLayer.add(this.konvaDraggableGroup[index]);
		this.konvaDraggableGroup[index].zIndex(controller.settings.orderNumber - 1);
		this.konvaCircle[index] = new Konva.Circle({ radius: _graphContext.circleRadius, strokeWidth: ampUi.filtersGraphSettings.circleStrokeWidth });
		this.konvaNumber[index] = new Konva.Text({ text: controller.settings.orderNumber, fontSize: _graphContext.circleRadius, fontFamily: ampUi.globalSettings.fontOrdinary });
		this.konvaNumber[index].offsetX(this.konvaNumber[index].width() / 2);
		this.konvaNumber[index].offsetY(this.konvaNumber[index].height() / 2);
		this.konvaDraggableGroup[index].add(this.konvaCircle[index]);
		this.konvaDraggableGroup[index].add(this.konvaNumber[index]);
		this.onKonvaGroupSeleced[index] = function() { // Applies on "click" and "dragstart" events of konva group
			_controllersContext.previouslySelectedController = _controllersContext.currentlySelectedController;
			_controllersContext.currentlySelectedController = _controllersContext.controllers[index];
			_controllersContext.triggerSelectedControllerChanged();
			
			
			/*
			if(_controllersContext.selectedController) { // Unselect previous 
				_controllersContext.selectedController.setliUnselected(); // 
				_controllersContext.selectedController.setLineUnselected();
				_controllersContext.selectedController.setCircleUnselected();
			}
			this.controller.setliSelected();
			this.controller.setLineSelected();
			this.controller.setCircleSelected();
			_controllersContext.selectedController = this.controller;
			*/
		}
		
		this.konvaDraggableGroup[index].on('click', this.onKonvaGroupSeleced[index]);
		this.konvaDraggableGroup[index].on('dragstart', this.onKonvaGroupSeleced[index]);
		
		
		this.konvaDraggableGroup[index].on('dragmove', function() { 
			
			var frequency = _graphContext.xToFrequency(this.position().x);
			var gain = _graphContext.yToGain(this.position().y);
			
			controller.data.frequency = frequency;
			controller.data.gain = gain;
			
			controller.eventsContext.triggerFrequencyChanged();
			controller.eventsContext.triggerGainChanged();
			
			/*
			this.controller.setliSelected();
			
			this.controller.updateliFrequency();
			this.controller.updateliGain();
			

			this.controller.redrawLine(true);
			*/
			
		});
		
		// -- Circles 
		
		

		// ++ Circles methods 
		this.setCircleUnselected[index] = function() { 
			var circle = _graphContext.konvaCircle[index];
			var number = _graphContext.konvaNumber[index];
			if(controller.data.active) {
				circle.stroke(controller.settings.color);
				circle.fill(ampUi.colors.backgroundOrdinary);
				number.stroke(controller.settings.color);
			} else {
				circle.stroke(ampUi.colors.filterInactiveCircleNumber);
				circle.fill(ampUi.colors.backgroundOrdinary);
				number.stroke(ampUi.colors.filterInactiveCircleNumber);
			}
			_graphContext.circlesLayer.draw();
		};
		this.setCircleSelected[index] = function () {
			var circle = _graphContext.konvaCircle[index];
			var number = _graphContext.konvaNumber[index];
			if(controller.data.active) {
				circle.stroke(controller.settings.color);
				circle.fill(controller.settings.color);
				number.stroke(controller.settings.textColor);
			} else {
				circle.stroke(ampUi.colors.filterInactiveCircleNumber);
				circle.fill(ampUi.colors.filterInactiveCircleNumber);
				number.stroke(ampUi.colors.backgroundOrdinary);
			}
			_graphContext.circlesLayer.draw();
		}
		
		
		/*
		this.updateCirclePosition[index] = function() { // Change a position of a draggable group where the circle and its number are
			_graphContext.konvaDraggableGroup[index].position({x: _graphContext.frequencyToX(controller.data.frequency), y: _graphContext.gainToY(controller.data.gain) });
		}
		*/
		
		this.redrawCircle[index] = function(isPositionUpdateNeeded) {
			if(isPositionUpdateNeeded) _graphContext.konvaDraggableGroup[index].position({x: _graphContext.frequencyToX(controller.data.frequency), y: _graphContext.gainToY(controller.data.gain) });
			_graphContext.konvaDraggableGroup[index].draw();
		};
		// -- Circles methods 
		
		/*
		this.frequencyChanged = {};
		this.gainChanged = {};
		this.qualityChanged = {};
		this.stateChanged = {};
		*/
		
		this.filterValueChanged[index] = function() { 
			_graphContext.redrawLine[index](true); 
			_graphContext.redrawCircle[index](true); 
		};
		
		// ++ Events listeners
		//this.frequencyChanged[index] = function() { _graphContext.updateCirclePosition[index](); };
		controller.eventsContext.frequencyChanged.push(this.filterValueChanged[index]);
		//this.gainChanged[index] = function() { $(_listContext.jGainValue[index]).text(controller.data.gain.toFixed(ampUi.globalSettings.gainDecimalPoints)); };
		controller.eventsContext.gainChanged.push(this.filterValueChanged[index]);
		//this.qualityChanged[index] = function() { $(_listContext.jQualityValue[index]).text(controller.data.quality.toFixed(ampUi.globalSettings.qualityDecimalPoints)); };
		controller.eventsContext.qualityChanged.push(this.filterValueChanged[index]);
		//this.stateChanged[index] = function() { if(controller.data.active) _listContext.setListItemActive[index](); else _listContext.setListItemInactive[index](); };
		//controller.eventsContext.stateChanged.push(this.stateChanged[index]);
		// -- Events listeners
		
	};
	
	
	
	(function() {
		// ++ Draw a scale
		_graphContext.createFrequencyGrid();
		_graphContext.createGainGrid();
		_graphContext.createFrequencyScale();
		_graphContext.createGainScale();
		_graphContext.createLogo();
		_graphContext.scaleLayer.draw();
		// -- Draw a scale
		// ++ Initialize matrix map 
		var scaleMap = _graphContext.frequencyScaleMap;
		var matrixMap = _graphContext.frequencyMatrixMap;
		var scaleMapBeginning = _graphContext.frequencyScaleBeginningPixel;
		var step = _graphContext.matrixStep;
		for(var i = _graphContext.matrixLength; --i;) { 
			matrixMap[i] = scaleMap[Math.floor(scaleMapBeginning + (i + 1) * step)];
		}
		matrixMap[0] = scaleMap[Math.floor(scaleMapBeginning + step)];
		// -- Initialize matrix map 
		
		var controllers = _controllersContext.controllers;
		for(var index in controllers) {
			_graphContext.extend(index); // Extending 
			
			// ++ Running initialization methods 
			//_listContext.setTextConstants[index](); 
			//_listContext.setListItemUnselected[index](); 
			
			//_graphContext.redrawLine[index](true); 
			_graphContext.setLineUnselected[index](); 
			
			//_graphContext.updateCirclePosition[index](); 
			_graphContext.setCircleUnselected[index](); 
			//_graphContext.redrawCircle[index](true); 
			
			// -- Running initialization methods 
		}
		// ++ Selected item changed 
		_controllersContext.selectedControllerChanged.push(function() {
			var previous = _controllersContext.previouslySelectedController;
			var current = _controllersContext.currentlySelectedController;
			if(previous) {
				_graphContext.setCircleUnselected[previous.name](); 
				_graphContext.setLineUnselected[previous.name]();  
				
				//_listContext.setListItemUnselected[previous.name](); 
			}
			_graphContext.setLineSelected[current.name](); 
			_graphContext.redrawLine[current.name](false); 
			
			//_graphContext.updateCirclePosition[current.name](); 
			_graphContext.setCircleSelected[current.name](); 
			
			_graphContext.redrawCircle[current.name](false); 
			//_listContext.setListItemSelected[current.name](); 
		});
		// -- Selected item changed 
	})();
};




