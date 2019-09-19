$( document ).ready(function() {

		
			// Dimensions of container to draw canvas 
			var eqContainerWidth = $("#eqContainer").width(); 
			var eqContainerHeight = $("#eqContainer").height();
			
			
			
			var dbThreshold = 12; // dB scale is linear and symmetric 
			var zeroDbY = eqContainerHeight / 2; // Zero dB value is in the middle 
			var stepDbMultiplier = zeroDbY / dbThreshold; // This is to calculate pixelwise step
			var getDbYForGain = function(dbGain) {
				return zeroDbY - dbGain * stepDbMultiplier; // Y on canvas is from top to bottom
			};
			var getDbGainOfY = function(dbY) { // BETTER TO REFACTOR TO CONST FOR PIXELS
				return (zeroDbY - dbY) / stepDbMultiplier;
			};
			var minFrequency = 10;
			var maxFrequency = 22050; // Max frequency should correspond to that in human hearing
			var sampleRate = 44100;
			var frequencyStopsAmount = Math.round(eqContainerWidth);
			var frequenciesStops = Array(frequencyStopsAmount); // Represents logarithmic frequencies scale (related to window width) 
			for(var i = 0; i < frequencyStopsAmount; i++) { // Frequencies stops values 
				frequenciesStops[i] = Math.pow(10, (Math.log10(maxFrequency - minFrequency) / eqContainerWidth * i)) + minFrequency;
			}
			// ++ Find closest frequency item index in EQ points array
			var findClosestFrequencyIndex = function(desiredFrequencyHz) {
				var middleIndex;
				var lowIndex = 0;
				var highIndex = frequenciesStops.length - 1;
				while (highIndex - lowIndex > 1) {
					middleIndex = Math.floor((lowIndex + highIndex) / 2);
					if (frequenciesStops[middleIndex] < desiredFrequencyHz) {
						lowIndex = middleIndex;
					} else {
						highIndex = middleIndex;
					}
				}
				if (desiredFrequencyHz - frequenciesStops[lowIndex] <= frequenciesStops[highIndex] - desiredFrequencyHz) {
					return lowIndex;
				}
				return highIndex;
			};
			// ++ Find closest frequency item index in EQ points array
			
			
			// Each band of equalizer is a set of frequencies according to amplitude
			// All of them should be calculated separately and them sum together
			// Aliases correspond to that in BiQuadFilter.js
			// LOWPASS, HIGHPASS, BANDPASS, PEAK, NOTCH, LOWSHELF, HIGHSHELF
			var eqFiltersMatrices = { };
			eqFiltersMatrices.LOWPASS = Array(frequencyStopsAmount).fill(0);
			eqFiltersMatrices.LOWSHELF = Array(frequencyStopsAmount).fill(0);
			eqFiltersMatrices.PEAK1 = Array(frequencyStopsAmount).fill(0);
			eqFiltersMatrices.PEAK2 = Array(frequencyStopsAmount).fill(0);
			eqFiltersMatrices.PEAK3 = Array(frequencyStopsAmount).fill(0);
			eqFiltersMatrices.PEAK4 = Array(frequencyStopsAmount).fill(0);
			eqFiltersMatrices.HIGHPASS = Array(frequencyStopsAmount).fill(0);
			eqFiltersMatrices.HIGHSHELF = Array(frequencyStopsAmount).fill(0);
			eqFiltersMatrices.updateSingleMatrix = function(filterName, frequency, q, gain) { // Apply new values to certain filter
				// Get corresponding enumeration value from the library 
				var numericFilterType = BiQuadFilter[filterName.replace(/[0-9]/g, '')];
				// Select target matrix 
				var targetMatrix = this[filterName];
				// Create filter
				BiQuadFilter.create(numericFilterType, frequency, sampleRate, q, gain);
				// Update frequencies gain values
				for(var i = 0; i < frequencyStopsAmount; i++) {
					targetMatrix[i] = BiQuadFilter.log_result(frequenciesStops[i]);
				}
			};
			eqFiltersMatrices.getResultMatrix = function() {
				var sumMatrix = Array(frequencyStopsAmount).fill(parseInt(0));
				for(var i = 0; i < frequencyStopsAmount; i++) {
					sumMatrix[i] += 
						this.LOWPASS[i] +
						this.LOWSHELF[i] +
						this.PEAK1[i] +
						this.PEAK2[i] +
						this.PEAK3[i] +
						this.PEAK4[i] +
						this.HIGHPASS[i] +
						this.HIGHSHELF[i];
				}
				return sumMatrix;
			};
			
			
			
			
			
			
			
			
			
			
			// This object contains all that is needed to handle controls and drawing 
			var konvaUi = {};
			konvaUi.getLineFromFilterMatrix = function(filterMatrix) {
				// Konva accepts line as [x0,y0,x1,y1...]
				var konvaLine = []; 
				for(var i = 0; i < frequencyStopsAmount; i++) {
					konvaLine.push(i); // X
					konvaLine.push(Math.round(getDbYForGain(filterMatrix[i]))); // Y
				}
				return konvaLine;
			};
			konvaUi.alignFrequenciesScale = function() {
				var previousFrequency = minFrequency;
				var elements = $(".frequency");
				$(elements).each(function(i, item) {
					// Find which pixel on canvas is corresponding for certain frequency
					var currentFrequency = $(this).data().frequency; // 1. Find current frequency 
					
					var nextFrequency = maxFrequency; // 2. Find next frequency 
					var nextElement = $(this).next();
					if(typeof($(nextElement).data())  === "undefined") {
						// If it is the last one 
					} else {
						nextFrequency = $(nextElement).data().frequency;
					}
					var previousIntermediate = (currentFrequency - previousFrequency) / 2; // 3. Find middle between current and previous 
					var nextIntermediate = (nextFrequency - currentFrequency) / 2; // 4. Find middle between next and current 
					
					var width = findClosestFrequencyIndex(nextIntermediate) - findClosestFrequencyIndex(previousIntermediate);
					
					$(this).width(width);
					previousFrequency = currentFrequency;
				});
			};
			
			konvaUi.alignFrequenciesScale();
			
		
		//eqFiltersMatrices.updateSingleMatrix("HIGHPASS", 20, 0.5, 0); //(filterName, frequency, q, gain)
		
		
		
		
		// APPLY VALUES TO EQ
		//eqFiltersMatrices.updateSingleMatrix("LOWSHELF", 80, 0.05, 2);
		//eqFiltersMatrices.updateSingleMatrix("HIGHPASS", 11, 0.3, 0);
		//eqFiltersMatrices.updateSingleMatrix("HIGHSHELF", 6000, 10, 5);
		eqFiltersMatrices.updateSingleMatrix("PEAK1", 20, 30, 8);
		eqFiltersMatrices.updateSingleMatrix("PEAK2", 11, 80, 8);
		//eqFiltersMatrices.updateSingleMatrix("PEAK3", 20000, 20, 8);
		eqFiltersMatrices.updateSingleMatrix("PEAK4", 50, 30, 8);
		//eqFiltersMatrices.updateSingleMatrix("LOWPASS", 27800, 0.12, 0);
		
		
		
		
		//var freqs = $(".frequency").length;
		//alert(freqs);
		
		
		
		
		
		
		//alert(BiQuadFilter.log_result(200));
		
		
		
		
		
		var matrix = eqFiltersMatrices.getResultMatrix();
		//alert(matrix[0] +  ' ' + matrix[1]);
		
		
		
		
		var konvaLine = konvaUi.getLineFromFilterMatrix(matrix);

		// ++ Initiate Konva
		var konvaStage = new Konva.Stage({
			container: 'eqContainer',
			width: eqContainerWidth,
			height: eqContainerHeight
        });
    console.log('stage = 18');
		var konvaLayer = new Konva.Layer();
		// -- Initiate Konva
		
		// ++ Draw EQ line 
		var eqLine = new Konva.Line({
			points: konvaLine,
			stroke: 'red',
			strokeWidth: 1,
			lineCap: 'round',
			lineJoin: 'round'
		});
		konvaLayer.add(eqLine);
		konvaStage.add(konvaLayer);
		// -- Draw EQ line 
	});
	
	
		/*
		function closest (num, arr) {
                var mid;
                var lo = 0;
                var hi = arr.length - 1;
                while (hi - lo > 1) {
                    mid = Math.floor ((lo + hi) / 2);
                    if (arr[mid] < num) {
                        lo = mid;
                    } else {
                        hi = mid;
                    }
                }
                if (num - arr[lo] <= arr[hi] - num) {
                    return arr[lo];
                }
                return arr[hi];
            }
		
		
		
		*/
		
		//frequency index test 
		//var a = findClosestFrequencyIndex(20000);
		//var b = eqPointsArray[a].frequency;
		//alert(b);
		
		
		// The relations of amounts of gain reduction 
		// Are the same as the relations 
		//https://www.mathworks.com/help/audio/ref/multibandparametriceq-system-object.html
		//https://ccrma.stanford.edu/~jos/filters/Peaking_Equalizers.html
		
		
		//https://arachnoid.com/BiQuadDesigner/ ACHTUNG
		
		
		// By approximating, it was found, that while using 1Hz bandwidth
		// Each next Hz gain = GAIN - (DELTA / (bandwidth * 3 / 2) reduced by 
		
		
		
		
		// it is not even difficult, is it DEEFFEECOOLED
		
				  
	
	//redLine.destroy();
	
      
		
		
	  
	  /*
      var rectX = stage.width() / 2 - 50;
      var rectY = stage.height() / 2 - 25;

      var box = new Konva.Rect({
        x: rectX,
        y: rectY,
        width: 100,
        height: 50,
        fill: '#00D2FF',
        stroke: 'black',
        strokeWidth: 4,
        draggable: true
      });
	  
	  var box2 = new Konva.Rect({
        x: rectX + 50,
        y: rectY + 50,
        width: 100,
        height: 50,
        fill: '#FF0000',
        stroke: 'black',
        strokeWidth: 4,
        draggable: true
      });
	  
	  var box3 = new Konva.Rect({
        x: rectX + 150,
        y: rectY + 150,
        width: 100,
        height: 50,
        fill: '#0000FF',
        stroke: 'black',
        strokeWidth: 4,
        draggable: true
      });

      // add cursor styling
      box.on('mouseover', function() {
        document.body.style.cursor = 'pointer';
      });
      box.on('mouseout', function() {
        document.body.style.cursor = 'default';
      });

      layer.add(box);
	        layer.add(box2);
			      layer.add(box3);
				  */
				  
	  