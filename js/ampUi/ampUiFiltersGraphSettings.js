ampUi.filtersGraphSettings = {
	minFrequency: 8, // Hz
	maxFrequency: 22000,
	minGain: -30, // dB
	maxGain: 20,
	minQuality: 0.025, // Q
	maxQuality: 40,
	sampleRate: 44100, 
	htmlContainerId: 'graph-container', // Container element 
	circleSizeCoefficient: 6, // How much percent of EQ graph height a circle button is 
	circleStrokeWidth: 2, // Circles edging width in pixels 
	frequencyScaleHeight: 36, // Scales width in pixels 
	gainScaleWidth: 36, 
	logoSide: 36,
	scaleNumberHeight: 11, // Font size of numbers on frequency and gain scales 
	gridStrokeWidth: 1, // Pixel width of background grid 
	partialCurveStrokeWidth: 1.3, // Pixel width of curves for each separate filter 
	partialCurveUnselectedOpacity: 0.075,
	partialCurveSelectedOpacity: 0.15,
	leadingCurveStrokeWidth: 3, // Pixel width of single resulting curve
	gridAtFrequency: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 20000],
	gridAtGain: [-25, -20, -15, -10, -5, 0, 5, 10, 15], // Which values are highlighted by grid lines 
	scaleNumbersAtFrequency: [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000],
	scaleNumbersAtGain: [-30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20], // Which values are highlighted by numbers on scales
	scaleNumbersAtQuality: [0.5, 1, 10, 20, 30, 40]
};

