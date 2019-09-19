ampUi.resizeController = {};
ampUi.resizeController.delegates = [];
ampUi.resizeController.add = function(delegate) { 
	var scDelegates = ampUi.resizeController.delegates;
	scDelegates.push(delegate);
};
ampUi.resizeController.remove = function(delegate) { 
	var scDelegates = ampUi.resizeController.delegates;
	scDelegates[scDelegates.indexOf(delegate)] = function() { };
};
ampUi.resizeController.execute = function() {
    var scDelegates = ampUi.resizeController.delegates;    
	for(var i = 0; i < scDelegates.length; i++) scDelegates[i]();
}
$(window).resize(ampUi.resizeController.execute);

ampUi.resizeController.add(function() { }); // Usage

ampUi.navigationController = {};
// ++ Button: Back
ampUi.navigationController.buttonBack = { }; 
ampUi.navigationController.buttonBack.j = $("#navigation-button-back");
// -- Button: Back
// ++ Label: Channel Number 
ampUi.navigationController.labelCurrentChannelNumber = { }; 
ampUi.navigationController.labelCurrentChannelNumber.j = $("#currentchannel-label-number");
// -- Label: Channel Number 
// ++ Label: Name 
ampUi.navigationController.labelCurrentChannelName = { }; 
ampUi.navigationController.labelCurrentChannelName.j = $("#currentchannel-label-name");
// -- Label: Name 
// ++ Label: Meter L
ampUi.navigationController.labelCurrentChannelMeterL = { }; 
ampUi.navigationController.labelCurrentChannelMeterL.j = $("#currentchannel-label-meter-l");
// -- Label: Meter L
// ++ Label: Meter R
ampUi.navigationController.labelCurrentChannelMeterR = { }; 
ampUi.navigationController.labelCurrentChannelMeterR.j = $("#currentchannel-label-meter-r");
// -- Label: Meter R
// ++ Meter L 
ampUi.navigationController.meterCurrentChannelL = { }; 
ampUi.navigationController.meterCurrentChannelL.j = $("#currentchannel-meter-l");
// -- Meter L 
// ++ Meter R
ampUi.navigationController.meterCurrentChannelR = { }; 
ampUi.navigationController.meterCurrentChannelR.j = $("#currentchannel-meter-r");
// -- Meter R
// ++ Peak L 
ampUi.navigationController.peakCurrentChannelL = { }; 
ampUi.navigationController.peakCurrentChannelL.j = $("#currentchannel-label-peak-l");
// -- Peak L 
// ++ Peak R
ampUi.navigationController.peakCurrentChannelR = { }; 
ampUi.navigationController.peakCurrentChannelR.j = $("#currentchannel-label-peak-r");
// -- Peak R



// ++ Meter  
ampUi.navigationController.meterMain = { }; 
ampUi.navigationController.meterMain.min = ampUi.globalSettings.volumeScaleMin;
ampUi.navigationController.meterMain.max = ampUi.globalSettings.volumeScaleMax;
ampUi.navigationController.meterMain.width = null;
ampUi.navigationController.meterMain.height = null;
ampUi.navigationController.meterMain.step = null;
ampUi.navigationController.meterMain.wasResized = false;




ampUi.navigationController.meterMain.l = { }; 
ampUi.navigationController.meterMain.l.id = "currentchannel-meter-l"; 
ampUi.navigationController.meterMain.l.j = null;
ampUi.navigationController.meterMain.l.kStage = null;
ampUi.navigationController.meterMain.l.kLayer = null;
ampUi.navigationController.meterMain.l.kRectangle = null;
ampUi.navigationController.meterMain.l.color = ampUi.colors.indicators.meterMainL;
ampUi.navigationController.meterMain.l.value = -13; 
ampUi.navigationController.meterMain.l.peak = { };
ampUi.navigationController.meterMain.l.peak.id = "currentchannel-label-peak-l";

ampUi.navigationController.meterMain.l.render = function() {
	var contextCommon = ampUi.navigationController.meterMain;
	var contextThis = ampUi.navigationController.meterMain.l;
	contextCommon.render(contextThis);
};

ampUi.navigationController.meterMain.l.setValue = function(value) {
	var context = ampUi.navigationController.meterMain.l;
	context.value = value;
	context.render();
}

//

