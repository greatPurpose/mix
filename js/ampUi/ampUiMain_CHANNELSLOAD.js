//http://localhost:8000/main.html?fd2=0px&sessionid=1&anticache=9574-1005
// When channel number volume is changed to maximum 

//main.html?fd0=0px&sessionid=1&anticache=7224-308
//> channel in position 0 with number 1 volume changed to max 

//main.html?fd0=269px&sessionid=1&anticache=9026-5746
//> channel in position 0 with number 1 volume changed to min 

//main.html?mu0=false&sessionid=1&anticache=3974-7187
//> channel in position 0 with number 1 mute changed to active 

//main.html?mu8=true&sessionid=1&anticache=3620-1175
//> channel in position 8 with number 19 mute changed to inactive 

//main.html?pn1=52px&sessionid=1&anticache=345-8214
//> channel in position 1 with number 2 pan changed to right max  

//main.html?pn5=0px&sessionid=1&anticache=5804-7452
//> channel in position 5 with number 6 pan changed to left max  

//pan: 0px left | 26px mid | 52px right 





//main.html?b=82&status=controls&sessionid=60&anticache=2819-22
/*
status=controls&fd0=218px&pn0=41px&mu0=false&fd1=87px&pn1=28px&mu1=false&fd2=95px&pn2=26px&mu2=false&fd3=93px&pn3=0px&mu3=false&fd4=148px&pn4=35px&mu4=false&fd5=125px&pn5=26px&mu5=false&fd6=78px&pn6=26px&mu6=false&fd7=74px&pn7=22px&mu7=false&fd8=172px&pn8=26px&mu8=false&fd9=70px&pn9=26px&mu9=false&fd10=110px&pn10=26px&mu10=false&fd11=102px&pn11=29px&mu11=false&fd12=2px&pn12=26px&mu12=true&fd13=269px&pn13=26px&mu13=false&fd14=269px&pn14=26px&mu14=true&fd15=269px&pn15=26px&mu15=true&fd16=11px&pn16=26px&mu16=false&fd17=133px&pn17=26px&mu17=true&fd18=123px&pn18=26px&mu18=false&fd19=78px&pn19=26px&mu19=true&fd20=87px&pn20=28px&mu20=false&

*/

//status=meters&
// status=meters&  DDKK    XXNNll                        DD
// Each single letter position is channel numb


