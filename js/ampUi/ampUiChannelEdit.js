ampUi.channelEdit = function(
	channelObject,
	viewgroupsButtonCallback,
	mixesButtonCallback,
	optionsButtonCallback,
	exitButtonCallback
	) {
		$("#channelinfo-number").text(channelObject.number); // Set heading values 
		$("#channelinfo-name").text(channelObject.name);
		
		//var _filtersGlobalEventsContext = {}; // Top-level context to be called from nested objects
		//_filtersGlobalContext.selectedController = null;
		
		// ++ Instantiate filters controllers 
		var filtersControllersContext = {};
		filtersControllersContext.controllers = {};
		filtersControllersContext.previouslySelectedController = null;
		filtersControllersContext.currentlySelectedController = null;
    filtersControllersContext.selectedControllerChanged = [];

        filtersControllersContext.triggerSelectedControllerChanged = function () {   
			if (filtersControllersContext.previouslySelectedController != null)
				filtersControllersContext.previouslySelectedController.data.selected = false;
            
            var currentController = filtersControllersContext.currentlySelectedController;            
            if (currentController != null) {
                currentController.data.selected = true;

                var ht = (1 - currentController.data.frequency / 20000) * filtersGraph.containerHeight;
                if (ht < 0) ht = 0;
                if (ht > (filtersGraph.containerHeight - 38)) ht = filtersGraph.containerHeight - 38;
                $(ampUi.globalSettings.freqSlider).css('top', ht + 'px');

                ht = (1 - (currentController.data.gain + 30) / 50) * filtersGraph.containerHeight;
                if (ht < 0) ht = 0;
                if (ht > (filtersGraph.containerHeight - 38)) ht = filtersGraph.containerHeight - 38;
                $(ampUi.globalSettings.gainSlider).css('top', ht + 'px'); 

                ht = (1 - currentController.data.quality) * filtersGraph.containerHeight;
                if (ht < 0) ht = 0;
                if (ht > (filtersGraph.containerHeight - 38)) ht = filtersGraph.containerHeight - 38;
                $(ampUi.globalSettings.qSlider).css('top', ht + 'px');
            }	
		};

		for(var item in channelObject.filters) {
			filtersControllersContext.controllers[item] = {  // Fill filters controllers with initial data
				name: item, // Filter unique name 
				data: channelObject.filters[item], // Technical data { frequency, gain, quality, active }
				settings: ampUi.filtersSettings[item],  // UI data { orderNumber, color, textColor, readableName, isGainApplicable, isQualityApplicable }
				li: $(".filterinfo-row[data-filter-order-number='" + ampUi.filtersSettings[item].orderNumber +  "']"), // List item HTML element
				eventsContext: {
					frequencyChanged: [],
					gainChanged: [],
					qualityChanged: [],
					stateChanged: []
				}
            };
            filtersControllersContext.controllers[item].eventsContext.triggerFrequencyChanged = function () {                
                var currentController = filtersControllersContext.currentlySelectedController;
                if (currentController != null) {
                    var ht = (1 - currentController.data.frequency / 20000) * filtersGraph.containerHeight;
                    if (ht < 0)  ht = 0;
                    if (ht > (filtersGraph.containerHeight - 38)) ht = filtersGraph.containerHeight - 38;
                    $(ampUi.globalSettings.freqSlider).css('top', ht + 'px');                
                }					
			
				for (var item in this.frequencyChanged) this.frequencyChanged[item]();
            };

            filtersControllersContext.controllers[item].eventsContext.triggerGainChanged = function () {
                var currentController = filtersControllersContext.currentlySelectedController;                
                if (currentController != null) {
                    var ht = (1 - (currentController.data.gain + 30) / 50) * filtersGraph.containerHeight; 
                    if (ht < 0) ht = 0;
                    if (ht > (filtersGraph.containerHeight - 38)) ht = filtersGraph.containerHeight - 38;
                    $(ampUi.globalSettings.gainSlider).css('top', ht + 'px');  
                }
					
				for (var item in this.gainChanged) this.gainChanged[item]();
            };

            filtersControllersContext.controllers[item].eventsContext.triggerQualityChanged = function () {
                var currentController = filtersControllersContext.currentlySelectedController;
                if (currentController != null) {
                    var ht = (1 - currentController.data.quality) * filtersGraph.containerHeight;
                    if (ht < 0) ht = 0;
                    if (ht > (filtersGraph.containerHeight - 38)) ht = filtersGraph.containerHeight - 38;
                    $(ampUi.globalSettings.qSlider).css('top', ht + 'px');
                }

                for (var item in this.qualityChanged) this.qualityChanged[item]();
            }
            filtersControllersContext.controllers[item].eventsContext.triggerStateChanged = function () { for (var item in this.stateChanged) this.stateChanged[item](); }
		}
		// -- Instantiate filters controllers 	
		var filtersList = new ampUi.FiltersList(filtersControllersContext);
		var filtersGraph = new ampUi.FiltersGraph(filtersControllersContext);
		var filtersDeck = new ampUi.FiltersDeck(filtersControllersContext);
		
		var sliderNew = new ampUi.SliderNew(filtersControllersContext, 'frequency');
		
		for(var item in filtersControllersContext.controllers) {
			var controller = filtersControllersContext.controllers[item];
			controller.eventsContext.triggerFrequencyChanged();
			controller.eventsContext.triggerGainChanged();
			controller.eventsContext.triggerQualityChanged();
            controller.eventsContext.triggerStateChanged();            
        }    
};