ampUi.navigationController.meterMain.r = { }; 
ampUi.navigationController.meterMain.r.id = "currentchannel-meter-r"; 
ampUi.navigationController.meterMain.r.j = null;
ampUi.navigationController.meterMain.r.kStage = null;
ampUi.navigationController.meterMain.r.kLayer = null;
ampUi.navigationController.meterMain.r.kRectangle = null;
ampUi.navigationController.meterMain.r.color = ampUi.colors.indicators.meterMainR;
ampUi.navigationController.meterMain.r.value = -7; 
ampUi.navigationController.meterMain.r.peak = { };
ampUi.navigationController.meterMain.r.peak.id = "currentchannel-label-peak-r";

ampUi.navigationController.meterMain.r.render = function() {
	var contextCommon = ampUi.navigationController.meterMain;
	var contextThis = ampUi.navigationController.meterMain.r;
	contextCommon.render(contextThis);
};

ampUi.navigationController.meterMain.r.setValue = function(value) {
	var context = ampUi.navigationController.meterMain.r;
	context.value = value;
	context.render();
}

//

ampUi.navigationController.meterMain.remap = function() {
	var context = ampUi.navigationController.meterMain;
	context.width = $(context.l.j).width();
	context.height = $(context.l.j).height();
	context.step = context.width / (context.max - context.min);
	context.wasResized = true;
	context.l.render();
	context.r.render();
	context.wasResized = false;
};

ampUi.navigationController.meterMain.render = function(contextThis) {
	var contextCommon = ampUi.navigationController.meterMain;
	if(contextCommon.wasResized) {
		if(contextThis.kStage) contextThis.kStage.destroy();
        contextThis.kStage = new Konva.Stage({ container: contextThis.id, width: contextCommon.width, height: contextCommon.height }); 

		contextThis.kLayer = new Konva.FastLayer();
		contextThis.kRectangle = new Konva.Rect({ x: 2, y: 2, fill: contextThis.color.light });
		contextThis.kRectangle.height(contextCommon.height - 4);
		contextThis.kLayer.add(contextThis.kRectangle);
		contextThis.kStage.add(contextThis.kLayer);
    }
    console.log('stage = 8');
	contextThis.kRectangle.width((contextThis.value - contextCommon.min) * contextCommon.step - 4);
	contextThis.kRectangle.draw();
};


(function(){
	var meterContext = ampUi.navigationController.meterMain;
	meterContext.l.j = $("#" + meterContext.l.id);
	//meterContext.r.j = $("#" + meterContext.r.id);
	
	
	ampUi.resizeController.add(meterContext.remap);
})();
// -- Meter  




// ++ Hint 
ampUi.navigationController.hint = {};
ampUi.navigationController.hint.id = "navigation-hint";
ampUi.navigationController.hint.j = null;
ampUi.navigationController.hint.isShowingParameter = false; 
ampUi.navigationController.hint.lockForParameter = function() {
	var context = ampUi.navigationController.hint;
	context.isShowingParameter = true;
	$(context.j).css({'font-size': '2.8vmin'});
};
ampUi.navigationController.hint.showParameter = function(parameter) {
	var context = ampUi.navigationController.hint;
	$(context.j).text(parameter);
};
ampUi.navigationController.hint.releaseFromParameter = function() {
	var context = ampUi.navigationController.hint;
	context.isShowingParameter = false;
	$(context.j).css({'font-size': '1.75vmin'});
	$(context.j).trigger('mouseleave');
};

ampUi.navigationController.hint.showText = function(selector) {
	var context = ampUi.navigationController.hint;
	$(context.j).text($(selector).data('hint'));
};

ampUi.navigationController.hint.enable = function(selector) {
	var context = ampUi.navigationController.hint;
	$(selector).on('mouseenter touchstart', function(){ 
		if(!context.isShowingParameter) context.showText($(this));
	});
	$(selector).on('mouseleave touchend', function(){
		if(!context.isShowingParameter) $(context.j).text("");
	});
};
(function(){
	var hintContext = ampUi.navigationController.hint;
	hintContext.j = $("#" + hintContext.id);
})();
// -- Hint 