$(document).ready(function() {	
	// ++ Shortcuts
	var scSa = ampUi.serverAdapter;
	var scQueryValue = scSa.queryVariableValue;
	var scServerMeterToClient = scSa.serverMeterToClient;
	var scClientVolumeToServer = scSa.clientVolumeToServer;
    var scClientPanToServer = scSa.clientPanToServer;
    
	// -- Shortcuts
	// ++ Variables
	var channels = [];
	// -- Variables
	// ++ Loading channels 
	var initialLoginResult = scSa.initialLogin();
    if (initialLoginResult) {
		var channelsData = scSa.initializeChannelsRequest();
        if (scQueryValue(channelsData, "status") == "init") { // Channels loading OK
            
			var channelCount = scQueryValue(channelsData, "max");
			var mixName = scQueryValue(channelsData, "mix");
			var mixArrayString = scQueryValue(channelsData, "ma").split("|");
			var mixArray = [];
			for (var i = 0; i < mixArrayString.length - 1; i++) {
				var mixEntry = mixArrayString[i].split("^");
				var mixObject = { id: mixEntry[0], readableName: mixEntry[1] };
				mixArray.push(mixObject);
			}
			var channelType = scQueryValue(channelsData, "only"); 
			for (var i = 0; i < channelCount; i++){
				var number = scQueryValue(channelsData, "nm" + i);
				var caption = scQueryValue(channelsData, "caption" + i); // Input 3, Buss 1
				var type = scQueryValue(channelsData, "type" + i); // slider | slider_red | slider_green | slider_blue 
				var colorAlias = '';
				switch(type) {
					case 'slider_red':
						colorAlias = 'red';
						break;
					case 'slider_green':
						colorAlias = 'green';
						break;
					case 'slider_blue':
						colorAlias = 'aqua';
						break;
					default:
						colorAlias = 'yellow';
				}
				
				var channelObject = {
					index: i,
					number: number,
					name: caption,
					readableName: caption,
					info: caption,
					volume: 0,
					pan: 0,
					active: true,
					coloralias: colorAlias //red purple aqua green yellow 
				}
				channels.push(channelObject);
			}
		} else {
        }
    } else {
	}
	// -- Loading channels

    	
	// ++ Server 

	var GSendMetersUpdateTimer;
	var GSendSliderPositionTimer;
	var GSendControlsSyncTimer;
	var bobtimer;
	var bobCount = 0;
	var GMetersUpdateRate = 1000; //75; 
	var GSlidersSendRate = 1000; //250;
	var GControlsSyncRate = 3000;
	var GDisconnectedSyncRate=30000;
	var GChannelCount = 0;

	var httpWorker = new Worker("js/worker-requestsend.js"); 
	
	//function resp() { console.log('resp');}
	
	
	httpWorker.onmessage = ServerResponseReceive;
	
    function SetMeterUpdateAndControlSyncInterval() {
		GSendMetersUpdateTimer = setInterval(SendMetersUpdate, GMetersUpdateRate);
		GSendControlsSyncTimer = setInterval(SyncControlsUpdate, GControlsSyncRate);
	}
	
	
	SetMeterUpdateAndControlSyncInterval();
	
	function ServerRequestSend(parameter, value) { // Meter Server Requests Sender
		
		bobCount++;
		var postQuery = scSa.serverUrl + "?b=" + scSa.bobCount + "&" + parameter + "=" + value + "&sessionid=" + scSa.sessionId + scSa.httpRequestAntiCache();
		console.log('ServerRequestSend: ' + postQuery);		
		
		httpWorker.postMessage(postQuery);
		
	};
	
	function SyncControlsUpdate(){
		console.log('SyncControlsUpdate');		
		ServerRequestSend("status", "controls");	
	}
	function SendMetersUpdate(){
		console.log('SendMetersUpdate');		
		ServerRequestSend("status", "meters");								
	}
	
	var volumeOldValues = new Array(channels.length);
	volumeOldValues.fill(0);
	var volumeNewValues = new Array(channels.length);
	volumeNewValues.fill(0);
	
	var panOldValues = new Array(channels.length);
	panOldValues.fill(0);
	var panNewValues = new Array(channels.length);
	panNewValues.fill(0);
    
	function FaderServerRequestSend(ParamName, ParamValue){
		scSa.httpRequest2(scSa.serverUrl  + "?" + ParamName + "=" + ParamValue + "&sessionid=" + scSa.sessionId  + scSa.httpRequestAntiCache());
		console.log('FaderServerRequestSend');
	}
	
	function SendSliderPosition(){
		for (var i=0; i < channels.length; i++) {
			
		}
		console.log('SendSliderPosition');
	}
    	
	// ++ Channel controller 
	var ChannelController = function(html, data) {
		// ++ Shortcuts
		var scIndexOfClosest = ampUi.math.getIndexOfClosestToInArray_Sequential;
		var scVolSliderNumbers = ampUi.globalSettings.volumeSliderNumbersAt;
		// -- Shortcuts 
		var _controllerContext = this;
		this.html = html;
		this.data = data;
		this.color = ampUi.colors.channels[this.data.coloralias];
		
		
		
		this.jLblPanL = $(this.html).find('.channelcontainer-label-pan-l');
		this.jSliderPan = $(this.html).find('.channelcontainer-slider-pan');
		this.jLblPanR = $(this.html).find('.channelcontainer-label-pan-r');
		this.jSliderVolume = $(this.html).find('.channelcontainer-slider-volume');
		this.jPeakL = $(this.html).find('.channelcontainer-peak-l');
		this.jPeakR = $(this.html).find('.channelcontainer-peak-r');
		this.jMeterL = $(this.html).find('.channelcontainer-meter-l');
		this.jScaleVolume = $(this.html).find('.channelcontainer-scale-volume');
		this.jMeterR = $(this.html).find('.channelcontainer-meter-r');
		this.jLblMeterL = $(this.html).find('.channelcontainer-label-meter-l');
		this.jLblMeterR = $(this.html).find('.channelcontainer-label-meter-r');
		this.jBtnEq = $(this.html).find('.channelcontainer-button-equalizer');
		this.jBtnMute = $(this.html).find('.channelcontainer-button-mute');
		this.jLblNumber = $(this.html).find('.channelcontainer-label-number');
		this.jLblName = $(this.html).find('.channelcontainer-label-name');
		
		
		$(this.jLblNumber).text(this.data.number);
		$(this.jLblName).text(this.data.readableName);
		
		$(this.html).appendTo("#container-channels-list");
		
		// ++ Pan Labels 
		this.updateLabelsPan = function() {
			var pan = _controllerContext.data.pan;
			if(pan < 0) { // L
				$(_controllerContext.jLblPanL).css({ 'font-weight': 700 });
				$(_controllerContext.jLblPanL).css({ 'opacity': 1 });
				$(_controllerContext.jLblPanR).css({ 'font-weight': 100 });
				$(_controllerContext.jLblPanR).css({ 'opacity': 0.5 });
			} else if(pan > 0) { // R
				$(_controllerContext.jLblPanR).css({ 'font-weight': 700 });
				$(_controllerContext.jLblPanR).css({ 'opacity': 1 });
				$(_controllerContext.jLblPanL).css({ 'font-weight': 100 });
				$(_controllerContext.jLblPanL).css({ 'opacity': 0.5 });
			} else { // 0
				$(_controllerContext.jLblPanL).css({ 'font-weight': 400 });
				$(_controllerContext.jLblPanL).css({ 'opacity': 1 });
				$(_controllerContext.jLblPanR).css({ 'font-weight': 400 });
				$(_controllerContext.jLblPanR).css({ 'opacity': 1 });
			}
		};
		// -- Pan Labels 
		
		
		// ++ Pan slider
		
		this.idSliderPan = 'channelcontainer-slider-pan-' + this.data.name;
		$(this.jSliderPan).attr('id', this.idSliderPan);
		this.widthSliderPan = $(this.jSliderPan).width();
		this.heightSliderPan = $(this.jSliderPan).height();
		this.stageSliderPan = new Konva.Stage({ container: _controllerContext.idSliderPan, width: _controllerContext.widthSliderPan, height: _controllerContext.heightSliderPan });
        console.log('stage = 12');
        this.layerSliderPan = new Konva.Layer();
		this.stageSliderPan.add(this.layerSliderPan);
		//
		this.marginRegulatorPan = ampUi.globalSettings.panSliderStrokeWidth / 2;
		this.widthRegulatorPan_NoMargin = this.heightSliderPan / 2;
		this.heightRegulatorPan_NoMargin = this.heightSliderPan;
		this.widthRegulatorPan_Margin = this.widthRegulatorPan_NoMargin - this.marginRegulatorPan * 2;
		this.heightRegulatorPan_Margin = this.heightRegulatorPan_NoMargin - this.marginRegulatorPan * 2;
		//
		this.sliderPanGroupY = 0;
		this.sliderPanGroupBeginningX = 0;
		this.sliderPanGroupEndingX = Math.round(this.widthSliderPan - this.widthRegulatorPan_NoMargin);
		//
		this.mapSliderPan = ampUi.math.createLinearMap(this.widthSliderPan, this.sliderPanGroupBeginningX, this.sliderPanGroupEndingX, ampUi.globalSettings.panMin, ampUi.globalSettings.panMax);
		this.fontSizeSliderPan = this.heightRegulatorPan_Margin / 4;
		//
		this.draggableGroupSliderPan = new Konva.Group({ 
			y: _controllerContext.sliderPanGroupY, 
			width: _controllerContext.widthRegulatorPan_NoMargin,
			height: _controllerContext.heightRegulatorPan_NoMargin,
			draggable: true, 
			dragBoundFunc: function(cursorPosition) {
				var x = cursorPosition.x;
				if(x < _controllerContext.sliderPanGroupBeginningX) x = _controllerContext.sliderPanGroupBeginningX;
				if(x > _controllerContext.sliderPanGroupEndingX) x = _controllerContext.sliderPanGroupEndingX;
				return { x: x, y: this.absolutePosition().y };
			}
		});
		//
		this.draggableGroupSliderPan.on('mouseenter', function() {
			_controllerContext.stageSliderPan.container().style.cursor = 'pointer';
		});
		this.draggableGroupSliderPan.on('mouseleave', function() {
			_controllerContext.stageSliderPan.container().style.cursor = 'default';
		});
		//
		this.rectangleSliderPan = new Konva.Rect({ 
			x: _controllerContext.marginRegulatorPan, 
			y: _controllerContext.marginRegulatorPan, 
			width: _controllerContext.widthRegulatorPan_Margin,
			height: _controllerContext.heightRegulatorPan_Margin,
			strokeWidth: ampUi.globalSettings.panSliderStrokeWidth
		});
		//
		this.labelSliderPan = new Konva.Text({
			x: _controllerContext.widthRegulatorPan_NoMargin / 2,
			y: _controllerContext.heightRegulatorPan_NoMargin / 2,
			fontSize: _controllerContext.fontSizeSliderPan,
			fontFamily: ampUi.globalSettings.fontOrdinary,
			text: Math.abs(_controllerContext.data.pan).toString()
		});
		//
		this.labelSliderPan.offsetX(this.labelSliderPan.width() / 2);
		this.labelSliderPan.offsetY(this.labelSliderPan.height() / 2);
		this.draggableGroupSliderPan.add(this.rectangleSliderPan);
		this.draggableGroupSliderPan.add(this.labelSliderPan);
		this.draggableGroupSliderPan.label = this.labelSliderPan;
		//
		this.updateSliderPanPosition = function() {
			this.draggableGroupSliderPan.x(scIndexOfClosest(this.data.pan, this.mapSliderPan));
		};
		
		this.draggableGroupSliderPan.on('dblclick dbltap', function() {
			var _groupContext = this;
			_controllerContext.data.pan = 0;
			_controllerContext.updateSliderPanPosition();
			_groupContext.label.text("0");
			_groupContext.label.offsetX((_groupContext.label.width() / 2));
			_controllerContext.layerSliderPan.draw();
		});
		
		this.draggableGroupSliderPan.on('dragmove', function() {
			var _groupContext = this;
			var value = Math.round(_controllerContext.mapSliderPan[Math.round(_groupContext.position().x)]);
			_controllerContext.data.pan = value;			
			_groupContext.label.text(Math.abs(value).toString());
			_groupContext.label.offsetX((_groupContext.label.width() / 2));
			_controllerContext.layerSliderPan.draw();
			
			//Pans update on move 
			panNewValues[_controllerContext.data.index] = _controllerContext.data.pan;
			
			if (!GSendSliderPositionTimer) {
					GSendSliderPositionTimer = setInterval(SendSliderPosition, GSlidersSendRate);
				}
				else {
					//console.log('GSendSliderPositionTimer active');
				}

				if (GSendControlsSyncTimer) {
					clearInterval(GSendControlsSyncTimer);
					GSendControlsSyncTimer = setInterval(SyncControlsUpdate, GControlsSyncRate);
				}
			
		});
		
		this.draggableGroupSliderPan.on('dragend', function() {
			
			clearInterval(GSendSliderPositionTimer);	
			SendSliderPosition(); // make sure last Slider value sent
			GSendSliderPositionTimer = null;		
			
		});
		
		
		
		this.layerSliderPan.add(this.draggableGroupSliderPan);
		
		
		this.updateSliderPanPosition(); 
		this.updateLabelsPan();
		
		this.setPan = function(pan) {
			this.data.pan = pan;
			this.updateLabelsPan();
			this.updateSliderPanPosition();
			this.labelSliderPan.text(pan.toString());
			this.labelSliderPan.offsetX((this.labelSliderPan.width() / 2));
			this.layerSliderPan.draw();
		};
		
		// -- Pan slider
		
		
		
		
		
		// ++ Volume slider 
		this.idSliderVolume = 'channelcontainer-slider-volume-' + this.data.name;
		$(this.jSliderVolume).attr('id', this.idSliderVolume);
		this.widthSliderVolume = $(this.jSliderVolume).width();
		this.heightSliderVolume = $(this.jSliderVolume).height();
		this.stageSliderVolume = new Konva.Stage({ container: _controllerContext.idSliderVolume, width: _controllerContext.widthSliderVolume, height: _controllerContext.heightSliderVolume });
        console.log('stage = 13');
        this.layerSliderVolume = new Konva.Layer();
		this.stageSliderVolume.add(this.layerSliderVolume);
		//
		this.marginRegulatorVolume = ampUi.globalSettings.volumeSliderStrokeWidth / 2;
		this.widthRegulatorVolume_NoMargin = this.widthSliderVolume;
		this.heightRegulatorVolume_NoMargin = this.widthRegulatorVolume_NoMargin / 2;
		this.widthRegulatorVolume_Margin = this.widthRegulatorVolume_NoMargin - this.marginRegulatorVolume * 2;
		this.heightRegulatorVolume_Margin = this.heightRegulatorVolume_NoMargin - this.marginRegulatorVolume * 2;
		//
		this.sliderVolumeGroupX = 0;
		this.sliderVolumeGroupBeginningY = 0;
		this.sliderVolumeGroupEndingY = Math.round(this.heightSliderVolume - this.heightRegulatorVolume_NoMargin);
		//
		this.mapSliderVolume = ampUi.math.createLinearMap_Inverted(this.heightSliderVolume, this.sliderVolumeGroupBeginningY, this.sliderVolumeGroupEndingY, ampUi.globalSettings.volumeMin, ampUi.globalSettings.volumeMax);
		this.fontSizeSliderVolume = this.heightRegulatorVolume_NoMargin / 2;
		//
		for(var i = 0; i < scVolSliderNumbers.length; i++) {
			var y = scIndexOfClosest(scVolSliderNumbers[i], this.mapSliderVolume) + this.fontSizeSliderVolume / 2 + ampUi.globalSettings.volumeSliderStrokeWidth / 2;
			var number = new Konva.Text({
				x: 0,
				y: y,
				text: scVolSliderNumbers[i] > 0 ? "+" + scVolSliderNumbers[i] : scVolSliderNumbers[i].toString(),
				fontFamily: ampUi.globalSettings.fontOrdinary,
				fontSize: this.fontSizeSliderVolume,
				fill: ampUi.colors.sliderVolumeNumbers
			});
			number.offsetX(-(this.widthSliderVolume / 2 - number.width() / 2));
			this.layerSliderVolume.add(number);
		}
		//
		this.draggableGroupSliderVolume = new Konva.Group({ 
			x: _controllerContext.sliderVolumeGroupX,
			width: _controllerContext.widthRegulatorVolume_NoMargin,
			height: _controllerContext.heightRegulatorVolume_NoMargin,
			draggable: true, 
			dragBoundFunc: function(cursorPosition) {
				var y = cursorPosition.y;
				if(y < _controllerContext.sliderVolumeGroupBeginningY) y = _controllerContext.sliderVolumeGroupBeginningY;
				if(y > _controllerContext.sliderVolumeGroupEndingY) y = _controllerContext.sliderVolumeGroupEndingY;
				return { x: this.absolutePosition().x,  y: y };
			}
		});
		//
		this.draggableGroupSliderVolume.on('mouseenter', function() {
			_controllerContext.stageSliderVolume.container().style.cursor = 'pointer';
		});
		this.draggableGroupSliderVolume.on('mouseleave', function() {
			_controllerContext.stageSliderVolume.container().style.cursor = 'default';
		});
		//
		this.rectangleSliderVolume = new Konva.Rect({ 
			x: _controllerContext.marginRegulatorVolume, 
			y: _controllerContext.marginRegulatorVolume, 
			width: _controllerContext.widthRegulatorVolume_Margin,
			height: _controllerContext.heightRegulatorVolume_Margin,
			strokeWidth: ampUi.globalSettings.volumeSliderStrokeWidth
		});
		//
		this.labelSliderVolume = new Konva.Text({
			x: _controllerContext.widthRegulatorVolume_NoMargin / 2,
			y: _controllerContext.heightRegulatorVolume_NoMargin / 2,
			fontSize: _controllerContext.fontSizeSliderVolume,
			fontFamily: ampUi.globalSettings.fontOrdinary,
			text: _controllerContext.data.volume > 0 ? "+" + _controllerContext.data.volume : _controllerContext.data.volume.toString()
		});
		//
		this.labelSliderVolume.offsetX(this.labelSliderVolume.width() / 2);
		this.labelSliderVolume.offsetY(this.labelSliderVolume.height() / 2);
		
		this.draggableGroupSliderVolume.add(this.rectangleSliderVolume);
		this.draggableGroupSliderVolume.add(this.labelSliderVolume);
		this.draggableGroupSliderVolume.label = this.labelSliderVolume;
		//
		this.updateSliderVolumePosition = function() {
			this.draggableGroupSliderVolume.y(scIndexOfClosest(this.data.volume, this.mapSliderVolume));
		};
		//
		this.draggableGroupSliderVolume.on('dblclick dbltap', function() {
			var _groupContext = this;
			_controllerContext.data.volume = 0;

			_controllerContext.updateSliderVolumePosition();
			_groupContext.label.text("0");
			_groupContext.label.offsetX((_groupContext.label.width() / 2));
			_controllerContext.layerSliderVolume.draw();
		});
		//
		this.draggableGroupSliderVolume.on('dragmove', function() {
			var _groupContext = this;
			var value = Math.round(_controllerContext.mapSliderVolume[Math.round(_groupContext.position().y)]);
			_controllerContext.data.volume = value;
			var stringValue = value > 0 ? "+" + value : value.toString();

			_groupContext.label.text(stringValue);
			_groupContext.label.offsetX((_groupContext.label.width() / 2));
			_controllerContext.layerSliderVolume.draw();
			
			volumeNewValues[_controllerContext.data.index] = _controllerContext.data.volume;
			//Faders update on move 
			
			if (!GSendSliderPositionTimer) {
					GSendSliderPositionTimer = setInterval(SendSliderPosition, GSlidersSendRate);
			}
			if (GSendControlsSyncTimer) {
				clearInterval(GSendControlsSyncTimer);
				GSendControlsSyncTimer = setInterval(SyncControlsUpdate, GControlsSyncRate);
			}
			
			
		});
		
		this.draggableGroupSliderVolume.on('dragend', function() {

			
			
			clearInterval(GSendSliderPositionTimer);	
			SendSliderPosition(); // make sure last Slider value sent
			GSendSliderPositionTimer = null;	
			
		});
		
		this.layerSliderVolume.add(this.draggableGroupSliderVolume);
		this.updateSliderVolumePosition(); 
		
		this.setVolume = function(volume) {
			this.data.volume = volume;

			this.updateSliderVolumePosition();
			this.labelSliderVolume.text(volume.toString());
			this.labelSliderVolume.offsetX((this.labelSliderVolume.width() / 2));
			this.layerSliderVolume.draw();
		};
		
		// -- Volume slider 
		
		
		
		
		// ++ Volume scale 
		this.idScaleVolume = 'channelcontainer-scale-volume-' + this.data.name;
		$(this.jScaleVolume).attr('id', this.idScaleVolume);
		this.widthScaleVolume = $(this.jScaleVolume).width();
		this.heightScaleVolume = $(this.jScaleVolume).height();
		this.stageScaleVolume = new Konva.Stage({ container: _controllerContext.idScaleVolume, width: _controllerContext.widthScaleVolume, height: _controllerContext.heightScaleVolume });
        console.log('stage = 14');
        this.layerScaleVolume = new Konva.Layer();
		this.stageScaleVolume.add(this.layerScaleVolume);
		this.marginVerticalScaleVolume = this.heightScaleVolume * 0.0625;
		this.marginInternalScaleVolume = ampUi.globalSettings.volumeScaleMargin;;
		this.scaleVolumeBeginningY = Math.floor(this.marginVerticalScaleVolume); // Rounding may be better
		this.scaleVolumeEndingY = Math.ceil(this.heightScaleVolume - this.marginVerticalScaleVolume);
		this.scaleVolumeLeftX = this.marginInternalScaleVolume; 
		this.scaleVolumeRightX = this.widthScaleVolume - this.marginInternalScaleVolume;
		this.scaleVolumeMap = ampUi.math.createLinearMap_Inverted(this.heightScaleVolume, this.scaleVolumeBeginningY, this.scaleVolumeEndingY, ampUi.globalSettings.volumeScaleMinimum, 0);
		this.scaleVolumeStops = ampUi.globalSettings.volumeScaleStopsAt;
		this.scaleVolumeKonvaLines = []; // STATE
		for(var i = 0; i < this.scaleVolumeStops.length; i++) { // Volume scale lines
			var y = ampUi.math.getIndexOfClosestToInArray_Sequential(this.scaleVolumeStops[i], this.scaleVolumeMap) - 0.5;
			var scaleVolumeLine = new Konva.Line({ points: [_controllerContext.scaleVolumeLeftX, y, _controllerContext.scaleVolumeRightX, y], strokeWidth: 1 }); // stroke: scaleColor, 
			this.layerScaleVolume.add(scaleVolumeLine);
			this.scaleVolumeKonvaLines.push(scaleVolumeLine);
		}
		this.scaleVolumeFontSize = ampUi.globalSettings.volumeScaleNumberHeight;
		this.scaleVolumeNumbers = ampUi.globalSettings.volumeScaleNumbersAt;
		this.scaleVolumeKonvaNumbers = []; // STATE
		for(var i = 0; i < this.scaleVolumeNumbers.length; i++) { // Volume scale numbers 
			var y = ampUi.math.getIndexOfClosestToInArray_Sequential(this.scaleVolumeNumbers[i], this.scaleVolumeMap) - this.scaleVolumeFontSize / 2 - this.marginInternalScaleVolume;
			var label = new Konva.Label({ x: _controllerContext.scaleVolumeLeftX, y: y });
			label.add(new Konva.Tag({ fill: ampUi.colors.backgroundOrdinary }));
			var number = new Konva.Text({ 
				text: _controllerContext.scaleVolumeNumbers[i].toString(), 
				fontFamily: ampUi.globalSettings.fontOrdinary, 
				fontSize: _controllerContext.scaleVolumeFontSize,
				padding: _controllerContext.marginInternalScaleVolume
			})
			label.add(number);
			label.offsetX(-(this.widthScaleVolume / 2 - label.width() / 2 - this.marginInternalScaleVolume));
			this.layerScaleVolume.add(label);
			this.scaleVolumeKonvaNumbers.push(number);
		}

		// -- Volume scale 
		
		
		
		
		
		// ++ Meters static 
		this.widthMeter = $(this.jMeterL).width();
		this.heightMeter = $(this.jMeterL).height();
		
		
		this.idMeterL = 'channelcontainer-meter-l-' + this.data.name;
		$(this.jMeterL).attr('id', this.idMeterL);
		this.stageMeterL = new Konva.Stage({ container: _controllerContext.idMeterL, width: _controllerContext.widthMeter, height: _controllerContext.heightMeter });
        console.log('stage = 15');
        this.layerMeterL = new Konva.Layer();
		this.stageMeterL.add(this.layerMeterL);
		
		this.idMeterR = 'channelcontainer-meter-r-' + this.data.name;
		$(this.jMeterR).attr('id', this.idMeterR);
		this.stageMeterR = new Konva.Stage({ container: _controllerContext.idMeterR, width: _controllerContext.widthMeter, height: _controllerContext.heightMeter });
        console.log('stage = 16');
        this.layerMeterR = new Konva.Layer();
		this.stageMeterR.add(this.layerMeterR);
		
		this.rectangleMeterL = new Konva.Rect({ x: 0, y: 0, width: _controllerContext.widthMeter, height: _controllerContext.heightMeter });
		this.rectangleMeterR = new Konva.Rect({ x: 0, y: 0, width: _controllerContext.widthMeter, height: _controllerContext.heightMeter });
		
		this.lineMeterL = new Konva.Rect({ x: 0, y: 0, width: _controllerContext.widthMeter, height: ampUi.globalSettings.meterRectangleHeight });
		this.lineMeterR = new Konva.Rect({ x: 0, y: 0, width: _controllerContext.widthMeter, height: ampUi.globalSettings.meterRectangleHeight });
		
		this.layerMeterL.add(this.rectangleMeterL);
		this.layerMeterL.add(this.lineMeterL);
		
		this.layerMeterR.add(this.rectangleMeterR);
		this.layerMeterR.add(this.lineMeterR);
		
		this.mapMeter = ampUi.math.createLinearMap_Inverted(this.heightMeter, 0, this.heightMeter, ampUi.globalSettings.volumeScaleMinimum, 0);
		
		this.setMeterL = function(volumeL) {
			var yVolumeL = scIndexOfClosest(volumeL, _controllerContext.mapMeter);
			_controllerContext.rectangleMeterL.y(yVolumeL);
			_controllerContext.rectangleMeterL.draw();
		};
		this.setMeterR = function(volumeR) {
			var yVolumeR = scIndexOfClosest(volumeR, _controllerContext.mapMeter);
			_controllerContext.rectangleMeterR.y(yVolumeR);
			_controllerContext.rectangleMeterR.draw();
		};
		
		//var yVolumeR = scIndexOfClosest(volumeR, _controllerContext.mapMeter);
		
		// -- Meters static 
		
		
		
		
		
		
		// ++ Meter animation (from 0 to -96)
		/*
		this.widthMeter = $(this.jMeterL).width();
		this.heightMeter = $(this.jMeterL).height();
		
		
		this.idMeterL = 'channelcontainer-meter-l-' + this.data.name;
		$(this.jMeterL).attr('id', this.idMeterL);
		this.stageMeterL = new Konva.Stage({ container: _controllerContext.idMeterL, width: _controllerContext.widthMeter, height: _controllerContext.heightMeter });
		this.layerMeterL = new Konva.Layer();
		this.stageMeterL.add(this.layerMeterL);
		
		this.idMeterR = 'channelcontainer-meter-r-' + this.data.name;
		$(this.jMeterR).attr('id', this.idMeterR);
		this.stageMeterR = new Konva.Stage({ container: _controllerContext.idMeterR, width: _controllerContext.widthMeter, height: _controllerContext.heightMeter });
		this.layerMeterR = new Konva.Layer();
		this.stageMeterR.add(this.layerMeterR);
		
		this.rectangleMeterL = new Konva.Rect({ x: 0, y: 0, width: _controllerContext.widthMeter, height: _controllerContext.heightMeter });
		this.rectangleMeterR = new Konva.Rect({ x: 0, y: 0, width: _controllerContext.widthMeter, height: _controllerContext.heightMeter });
		
		this.lineMeterL = new Konva.Rect({ x: 0, y: 0, width: _controllerContext.widthMeter, height: ampUi.globalSettings.meterRectangleHeight });
		this.lineMeterR = new Konva.Rect({ x: 0, y: 0, width: _controllerContext.widthMeter, height: ampUi.globalSettings.meterRectangleHeight });
		
		this.layerMeterL.add(this.rectangleMeterL);
		this.layerMeterL.add(this.lineMeterL);
		
		this.layerMeterR.add(this.rectangleMeterR);
		this.layerMeterR.add(this.lineMeterR);
		
		this.mapMeter = ampUi.math.createLinearMap_Inverted(this.heightMeter, 0, this.heightMeter, ampUi.globalSettings.volumeScaleMinimum, 0);

		this.meterVelocity = this.heightMeter + this.heightMeter / 2;
		
		this.frameResetMeterL = false;
		this.frameResetMeterR = false;
		
		this.frameResetLineL = false;
		this.frameResetLineR = false;
		
		this.yLastMeterL = this.heightMeter;
		this.yLastMeterR = this.heightMeter;
		
		this.yLastMeterLineL = this.heightMeter;
		this.yLastMeterLineR = this.heightMeter;
		
		this.peakReachedL = false;
		this.peakReachedR = false;
		
		this.animationMeterL = new Konva.Animation(function(frame) {
			if(_controllerContext.frameResetMeterL) {
				frame.time = 0;
				_controllerContext.frameResetMeterL = false;
			}
			var yMeter = _controllerContext.yLastMeterL + _controllerContext.meterVelocity * (frame.time / 1000);
			_controllerContext.rectangleMeterL.y(yMeter);
			
		}, this.layerMeterL);
		this.animationMeterL.start();
	
		this.animationLineL = new Konva.Animation(function(frame) {
			if(_controllerContext.frameResetLineL) {
				frame.time = 0;
				_controllerContext.frameResetLineL = false;
			}
			var yLine = _controllerContext.yLastMeterLineL + _controllerContext.meterVelocity * (frame.time / 4000);
			_controllerContext.lineMeterL.y(yLine);
			
		}, this.layerMeterL);
		this.animationLineL.start();	
		
		//
		
		this.animationMeterR = new Konva.Animation(function(frame) {
			if(_controllerContext.frameResetMeterR) {
				frame.time = 0;
				_controllerContext.frameResetMeterR = false;
			}
			var yMeter = _controllerContext.yLastMeterR + _controllerContext.meterVelocity * (frame.time / 1000);
			_controllerContext.rectangleMeterR.y(yMeter);
			
		}, this.layerMeterR);
		this.animationMeterR.start();
	
		this.animationLineR = new Konva.Animation(function(frame) {
			if(_controllerContext.frameResetLineR) {
				frame.time = 0;
				_controllerContext.frameResetLineR = false;
			}
			var yLine = _controllerContext.yLastMeterLineR + _controllerContext.meterVelocity * (frame.time / 4000);
			_controllerContext.lineMeterR.y(yLine);
			
		}, this.layerMeterR);
		this.animationLineR.start();	
	
		

		
		
		var play = setInterval(function() { 
			if(_controllerContext.data.active) {
				var volumeL = ampUi.math.getRandom(-96, 0) + _controllerContext.data.volume - (_controllerContext.data.pan / 5);
				var volumeR = ampUi.math.getRandom(-96, 0) + _controllerContext.data.volume + (_controllerContext.data.pan / 5);
				
				var yVolumeL = scIndexOfClosest(volumeL, _controllerContext.mapMeter);
				var yVolumeR = scIndexOfClosest(volumeR, _controllerContext.mapMeter);
				
				if(volumeL >= 0) {
					_controllerContext.peakReachedL = true;
					$(_controllerContext.jPeakL).css({ 'background-color': _controllerContext.color.background, 'color':  _controllerContext.color.foreground })
				} else {
					if(_controllerContext.peakReachedL) {
						_controllerContext.peakReachedL = false;
						$(_controllerContext.jPeakL).css({ 'background-color': ampUi.colors.backgroundOrdinary, 'color': ampUi.colors.channelControlOff });
					}
				}
				//
				if(volumeR >= 0) {
					_controllerContext.peakReachedR = true;
					$(_controllerContext.jPeakR).css({ 'background-color': _controllerContext.color.background, 'color':  _controllerContext.color.foreground })
				} else {
					if(_controllerContext.peakReachedR) {
						_controllerContext.peakReachedR = false;
						$(_controllerContext.jPeakR).css({ 'background-color': ampUi.colors.backgroundOrdinary, 'color': ampUi.colors.channelControlOff });
					}
				}
				
				if(yVolumeL < _controllerContext.rectangleMeterL.y()) {
					_controllerContext.rectangleMeterL.y(yVolumeL);
					_controllerContext.yLastMeterL = yVolumeL;
					//_controllerContext.rectangleMeterL.y(20);
					_controllerContext.frameResetMeterL = true;
				}
				
				if(yVolumeL < _controllerContext.lineMeterL.y()) {
					_controllerContext.lineMeterL.y(yVolumeL);
					_controllerContext.yLastMeterLineL = yVolumeL;
					//_controllerContext.rectangleMeterL.y(20);
					_controllerContext.frameResetLineL = true;
				}
				
				
				//
				if(yVolumeR < _controllerContext.rectangleMeterR.y()) {
					_controllerContext.rectangleMeterR.y(yVolumeR);
					_controllerContext.yLastMeterR = yVolumeR;
					//_controllerContext.rectangleMeterL.y(20);
					_controllerContext.frameResetMeterR = true;
				}
				
				if(yVolumeR < _controllerContext.lineMeterR.y()) {
					_controllerContext.lineMeterR.y(yVolumeR);
					_controllerContext.yLastMeterLineR = yVolumeR;
					//_controllerContext.rectangleMeterL.y(20);
					_controllerContext.frameResetLineR = true;
				}
				
			} else {
				
				//animationLine.stop();	
			}
		}, 200);
		
		*/
		// -- Meter animation 
		
		
		
		this.setChannelOn = function() {
			$(this.jLblPanL).css({ 'color': _controllerContext.color.background }); // Pan labels
			$(this.jLblPanR).css({ 'color': _controllerContext.color.background });
			
			this.labelSliderPan.fill(this.color.background); // Pan slider
			this.rectangleSliderPan.stroke(this.color.background);
			this.layerSliderPan.draw();
			
			this.labelSliderVolume.fill(this.color.background); // Volume slider
			this.rectangleSliderVolume.stroke(this.color.background);
			this.layerSliderVolume.draw();
			
			for(var item in this.scaleVolumeKonvaLines) this.scaleVolumeKonvaLines[item].stroke(this.color.background); // Volume scale 
			for(var item in this.scaleVolumeKonvaNumbers) this.scaleVolumeKonvaNumbers[item].fill(this.color.background);
			this.layerScaleVolume.draw();
			
			$(this.jLblNumber).css({ 'background-color': _controllerContext.color.background, 'color': _controllerContext.color.foreground }); // Footer labels
			$(this.jLblName).css({ 'background-color': ampUi.colors.backgroundOrdinary, 'color': _controllerContext.color.background });
			
			$(this.jLblMeterL).css({ 'color': _controllerContext.color.background }); // Meter labels
			$(this.jLblMeterR).css({ 'color': _controllerContext.color.background });
			
			this.rectangleMeterL.fill(_controllerContext.color.background); // Meter L
			this.lineMeterL.fill(_controllerContext.color.background);
			
			this.rectangleMeterR.fill(_controllerContext.color.background); // Meter R
			this.lineMeterR.fill(_controllerContext.color.background);
			
			$(this.jBtnEq).css({ 'color': _controllerContext.color.background }); // EQ
			$(this.jBtnMute).css({ 'background-color': _controllerContext.color.background,  'color': _controllerContext.color.foreground  }); // Mute
		};
		
		this.setChannelOff = function() {
			$(this.jLblPanL).css({ 'color': ampUi.colors.channelControlOff }); // Pan labels
			$(this.jLblPanR).css({ 'color': ampUi.colors.channelControlOff });
			
			this.labelSliderPan.fill(ampUi.colors.channelControlOff); // Pan slider
			this.rectangleSliderPan.stroke(ampUi.colors.channelControlOff);
			this.layerSliderPan.draw();
			
			this.labelSliderVolume.fill(ampUi.colors.channelControlOff); // Volume slider
			this.rectangleSliderVolume.stroke(ampUi.colors.channelControlOff);
			this.layerSliderVolume.draw();
			
			for(var item in this.scaleVolumeKonvaLines) this.scaleVolumeKonvaLines[item].stroke(ampUi.colors.channelControlOff); // Volume scale 
			for(var item in this.scaleVolumeKonvaNumbers) this.scaleVolumeKonvaNumbers[item].fill(ampUi.colors.channelControlOff);
			this.layerScaleVolume.draw();
			
			
			$(this.jLblNumber).css({ 'background-color': ampUi.colors.backgroundOrdinary, 'color': ampUi.colors.channelControlOff }); // Footer labels
			$(this.jLblName).css({ 'background-color': ampUi.colors.backgroundOrdinary, 'color': ampUi.colors.channelControlOff });
			
			$(this.jLblMeterL).css({ 'color': ampUi.colors.channelControlOff }); // Meter labels
			$(this.jLblMeterR).css({ 'color': ampUi.colors.channelControlOff });
			
			this.rectangleMeterL.fill(ampUi.colors.channelControlOff); // Meter L
			this.lineMeterL.fill(ampUi.colors.channelControlOff);
			
			this.rectangleMeterR.fill(ampUi.colors.channelControlOff); // Meter R
			this.lineMeterR.fill(ampUi.colors.channelControlOff);
			
			$(this.jBtnEq).css({ 'color': ampUi.colors.channelControlOff }); // EQ 
			$(this.jBtnMute).css({ 'background-color': ampUi.colors.backgroundOrdinary,  'color': _controllerContext.color.background  }); // Mute
		};

		this.setActive = function(active) {
			_controllerContext.data.active = active;
			if(_controllerContext.data.active) _controllerContext.setChannelOn();
			else _controllerContext.setChannelOff();
			
			
		};
		
		$(this.jBtnMute).click(function() {
			_controllerContext.setActive(!_controllerContext.data.active);
			
			//clearInterval(GSendSliderPositionTimer);	
			//SendSliderPosition(); // make sure last Slider value sent
			//GSendSliderPositionTimer = null;	
			
			
			
			FaderServerRequestSend("mu" + _controllerContext.data.index, _controllerContext.data.active);
			
			/*
			_controllerContext.data.active = !_controllerContext.data.active;
			if(_controllerContext.data.active) _controllerContext.setChannelOn();
			else _controllerContext.setChannelOff();
			*/
		});
		
		//show, hide
	};
	// -- Channel controller 
	
	//http://localhost:8000/ | 974 
	
	
	function ServerResponseReceive(response) {
		//console.log('server response received');
		
		var responseData = response.data;
		//console.log(responseData);
		
		if (scQueryValue(responseData, "status") == "meters") //if "status" variable of received string is "meters"
		{
			for (var i = 0; i < channelControllers.length; i++) //iterate all the channels 
			{
				var controller = channelControllers[i];
				var meterLeftValue = scServerMeterToClient(responseData.charCodeAt(i * 2 + 14));
				var meterRightValue = scServerMeterToClient(responseData.charCodeAt(i * 2 + 15));
				controller.setMeterL(meterLeftValue);
				controller.setMeterR(meterRightValue);
			}
		}
		if (scQueryValue(responseData, "status") == "controls")
		{			
			// No Controls sync while Slider values are changed: GSendSliderPositionTimer is on 
			if (!GSendSliderPositionTimer)
			{
				//console.log("Starting controls sync");
				for (var i = 0; i < channelControllers.length; i++)
				{			
				
				}
			}
		}	
	};
	
	// ++ Loading channels controllers
	var channelControllers = [];
	var html = $(".channelcontainer").detach();
	for(var i = 0; i </*5; i++) {*/	channels.length; i++) {
		var channelController = new ChannelController($(html).clone(),channels[i]);
		channelControllers.push(channelController);		
		channelController.setChannelOn();
		//channelController.setChannelOff();
	}
});


$(window).on("load", function () {
    var envarray = ['Mixing Plateform', 'Equalizer Plateform'];
    var bSelectedMix = false;

    var envselector = document.getElementById('envsel');
    for (var i = 0; i < envarray.length; i++) {
        envselector.remove(envselector.i);
    }

    for (var i = 0; i < envarray.length; i++) {
        var enventry = envarray[i];
        var option = document.createElement('option');
        option.value = i;
        option.text = enventry;
        envselector.add(option);
    }
    envselector.selectedIndex = 1;
    envselector.onchange = function () {
        bSelectedMix = (!bSelectedMix);
        if (bSelectedMix) {
            window.open("main.html", "_self");
        } else {
            window.open("equalizer.html", "_self");
        }
    };
});

