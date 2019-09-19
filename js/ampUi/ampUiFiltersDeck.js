ampUi.FiltersDeck = function(controllersContext) {
	var _controllersContext = controllersContext; // Global context
	var _deckContext = this;
	this.jNumber = $("#filterdeck-number");
	this.jName = $("#filterdeck-name");
	this.jState = $("#filterdeck-state");
	this.jFrequencyValue = $("#filterdeck-frequency-value");
	this.jFrequencySlider = $("#filterdeck-frequency-slider");
	this.jGainValue = $("#filterdeck-gain-value");
	this.jGainSlider = $("#filterdeck-gain-slider");
	this.jQualityValue = $("#filterdeck-quality-value");
	this.jQualitySlider = $("#filterdeck-quality-slider");
	this.jAll = [this.jNumber, this.jName, this.jState, this.jFrequencyValue, this.jFrequencySlider, this.jGainValue, this.jGainSlider, this.jQualityValue, this.jQualitySlider];
	
	/*
	this.slider1 = new ampUi.SliderOld(
		 'filterdeck-frequency-slider', //this.jFrequencySlider.id,
		ampUi.filtersGraphSettings.minFrequency,
		ampUi.filtersGraphSettings.maxFrequency,
		5000,
		true,
		[8, 20, 50, 100, 200,500, 1000, 2000, 5000, 10000, 20000],
		[8, 20, 50, 100, 200,500, 1000, 2000, 5000, 10000, 20000],
		'Hz',
		"#FFFFFF",
		"#FFFFFF",
		function(currentValue) {
			//$(bandSettingsHtml.sHzValue).text(Math.round(currentValue) + ' Hz');
			console.log(currentValue);
		});
*/
/*	this.slider2 = new ampUi.SliderOld(
		'filterdeck-gain-slider',
		-30,
		20,
		3,
		false,
		[-30, -12,-9,-6,-3,0,3,6,9,12, 20],
		[-30, -12,-9,-6,-3,0,3,6,9,12, 20],
		'dB',
		"#FFFFFF",
		"#FFFFFF",
		function(currentValue) {
			console.log(currentValue);
		});
		
	this.slider3 = new ampUi.SliderOld(
		'filterdeck-quality-slider',
		0.025,
		40,
		2,
		true,
		[0.5, 5, 10, 20, 30, 40],
		[0.5, 5, 10, 20, 30, 40],
		'Q',
		"#FFFFFF",
		"#FFFFFF",
		function(currentValue) {
			console.log(currentValue);
		});
		
*/		
		
		
	//_controllersContext.selectedController = null;
	
	this.extend = function(index) {
		var controller = _controllersContext.controllers[index];
		
		//this.slider3
		
		//console.log(this.jAll.length);
		/*
		filterController.setFilterDeck = function() {
			$(_deckContext.jAll).off();
			$(_deckContext.jAll).empty();
			
			
			
			
			console.log('offed');
		};*/
		
	};
	
	(function(){
		var controllers = _controllersContext.controllers;
		for(var index in controllers) {
			_deckContext.extend(index); // Extending 
			// ++ Running initialization methods 
			//_listContext.setTextConstants[index](); 
			//_listContext.setListItemUnselected[index](); 
			// -- Running initialization methods 
		}
		// ++ Selected item changed 
		_controllersContext.selectedControllerChanged.push(function() {
			var previous = _controllersContext.previouslySelectedController;
			var current = _controllersContext.currentlySelectedController;
			if(previous) {
				// Unbind events from prev 
				//_listContext.setListItemUnselected[previous.name](); 
			}
			// Bind to new 
			//_listContext.setListItemSelected[current.name](); 
		});
		// -- Selected item changed 
	})();
	
};