// ++ Scale 
ampUi.navigationController.scaleMain = { }; 
ampUi.navigationController.scaleMain.id = "currentchannel-scale";
ampUi.navigationController.scaleMain.j = null;
ampUi.navigationController.scaleMain.color = ampUi.colors.indicators.scaleMain;
ampUi.navigationController.scaleMain.font = ampUi.globalSettings.fontOrdinary;
ampUi.navigationController.scaleMain.numbers = [-96, -84, -72, -60, -48, -36, -24, -12, 0];
ampUi.navigationController.scaleMain.min = ampUi.globalSettings.volumeScaleMin;
ampUi.navigationController.scaleMain.max = ampUi.globalSettings.volumeScaleMax;
ampUi.navigationController.scaleMain.kStage = null;
ampUi.navigationController.scaleMain.render = function() {
	var context = ampUi.navigationController.scaleMain;
	var width = $(context.j).width();
	var height = $(context.j).height();
	var xLeft = width / 12;
	var xRight = width - width / 12;
	var min = context.min;
	var max = context.max;
	var step = (xRight - xLeft) / (max - min);
	var font = context.font;
	var fontSize =  height - 2;
	var fill = context.color.light;
	if(context.kStage) context.kStage.destroy();
    context.kStage = new Konva.Stage({ container: context.id, width: width, height: height });
    console.log('stage = 9');
	var kLayer = new Konva.FastLayer();
	for(var i = 0, numbers = context.numbers, length = context.numbers.length; i < length; i++) {
		var number = numbers[i];
		var kLabel = new Konva.Text({ x: xLeft + (number - min) * step, y: 1, text: number.toString(), fontSize: fontSize, fontFamily: font, fill: fill });
		kLabel.offsetX(kLabel.width() / 2);
		kLayer.add(kLabel);
	}
	context.kStage.add(kLayer);
};

(function(){
	//var hintContext = ampUi.navigationController.hint;
	var scaleContext = ampUi.navigationController.scaleMain;
	scaleContext.j = $("#" + scaleContext.id);
	
	//hintContext.enable(scaleContext.j);
	
	ampUi.resizeController.add(scaleContext.render);
})();
// -- Scale 








// ++ Slider: Pan
ampUi.navigationController.sliderPanMain = { }; 
ampUi.navigationController.sliderPanMain.id = "currentchannel-slider-pan";
ampUi.navigationController.sliderPanMain.j = null;
ampUi.navigationController.sliderPanMain.color = ampUi.colors.sliders.pan;
ampUi.navigationController.sliderPanMain.font = ampUi.globalSettings.fontOrdinary;
ampUi.navigationController.sliderPanMain.min = ampUi.globalSettings.panMin;
ampUi.navigationController.sliderPanMain.max = ampUi.globalSettings.panMax;
ampUi.navigationController.sliderPanMain.numbers = [-100, -50, 0, 50, 100];
ampUi.navigationController.sliderPanMain.kStage = null;
ampUi.navigationController.sliderPanMain.kRegulator = null;
ampUi.navigationController.sliderPanMain.strokeWidth = ampUi.globalSettings.panSliderStrokeWidth;
ampUi.navigationController.sliderPanMain.value = 0;
ampUi.navigationController.sliderPanMain.valueChanged = function() { };
ampUi.navigationController.sliderPanMain.literalOf = function(value) { 
	if(value < 0) return "L" + (-value);
	else if(value > 0) return "R" + value;
	else return "L R";
};

ampUi.navigationController.sliderPanMain.setValue = function(value, isMouseWheel) {
	var context = ampUi.navigationController.sliderPanMain;
	if(value >= context.min && value <= context.max) {
		context.value = value;
		context.kRegulator.moveToValue(isMouseWheel);
	}
};

ampUi.navigationController.sliderPanMain.getValue = function() {
	var context = ampUi.navigationController.sliderPanMain;
	return context.value;
};

