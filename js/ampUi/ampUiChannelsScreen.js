$(document).ready(function() {
	// ++ Channels data
	var channelsData = [
	{
		number: '04', name: 'guitar', readableName: 'Guitar', info: 'This is some awesome channel to be edited in awesome interface', gain: 23, pan: -32,
		filters: {
			highPass: { frequency: 15, gain: 0, quality: 1, active: true },
			lowShelf: { frequency: 40, gain: 0, quality: 1, active: false },
			peakOne: { frequency: 100, gain: 0, quality: 1, active: true },
			peakTwo: { frequency: 200, gain: 0, quality: 1, active: true },
			peakThree: { frequency: 400, gain: 0, quality: 1, active: true },
			peakFour: { frequency: 2000, gain: 0, quality: 1, active: false },
			highShelf: { frequency: 7000, gain: 0, quality: 1, active: true },
			lowPass: { frequency: 10000, gain: 0, quality: 1, active: true }
		},
		active: true 
	},
	{ number: '18', name: 'bass', readableName: 'Bass', info: 'It is even being heard', gain: 13, pan: -67, filters: { }, active: true },
	{ number: '95', name: 'drums', readableName: 'Drums', info: 'Live recorded', gain: -15, pan: 49, filters: { }, active: true },
	{ number: '67', name: 'air', readableName: 'Air', info: 'Some space for the mix', gain: 15, pan: 8, filters: { }, active: true },
	{ number: '41', name: 'vocals',readableName: 'Vocals', info: 'Vocals channel is also there', gain: -7, pan: -14, filters: { },active: true }];
	// -- Channels data
	
	// ++ Channel sound object 
	ampUi.ChannelSound = function() {
		this.run = function(leftVolumeChangedCallback, rightVolumeChangedCallback) {
			var minVolume = ampUi.globalSettings.volumeScaleMinimum;
			var getRandom = ampUi.math.getRandom;
			var getValue = function() { return getRandom(minVolume, 0); };
			
			var timerId = setInterval(function() {
				leftVolumeChangedCallback(getValue());
			}, 200);
			
			var timerId = setInterval(function() {
				rightVolumeChangedCallback(getValue());
			}, 200);
		};
	};
	//var sound = new ampUi.ChannelSound();
	//sound.run(function(value) { console.log('L ' + value); }, function(value) { console.log('R ' + value); });
	// -- Channel sound object 
	/*
	ampUi.ChannelController = function(htmlBlank, channelData) {
		var _channelControllerContext = this;
		this.html = htmlBlank;
		this.data = channelData;
		(function(){
			$(_channelControllerContext.html).appendTo("#channelsrow");
		})();
	};
	
	var htmlBlank = $(".channelcontainer").detach();
	var channelControllers = [];
	for(var i = 0; i < channelsData.length; i++) {
		channelControllers.push(new ampUi.ChannelController($(htmlBlank).clone(), channelsData[i]));
	}
	*/
	

	
	var channelsColors = ampUi.colors.channels;
	
	var channelContainerBlank = $(".channelcontainer");
	$(channelContainerBlank).detach();
	
	
	for(var i = 0; i < channelsData.length; i++) {
		var channel = channelsData[i];
		var color = channelsColors[i];
		
		var channelContainer = $(channelContainerBlank).clone();
		$(channelContainer).appendTo("#channelsrow");
		$(channelContainer).find('.channelcontainer-label-number').css({'background-color': color.background, 'color': color.foreground }).text(channel.number);
		$(channelContainer).find('.channelcontainer-label-name').css({'background-color': ampUi.colors.backgroundOrdinary, color: color.background }).text(channel.readableName);
		$(channelContainer).find('.channelcontainer-label-pan-l').css({'background-color': ampUi.colors.backgroundOrdinary, color: color.background });
		$(channelContainer).find('.channelcontainer-label-pan-r').css({'background-color': ampUi.colors.backgroundOrdinary, color: color.background });
		$(channelContainer).find('.channelcontainer-label-meter-l').css({'background-color': ampUi.colors.backgroundOrdinary, color: color.background });
		$(channelContainer).find('.channelcontainer-label-meter-r').css({'background-color': ampUi.colors.backgroundOrdinary, color: color.background });
		
		// Volume scale 
		
		var jScaleContainer = $(channelContainer).find('.channelcontainer-scale-volume');
		var scaleContainerId = 'channelcontainer-scale-volume-' + channel.name;
		$(jScaleContainer).attr('id', scaleContainerId);
		var scaleWidth = $(jScaleContainer).width();
		var scaleHeight = $(jScaleContainer).height(); 

		
		var volumeScaleStage = new Konva.Stage({
			container: scaleContainerId,
			width: scaleWidth,
			height: scaleHeight
        });
        console.log('stage = 1');
		var scaleLayer = new Konva.Layer();
		
		
		
		
		var scaleVerticalMargin = scaleHeight * 0.0625;
		
		var margin = ampUi.globalSettings.volumeScaleMargin;
		
		var scaleBeginningY = Math.round(scaleVerticalMargin);
		var scaleEndingY = Math.round(scaleHeight - scaleVerticalMargin);
		
		var scaleLeftX = margin; 
		var scaleRightX = scaleWidth - margin;
		
		var scaleMap = ampUi.math.createLinearMap_Inverted(scaleHeight, scaleBeginningY, scaleEndingY, ampUi.globalSettings.volumeScaleMinimum, 0);
		var scaleStops = ampUi.globalSettings.volumeScaleStopsAt;
		var getY = ampUi.math.getIndexOfClosestToInArray_Sequential;
		var scaleColor = color.background;

		for(var j = 0; j < scaleStops.length; j++) {
			var y = ampUi.math.getIndexOfClosestToInArray_Sequential(scaleStops[j], scaleMap) - 0.5;
			console.log(y);
			var scaleLine = new Konva.Line({
				points: [scaleLeftX, y, scaleRightX, y],
				stroke: scaleColor, // SCALE COLOR
				strokeWidth: 1
			});
			scaleLayer.add(scaleLine);
		}
		var fontSize = ampUi.globalSettings.volumeScaleNumberHeight;
		var scaleNumbers = ampUi.globalSettings.volumeScaleNumbersAt;
		for(var k = 0; k < scaleNumbers.length; k++) {
			var y = ampUi.math.getIndexOfClosestToInArray_Sequential(scaleNumbers[k], scaleMap) - fontSize / 2 - margin - 0.5;
			var simpleLabel = new Konva.Label({
				x: scaleLeftX,
				y: y
			});
				simpleLabel.add(
					new Konva.Tag({
					  fill: ampUi.colors.backgroundOrdinary
					})
				  );
				  simpleLabel.add(
			new Konva.Text({
			  text: scaleNumbers[k].toString(),
			  fontFamily: ampUi.globalSettings.fontOrdinary,
			  fontSize: fontSize,
			  fill: scaleColor,
			  padding: margin
			})
		  );
			simpleLabel.offsetX(-(scaleWidth / 2 - simpleLabel.width() / 2 - margin));
			
			scaleLayer.add(simpleLabel);
		}

		volumeScaleStage.add(scaleLayer);
		
		
		
		
		
		// Volume slider 
		
		var jVolumeSliderContainer = $(channelContainer).find('.channelcontainer-slider-volume');
		var volumeSliderContainerId = 'channelcontainer-slider-volume-' + channel.name;
		
		$(jVolumeSliderContainer).attr('id', volumeSliderContainerId);
		var volumeSliderWidth = $(jVolumeSliderContainer).width();
		var volumeSliderHeight = $(jVolumeSliderContainer).height(); 
		
		var volumeSliderStage = new Konva.Stage({
			container: volumeSliderContainerId,
			width: volumeSliderWidth,
			height: volumeSliderHeight
        });
        console.log('stage = 2');
		var volumeSliderLayer = new Konva.Layer();
		volumeSliderStage.add(volumeSliderLayer);
		
		/*
		var volumeSliderBackground = new Konva.Rect({ // bg
			width: volumeSliderWidth,
			height: volumeSliderHeight,
			fill: ampUi.colors.volumeSliderBackground
		});
		volumeSliderLayer.add(volumeSliderBackground);
		*/
		
		var volumeRegulatorWidth = volumeSliderWidth - ampUi.globalSettings.volumeSliderStrokeWidth;
		var volumeRegulatorHeight = volumeSliderWidth / 2 - ampUi.globalSettings.volumeSliderStrokeWidth;
		
		var sliderBeginningY = 0;
		var sliderEndingY = volumeSliderHeight - volumeRegulatorHeight - ampUi.globalSettings.volumeSliderStrokeWidth;
		
		var volumeSliderMap = ampUi.math.createLinearMap_Inverted(volumeSliderHeight, sliderBeginningY, sliderEndingY, ampUi.globalSettings.volumeMin, ampUi.globalSettings.volumeMax);
		
		var volumeSliderNumbers = ampUi.globalSettings.volumeSliderNumbersAt;
		
		var volumeSliderFontSize = volumeRegulatorHeight / 2;
		
		for(var m = 0; m < volumeSliderNumbers.length; m++) {
			var y1 = Number(ampUi.math.getIndexOfClosestToInArray_Sequential(volumeSliderNumbers[m], volumeSliderMap)) + volumeSliderFontSize / 2 + ampUi.globalSettings.volumeSliderStrokeWidth / 2;
			var number = new Konva.Text({
				x: 0,
				y: y1,
			  text: volumeSliderNumbers[m].toString(),
			  fontFamily: ampUi.globalSettings.fontOrdinary,
			  fontSize: volumeSliderFontSize,
			  fill: ampUi.colors.equalizerGrid
			});
			number.offsetX(-(volumeSliderWidth / 2 - number.width() / 2));
			console.log("n " +  volumeSliderNumbers[m]);
			volumeSliderLayer.add(number);
		}
		
		var volumeSliderDraggableGroup = new Konva.Group({ // Create a group, which will accept all the draggable controls 
			x: 0,
			y: 0,
			draggable: true,
			opacity: 1,
			dragBoundFunc: function(cursorPosition) {
				var y = cursorPosition.y;
				var x = this.absolutePosition().x;
				if(y < 0) y = 0;
				if(y > volumeSliderHeight - volumeRegulatorHeight - ampUi.globalSettings.volumeSliderStrokeWidth) y = volumeSliderHeight - volumeRegulatorHeight - ampUi.globalSettings.volumeSliderStrokeWidth;
				return { x: x, y: y };
			}
		});
		
		var volumeSliderRectangle = new Konva.Rect({ // Volume recangle 
			x: ampUi.globalSettings.volumeSliderStrokeWidth / 2,
			y: ampUi.globalSettings.volumeSliderStrokeWidth / 2,
			width: volumeRegulatorWidth,
			height: volumeRegulatorHeight,
			strokeWidth: ampUi.globalSettings.volumeSliderStrokeWidth,
			stroke: color.background
		});
		
		var volumeSliderLabel = new Konva.Text({
			x: volumeSliderWidth / 2,
			y: volumeSliderWidth / 4,
			fontSize: volumeSliderFontSize,
			fontFamily: 'Segoe UI',
			text: channel.gain,
			fill: color.background
		});
		volumeSliderLabel.offsetX(volumeSliderLabel.width() / 2);
		volumeSliderLabel.offsetY(volumeSliderLabel.height() / 2);
		volumeSliderDraggableGroup.add(volumeSliderRectangle);
		volumeSliderDraggableGroup.add(volumeSliderLabel);
		
		volumeSliderDraggableGroup.label = volumeSliderLabel;
		
		volumeSliderDraggableGroup.on('dragmove', function() { // Bind external callback for scale moving event
			var value = volumeSliderMap[Math.round(this.position().y) + sliderBeginningY];
			this.label.text(Math.round(value)+'');
			this.label.offsetX((this.label.width()/2));
			console.log(Math.round(value));
		});
		
		volumeSliderLayer.add(volumeSliderDraggableGroup);
		
		
		
		// Pan slider 
		
		var jPanSliderContainer = $(channelContainer).find('.channelcontainer-slider-pan');
		var panSliderContainerId = 'channelcontainer-slider-pan-' + channel.name;
		
		$(jPanSliderContainer).attr('id', panSliderContainerId);
		var panSliderWidth = $(jPanSliderContainer).width();
		var panSliderHeight = $(jPanSliderContainer).height(); 
		
		var panSliderStage = new Konva.Stage({
			container: panSliderContainerId,
			width: panSliderWidth,
			height: panSliderHeight
        });
        console.log('stage = 3');
		var panSliderLayer = new Konva.Layer();
		panSliderStage.add(panSliderLayer);
		
		var panRegulatorWidth = panSliderHeight - ampUi.globalSettings.panSliderStrokeWidth;
		var panRegulatorHeight = panRegulatorWidth; //panSliderWidth / 2 - ampUi.globalSettings.panSliderStrokeWidth;
		
		var panSliderBeginningX = 0;
		var panSliderEndingX = panSliderWidth - panRegulatorWidth - ampUi.globalSettings.panSliderStrokeWidth;
		
		var panSliderMap = ampUi.math.createLinearMap(panSliderWidth, panSliderBeginningX, panSliderEndingX, ampUi.globalSettings.panMin, ampUi.globalSettings.panMax);
		
		var panSliderFontSize = panRegulatorHeight / 4;
		
		
		var panSliderDraggableGroup = new Konva.Group({ // Create a group, which will accept all the draggable controls 
			x: 0,
			y: 0,
			draggable: true,
			opacity: 1,
			dragBoundFunc: function(cursorPosition) {
				var y = this.absolutePosition().y; 
				var x = cursorPosition.x;
				if(x < 0) x = 0;
				if(x > panSliderWidth - panRegulatorWidth - ampUi.globalSettings.panSliderStrokeWidth) x = panSliderWidth - panRegulatorWidth - ampUi.globalSettings.panSliderStrokeWidth;
				return { x: x, y: y };
			}
		});
		
		var panSliderRectangle = new Konva.Rect({ // Pan recangle 
			x: ampUi.globalSettings.panSliderStrokeWidth / 2,
			y: ampUi.globalSettings.panSliderStrokeWidth / 2,
			width: panRegulatorWidth,
			height: panRegulatorHeight,
			strokeWidth: ampUi.globalSettings.panSliderStrokeWidth,
			stroke: color.background
		});
		
		var panSliderLabel = new Konva.Text({
			x: panSliderHeight / 2,
			y: panSliderHeight / 4,
			fontSize: panSliderFontSize,
			fontFamily: 'Segoe UI',
			text: channel.gain,
			fill: color.background
		});
		panSliderLabel.offsetX(panSliderLabel.width() / 2);
		panSliderLabel.offsetY(panSliderLabel.height() / 2);
		panSliderDraggableGroup.add(panSliderRectangle);
		panSliderDraggableGroup.add(panSliderLabel);
		
		panSliderDraggableGroup.label = panSliderLabel;
		
		panSliderDraggableGroup.on('dragmove', function() { // Bind external callback for scale moving event
			var value = panSliderMap[Math.round(this.position().x) + panSliderBeginningX];
			this.label.text(Math.round(value)+'');
			this.label.offsetX((this.label.width()/2));
			console.log(Math.round(value));
		});
		panSliderLayer.add(panSliderDraggableGroup);
		
		
		
		
		// Meters 
		
		var jMeterContainer = $(channelContainer).find('.channelcontainer-meter-left');
		var meterContainerId = 'channelcontainer-meter-left-' + channel.name;
		$(jMeterContainer).attr('id', meterContainerId);
		
		var meterWidth = $(jMeterContainer).width();
		var meterHeight = $(jMeterContainer).height(); 
		
		var meterStage = new Konva.Stage({
			container: meterContainerId,
			width: meterWidth,
			height: meterHeight
        });
        console.log('stage = 4');
		var meterLayer = new Konva.Layer();
		meterStage.add(meterLayer);
		
		var meterMap = ampUi.math.createLinearMap_Inverted(meterHeight, 0, meterHeight, ampUi.globalSettings.volumeScaleMinimum, 0);
		
		var meterRectangle = new Konva.Rect({ // Pan recangle 
			x: 0,
			y: 0,
			width: meterWidth,
			height: meterHeight,
			fill: color.background
		});
		meterLayer.add(meterRectangle);
		
		
		
		
		// Meters  2
		
		var jMeterContainer2 = $(channelContainer).find('.channelcontainer-meter-right');
		var meterContainerId2 = 'channelcontainer-meter-right-' + channel.name;
		$(jMeterContainer2).attr('id', meterContainerId2);
		
		var meterWidth2 = $(jMeterContainer2).width();
		var meterHeight2 = $(jMeterContainer2).height(); 
		
		var meterStage2 = new Konva.Stage({
			container: meterContainerId2,
			width: meterWidth2,
			height: meterHeight2
        });
        console.log('stage = 5');
		var meterLayer2 = new Konva.Layer();
		meterStage2.add(meterLayer2);
		
		//var meterMap = ampUi.math.createLinearMap_Inverted(meterHeight, 0, meterHeight, ampUi.globalSettings.volumeScaleMinimum, 0);
		
		var meterRectangle2 = new Konva.Rect({ // Pan recangle 
			x: 0,
			y: 0,
			width: meterWidth2,
			height: meterHeight2,
			fill: color.background
		});
		meterLayer2.add(meterRectangle2);
		
		
		
		meterStage.draw();
		
		meterStage2.draw();
		
		panSliderStage.draw();
		
		volumeSliderStage.draw();
		
		
		volumeScaleStage.draw();
	
		
		
		
		
		
		
		// ampUi.math.createLinearMap_Inverted = function(arrayLength, beginningMapIndex, endingMapIndex, minValue, maxValue)
		
		
		
		
		
		
		//$(channelContainer).find('.channelcontainer-label-pan-l').css({'color': channel.color });
		//$(channelContainer).find('.channelcontainer-label-pan-r').css({'color': channel.color });
		
		//$(channelContainer).find('.channelcontainer-button-equalizer').css({'color': channel.color });
		//.channelcontainer-label-pan-l
		
		
	}
	
	
	
	
	/*
	var clone2 = $(channelContainerBlank).clone();
	var clone3 = $(channelContainerBlank).clone();
	
	$(clone).appendTo("#channelsrow");
	$(clone2).appendTo("#channelsrow");
	$(clone3).appendTo("#channelsrow");
	*/
	
	//$("#channelsrow").add(clone);
	//$("#channelsrow").add(clone);
	
}); 