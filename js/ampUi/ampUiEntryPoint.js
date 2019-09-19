$(function() {
	// Load initial styles 
	$("*").css("background-color", ampUi.colors.backgroundOrdinary);
	
	// Let's assume we have some channel 
	var channelObject = {
		number: 14,
		name: 'Some Channel',
		hint: 'This is some awesome channel to be edited in awesome interface',
		gain: 23,
		pan: -32,
		filters: {
			highPass: { frequency: 0, gain: 0, quality: 1, active: true },
			lowShelf: { frequency: 40, gain: 0, quality: 1, active: true },
			peakOne: { frequency: 100, gain: 0, quality: 1, active: true },
			peakTwo: { frequency: 200, gain: 0, quality: 1, active: true },
			peakThree: { frequency: 400, gain: 0, quality: 1, active: true },
			peakFour: { frequency: 2000, gain: 0, quality: 1, active: true },
			highShelf: { frequency: 7000, gain: 0, quality: 1, active: true },
			lowPass: { frequency: 10000, gain: 0, quality: 1, active: true },
		},
		active: true 
	};
	
	// Switch to channel edit screen 
	// And load channel edit UI 
	ampUi.channelEdit(
		channelObject,
		function() {
			alert('View Groups Pressed!')
		},
		function() {
			alert('Mixes Pressed!')
		},
		function() {
			alert('Options Pressed!')
		},
		function() {
			alert('Exit Pressed!')
		}
    );
    ampUi.globalSettings.filtersControllersContext = channelObject;
});