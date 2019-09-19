//controllersContext, filterSettingName [controller.data.(frequency/gain/quality)] [controller.eventsContext.(frequency/gain/quality)(Changed)]

ampUi.SliderNew = function(controllersContext, settingName) {
	var _sliderContext = this;
	var _controllersContext = controllersContext; 
	
	this.settingName = settingName;
	this.settingNameCapital = settingName.charAt(0).toUpperCase() + settingName.slice(1);
	
	this.minValue = ampUi.filtersGraphSettings["min" + this.settingNameCapital];
	this.maxValue = ampUi.filtersGraphSettings["max" + this.settingNameCapital];
	this.scaleNumbersAt = ampUi.filtersGraphSettings["scaleNumbersAt" + this.settingNameCapital];
	
    //this.jContainer = $("#filterdeck-" + this.settingName + "-slider");    
    this.containerWidth = 100; //$(this.jContainer).width();
    this.containerHeight = 100; //$(this.jContainer).height();
    
	this.regulatorSide = this.containerHeight;
	this.scaleBeginningPixel = Math.floor(this.regulatorSide / 2);
	this.scaleEndingPixel = Math.ceil(this.containerWidth - this.regulatorSide / 2);
    this.scaleMap = (settingName != "gain" ? ampUi.math.createLogarithmicMap : ampUi.math.createLinearMap)
        (Math.round(this.containerWidth), this.scaleBeginningPixel, this.scaleEndingPixel, this.minValue, this.maxValue)
	
	// ++ Drawing height proportions
	// From 0% to 10% is for regulator triangle 
	// From 10% to 20% is for scale lines 
	// From 20% to 45% is for scale digits 
	// From 55% to 100% is for regulator box with text 
	// -- Drawing height proportions
	
	
	
	
	//alert(this.scaleMap.length);
};


