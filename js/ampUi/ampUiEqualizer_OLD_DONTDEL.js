// ++ EQ
ampUi.eq = {};
//	++ EQ PARAMETERS
ampUi.eq.parameters = {};
ampUi.eq.parameters.initialize = function(minHzFrequency, maxHzFrequency, dbGainThreshold, minQuality, maxQuality, sampleRate) {
	this.minHzFrequency = minHzFrequency;
	this.maxHzFrequency = maxHzFrequency;
	this.dbGainThreshold = dbGainThreshold;
	this.minQuality = minQuality;
	this.maxQuality = maxQuality;
	this.sampleRate = sampleRate;
};
//	-- EQ PARAMETERS
//	++ EQ DIMENSIONS
ampUi.eq.dimensions = {};
ampUi.eq.dimensions.createGridAreaHzMap = function(gridAreaLeftX, gridAreaWidth) {
	var minHz = ampUi.eq.parameters.minHzFrequency;
	var maxHz = ampUi.eq.parameters.maxHzFrequency;
	var hzMap = new Array(Math.round(gridAreaLeftX + gridAreaWidth));
	for(var i = 0; i < gridAreaWidth; i++) {
		// Each X pixel of grid area has its own frequency value assigned in logarithmic order
		hzMap[gridAreaLeftX + i] = Math.pow(10, (Math.log10(maxHz - minHz) / gridAreaWidth * i)) + minHz;
	}
	return hzMap;
};
ampUi.eq.dimensions.createGridAreaDbMap = function(gridAreaTopY, gridAreaHeight) {
	var dbGainThreshold = ampUi.eq.parameters.dbGainThreshold;
	var gridAreaHalfHeight = Math.round(gridAreaHeight / 2);
	var dbStep = dbGainThreshold / gridAreaHalfHeight;
	var dbMap = new Array(Math.round(gridAreaTopY + gridAreaHeight));
	for(var i = 0; i <= gridAreaTopY; i++) { // Empty space
		dbMap[i] = Number.MAX_SAFE_INTEGER;
	}
	for(var i = 0; i < gridAreaHalfHeight; i++) { // Positive values 
		dbMap[gridAreaTopY + i] = (gridAreaHalfHeight - i) * dbStep;
	}
	for(var j = gridAreaHalfHeight; j < gridAreaHeight; j++) { // Negative values 
		dbMap[gridAreaTopY + j]  = - (j - gridAreaHalfHeight) * dbStep;
	}
	return dbMap; 
};
ampUi.eq.dimensions.indexOfClosestToBinary = function(searchValue, sourceArray) { // Binary search method to match corresponding mapped frequency pixel
	var middleIndex;
	var lowIndex = 0;
	var highIndex = sourceArray.length - 1;
	while (highIndex - lowIndex > 1) {
		middleIndex = Math.floor((lowIndex + highIndex) / 2);
		if (sourceArray[middleIndex] < searchValue) {
			lowIndex = middleIndex;
		} else {
			highIndex = middleIndex;
		}
	}
	if (searchValue - sourceArray[lowIndex] <= sourceArray[highIndex] - searchValue) {
		return lowIndex;
	}
	return highIndex;
};
ampUi.eq.dimensions.indexOfClosestToPlain = function(searchValue, sourceArray) { // Plain search method to match corresponding mapped gain pixel
	var minimum, chosenIndex = 0;
    for (var i in sourceArray) {
        minimum = Math.abs(sourceArray[chosenIndex] - searchValue);
        if (Math.abs(sourceArray[i] - searchValue) < minimum) {
            chosenIndex = i;
        }
    }
    return chosenIndex;
}
ampUi.eq.dimensions.initialize = function(
	containerWidth,
	containerHeight, 
	dbScaleWidth, 
	hzScaleHeight,
	gridAreaTopMargin, 
	gridAreaRightMargin, 
	gridAreaBottomMargin, 
	gridAreaLeftMargin,
	gridStrokeWidth,
	partialCurveStrokeWidth,
	leadingCurveStrokeWidth,
	circleDiameter,
	circleStrokeWidth,
	numberHeight) {
	// ++ Source values
	this.containerWidth = containerWidth;
	this.containerHeight = containerHeight;
	this.dbScaleWidth = dbScaleWidth;
	this.hzScaleHeight = hzScaleHeight;
	this.gridAreaTopMargin = gridAreaTopMargin;
	this.gridAreaRightMargin = gridAreaRightMargin;
	this.gridAreaBottomMargin = gridAreaBottomMargin;
	this.gridAreaLeftMargin = gridAreaLeftMargin;
	this.gridStrokeWidth = gridStrokeWidth;
	this.partialCurveStrokeWidth = partialCurveStrokeWidth;
	this.leadingCurveStrokeWidth = leadingCurveStrokeWidth;
	this.circleDiameter = circleDiameter; 
	this.circleStrokeWidth = circleStrokeWidth; 
	this.numberHeight = numberHeight;
	// -- Source values
	// ++ Calculated values 
	//	++ Grid area
	this.gridAreaLeftX = gridAreaLeftMargin;
	this.gridAreaRightX = containerWidth - dbScaleWidth - gridAreaRightMargin;
	this.gridAreaTopY = gridAreaTopMargin; // NOTE: Y value is 0 at top and ascending to bottom 
	this.gridAreaBottomY = containerHeight - hzScaleHeight - gridAreaBottomMargin;
	this.gridAreaWidth = this.gridAreaRightX - this.gridAreaLeftX;
	this.gridAreaHeight = this.gridAreaBottomY - this.gridAreaTopY;
	this.gridAreaHzMap = this.createGridAreaHzMap(this.gridAreaLeftX, this.gridAreaWidth);
	this.gridAreaDbMap = this.createGridAreaDbMap(this.gridAreaTopY, this.gridAreaHeight);
	//	-- Grid area
	// 	++ Partial curve area 
	var partialCurveMargin = gridStrokeWidth / 2 + partialCurveStrokeWidth / 2;
	this.partialCurveAreaLeftX = this.gridAreaLeftX + partialCurveMargin;
	this.partialCurveAreaRightX = this.gridAreaRightX - partialCurveMargin;
	this.partialCurveAreaTopY = this.gridAreaTopY + partialCurveMargin;
	this.partialCurveAreaBottomY = this.gridAreaBottomY - partialCurveMargin;
	this.partialCurveAreaWidth =  this.partialCurveAreaRightX - this.partialCurveAreaLeftX;
	this.partialCurveAreaHeight = this.partialCurveAreaBottomY - this.partialCurveAreaTopY;
	// 	-- Partial curve area 
	// 	++ Leading curve area 
	var leadingCurveMargin = gridStrokeWidth / 2 + leadingCurveStrokeWidth / 2;
	this.leadingCurveAreaLeftX = this.gridAreaLeftX + leadingCurveMargin;
	this.leadingCurveAreaRightX = this.gridAreaRightX - leadingCurveMargin;
	this.leadingCurveAreaTopY = this.gridAreaTopY + leadingCurveMargin;
	this.leadingCurveAreaBottomY = this.gridAreaBottomY - leadingCurveMargin;
	this.leadingCurveAreaWidth =  this.leadingCurveAreaRightX - this.leadingCurveAreaLeftX;
	this.leadingCurveAreaHeight = this.leadingCurveAreaBottomY - this.leadingCurveAreaTopY;
	// 	-- Leading curve area 
	// -- Calculated values 
}
//	-- EQ DIMENSIONS
// 	++ EQ DRAWING
ampUi.eq.drawing = {};
//		++ Colors
ampUi.eq.drawing.colors = {};
ampUi.eq.drawing.colors.initialize = function(
	bgGridMargin,
	bgGrid,
	bgScaleDb,
	bgScaleHz,
	bgScaleSeparator,
	strokeGridHz,
	strokeGridDb,
	strokeScaleDb,
	strokeScaleHz,
	strokeScaleLabelDb,
	strokeScaleLabelHz,
	strokeCurvesPartial, // { curve, circleStroke, circleBg, numberStroke }
	strokeCurveLeading) {
	this.bgGridMargin = bgGridMargin;
	this.bgGrid = bgGrid;
	this.bgScaleDb = bgScaleDb;
	this.bgScaleHz = bgScaleHz;
	this.bgScaleSeparator = bgScaleSeparator;
	this.strokeGridHz = strokeGridHz;
	this.strokeGridDb = strokeGridDb;
	this.strokeScaleDb = strokeScaleDb;
	this.strokeScaleHz = strokeScaleHz;
	this.strokeScaleLabelDb = strokeScaleLabelDb;
	this.strokeScaleLabelHz = strokeScaleLabelHz;
	this.strokeCurvesPartial = strokeCurvesPartial;
	this.strokeCurveLeading = strokeCurveLeading;
};
//		-- Colors
//		++ Grid stops 
ampUi.eq.drawing.gridStops = {};
ampUi.eq.drawing.gridStops.initialize = function(
	atDb,
	atHz) {
	this.atDb = atDb;
	this.atHz = atHz;
};
//		-- Grid stops 
//		++ Scale stops 
ampUi.eq.drawing.scaleStops = {};
ampUi.eq.drawing.scaleStops.initialize = function(
	atDb,
	atHz) {
	this.atDb = atDb;
	this.atHz = atHz;
};
//		-- Scale stops 
//		++ Konva
ampUi.eq.drawing.konva = {};
//			++ Background
ampUi.eq.drawing.konva.createBackgroundLayer = function() {
	var _dimensions = ampUi.eq.dimensions;
	var _colors = ampUi.eq.drawing.colors;
	//			++ Grid margin
	var gridMarginWidth = Math.round(_dimensions.containerWidth - _dimensions.dbScaleWidth);
	var gridMarginHeight = Math.round(_dimensions.containerHeight - _dimensions.hzScaleHeight);
	var gridMargin = new Konva.Rect({
		x: 0, 
		y: 0,
		width: gridMarginWidth,
		height: gridMarginHeight,
		fill: _colors.bgGridMargin
	});
	//			-- Grid margin
	//			++ Grid area
	var gridArea = new Konva.Rect({
		x: _dimensions.gridAreaLeftX, 
		y: _dimensions.gridAreaTopY,
		width: _dimensions.gridAreaWidth,
		height: _dimensions.gridAreaHeight,
		fill: _colors.bgGrid
	});
	//			-- Grid area 
	//			++ dB scale 
	var dbScale = new Konva.Rect({
		x: gridMarginWidth, 
		y: 0,
		width: _dimensions.dbScaleWidth,
		height: gridMarginHeight,
		fill: _colors.bgScaleDb
	});
	//			-- dB scale 
	//			++ Hz scale 
	var hzScale = new Konva.Rect({
		x: 0,
		y: gridMarginHeight,
		width: gridMarginWidth,
		height: _dimensions.hzScaleHeight,
		fill: _colors.bgScaleHz
	});
	//			-- Hz scale 
	//			++ Scale separator/
	
	var scaleSeparator = new Konva.Rect({
		x: gridMarginWidth, 
		y: gridMarginHeight,
		width: _dimensions.dbScaleWidth,
		height: _dimensions.hzScaleHeight,
		fill: _colors.bgScaleSeparator
	});
	
	//			-- Scale separator
	var backgroundLayer = new Konva.Layer();
	backgroundLayer.add(gridMargin);
	backgroundLayer.add(gridArea);
	backgroundLayer.add(dbScale);
	backgroundLayer.add(hzScale);
	backgroundLayer.add(scaleSeparator);
	
	return backgroundLayer;
};
//			-- Background
//			++ Hz grid 
ampUi.eq.drawing.konva.createHzGridLayer = function() {
	var _dimensions = ampUi.eq.dimensions;
	var _drawing = ampUi.eq.drawing;
	var map = _dimensions.gridAreaHzMap;
	var stops = _drawing.gridStops.atHz;
	var strokeColor = _drawing.colors.strokeGridHz;
	var strokeWidth = _dimensions.gridStrokeWidth;
	var topY = _dimensions.gridAreaTopY;
	var bottomY = _dimensions.gridAreaBottomY;
	var xOfHz = function(hz) {
		return _dimensions.indexOfClosestToBinary(hz, map);
	}
	var hzGridLayer = new Konva.Layer();
	for(var i = 0; i < stops.length; i++) {
		var x = xOfHz(stops[i]) + 0.5;
		var hzLine = new Konva.Line({
			points: [x, topY, x, bottomY],
			stroke: strokeColor,
			strokeWidth: strokeWidth,
			lineCap: 'round',
			lineJoin: 'round',
		});
		hzGridLayer.add(hzLine);
	}
	return hzGridLayer;
};
//			-- Hz grid 
//			++ dB grid 
ampUi.eq.drawing.konva.createDbGridLayer = function() {
	var _dimensions = ampUi.eq.dimensions;
	var _drawing = ampUi.eq.drawing;
	var map = _dimensions.gridAreaDbMap;
	var stops = _drawing.gridStops.atDb;
	var strokeColor = _drawing.colors.strokeGridDb;
	var strokeWidth = _dimensions.gridStrokeWidth;
	var leftX = _dimensions.gridAreaLeftX;
	var rightX = _dimensions.gridAreaRightX;
	var dbGainThreshold = ampUi.eq.parameters.dbGainThreshold;
	var yOfDb = function(db) {
		return _dimensions.indexOfClosestToPlain(db, map);
	}
	var dbGridLayer = new Konva.Layer();
	for(var i = 0; i < stops.length; i++) {
		var y = yOfDb(stops[i]) - 0.5;
		
		var dbLine = new Konva.Line({
			points: [leftX, y, rightX, y],
			stroke: strokeColor,
			strokeWidth: strokeWidth,
			lineCap: 'round',
			lineJoin: 'round',
		});
		dbGridLayer.add(dbLine);
	}
	return dbGridLayer;
};
//			-- dB grid 
//			++ Hz scale 
ampUi.eq.drawing.konva.createHzScaleLayer = function() {
	var _parameters = ampUi.eq.parameters;
	var _dimensions = ampUi.eq.dimensions;
	var _drawing = ampUi.eq.drawing;
	var map = _dimensions.gridAreaHzMap;
	var stops = _drawing.scaleStops.atHz;
	var topY = _dimensions.containerHeight - _dimensions.hzScaleHeight / 2 - _dimensions.numberHeight / 2;
	var xOfHz = function(hz) {
		return _dimensions.indexOfClosestToBinary(hz, map);
	}
	var hzScaleLayer = new Konva.Layer();
	for(var i = 0; i < stops.length; i++) {
		var scaleItemText = "";
		var strokeColor = _drawing.colors.strokeScaleHz;
		if(i == 0) { // First scale item is "Hz" sign 
			scaleItemText = "Hz";
			strokeColor = _drawing.colors.strokeScaleLabelHz;
		} else if(stops[i] >= 1000) { // Thousands are shortened to *k
			scaleItemText = (stops[i] / 1000) + "k";
		} else {
			scaleItemText = stops[i]; // Other values are as usual 
		}
		var x = xOfHz(stops[i]);
		var hzScaleItem = new Konva.Text({
			x: x, 
			y: topY,
			text: scaleItemText,
			fill: strokeColor,
			fontSize: _dimensions.numberHeight,
			fontFamily: 'Segoe UI',
		});
		hzScaleItem.offsetX(hzScaleItem.width() / 2);
		hzScaleLayer.add(hzScaleItem);
	}
	return hzScaleLayer;
};
//			-- Hz scale 
//			++ dB scale 
ampUi.eq.drawing.konva.createDbScaleLayer = function() {
	var _parameters = ampUi.eq.parameters;
	var _dimensions = ampUi.eq.dimensions;
	var _drawing = ampUi.eq.drawing;
	var map = _dimensions.gridAreaDbMap;
	var stops = _drawing.scaleStops.atDb;
	var leftX = _dimensions.containerWidth - _dimensions.dbScaleWidth / 2;
	var dbGainThreshold = ampUi.eq.parameters.dbGainThreshold;
	var yOfDb = function(db) {
		return _dimensions.indexOfClosestToPlain(db, map);
	}
	var dbScaleLayer = new Konva.Layer();
	for(var i = 0; i < stops.length; i++) {
		var scaleItemText = "";
		var strokeColor = _drawing.colors.strokeScaleDb;
		if(stops[i] == 0) { // 0 scale item is "dB" sign 
			scaleItemText = "dB";
			strokeColor = _drawing.colors.strokeScaleLabelDb;
		} else {
			scaleItemText = stops[i]; // Other values are as usual 
		}
		var y = yOfDb(stops[i])  - _dimensions.numberHeight / 2;
		var dbScaleItem = new Konva.Text({
			x: leftX, 
			y: y ,
			text: scaleItemText,
			fill: strokeColor,
			fontSize: _dimensions.numberHeight,
			fontFamily: 'Segoe UI',
		});
		dbScaleItem.offsetX(dbScaleItem.width() / 2);
		dbScaleLayer.add(dbScaleItem);

	}
	return dbScaleLayer;
};
//			-- dB scale 