ampUi.navigationController.sliderPanMain.render = function() {
	var context = ampUi.navigationController.sliderPanMain;
	var width = $(context.j).width();
	var height = $(context.j).height();
	var regulatorStrokeWidth = context.strokeWidth;
	var regulatorSide_NoMargin = height;
	var regulatorSide_Margin = height - regulatorStrokeWidth;
	var fontSize = height / 3.5;
	var xScaleLeft = regulatorSide_NoMargin / 2;
	var xScaleRight = width - regulatorSide_NoMargin / 2;
	
	var min = context.min;
	var max = context.max;
	var step = (xScaleRight - xScaleLeft) / (max - min);
			
	if(context.kStage) context.kStage.destroy();
	var kStage = context.kStage = new Konva.Stage({ container: context.id, width: width, height: height }); 
    console.log('stage = 10');

	var kLayerScale = new Konva.FastLayer();	
	for(var i = 0, numbers = context.numbers, length = context.numbers.length; i < length; i++) {
		var number = numbers[i];
		var kLabel = new Konva.Text({ x: xScaleLeft + (number - min) * step, y: 0, text: context.literalOf(number), fontSize: fontSize, fontFamily: context.font, fill: context.color.subtle });
		kLabel.offsetX(kLabel.width() / 2);
		kLabel.offsetY(-(height / 2 - kLabel.height() / 2));
		kLayerScale.add(kLabel);
	}
	kStage.add(kLayerScale);
		
	var kLayerRegulator = new Konva.Layer();
	
	var kRegulator = context.kRegulator = new Konva.Group({ width: regulatorSide_NoMargin, height: regulatorSide_NoMargin, draggable: true });
	
	kRegulator.xScaleLeft = xScaleLeft;
	kRegulator.xMax = width - regulatorSide_NoMargin;
	kRegulator.minValue = min;
	kRegulator.step = step;
	kRegulator.context = context;
	kRegulator.mousewheelTimeout = null;
	
	kRegulator.dragBoundFunc(function(cursorPosition) {
		var x = cursorPosition.x;
		if(x < 0) x = 0;
		if(x > this.xMax) x = this.xMax;
		return { x: x,  y: this.absolutePosition().y };
	});
	
	kRegulator.kRectangle = new Konva.Rect({ 
		x: regulatorStrokeWidth / 2, 
		y: regulatorStrokeWidth / 2, 
		width: regulatorSide_Margin,
		height: regulatorSide_Margin,
		strokeWidth: regulatorStrokeWidth,
		stroke: context.color.light
	});
		
	kRegulator.kText = new Konva.Text({
		x: regulatorSide_NoMargin / 2,
		y: regulatorSide_NoMargin / 2,
		fontSize: fontSize,
		fontFamily: context.font,
		fill: context.color.light
	});
		
	kRegulator.add(kRegulator.kRectangle);
	kRegulator.add(kRegulator.kText);
		
	kRegulator.updateText = function() {
		var text = this.context.literalOf(this.context.value);
		this.kText.text(text);
		this.kText.offsetX(this.kText.width() / 2);
		this.kText.offsetY(this.kText.height() / 2);
		return text;
	};
		
	kRegulator.moveToValue = function(isMouseWheel) {
		this.x(this.xScaleLeft + (this.context.value - this.minValue) * this.step - this.width() / 2);
		var text = this.updateText();
		this.context.kStage.draw();
		this.context.valueChanged(this.context.value);
		var c = this.context;
		
		if(isMouseWheel) {
		
			hintContext.lockForParameter();
			hintContext.showParameter(text);
			
			if(this.mousewheelTimeout) {
				clearTimeout(this.mousewheelTimeout);
				this.mousewheelTimeout = null;
			}
			
			this.mousewheelTimeout = setTimeout(function() { hintContext.releaseFromParameter(); hintContext.showText(c.j); }, 1000);
		}
		
	};
	
	var hintContext = ampUi.navigationController.hint;
	
	kRegulator.on('dragstart', function() {
		hintContext.lockForParameter();
	});
	
	kRegulator.on('dragmove', function() {
		this.context.value = Math.round(this.minValue + this.position().x / this.step);
		var text = this.updateText();
		hintContext.showParameter(text);
		this.context.valueChanged(this.context.value);
	});
	
	kRegulator.on('dragend', function() {
		hintContext.releaseFromParameter();
		hintContext.showText(this.context.j);
	});
		
	kLayerRegulator.add(kRegulator);
	kStage.add(kLayerRegulator);	
	kRegulator.moveToValue(false);
	
};

(function(){
	//var hintContext = ampUi.navigationController.hint;
	var sliderPanContext = ampUi.navigationController.sliderPanMain;
	sliderPanContext.j = $("#" + sliderPanContext.id);
	
	$(sliderPanContext.j).on('wheel',function(e){
		var value = sliderPanContext.getValue();
		if(e.originalEvent.deltaY > 0) {
			value--;
		} else {
			value++;
		}
		sliderPanContext.setValue(value, true);
	});
	
	//hintContext.enable(sliderPanContext.j);
	
	ampUi.resizeController.add(sliderPanContext.render);
})();
// -- Slider: Pan