ampUi.SliderOld = function(
	htmlContainerId,
	minValue, // (int) Minimum scale value 
	maxValue, // (int) Maximum scale value 
	initialValue, // (int) The value given from start 
	isLogarithmic, // (bool) Is scale logarithmic or linear 
	scaleLinesAt, // (int[]) What scale values have lines drawn
	scaleNumbersAt, // (int[]) What scale values have numbers drawn
	regulatorText, // (string) A text label which is drawn on regulator
	scaleColor, // (string) Color of scale
	labelColor // (string) Color of label
	) {
		var _sliderContext = this;
		// ++ Assign initial values 
		this.minValue = minValue;
		this.maxValue = maxValue;
		this.currentValue = initialValue;
		this.containerId = htmlContainerId;
		
		this.onSliderMove = null;
		
		//this.onValueChangedByUser = onValueChangedByUser;
		
		// -- Assign initial values 
		// ++ Calculate dimensions 
		
		this.containerJq = $('#' + this.containerId);
		this.containerWidth = $(this.containerJq).width();
		this.containerHeight = $(this.containerJq).height();
		this.regulatorSide = this.containerHeight;
		this.scaleBeginningPixel = Math.floor(this.regulatorSide / 2);
		this.scaleEndingPixel = Math.ceil(this.containerWidth - this.regulatorSide / 2); // WARNING! UNCHECKED
		// -- Calculate dimensions 
		// ++ Map pixels of scale to corresponding values 
		this.scaleMap = new Array(Math.round(this.containerWidth)); // Index and value pairs of array mean pixel number and value of dimension on scale 
		this.scaleMap.fill(Number.MAX_SAFE_INTEGER); // Empty space is filled by max integer values 
		var scaleWidth = this.scaleEndingPixel - this.scaleBeginningPixel;
		if(isLogarithmic) {
			for(var i = this.scaleBeginningPixel; i <= this.scaleEndingPixel; i++) { // Measuring is limited to area between margins at beginning and end 
				this.scaleMap[i] = Math.pow(10, (Math.log10(this.maxValue - this.minValue) / scaleWidth * (i - this.scaleBeginningPixel))) + this.minValue;
			}
		}
		else 
		{
			var linearLength = this.maxValue - this.minValue;
			var pixelStep = linearLength / scaleWidth;
			for(var i = this.scaleBeginningPixel; i <= this.scaleEndingPixel; i++) { // Measuring is limited to area between margins at beginning and end 
				this.scaleMap[i] = minValue + pixelStep * (i - this.scaleBeginningPixel);
			}
		}
		// -- Map pixels of scale to corresponding values 
		// ++ Drawing height proportions
		// From 0% to 10% is for regulator triangle 
		// From 10% to 20% is for scale lines 
		// From 20% to 45% is for scale digits 
		// From 55% to 100% is for regulator box with text 
		// -- Drawing height proportions
		// ++ Instantiate main Konva object 
		this.konvaStage = new Konva.Stage({
			container: _sliderContext.containerId,
			width: _sliderContext.containerWidth,
			height: _sliderContext.containerHeight
        });
    console.log('stage = 17');
		// -- Instantiate main Konva object 
		// ++ Draw scale lines 
		this.scaleLinesLayer = new Konva.FastLayer();
		this.scaleLinesTopY = this.containerHeight - this.containerHeight * 0.20;
		this.scaleLinesBottomY = this.containerHeight - this.containerHeight * 0.10;
		for(var i = 0; i < scaleLinesAt.length; i++) {
			var x = ampUi.math.getIndexOfClosestToInArray_Sequential(scaleLinesAt[i], _sliderContext.scaleMap) - 0.5;
			var scaleLine = new Konva.Line({
				points: [x, _sliderContext.scaleLinesTopY, x, _sliderContext.scaleLinesBottomY],
				stroke: scaleColor, // SCALE COLOR
				strokeWidth: 1
			});
			_sliderContext.scaleLinesLayer.add(scaleLine);
		}
		this.konvaStage.add(this.scaleLinesLayer);
		// -- Draw scale lines 
		// ++ Draw scale numbers 
		this.scaleNumbersLayer = new Konva.Layer();
		this.scaleNumbersTopY = this.containerHeight - this.containerHeight * 0.45;
		this.scaleNumbersBottomY = this.containerHeight - this.containerHeight * 0.20;
		this.fontSize = (this.scaleNumbersBottomY - this.scaleNumbersTopY);
		
		for(var i = 0; i < scaleNumbersAt.length; i++) {
			var x = ampUi.math.getIndexOfClosestToInArray_Sequential(scaleNumbersAt[i], _sliderContext.scaleMap) - 0.5;
			var labelText = scaleNumbersAt[i].toString();
			if(scaleNumbersAt[i] >= 1000) { // Thousands are shortened to *k
				labelText = (scaleNumbersAt[i] / 1000) + "k";
			}
			var scaleNumber = new Konva.Text({
				x: x, 
				y: _sliderContext.scaleNumbersTopY,
				text: labelText,
				fill: scaleColor, // SCALE COLOR
				fontSize: _sliderContext.fontSize,
				fontFamily: 'Segoe UI',
			});
			scaleNumber.offsetX(scaleNumber.width() / 2);
			_sliderContext.scaleNumbersLayer.add(scaleNumber);
		}
		this.konvaStage.add(this.scaleNumbersLayer);
		// -- Draw scale numbers 
		// ++ Draw scale regulator 
		this.containerClientRectangle = $(this.containerJq)[0].getBoundingClientRect(); // As dragBoundFunc operates with absolute position 
		this.scaleRegulatorLayer = new Konva.Layer();
		this.getRegulatorXForValue = function(someValue) { // Function to find out regulator position for certain value 
			return ampUi.math.getIndexOfClosestToInArray_Sequential(someValue, _sliderContext.scaleMap) - _sliderContext.scaleBeginningPixel;
		};
		this.regulatorX = this.getRegulatorXForValue(this.currentValue); // Draw where the initial value is
		this.regulatorY = Math.round(this.konvaStage.height() / 2) - this.scaleBeginningPixel;
		this.draggableGroup = new Konva.Group({ // Create a group, which will accept all the draggable controls 
			x: this.regulatorX,
			y: this.regulatorY,
			draggable: true,
			opacity: 1,
			dragBoundFunc: function(cursorPosition) { // The argument is a relative position 
				var x = cursorPosition.x;
				var y = this.absolutePosition().y;
				if(x < 0) x = 0;
				if(x > _sliderContext.containerWidth - _sliderContext.regulatorSide) x = _sliderContext.containerWidth - _sliderContext.regulatorSide;
				return { x: x, y: y };
			}
		});
		this.regulatorHeadingBox = new Konva.Rect({ // First contol is a regulator box which also contains a value name 
			width: _sliderContext.regulatorSide,
			height: _sliderContext.regulatorSide * 0.45, // According to height proportions
			fill: labelColor // LABEL COLOR 
		});
		this.regulatorHeadingBoxText = new Konva.Text({ // Second is a text which is a value name itself
			fontSize: this.regulatorHeadingBox.height() / 1.5,
			fontFamily: 'Segoe UI',
			text: regulatorText,
			fill: ampUi.colors.backgroundOrdinary
		});

		this.regulatorHeadingBoxText.offsetX(-(this.regulatorHeadingBox.width() / 2 - this.regulatorHeadingBoxText.width() / 2)); // Center text on label 
		this.regulatorHeadingBoxText.offsetY(-(this.regulatorHeadingBox.height() / 2 - this.regulatorHeadingBoxText.height() / 2));
		
		this.regulatorPointer = new Konva.Line({ // Third a pointing triangle as a polygon
			points: [
				_sliderContext.regulatorSide / 4, _sliderContext.regulatorSide, // Left 
				_sliderContext.regulatorSide / 2, _sliderContext.regulatorSide - _sliderContext.regulatorSide * 0.10, // Middle (according to height proportions)
				_sliderContext.regulatorSide - _sliderContext.regulatorSide / 4, _sliderContext.regulatorSide // Right
				],
			fill: labelColor, // LABEL COLOR 
			closed: true
		});
		
		this.draggableGroup.add(this.regulatorHeadingBox); // Add created controls to draggable group 
		this.draggableGroup.add(this.regulatorHeadingBoxText);
		this.draggableGroup.add(this.regulatorPointer);
		this.draggableGroup.on('dragmove', function() { // Bind external callback for scale moving event
			_sliderContext.currentValue = _sliderContext.scaleMap[Math.round(this.position().x) + _sliderContext.scaleBeginningPixel];
			_sliderContext.onSliderMove(_sliderContext.currentValue); 
		});
		this.scaleRegulatorLayer.add(this.draggableGroup);
		this.konvaStage.add(this.scaleRegulatorLayer);
		// -- Draw scale regulator 
		// ++ Create interaction methods 
		this.setValue = function(someValue) { // Set custom value to slider 
			_sliderContext.currentValue = someValue;
			var newX = _sliderContext.getRegulatorXForValue(someValue);
			_sliderContext.draggableGroup.x(newX);
			_sliderContext.scaleRegulatorLayer.draw();
		};
		this.getValue = function() { // Get current value of slider 
			return _sliderContext.currentValue;
		};
		this.dispose = function() { // Remove a slider
			_sliderContext.konvaStage.destroy();
		};
		// -- Create interaction methods 
		
		// ++ NEW METHODS 
		this.setScaleColor = function(color) {
		};
		this.setLabelColor = function(color) {
		};
		this.setOnSliderMove = function(onSliderMove) {
		};
		// -- NEW METHODS 
		
};






