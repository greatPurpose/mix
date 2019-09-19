ampUi.FiltersList = function(controllersContext) {
	var _controllersContext = controllersContext; 
	var _listContext = this;
	// ++ HTML Elements
	this.jLi = {}; // Root
	this.jNumber = {};
	this.jName = {};
	this.jStateLabel = {};
	this.jFrequencyValue = {};
	this.jFrequencyLabel = {};
	this.jGainValue = {};
	this.jGainLabel = {};
	this.jQualityValue = {};
	this.jQualityLabel = {};
	this.jAll = {}; // Collection of all of the elements
	// -- HTML Elements
	// ++ Variables 
	this.isSelected = {};
	// -- Variables 
	// ++ Global functions
	this.setColor = function(selector, background, foreground) { // Shortcuts to set control colors
		$(selector).css({'background-color': background, 'color': foreground });
	};
	// -- Global functions
	// ++ Individual functions 
	this.setTextConstants = {};
	this.frequencyChanged = {};
	this.gainChanged = {};
	this.qualityChanged = {};
	this.stateChanged = {};
	this.setRowItemHighlighted = {};
	this.setRowItemBackgrounded = {};
	this.setRowItemSelectedDimmed = {};
	this.setRowItemUnselectedDimmed = {};
	this.setListItemSelected = {};
	this.setListItemUnselected = {};
	this.setListItemActive = {};
	this.setListItemInactive = {};
	// -- Individual functions 
	this.extend = function(index) {
		var controller = _controllersContext.controllers[index];
		// ++ HTML Elements 
		this.jLi[index] = _controllersContext.controllers[index].li; 
		this.jNumber[index] = $(this.jLi[index]).find('.filterinfo-number');
		this.jName[index] = $(this.jLi[index]).find('.filterinfo-name');
		this.jStateLabel[index] = $(this.jLi[index]).find('.filterinfo-state');
		this.jFrequencyValue[index] = $(this.jLi[index]).find('.filterinfo-frequencyvalue');
		this.jFrequencyLabel[index] = $(this.jLi[index]).find('.filterinfo-frequencylabel');
		this.jGainValue[index] = $(this.jLi[index]).find('.filterinfo-gainvalue');
		this.jGainLabel[index] = $(this.jLi[index]).find('.filterinfo-gainlabel');
		this.jQualityValue[index] = $(this.jLi[index]).find('.filterinfo-qualityvalue');
		this.jQualityLabel[index] = $(this.jLi[index]).find('.filterinfo-qualitylabel');
		this.jAll[index] = $(this.jLi[index]).find('*');
		// -- HTML Elements
		// ++ Variables 
		this.isSelected[index] = false;
		// -- Variables 
		this.setTextConstants[index] = function() { 
			$(_listContext.jNumber[index]).text(controller.settings.orderNumber);
			$(_listContext.jName[index]).text(controller.settings.readableName);
			$(_listContext.jStateLabel[index]).text(ampUi.globalSettings.stateMark);
			$(_listContext.jFrequencyLabel[index]).text(ampUi.globalSettings.hzMark);
			$(_listContext.jGainLabel[index]).text(ampUi.globalSettings.dbMark);
			$(_listContext.jQualityLabel[index]).text(ampUi.globalSettings.qMark);
		};
		// ++ Colors
		this.setRowItemHighlighted[index] = function(rowItemSelector) { _listContext.setColor(rowItemSelector, controller.settings.color, controller.settings.textColor); };
		this.setRowItemSelectedDimmed[index] = this.setRowItemHighlighted[index];
		this.setRowItemBackgrounded[index] = function(rowItemSelector) { _listContext.setColor(rowItemSelector, ampUi.colors.backgroundOrdinary, controller.settings.color); };
		this.setRowItemUnselectedDimmed[index] = function(rowItemSelector) { _listContext.setColor(rowItemSelector, ampUi.colors.backgroundOrdinary, ampUi.colors.textDisabled); };
		// -- Colors
		// ++ Active / Inactive 
		this.setListItemActive[index] = function() {
			if(_listContext.isSelected[index]) {
				_listContext.setRowItemHighlighted[index](_listContext.jName[index]);
				_listContext.setRowItemHighlighted[index](_listContext.jFrequencyValue[index]);
				_listContext.setRowItemHighlighted[index](_listContext.jGainValue[index]);
				_listContext.setRowItemHighlighted[index](_listContext.jQualityValue[index]);
				_listContext.setRowItemBackgrounded[index](_listContext.jNumber[index]);
				_listContext.setRowItemBackgrounded[index](_listContext.jStateLabel[index]);
				_listContext.setRowItemBackgrounded[index](_listContext.jFrequencyLabel[index]);
				_listContext.setRowItemBackgrounded[index](_listContext.jGainLabel[index]);
				_listContext.setRowItemBackgrounded[index](_listContext.jQualityLabel[index]);
			} else {
				_listContext.setRowItemHighlighted[index](_listContext.jNumber[index]);
				_listContext.setColor(_listContext.jFrequencyValue[index], ampUi.colors.backgroundOrdinary, ampUi.colors.filterFrequency);
				_listContext.setColor(_listContext.jGainValue[index], ampUi.colors.backgroundOrdinary, ampUi.colors.filterGain);
				_listContext.setColor(_listContext.jQualityValue[index], ampUi.colors.backgroundOrdinary, ampUi.colors.filterQuality);
				_listContext.setRowItemBackgrounded[index](_listContext.jName[index]);
				_listContext.setRowItemBackgrounded[index](_listContext.jStateLabel[index]);
				_listContext.setRowItemBackgrounded[index](_listContext.jFrequencyLabel[index]);
				_listContext.setRowItemBackgrounded[index](_listContext.jGainLabel[index]);
				_listContext.setRowItemBackgrounded[index](_listContext.jQualityLabel[index]);
			}
		};
		this.setListItemInactive[index] = function() { 
			if(_listContext.isSelected[index]) {
				_listContext.setRowItemSelectedDimmed[index](_listContext.jAll[index]);
			} else {
				_listContext.setRowItemUnselectedDimmed[index](_listContext.jAll[index]);
			}
		};
		// -- Active / Inactive 
		// ++ Select / Unselect
		this.setListItemSelected[index] = function() { // Color row selected 
			_listContext.isSelected[index] = true;
			if(controller.data.active) {
				_listContext.setListItemActive[index]();
			} else {
				_listContext.setListItemInactive[index]();
			}
		};
		this.setListItemUnselected[index] = function() {  // Color row unselected 
			_listContext.isSelected[index] = false;
			if(controller.data.active) {
				_listContext.setListItemActive[index]();
			} else {
				_listContext.setListItemInactive[index]();
			}
		};
		// -- Select / Unselect
		// ++ Events listeners
		this.frequencyChanged[index] = function() { $(_listContext.jFrequencyValue[index]).text(controller.data.frequency.toFixed(ampUi.globalSettings.frequencyDecimalPoints)); };
		controller.eventsContext.frequencyChanged.push(this.frequencyChanged[index]);
		this.gainChanged[index] = function() { $(_listContext.jGainValue[index]).text(controller.data.gain.toFixed(ampUi.globalSettings.gainDecimalPoints)); };
		controller.eventsContext.gainChanged.push(this.gainChanged[index]);
		this.qualityChanged[index] = function() { $(_listContext.jQualityValue[index]).text(controller.data.quality.toFixed(ampUi.globalSettings.qualityDecimalPoints)); };
		controller.eventsContext.qualityChanged.push(this.qualityChanged[index]);
		this.stateChanged[index] = function() { if(controller.data.active) _listContext.setListItemActive[index](); else _listContext.setListItemInactive[index](); };
		controller.eventsContext.stateChanged.push(this.stateChanged[index]);
		// -- Events listeners
		// ++ Click handler
		$(this.jLi[index]).data('controller-index', index);
		$(this.jLi[index]).on('click', function() {
			var index = $(this).data('controller-index');
			_controllersContext.previouslySelectedController = _controllersContext.currentlySelectedController;
			_controllersContext.currentlySelectedController = _controllersContext.controllers[index];
			_controllersContext.triggerSelectedControllerChanged();
		});
		// -- Click handler
	};		
	(function() { // Attach to each of controller
		var controllers = _controllersContext.controllers;
		for(var index in controllers) {
			_listContext.extend(index); // Extending 
			// ++ Running initialization methods 
			_listContext.setTextConstants[index](); 
			_listContext.setListItemUnselected[index](); 
			// -- Running initialization methods 
		}
		// ++ Selected item changed 
		_controllersContext.selectedControllerChanged.push(function() {
			var previous = _controllersContext.previouslySelectedController;
			var current = _controllersContext.currentlySelectedController;
			if(previous) {
				_listContext.setListItemUnselected[previous.name](); 
			}
			_listContext.setListItemSelected[current.name](); 
		});
		// -- Selected item changed 
	})();
};