// ++ Slider: Volume
ampUi.navigationController.sliderVolumeMain = { }; 
ampUi.navigationController.sliderVolumeMain.id = "currentchannel-slider-volume";
ampUi.navigationController.sliderVolumeMain.j = null;
ampUi.navigationController.sliderVolumeMain.color = ampUi.colors.sliders.volume;
ampUi.navigationController.sliderVolumeMain.font = ampUi.globalSettings.fontOrdinary;
ampUi.navigationController.sliderVolumeMain.min = ampUi.globalSettings.volumeMin;
ampUi.navigationController.sliderVolumeMain.max = ampUi.globalSettings.volumeMax;
ampUi.navigationController.sliderVolumeMain.numbers = [-30, -20, -10, 0, 10, 20];
ampUi.navigationController.sliderVolumeMain.kStage = null;
ampUi.navigationController.sliderVolumeMain.kRegulator = null;
ampUi.navigationController.sliderVolumeMain.strokeWidth = ampUi.globalSettings.volumeSliderStrokeWidth;
ampUi.navigationController.sliderVolumeMain.value = 0;
ampUi.navigationController.sliderVolumeMain.valueChanged = function() { };
ampUi.navigationController.sliderVolumeMain.literalOf = function(value) { 
	if(value < 0) return "-" + (-value);
	else if(value > 0) return "+" + value;
	else return "dB";
};

ampUi.navigationController.sliderVolumeMain.setValue = function(value, isMouseWheel) {
	var context = ampUi.navigationController.sliderVolumeMain;
	if(value >= context.min && value <= context.max) {
		context.value = value;
		context.kRegulator.moveToValue(isMouseWheel);
	}
};

ampUi.navigationController.sliderVolumeMain.getValue = function() {
	var context = ampUi.navigationController.sliderVolumeMain;
	return context.value;
};

ampUi.navigationController.sliderVolumeMain.render = function() {
	var context = ampUi.navigationController.sliderVolumeMain;
	var width = $(context.j).width();
	var height = $(context.j).height();
	var regulatorStrokeWidth = context.strokeWidth;
	var regulatorSide_NoMargin = height;
	var regulatorSide_Margin = height - regulatorStrokeWidth;
	var fontSize = height / 3.5;
	var xScaleLeft = regulatorSide_NoMargin / 2;
	var xScaleRight = width - regulatorSide_NoMargin / 2;
	
	var min = context.min;
	var max = context.max;
	var step = (xScaleRight - xScaleLeft) / (max - min);
			
	if(context.kStage) context.kStage.destroy();
    var kStage = context.kStage = new Konva.Stage({ container: context.id, width: width, height: height }); 
    console.log('stage = 11');
	var kLayerScale = new Konva.FastLayer();	
	for(var i = 0, numbers = context.numbers, length = context.numbers.length; i < length; i++) {
		var number = numbers[i];
		var kLabel = new Konva.Text({ x: xScaleLeft + (number - min) * step, y: 0, text: context.literalOf(number), fontSize: fontSize, fontFamily: context.font, fill: context.color.subtle });
		kLabel.offsetX(kLabel.width() / 2);
		kLabel.offsetY(-(height / 2 - kLabel.height() / 2));
		kLayerScale.add(kLabel);
	}
	kStage.add(kLayerScale);
		
	var kLayerRegulator = new Konva.Layer();
	
	var kRegulator = context.kRegulator = new Konva.Group({ width: regulatorSide_NoMargin, height: regulatorSide_NoMargin, draggable: true });
	
	kRegulator.xScaleLeft = xScaleLeft;
	kRegulator.xMax = width - regulatorSide_NoMargin;
	kRegulator.minValue = min;
	kRegulator.step = step;
	kRegulator.context = context;
	kRegulator.mousewheelTimeout = null;
	
	kRegulator.dragBoundFunc(function(cursorPosition) {
		var x = cursorPosition.x;
		if(x < 0) x = 0;
		if(x > this.xMax) x = this.xMax;
		return { x: x,  y: this.absolutePosition().y };
	});
	
	kRegulator.kRectangle = new Konva.Rect({ 
		x: regulatorStrokeWidth / 2, 
		y: regulatorStrokeWidth / 2, 
		width: regulatorSide_Margin,
		height: regulatorSide_Margin,
		strokeWidth: regulatorStrokeWidth,
		stroke: context.color.light
	});
		
	kRegulator.kText = new Konva.Text({
		x: regulatorSide_NoMargin / 2,
		y: regulatorSide_NoMargin / 2,
		fontSize: fontSize,
		fontFamily: context.font,
		fill: context.color.light
	});
		
	kRegulator.add(kRegulator.kRectangle);
	kRegulator.add(kRegulator.kText);
		
	kRegulator.updateText = function() {
		var text = this.context.literalOf(this.context.value);
		this.kText.text(text);
		this.kText.offsetX(this.kText.width() / 2);
		this.kText.offsetY(this.kText.height() / 2);
		return text;
	};
		
	kRegulator.moveToValue = function(isMouseWheel) {
		this.x(this.xScaleLeft + (this.context.value - this.minValue) * this.step - this.width() / 2);
		var text = this.updateText();
		this.context.kStage.draw();
		this.context.valueChanged(this.context.value);
		var c = this.context;
		
		if(isMouseWheel) {
		
			hintContext.lockForParameter();
			hintContext.showParameter(text);
			
			if(this.mousewheelTimeout) {
				clearTimeout(this.mousewheelTimeout);
				this.mousewheelTimeout = null;
			}
			
			this.mousewheelTimeout = setTimeout(function() { hintContext.releaseFromParameter(); hintContext.showText(c.j); }, 1000);
		}
		
	};
	
	var hintContext = ampUi.navigationController.hint;
	
	kRegulator.on('dragstart', function() {
		hintContext.lockForParameter();
	});
	
	kRegulator.on('dragmove', function() {
		this.context.value = Math.round(this.minValue + this.position().x / this.step);
		var text = this.updateText();
		hintContext.showParameter(text);
		this.context.valueChanged(this.context.value);
	});
	
	kRegulator.on('dragend', function() {
		hintContext.releaseFromParameter();
		hintContext.showText(this.context.j);
	});
		
	kLayerRegulator.add(kRegulator);
	kStage.add(kLayerRegulator);	
	kRegulator.moveToValue(false);
	
};

