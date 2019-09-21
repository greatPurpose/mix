ampUi.globalSettings = {};
ampUi.globalSettings.stateMark = "\u29bf";
ampUi.globalSettings.frequencyMark = "Hz";
ampUi.globalSettings.gainMark = "dB";
ampUi.globalSettings.qualityMark = "Q";
ampUi.globalSettings.onMark = "ON";
ampUi.globalSettings.offMark = "OFF";
ampUi.globalSettings.thousandsMark = "k";
ampUi.globalSettings.fontOrdinary = 'Segoe UI';
ampUi.globalSettings.frequencyDecimalPoints = 2;
ampUi.globalSettings.gainDecimalPoints = 1;
ampUi.globalSettings.qualityDecimalPoints = 3;
ampUi.globalSettings.equalizerPairs = 100; // Overall number of frequency / gain pairs
// ++ Each channel volume scale 
ampUi.globalSettings.volumeScaleMin = -96; // For 16 bit audio, dynamic range is -96 to 0 db 
ampUi.globalSettings.volumeScaleMax = 0; // For 16 bit audio, dynamic range is -96 to 0 db 
ampUi.globalSettings.volumeScaleStopsAt = [0, -10, -20, -30, -40, -50, -60, -70, -80, -96]; 
ampUi.globalSettings.volumeScaleNumbersAt = [0, -10, -20, -30, -40, -50, -60, -70, -80, -96]; 
ampUi.globalSettings.volumeScaleNumberHeight = 12;
ampUi.globalSettings.volumeScaleMargin = 2; // A margin between scale - meters and scale - numbers
// -- Each channel volume scale 
// ++ Each channel volume slider 
ampUi.globalSettings.volumeMin = -30;
ampUi.globalSettings.volumeMax = 20;
ampUi.globalSettings.volumeSliderNumbersAt = [-30,-20,-10,0,10,20];
ampUi.globalSettings.volumeSliderStrokeWidth = 2;
// -- Each channel volume slider 
// ++ Each channel pan slider 
ampUi.globalSettings.panMin = -100;
ampUi.globalSettings.panMax = 100;
ampUi.globalSettings.panSliderStrokeWidth = 2;
// -- Each channel pan slider 
// ++ Each channel meter 
ampUi.globalSettings.meterRectangleHeight = 2;
// -- Each channel meter
ampUi.globalSettings.filtersControllersContext = {};

ampUi.globalSettings.freqSlider = null;
ampUi.globalSettings.qSlider = null;
ampUi.globalSettings.gainSlider = null;