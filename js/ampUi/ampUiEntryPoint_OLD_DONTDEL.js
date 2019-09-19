ampUi.entryPoint = {};
ampUi.entryPoint.run = function(data) {
	// ++ ELEMENTS IDS
	var _domElementsIds = ampUi.dom.elementsIds;
	var domElementsIdsValues = data.domElementsIds;
	_domElementsIds.initialize(
		domElementsIdsValues.eqContainer
	);
	// -- ELEMENTS IDS
	// ++ EQ PARAMETERS 
	var _eqParameters = ampUi.eq.parameters;
	var eqParametersValues = data.eqParameters;
	_eqParameters.initialize(
		eqParametersValues.minHzFrequency,
		eqParametersValues.maxHzFrequency,
		eqParametersValues.dbGainThreshold,
		eqParametersValues.minQuality,
		eqParametersValues.maxQuality,
		eqParametersValues.sampleRate);
	// -- EQ PARAMETERS 
	// ++ EQ DIMENSIONS
	var _eqDimensions = ampUi.eq.dimensions;
	var eqDimensionsValues = data.eqDimensions;
	_eqDimensions.initialize(
		$("#" + _domElementsIds.eqContainer).width(),
		$("#" + _domElementsIds.eqContainer).height(),
		eqDimensionsValues.dbScaleWidth,
		eqDimensionsValues.hzScaleHeight,
		eqDimensionsValues.gridAreaTopMargin,
		eqDimensionsValues.gridAreaRightMargin,
		eqDimensionsValues.gridAreaBottomMargin,
		eqDimensionsValues.gridAreaLeftMargin,
		eqDimensionsValues.gridStrokeWidth,
		eqDimensionsValues.partialCurveStrokeWidth,
		eqDimensionsValues.leadingCurveStrokeWidth,
		eqDimensionsValues.circleDiameter,
		eqDimensionsValues.circleStrokeWidth,
		eqDimensionsValues.numberHeight);
	// -- EQ DIMENSIONS
	// ++ EQ DRAWING COLORS
	var _eqDrawingColors = ampUi.eq.drawing.colors;
	var eqColorsValues = data.eqDrawingColors;
	_eqDrawingColors.initialize(
		eqColorsValues.bgGridMargin,
		eqColorsValues.bgGrid,
		eqColorsValues.bgScaleDb,
		eqColorsValues.bgScaleHz,
		eqColorsValues.bgScaleSeparator,
		eqColorsValues.strokeGridHz,
		eqColorsValues.strokeGridDb,
		eqColorsValues.strokeScaleDb,
		eqColorsValues.strokeScaleHz,
		eqColorsValues.strokeScaleLabelDb,
		eqColorsValues.strokeScaleLabelHz,
		eqColorsValues.strokeCurvesPartial,
		eqColorsValues.strokeCurveLeading);
	// -- EQ DRAWING COLORS
	// ++ EQ DRAWING GRID STOPS
	var _eqDrawingGridStops = ampUi.eq.drawing.gridStops;
	var eqGridStopsValues = data.eqDrawingGridStops;
	_eqDrawingGridStops.initialize(eqGridStopsValues.atDb, eqGridStopsValues.atHz);
	// -- EQ DRAWING GRID STOPS
	// ++ EQ DRAWING SCALE STOPS
	var _eqDrawingScaleStops = ampUi.eq.drawing.scaleStops;
	var eqScaleStopsValues = data.eqDrawingScaleStops;
	_eqDrawingScaleStops.initialize(eqScaleStopsValues.atDb, eqScaleStopsValues.atHz);
	// -- EQ DRAWING SCALE STOPS
	// ++ KONVA
	var _konva = ampUi.eq.drawing.konva;
	_konva.initialize();
	// -- KONVA 
	
	// ++ EQ FILTERS
	var eqFilters = data.eqFilters;
	//	++ Band settings HTML elements
	var bandSettingsHtml = {
		sNumber: $("#bandsettings-number"),
		sName: $("#bandsettings-name"),
		sState: $("#bandsettings-state"),
	    sHzValue: $("#bandsettings-frequency-value"),
	    sHzSlider: $("#bandsettings-frequency-slider"),
	    sDbValue: $("#bandsettings-gain-value"),
	    sDbSlider: $("#bandsettings-gain-slider"),
	    sQValue: $("#bandsettings-quality-value"),
	    sQSlider: $("#bandsettings-quality-slider")
	};
	//	-- Band settings HTML elements
	var lastClickedBandInfoColumn = null; // Tracking last clicked band info column
	var backgroundOrdinary = $("body").data("background-ordinary"); // Ordinary background settings 
	//	++ Reusable settings-wide functions 
	var getFilterByName = function(filterName) { // Get band info HTML column for filter 
		for(var item in eqFilters) {
			var filter = eqFilters[item];
			if(filter.name == filterName) {
				return filter;
			}
		}
		return null;
	};
	var getBandInfoColumnForFilter = function(filterObject) { // Get band info HTML column for filter 
		return $("#bandinfo-" + filterObject.name);
	};
	var updateBandInfoColumnForFilter = function(filterObject) { // Update band info HTML column for filter
		var column = getBandInfoColumnForFilter(filterObject);
		$(column).find('.bandinfo-frequencyvalue').text(filterObject.frequencyHz); 
		$(column).find('.bandinfo-gainvalue').text(filterObject.gainDb);
		$(column).find('.bandinfo-qualityvalue').text(filterObject.quality);
		if(filterObject.isActive) {
			$(column).removeAttr('disabled');
			$(column).attr('enabled', '');
		} else {
			$(column).removeAttr('enabled');
			$(column).attr('disabled', '');
		}
		return column;
	};
	var updateBandSettingsForFilter = function(filterObject) { // Update band settings section for certain filter
		var column = getBandInfoColumnForFilter(filterObject);
		var bandColor = $(column).data("bandcolor"); 
		var textColor = $(column).data("textcolor");
		var bandName = $(column).find(".bandinfo-name").text();
		var bandNumber = $(column).find(".bandinfo-number").text();
		$(bandSettingsHtml.sNumber).text(bandNumber); 
		$(bandSettingsHtml.sName).text(bandName);
		if(filterObject.isActive) {
			// ++ Header
			for(var item in bandSettingsHtml) {
				$(bandSettingsHtml[item]).removeAttr('disabled');
				$(bandSettingsHtml[item]).attr('enabled', '');
			}
			$(bandSettingsHtml.sNumber).css("background-color", bandColor);
			$(bandSettingsHtml.sNumber).css("color", textColor);
			$(bandSettingsHtml.sName).css("background-color", backgroundOrdinary);
			$(bandSettingsHtml.sName).css("color", bandColor);
			$(bandSettingsHtml.sState).css("background-color", bandColor);
			$(bandSettingsHtml.sState).css("color", textColor);	
			$(bandSettingsHtml.sState).text("ON");	
			$(bandSettingsHtml.sState).off('click');
			$(bandSettingsHtml.sState).data("filter-name", filterObject.name);
			$(bandSettingsHtml.sState).on('click', function() {
				var filter = getFilterByName($(this).data("filter-name"));
				filter.isActive = false;
				updateBandInfoColumnForFilter(filter);
				updateBandSettingsForFilter(filter);
			});
			// -- Header
			// ++ Frequency 
			$(bandSettingsHtml.sHzValue).css("background-color", backgroundOrdinary);
			$(bandSettingsHtml.sHzValue).css("color", bandColor);
			$(bandSettingsHtml.sHzValue).text(filterObject.frequencyHz + " Hz");
			// -- Frequency 
			// ++ Gain 
			$(bandSettingsHtml.sDbValue).css("background-color", backgroundOrdinary);
			$(bandSettingsHtml.sDbValue).css("color", bandColor);
			$(bandSettingsHtml.sDbValue).text(filterObject.gainDb + " dB");
			// -- Gain 
			// ++ Q 
			$(bandSettingsHtml.sQValue).css("background-color", backgroundOrdinary);
			$(bandSettingsHtml.sQValue).css("color", bandColor);
			$(bandSettingsHtml.sQValue).text(filterObject.quality + " Q");
			// -- Q 
			// ++ Frequency slider
			var frequencySlider = new ampUi.Slider(
				'bandsettings-frequency-slider',
				10,
				22050,
				filterObject.frequencyHz,
				true,
				[20, 50, 100, 200,500, 1000, 2000, 5000, 10000, 20000],
				[20, 50, 100, 200,500, 1000, 2000, 5000, 10000, 20000],
				'Hz',
				bandColor,//ampUi.colors.scaleHz,
				bandColor,
				function(currentValue) {
					$(bandSettingsHtml.sHzValue).text(Math.round(currentValue) + ' Hz');
				}
				);
			// -- Frequency slider
			
			// ++ Gain slider
			var gainSlider = new ampUi.Slider(
				'bandsettings-gain-slider',
				-12,
				12,
				filterObject.gainDb,
				false,
				[-12,-9,-6,-3,0,3,6,9,12],
				[-12,-9,-6,-3,0,3,6,9,12],
				'dB',
				bandColor,//ampUi.colors.scaleDb,
				bandColor,
				function(currentValue) {
					$(bandSettingsHtml.sDbValue).text(Math.round(currentValue)+ ' dB');
				}
				);
			// -- Gain slider
			
			// ++ Quality slider
			var qualitySlider = new ampUi.Slider(
				'bandsettings-quality-slider',
				0.025,
				40,
				filterObject.quality,
				true,
				[0.025, 1, 5, 10, 20, 30, 40],
				[0.025, 1, 5, 10, 20, 30, 40],
				'Q',
				bandColor,//ampUi.colors.scaleHz,
				bandColor,
				function(currentValue) {
					$(bandSettingsHtml.sQValue).text(Math.round(currentValue) + ' Q');
				}
				);
			// -- Gain slider
			
			
			//frequencySlider.setValue(-6);
			
		} else {
			// ++ Header
			for(var item in bandSettingsHtml) {
				$(bandSettingsHtml[item]).removeAttr('enabled');
				$(bandSettingsHtml[item]).attr('disabled', '');
			}
			$(bandSettingsHtml.sNumber).css("background-color", backgroundOrdinary);
			$(bandSettingsHtml.sNumber).css("color", bandColor);
			$(bandSettingsHtml.sName).css("background-color", bandColor);
			$(bandSettingsHtml.sName).css("color", textColor);
			$(bandSettingsHtml.sState).css("background-color", backgroundOrdinary);
			$(bandSettingsHtml.sState).css("color", bandColor);	
			$(bandSettingsHtml.sState).text("OFF");	
			$(bandSettingsHtml.sState).off('click');
			$(bandSettingsHtml.sState).data("filter-name", filterObject.name);
			$(bandSettingsHtml.sState).on('click', function() {
				var filter = getFilterByName($(this).data("filter-name"));
				filter.isActive = true;
				updateBandInfoColumnForFilter(filter);
				updateBandSettingsForFilter(filter);
			});
			// -- Header
			// ++ Frequency 
			$(bandSettingsHtml.sHzValue).css("background-color", backgroundOrdinary);
			$(bandSettingsHtml.sHzValue).text('');
			// -- Frequency 
			// ++ Gain 
			$(bandSettingsHtml.sDbValue).css("background-color", backgroundOrdinary);
			$(bandSettingsHtml.sDbValue).text('');
			// -- Gain 
			// ++ Q 
			$(bandSettingsHtml.sQValue).css("background-color", backgroundOrdinary);
			$(bandSettingsHtml.sQValue).text('');
			// -- Q 
			
			
			
		}
	};
	//	-- Reusable settings-wide functions 
	
	for(var i = 0; i < eqFilters.length; i++) {
		var column = updateBandInfoColumnForFilter(eqFilters[i]);
		$(column).data("filterObjectIndex", i); 
		$(column).click(function(eventArgument) { 
			var filterObject = eqFilters[$(this).data("filterObjectIndex")];
			
			if(lastClickedBandInfoColumn) { // Unselect previously clicked band info column
				$(lastClickedBandInfoColumn).removeAttr('selected');
				for(var item in bandSettingsHtml) { // Empty all the settings 
					$(bandSettingsHtml[item]).empty();
				}
			}
			$(this).attr('selected', ''); // Select currently clicked column
			lastClickedBandInfoColumn = $(this); // Write current as last clicked
			
			updateBandSettingsForFilter(filterObject);
			
			
			
			/*
			// ++ Click on state 
			$(bandSettingsHtml.sState).data("eqFilterObjectIndex", eqFilterObjectIndex); 
			$(bandSettingsHtml.sState).click(function() {
				var eqFilterObjectIndex = $(this).data("eqFilterObjectIndex");
				var eqFilterObject = eqFilters[eqFilterObjectIndex];
				eqFilterObject.isActive = !eqFilterObject.isActive;
			});
			// -- Click on state 
			*/
			
			

		});
	}
	// -- EQ FILTERS
	
};