(function(){
	//var hintContext = ampUi.navigationController.hint;
	var sliderVolumeContext = ampUi.navigationController.sliderVolumeMain;
	sliderVolumeContext.j = $("#" + sliderVolumeContext.id);
	
	$(sliderVolumeContext.j).on('wheel',function(e){
		var value = sliderVolumeContext.getValue();
		if(e.originalEvent.deltaY > 0) {
			value--;
		} else {
			value++;
		}
		sliderVolumeContext.setValue(value, true);
	});
	
	//hintContext.enable(sliderVolumeContext.j);
	
	ampUi.resizeController.add(sliderVolumeContext.render);
})();
// -- Slider: Volume





// ++ Logo
ampUi.navigationController.logo = { }; 
ampUi.navigationController.logo.j = $("#navigation-logo");
// -- Logo







// ++ View Groups 
ampUi.navigationController.viewGroups = {};

ampUi.navigationController.viewGroups.button = { }; 
ampUi.navigationController.viewGroups.button.j = $("#navigation-button-viewgroups");
ampUi.navigationController.viewGroups.button.color = ampUi.colors.buttons.viewGroups;
ampUi.navigationController.viewGroups.button.setState = function(isOn) {
	var context = ampUi.navigationController.viewGroups.button;
	if(isOn) $(context.j).css({ 'background-color': context.color.dark, 'color': context.color.light });
	else $(context.j).css({ 'background-color': context.color.light, 'color': context.color.dark });
};

ampUi.navigationController.viewGroups.list = { }; 
ampUi.navigationController.viewGroups.list.j = $("#container-viewgroups-list");
ampUi.navigationController.viewGroups.list.color = ampUi.colors.containers.viewGroups;
ampUi.navigationController.viewGroups.list.setState = function(isOn) {
	var context = ampUi.navigationController.viewGroups.list;
	if(isOn) {
		$(context.j).removeClass('hidden-important');
		$(context.j).addClass('flex-important');
	}
	else { 
		$(context.j).removeClass('flex-important');
		$(context.j).addClass('hidden-important');
	}
};