// 	++ EQ FILTERING

/*
ampUi.eq.filtering = {};
ampUi.eq.filtering.handler.createHzDbMapEmpty = function() {
	var _dimensions = ampUi.eq.dimensions; 
	var hzMap = _dimensions.gridAreaHzMap;
	var dbMap = _dimensions.gridAreaDbMap;
}


ampUi.eq.filtering.handler.initialize = function(){
	// ++ References
	var _dimensions = ampUi.eq.dimensions; 
	var hzMap = _dimensions.gridAreaHzMap;
	var dbMap = _dimensions.gridAreaDbMap;
	// -- References
	this.hzDbMap
};


ampUi.eq.filtering.Filter = function(
	hzFrequency,
	dbGain,
	type, // LOWPASS, HIGHPASS, BANDPASS, PEAK, NOTCH, LOWSHELF, HIGHSHELF
	quality) {
	// ++ References
	var _dimensions = ampUi.eq.dimensions; 
	var hzMap = _dimensions.gridAreaHzMap;
	  //this.gridAreaDbMap
	// -- References
	// ++ Fields
	this.hzFrequency = hzFrequency;
	this.dbGain = dbGain;
	this.type = type;
	this.quality = quality;
	// ++ Fields
	// ++ Methods
	this.getMatrix = function() {
		
	};
	// -- Methods
};
*/
// 	-- EQ FILTERING





ampUi.eq.drawing.konva.initialize = function () {
	var _domElementsIds = ampUi.dom.elementsIds;
	var _dimensions = ampUi.eq.dimensions;
	//		++ Top level konva object 
	var konvaStage = new Konva.Stage({
		container: _domElementsIds.eqContainer,
		width: _dimensions.containerWidth,
		height: _dimensions.containerHeight
    });
    console.log('stage = 6');
	//		-- Top level konva object 
	var bgL = this.createBackgroundLayer();
	var grHz = this.createHzGridLayer();
	var grDb = this.createDbGridLayer();
	var scaleHz = this.createHzScaleLayer();
	var scaleDb = this.createDbScaleLayer();
	konvaStage.add(bgL);
	konvaStage.add(grHz);
	konvaStage.add(grDb);
	konvaStage.add(scaleHz);
	konvaStage.add(scaleDb);
};	
//		-- Konva


// 	-- EQ DRAWING

// -- EQ 