$(function() {
	// Here is a place where all the initial data must be collected 
	var data = {};
	// ++ ELEMENTS IDS
	data.domElementsIds = {};
	data.domElementsIds.eqContainer = "eqContainer";
	// -- ELEMENTS IDS
	// ++ EQ PARAMETERS
	data.eqParameters = {};
	data.eqParameters.minHzFrequency = 8;
	data.eqParameters.maxHzFrequency = 22050;
	data.eqParameters.dbGainThreshold = 12;
	data.eqParameters.minQuality = 0.025;
	data.eqParameters.maxQuality = 40;
	data.eqParameters.sampleRate = 44100;
	// -- EQ PARAMETERS
	// ++ EQ DIMENSIONS 
	data.eqDimensions = {};
	data.eqDimensions.dbScaleWidth = 32;
	data.eqDimensions.hzScaleHeight = 32;
	data.eqDimensions.gridAreaTopMargin = 16;
	data.eqDimensions.gridAreaRightMargin = 16;
	data.eqDimensions.gridAreaBottomMargin = 16;
	data.eqDimensions.gridAreaLeftMargin = 16;
	data.eqDimensions.gridStrokeWidth = 1;
	data.eqDimensions.partialCurveStrokeWidth = 1;
	data.eqDimensions.leadingCurveStrokeWidth = 3;
	data.eqDimensions.circleDiameter = 32;
	data.eqDimensions.circleStrokeWidth = 2;
	data.eqDimensions.numberHeight = 11;
	// -- EQ DIMENSIONS 
	// ++ EQ DRAWING COLORS
	data.eqDrawingColors = {};
	data.eqDrawingColors.bgGridMargin = "#1c181d"; // Pastelle green
	data.eqDrawingColors.bgGrid = "#1c181d"; 
	data.eqDrawingColors.bgScaleDb = "#1c181d";
	data.eqDrawingColors.bgScaleHz = "#1c181d";
	

	
	data.eqDrawingColors.bgScaleSeparator = "#FF0000"; // Red
	
	data.eqDrawingColors.strokeGridHz = "#3a373b"; 
	data.eqDrawingColors.strokeGridDb = "#3a373b"; 
	
	data.eqDrawingColors.strokeScaleDb = "#f7ab05"; 
	data.eqDrawingColors.strokeScaleHz = "#1a808a"; //"#2ed8e7";
	
	data.eqDrawingColors.strokeScaleLabelDb = "#faa20a"; 
	data.eqDrawingColors.strokeScaleLabelHz = "#0addf5"; 
	
	data.eqDrawingColors.strokeCurvesPartial = [];
	
	/*
	data.eqDrawingColors.strokeCurvesPartial = [
	{
		curve: "#33f754", // Bright green
		circleStroke: "#f73232", // Bright red 
		circleBg: "#edf732", // Yellow 
		numberStroke: "#f73273" // Magenta 
	},
	{
		curve: "#3f32f7", // Blueviolet
		circleStroke: "#f79b32", // Orange 
		circleBg: "#32edf7", // Aqua 
		numberStroke: "#2b5411" // Darkdirtygreen  
	},
	{
		curve: "#ff0000", // Red
		circleStroke: "#dc00ff", // Magenta 
		circleBg: "#004cff", // Blue 
		numberStroke: "#fffa00" // Yellow  
	}];
	*/
	
	data.eqDrawingColors.strokeCurveLeading = "#630000"; // Dark red 
	// -- EQ DRAWING COLORS
	// ++ EQ DRAWING GRID STOPS
	data.eqDrawingGridStops = {};
	data.eqDrawingGridStops.atDb = [-9, -6, -3, 0, 3, 6, 9];
	data.eqDrawingGridStops.atHz = [
		10, 20, 30, 40, 50, 60, 70, 80, 90,
		100, 200, 300, 400, 500, 600, 700, 800, 900, 
		1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 
		10000, 20000
	];
	// -- EQ DRAWING GRID STOPS
	// ++ EQ DRAWING SCALE STOPS
	data.eqDrawingScaleStops = {};
	data.eqDrawingScaleStops.atDb = [-12, -9, -6, -3, 0, 3, 6, 9, 12];
	data.eqDrawingScaleStops.atHz = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
	// -- EQ DRAWING SCALE STOPS
	
	
	// ++ EQ FILTERS
	data.eqFilters = [
		{
			name: 'highpass',
			type: 'HIGHPASS',
			frequencyHz: 100.123,
			gainDb: 0,
			quality: 1,
			isActive: true
		},
		{
			name: 'lowshelf',
			type: 'LOWSHELF',
			frequencyHz: 300.456,
			gainDb: 2,
			quality: 0.5,
			isActive: true
		},
		{
			name: 'peakone',
			type: 'PEAK',
			frequencyHz: 3000.789,
			gainDb: 5,
			quality: 10,
			isActive: true
		},
		{
			name: 'peaktwo',
			type: 'PEAK',
			frequencyHz: 9000.789,
			gainDb: 3,
			quality: 20,
			isActive: true
		},
		{
			name: 'peakthree',
			type: 'PEAK',
			frequencyHz: 17000.012,
			gainDb: 7,
			quality: 30,
			isActive: false
		},
		{
			name: 'peakfour',
			type: 'PEAK',
			frequencyHz: 1000.012,
			gainDb: 4,
			quality: 20,
			isActive: true
		},
		{
			name: 'highshelf',
			type: 'HIGHSHELF',
			frequencyHz: 13000.012,
			gainDb: 2,
			quality: 1,
			isActive: true
		},
		{
			name: 'lowpass',
			type: 'LOWPASS',
			frequencyHz: 15000.012,
			gainDb: 2,
			quality: 0.5,
			isActive: true
		}
	];
	// -- EQ FILTERS
	
	
	
	// LOWPASS, HIGHPASS, BANDPASS, PEAK, NOTCH, LOWSHELF, HIGHSHELF
	

	var _entryPoint = ampUi.entryPoint;
	_entryPoint.run(data);
	
	
	
	var indexOfClosestToPlain = function(searchValue, sourceArray) { // Plain search method to match corresponding mapped gain pixel
		var minimum, chosenIndex = 0;
		for (var i in sourceArray) {
			minimum = Math.abs(sourceArray[chosenIndex] - searchValue);
			if (Math.abs(sourceArray[i] - searchValue) < minimum) {
				chosenIndex = i;
			}
		}
		return chosenIndex;
	}
	var backgroundOrdinary = $("body").data("background-ordinary"); // Ordinary background settings 
	
	


var slider2 = new ampUi.Slider(
		'channelsettings-volume-slider',
		-12,
		12,
		10,
		true,
		[-12,-11,-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,11,12],
		[-12,-9,-6,-3,0,3,6,9,12],
		'Pan',
		"green",//"#f24129"
		function(currentValue) {
			console.log('value is ' + currentValue);
		}
		);
	
	slider2.setValue(-6);
	//alert(slider2.getValue());

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
});