ampUi.navigationController.viewGroups.state = true;
ampUi.navigationController.viewGroups.renderState = function() {
	var context = ampUi.navigationController.viewGroups;
	context.button.setState(context.state);
	context.list.setState(context.state);
};

(function(){
	var vgContext = ampUi.navigationController.viewGroups;
	$(vgContext.button.j).click(function(){
		vgContext.state = !vgContext.state;
		vgContext.renderState(vgContext.state);
	});
	vgContext.renderState(vgContext.state);
})();

// -- View Groups 



// ++ Mixes
ampUi.navigationController.mixes = {};

ampUi.navigationController.mixes.button = { }; 
ampUi.navigationController.mixes.button.j = $("#navigation-button-mixes");
ampUi.navigationController.mixes.button.color = ampUi.colors.buttons.mixes;
ampUi.navigationController.mixes.button.setState = function(isOn) {
	var context = ampUi.navigationController.mixes.button;
	if(isOn) $(context.j).css({ 'background-color': context.color.dark, 'color': context.color.light });
	else $(context.j).css({ 'background-color': context.color.light, 'color': context.color.dark });
};

ampUi.navigationController.mixes.list = { }; 
ampUi.navigationController.mixes.list.j = $("#container-mixes-list");
ampUi.navigationController.mixes.list.color = ampUi.colors.containers.mixes;
ampUi.navigationController.mixes.list.setState = function(isOn) {
	var context = ampUi.navigationController.mixes.list;
	if(isOn) {
		$(context.j).removeClass('hidden-important');
		$(context.j).addClass('flex-important');
	}
	else { 
		$(context.j).removeClass('flex-important');
		$(context.j).addClass('hidden-important');
	}
};

ampUi.navigationController.mixes.state = true;
ampUi.navigationController.mixes.renderState = function() {
	var context = ampUi.navigationController.mixes;
	context.button.setState(context.state);
	context.list.setState(context.state);
};

(function(){
	var mixesContext = ampUi.navigationController.mixes;
	$(mixesContext.button.j).click(function(){
		mixesContext.state = !mixesContext.state;
		mixesContext.renderState(mixesContext.state);
	});
	mixesContext.renderState(mixesContext.state);
})();

// -- Mixes
















// ++ Button: Options
ampUi.navigationController.buttonOptions = { }; 
ampUi.navigationController.buttonOptions.j = $("#navigation-button-options");
// -- Button: Options
// ++ Button: Exit
ampUi.navigationController.buttonExit = { }; 
ampUi.navigationController.buttonExit.j = $("#navigation-button-exit");
// -- Button: Exit

// ++ Container: Mixes List
ampUi.navigationController.containerMixesList = { }; 
ampUi.navigationController.containerMixesList.j = $("#container-mixes-list");
// -- Container: Mixes List
// ++ Container: Channels List
ampUi.navigationController.containerChannelsList = { }; 
ampUi.navigationController.containerChannelsList.j = $("#container-channels-list");
// -- Container: Channels List
// ++ Slider: Current Channel Volume
ampUi.navigationController.sliderCurrentChannelVolume = { }; 
ampUi.navigationController.sliderCurrentChannelVolume.j = $("#currentchannel-slider-volume");
// -- Slider: Current Channel Volume






















// ++ Button: Mute
ampUi.navigationController.buttonCurrentChannelMute = { }; 
ampUi.navigationController.buttonCurrentChannelMute.j = $("#currentchannel-button-mute");
// -- Button: Mute


// ++ View Groups 
ampUi.navigationController.isViewGroupsListVisible = false;
ampUi.navigationController.renderViewGroupsList = function() {
	var context = ampUi.navigationController;
	var ctrlButton = context.buttonViewGroups;
	var ctrlContainer = context.containerViewGroupsList;
	if(context.isViewGroupsListVisible) {
		
	} else {
	}
}
// -- View Groups 



//currentchannel-slider-volume


//currentchannel-meter-l

$(document).ready(function() {
	var elementsWithHint = $(".has-hint");
	ampUi.navigationController.hint.enable(elementsWithHint);
	
	//ampUi.navigationController.sliderPanMain.valueChanged = _.debounce(function(value) { console.log(value);}, 150);
	//;
	
	//var
	ampUi.resizeController.execute();
	
	//ampUi.navigationController.sliderPanMain.setValue(85);
});













