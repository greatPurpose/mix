// Global variables 
var GHTTPRequestWorker;
var GWorkersNotSupported;
var GIE8Required;
var IE;
var ie10;

// Session
var GSessionID;
var GIsConnected=true;

// Timers
var GSendMetersUpdateTimer;
var GSendSliderPositionTimer;
var GSendControlsSyncTimer;
var bobtimer;
var GMetersUpdateRate = 75; // 75ms
var GSlidersSendRate = 250; // 250ms
var GControlsSyncRate = 3000; //3000 ms
var GDisconnectedSyncRate=30000;
// Channels
var GChannelCount = 0;


// Selected slider info
var GSelectedSlider=false;
var GSelectedSliderID;
var GSelectedSliderClass;
//var GSelectedSliderInfotext;

// All slider info
var GFaderPx = [];
var GFaderOldPx = [];
var GFaderActive = [];
var GPanPx = [];
var GPanOldPx = [];
var GPanActive = [];
var GEq = [];

var GOriginalHeight = 0;
var GSizeRate = 0.0;

var bobcount=0;
var tryNum=0;
var lostConnectionAtTryNum=0;
// Touch
var GIsTouch;
var ServerUrl = window.location.href;
var bSelectedMix = true;
var modal = document.querySelector(".modal");
var closeButton = document.querySelector(".close-button");

// INITIALIZATION
function init(){			
	// IE check
	IE="\v"=="v";
	// IE 10 check
	if(/*@cc_on!@*/false)
	{
		ie10="1";
	}else{
		ie10="0";
	}

	GWorkersNotSupported = false;	
	
	
	// Request Session ID
	GSessionID = getCookie('session');
	if (!GSessionID) { GSessionID = HTTPRequestSend(ServerUrl + "?" + "status" + "=" + "sessionid" + HTTPRequestAntiCache()); }
	
	// check cookies
	var Login1 = getCookie('login');
	var Password1 = getCookie('password');	
	var Response1 = Authorization(Login1, GSessionID);	
	if (Response1.search("accepted") == -1){
	//	window.open("index.html", "_self"); 
	//	return;
	}
	
	// Create consoles 
	var mainconsole1 = document.getElementById("ClassMainConsole");	

	if (mainconsole1.addEventListener)
	{
		GIE8Required = false;
	}
	else
	{ // IE8 compatible
		GIE8Required = true;
	}

	GIsTouch = (('ontouchstart' in window)
      || (navigator.maxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
	  
	console.log("GIsTouch="+GIsTouch);
  
	try
	{
		GHTTPRequestWorker = new Worker("js/worker-requestsend.js");
		GHTTPRequestWorker.onmessage = ServerResponseReceive;
	}
	catch(err)
	{	// IE9 compatible
		GWorkersNotSupported = true;
		console.log("GWorkersNotSupported=true");
	}
	
	// Initialize Channels request	
	data1 = HTTPRequestSend(ServerUrl + "?" + "status" + "=" + "init&sessionid=" + GSessionID + HTTPRequestAntiCache());
	InitChannels(data1);
	
	// Adjust header width
	//nowrapper1 = document.getElementById("ClassNoWrapper");
	//nowrapper1.style.width = 80 * GChannelCount + "px";	
	//console.log("Set nowrapper1.style.width="+nowrapper1.style.width);
	// set meter update and control sync timer
	setMeterUpdateAndControlSyncInterval();
	
}
function setMeterUpdateAndControlSyncInterval(){
	GSendMetersUpdateTimer = setInterval(SendMetersUpdate, GMetersUpdateRate);
	GSendControlsSyncTimer = setInterval(SyncControlsUpdate, GControlsSyncRate);
}

function setMeterUpdateAndControlSyncIntervalEx(){
	GSendMetersUpdateTimer = setInterval(SendMetersUpdate, GDisconnectedSyncRate);
	GSendControlsSyncTimer = setInterval(SyncControlsUpdate, GDisconnectedSyncRate);
}

function InitChannels(data){	
	if (WebqueryVariableValue(data, "status") != "init")
		return;

	var mainconsole1 = document.getElementById("ClassMainConsole");
	mainconsole1.innerHTML = "";	
	
//	GChannelCount = Math.floor((WebqueryVariableCount(data) - 2) / 3);
    GChannelCount=WebqueryVariableValue(data,"max");
	//nowrapper1 = document.getElementById("ClassNoWrapper");
	//nowrapper1.style.width = 80 * GChannelCount + "px";	
	//console.log("Set nowrapper1.style.width="+nowrapper1.style.width);
	// Add Channel Consoles
	var caption1;
	var type1;
	var pan1;
	var panbool1;
	var mixname;
	var colr;
    var chnum;
    
    mixname = WebqueryVariableValue(data, "mix");
        
	var mixselector = document.getElementById('menu');
	while (mixselector.firstChild) {
		mixselector.removeChild(mixselector.firstChild);
	  }
 
	var mixarray = WebqueryVariableValue(data, "ma").split("|");
	for (var i=0, len = mixarray.length; i < len-1; i++) {	
		var mixentry = mixarray[i].split("^");        
		var node = document.createElement("div");
		node.setAttribute("name", mixentry[0]);
		node.innerHTML = mixentry[1];
		node.addEventListener('click', function(event){			
			ServerRequestSend("status","set_mix&mix=" + event.target.getAttribute("name"));
		})
		mixselector.appendChild(node);
	}
	GEq = [];
	type1= WebqueryVariableValue(data,"only"); 
	for (var i = 0; i < GChannelCount; i++){
		caption1 = WebqueryVariableValue(data, "caption" + i);
		type1 = WebqueryVariableValue(data, "type" + i);
		pan1 = WebqueryVariableValue(data, "pan" + i);
		colr = WebqueryVariableValue(data, "cl" + i);
		chnum = WebqueryVariableValue(data, "nm" + i);
		if (pan1 == "0")
			panbool1 = false;
		else
			panbool1 = true;			
		AddChannel(i, caption1, type1, panbool1, colr, chnum);        

		GEq[i] = {
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
    }
    
	 resizeFunc();    
}

function AddChannel(channelnumber, channelcaption, channeltype, showpan, colr, chnum){
	var mainconsole1 = document.getElementById("ClassMainConsole");
	
	// Console 
	var console1 = document.createElement("div");	
	console1.id = "ClassConsole" + channelnumber;
    console1.className = "console";        
	mainconsole1.appendChild(console1);    
	
	// EQ button 
	var eqbutton1 = document.createElement("div");	
	eqbutton1.id = "ClassEQButton" + channelnumber;
	eqbutton1.className = "eq_button";
	eqbutton1.setAttribute("index", channelnumber );
	eqbutton1.addEventListener('click', function(event){
		if (event.target.getAttribute('class')=="eq_button"){
			var index = event.target.getAttribute('index');
			
			toggleModal();

		}
	});	
	console1.appendChild(eqbutton1);
	// Info block 
	var infoblock1 = document.createElement("div");	
	infoblock1.id = "ClassInfoBlock" + channelnumber;
	infoblock1.className = "info_block_on";
	console1.appendChild(infoblock1);	
	// Info text 
	var infotext1 = document.createElement("div");	
	infotext1.id = "ClassInfoText" + channelnumber;
	infotext1.className = "info_text";
	infoblock1.appendChild(infotext1);	
	// Mute button 
	var mutebutton1 = document.createElement("div");	
	mutebutton1.id = "mu" + channelnumber;
	mutebutton1.className = "mute_button_off";
	console1.appendChild(mutebutton1);

//	console1.appendChild(eqbutton1);
	// Pan panel
	var panpanel1 = document.createElement("div");	
	panpanel1.id = "ClassPanPanel" + channelnumber;
	panpanel1.className = "pan_panel";	
	console1.appendChild(panpanel1);
	if (showpan)
	{
		// Pan bar
		var panbar1 = document.createElement("div");	
		panbar1.id = "ClassPanBar" + channelnumber;
		panbar1.className = "pan_bar";	
		panpanel1.appendChild(panbar1);		
		// Pan slider 
		var panslider1 = document.createElement("div");	
		panslider1.id = "pn" + channelnumber;
		panslider1.className = "pan_slider";	
		panbar1.appendChild(panslider1);	
	}
	// Slider group, with additional attributes that contain references to bar, info and sliderline	
	var slidergroup1 = document.createElement("div");	
	slidergroup1.id = "ClassSliderGroup" + channelnumber;
	slidergroup1.className = "slider_group";	
	console1.appendChild(slidergroup1);
	// Slider group / Bar 
	var bar1 = document.createElement("div");	
	bar1.id = "ClassBar" + channelnumber;
	bar1.className = "bar";	
	slidergroup1.appendChild(bar1);	
	// Slider group / Bar / Slider 
	var slider1 = document.createElement("div");	
	slider1.id = "fd" + channelnumber;
	slider1.className = channeltype;	
	bar1.appendChild(slider1);
	// Slider group / Bar / Slider line 
	/* var sliderline1 = document.createElement("div");	
	sliderline1.id = "ClassSliderLine" + channelnumber;
	sliderline1.className = "slider_line";
	bar1.appendChild(sliderline1); */
	// Slider group / Digits 

	var digits1 = document.createElement("div");	
	digits1.id = "ClassDigits" + channelnumber;
	digits1.className = "digits";	
	slidergroup1.appendChild(digits1);
	// Slider group / Digits / p20 
	var p20 = document.createElement("div");	
	p20.className = "p20";	
	p20.innerHTML = "+20";		
	digits1.appendChild(p20);		
	// Slider group / Digits / p10 
	var p10 = document.createElement("div");	
	p10.className = "p10";	
	p10.innerHTML = "+10";
	digits1.appendChild(p10);	
	// Slider group / Digits / zero 
	var zero = document.createElement("div");	
	zero.className = "zero";
	zero.innerHTML = "__";
	digits1.appendChild(zero);	
	// Slider group / Digits / m10 
	var m10 = document.createElement("div");	
	m10.className = "m10";
	m10.innerHTML = "-10";
	digits1.appendChild(m10);	
	// Slider group / Digits / m20 
	var m20 = document.createElement("div");	
	m20.className = "m20";	
	m20.innerHTML = "-20";		
	digits1.appendChild(m20);	
	// Slider group / Digits / m30 
	var m30 = document.createElement("div");	
	m30.className = "m30";	
	m30.innerHTML = "-30";		
	digits1.appendChild(m30);	
	// Slider group / Digits / soff 
	var soff = document.createElement("div");	
	soff.className = "s_off";	
	soff.innerHTML = "OFF";			
	digits1.appendChild(soff);							
	// Slider group / Indicator 
	var indicator1 = document.createElement("div");	
	indicator1.id = "ClassIndicator" + channelnumber;
	indicator1.className = "indicator";	
	slidergroup1.appendChild(indicator1);	
	// Slider group / Indicator light 
	var indicatorlight1 = document.createElement("div");	
	indicatorlight1.id = "ClassIndicatorLight" + channelnumber;
	indicatorlight1.className = "indicatorlight";	
    slidergroup1.appendChild(indicatorlight1);		
	// Slider group / Indicator overload L 
	var indicatoroverl1 = document.createElement("div");	
	indicatoroverl1.id = "ClassIndicatorOverL" + channelnumber;
	indicatoroverl1.className = "indicatormeter_over_l";	
	slidergroup1.appendChild(indicatoroverl1);		
	// Slider group / Indicator overload R
	var indicatoroverr1 = document.createElement("div");	
	indicatoroverr1.id = "ClassIndicatorOverR" + channelnumber;
	indicatoroverr1.className = "indicatormeter_over_r";	
	slidergroup1.appendChild(indicatoroverr1);		
	// Slider group / Indicator meter left
	var indicatormeterleft = document.createElement("div");	
	indicatormeterleft.id = "ml" + channelnumber;
	indicatormeterleft.className = "indicatormeter_l";	
    slidergroup1.appendChild(indicatormeterleft);
	// Slider group / Indicator meter right
	var indicatormeterright = document.createElement("div");	
	indicatormeterright.id = "mr" + channelnumber;
	indicatormeterright.className = "indicatormeter_r";	
    slidergroup1.appendChild(indicatormeterright);				
	// Channel info 
	var channelinfo1 = document.createElement("div");	
	channelinfo1.id = "ClassChannelInfo" + channelnumber;
	channelinfo1.className = "channel_info";	
	console1.appendChild(channelinfo1);
	
	// Channel info / Channel name 
	if(IE) {
		var channelname1 = document.createElement("div");	
		channelname1.id = "ClassChannelName" + channelnumber;
		channelname1.className = "chanel_nameie";	
		channelinfo1.appendChild(channelname1);		
	}else{	
		var channelname1 = document.createElement("div");	
		channelname1.id = "ClassChannelName" + channelnumber;
		channelname1.className = "chanel_name";	
		channelinfo1.appendChild(channelname1);		
	}					
	var channelnum1 = document.createElement("div");
	channelnum1.id = "ClassChannelNum" + channelnumber;
	channelnum1.className = "channel_num";
	console1.appendChild(channelnum1);
	channelnum1.innerHTML = chnum;
	
	// Slider has references to other related elements that are used in slider Events 
	slider1.customBar = bar1.id;
	slider1.customInfotext = infotext1.id;	
	/*slider1.customSliderline = sliderline1.id;*/
	slider1.customSlidergroup = slidergroup1.id;
	slider1.customConsole = console1.id;
	channelname1.innerHTML = channelcaption;
	if (showpan)
	{	
		panslider1.customBar = panpanel1.id;
		panslider1.customSlidergroup = slidergroup1.id;
		panslider1.customConsole = console1.id;	
	}
	
	// slider default values 
	infotext1.innerHTML = "Off";	
    slider1.style.top = bar1.offsetHeight - slider1.offsetHeight - 8 + "px";
	mutebutton1.checked = false;
	eqbutton1.checked = false;
	
	if (GIsTouch)
	{
		slider1.addEventListener("touchstart", startTouch, false);	

		if (showpan)
		{
			panslider1.addEventListener("touchstart", startTouch, false);	
		}
		mutebutton1.addEventListener("touchstart", OnChangeMuteButton, false);
	//	eqbutton1.addEventListener("touchstart", OnChangeEQButton, false);		
	}
	if (!GIE8Required)
	{
		slider1.addEventListener("mousedown", startSlide, false);	
		if (showpan)
			panslider1.addEventListener("mousedown", startSlide, false);
		mutebutton1.addEventListener("click", OnChangeMuteButton, false);	
	//	eqbutton1.addEventListener("click", OnChangeEQButton, false);
	}
	else 
	{ // IE8 compatible
		slider1.attachEvent("onmousedown", startSlide, false);	
		if (showpan)
			panslider1.attachEvent("onmousedown", startSlide, false);
		mutebutton1.attachEvent("onclick", OnChangeMuteButton, false);		
	//	eqbutton1.attachEvent("onclick", OnChangeEQButton, false);		
	}	
}

// EVENTS -----------------------------------------------------------------------------------------

// Events helpers
function incrementmix(){
     ServerRequestSend("status","inc_mix");
}
function decrementmix(){ 
     ServerRequestSend("status","dec_mix");
}

function EventTargetIE8Compatible(event){
	if (!GIE8Required)
	{
		return event.target;
	}
	else
	{	// IE8 compatible		
		return event.srcElement;
	}
}

// Fader coordinates adjustments 
function FadersUpdateOnMove(event, touchEvent){
    tryToUpdateFaders: {        
		mainconsole1 = document.getElementById("ClassMainConsole");	
		if (touchEvent) {
			SelectedSliderID = EventTargetIE8Compatible(event).id;
			SelectedSlider = document.getElementById(SelectedSliderID);
		}
		else {
			SelectedSliderID = GSelectedSliderID;
			SelectedSlider = GSelectedSlider;
		}
		var bar1 = document.getElementById(SelectedSlider.customBar);
		var infotext1 = document.getElementById(SelectedSlider.customInfotext);
		
		if (touchEvent)
		{
			clienty1 = event.changedTouches[0].clientY + document.documentElement.scrollTop + document.body.scrollTop;
		}
		else
		{
			clienty1 = event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
		}	
		
		var slidergroup1 = document.getElementById(SelectedSlider.customSlidergroup);
		var console1 = document.getElementById(SelectedSlider.customConsole);
		/*if (!bar1) {
			console.log("bar1 is null. break!"); // debug stuff
			break tryToUpdateFaders;
		}*/
        var top1 = mainconsole1.offsetTop + bar1.offsetTop + slidergroup1.offsetTop + console1.offsetTop;        
        var relativeheight1 = bar1.offsetHeight - 8;
        var bottom1 = relativeheight1 - SelectedSlider.offsetHeight;
        var slider_top = clienty1 - top1 - SelectedSlider.offsetHeight / 2;
		if (slider_top < 0){
			SelectedSlider.style.top = 0;
		} else if (slider_top < bottom1){
			SelectedSlider.style.top = slider_top + "px";		
		} else{
			SelectedSlider.style.top = bottom1 + "px";
		}
		var ov;
        var set_perc = (clienty1 - top1 - SelectedSlider.offsetHeight / 2 - 0) / (relativeheight1 - SelectedSlider.offsetHeight);

        set_perc = 127 - (set_perc * 127).toFixed(0);
		if (set_perc>127) { set_perc=127; }
		if (set_perc >=50){ ov=((set_perc-50)/2)-20; }
		if (set_perc <10) { ov=set_perc*2-80; }
        if ((set_perc >= 10) && (set_perc < 50)) { ov = set_perc - 70; }
		if (ov<-78) { ov = 'Off'; } else { ov=ov.toFixed(1); }	
		infotext1.innerHTML = ov;
		var vv=SelectedSlider.style.top;
		var vv1=String(vv).length;
		//GSelectedSliderInfotext = Math.floor(String(vv).substring(0,vv1-2))+'px'; //GSelectedSlider.style.top);
		
		GFaderPx[SelectedSliderID.substring(2)] = Math.floor(String(vv).substring(0,vv1-2))+'px';
		//console.log("just set GFaderPx["+SelectedSliderID.substring(2)+"]="+GFaderPx[SelectedSliderID.substring(2)]);
		//console.log("len="+GFaderPx.length);
		
		/*sliderline1.style.top = slider1.style.top;
		sliderline1.style.height = bar1.offsetHeight + slidergroup1.offsetTop - slider1.offsetTop - slider1.offsetHeight + "px";*/
		
		if (!GSendSliderPositionTimer) {
			GSendSliderPositionTimer = setInterval(SendSliderPosition, GSlidersSendRate);
		}

		if (GSendControlsSyncTimer) {
			clearInterval(GSendControlsSyncTimer);
			GSendControlsSyncTimer = setInterval(SyncControlsUpdate, GControlsSyncRate);
		}
	}
}

// PANs coordinates adjustments 
function PansUpdateOnMove(event, touchEvent){
	tryToUpdatePans: {
		mainconsole1 = document.getElementById("ClassMainConsole");	
		if (touchEvent) {
			SelectedSliderID = EventTargetIE8Compatible(event).id;
			SelectedSlider = document.getElementById(SelectedSliderID);
		}
		else {
			SelectedSliderID = GSelectedSliderID;
			SelectedSlider = GSelectedSlider;
		}
		var bar1 = document.getElementById(SelectedSlider.customBar);
		
		if (touchEvent)
		{
			clientx1 = event.changedTouches[0].clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
		}
		else
		{
			clientx1 = event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
		}
		
		var slidergroup1 = document.getElementById(SelectedSlider.customSlidergroup);
		var console1 = document.getElementById(SelectedSlider.customConsole);
		/*if (!bar1) {
			console.log("bar1 is null. break!"); // debug stuff
			break tryToUpdatePans;
		}*/
		var left1 = mainconsole1.offsetLeft + bar1.offsetLeft + slidergroup1.offsetLeft + console1.offsetLeft;
		var relativewidth1 = bar1.offsetWidth;	
		var right1 = relativewidth1 - SelectedSlider.offsetWidth;
					
		var panslider_left = clientx1 - left1 - SelectedSlider.offsetWidth/2;
		if (panslider_left < 0){
			SelectedSlider.style.left = 0;
		} else if (panslider_left < right1){
			SelectedSlider.style.left = panslider_left + "px";		
		} else{
			SelectedSlider.style.left = right1 + "px";
		}
		
		//GSelectedSliderInfotext = GSelectedSlider.style.left;
		var ov;
		var set_perc = (clientx1 - left1 - SelectedSlider.offsetWidth/2 - 0) / (relativewidth1 - SelectedSlider.offsetWidth);
		set_perc = 127-(set_perc * 127).toFixed(0);
		if (set_perc>127) { set_perc=127; }
		if (set_perc >=50){ ov=((set_perc-50)/2)-20; }
		if (set_perc <10) { ov=set_perc*2-80; }
		if ((set_perc>=10) && (set_perc<50)) { ov=set_perc-70; }

		if (ov<-78) { ov = 'Off'; } else { ov=ov.toFixed(1); }	
		//infotext1.innerHTML = ov;
		var vv=SelectedSlider.style.left;
		var vv1=String(vv).length;
		//GSelectedSliderInfotext = Math.floor(String(vv).substring(0,vv1-2))+'px'; 
		
		GPanPx[SelectedSliderID.substring(2)] = Math.floor(String(vv).substring(0,vv1-2))+'px';
		//console.log("just set GPanPx["+SelectedSliderID.substring(2)+"]="+GPanPx[SelectedSliderID.substring(2)]);


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
	}
}

// MOUSE EVENTS	
// Slider mouseup, mousedown and move
function startSlide(event){
	SelectedSliderID = EventTargetIE8Compatible(event).id;
	SelectedSlider = document.getElementById(SelectedSliderID);

	GSelectedSliderID = SelectedSliderID;
	GSelectedSlider = SelectedSlider;
	GSelectedSliderClass = SelectedSlider.className;
	
	if (!GIE8Required) 
	{
		document.addEventListener("mousemove", moveSlide, false);
		document.addEventListener("mouseup", stopSlide, false);		
	}
	else // IE8 compatible
	{
		document.attachEvent("onmousemove", moveSlide, false);	
		document.attachEvent("onmouseup", stopSlide, false);				
	}	
	
	clearAllActive();
	if (strcmp(SelectedSliderID.substring(0,2), "fd") == 0) {
		GFaderActive[SelectedSliderID.substring(2)] = true;
		console.log("Fader "+SelectedSliderID.substring(2)+" active");
	}
	else if (strcmp(SelectedSliderID.substring(0,2), "pn") == 0) {
		GPanActive[SelectedSliderID.substring(2)] = true;
		console.log("Pan "+SelectedSliderID.substring(2)+" active");
	}
}

function stopSlide(event){

	GSelectedSliderID=false;
	GSelectedSlider=false;
	GSelectedSliderClass=false;
	
	if (!GIE8Required) 
	{
		document.removeEventListener("mousemove", moveSlide, false);
		document.removeEventListener("mouseup", stopSlide, false);		
	}
	else // IE8 compatible
	{
		document.detachEvent("onmousemove", moveSlide, false);	
		document.detachEvent("onmouseup", stopSlide, false);				
	}		
	
	clearInterval(GSendSliderPositionTimer);	
	SendSliderPosition(); // make sure last Slider value sent
	GSendSliderPositionTimer = null;		

	clearAllActive();
	console.log("All faders and pans inactive.");
}

function moveSlide(event){
	if (GSelectedSliderClass) { // move initiated by mouse
		if (GSelectedSliderClass == "pan_slider")
			PansUpdateOnMove(event, 0);
		else
			FadersUpdateOnMove(event, 0);
	}
	else { // move initiated by touch
		SelectedSliderID = EventTargetIE8Compatible(event).id;
		SelectedSlider = document.getElementById(SelectedSliderID);
		
		if (SelectedSlider) { // if you move off the fader, ignore anything that happens so as to suppress errors
			SelectedSliderClass = SelectedSlider.className;
			
			if (SelectedSliderClass == "pan_slider") {
				if (GPanActive[SelectedSliderID.substring(2)] == true) { 
					PansUpdateOnMove(event, 0); 
				}
			}
			else {
                if (GFaderActive[SelectedSliderID.substring(2)] == true) {                     
					FadersUpdateOnMove(event, 0); 
				}
			}
		}
	}
}	

function clearAllActive(){
	for (var i=0, len = GFaderActive.length; i < len; i++) {
		GFaderActive[i] = false;
	}
	for (var i=0, len = GPanActive.length; i < len; i++) {
		GPanActive[i] = false;
	}
}

// TOUCH EVENTS

// Slider touchstart, touchend and touchmove
function startTouch(event){
	event.preventDefault();	
	
	SelectedSliderID = EventTargetIE8Compatible(event).id;
	SelectedSlider = document.getElementById(SelectedSliderID);
	SelectedSliderClass = SelectedSlider.className;
	
	SelectedSlider.addEventListener("touchmove", moveTouch, false);	
	SelectedSlider.addEventListener("touchcancel", stopTouch, false);
	SelectedSlider.addEventListener("touchend", stopTouch, false);
	
	if (strcmp(SelectedSliderID.substring(0,2), "fd") == 0) {
		GFaderActive[SelectedSliderID.substring(2)] = true;
		console.log("Fader "+SelectedSliderID.substring(2)+" active");
	}
	else if (strcmp(SelectedSliderID.substring(0,2), "pn") == 0) {
		GPanActive[SelectedSliderID.substring(2)] = true;
		console.log("Pan "+SelectedSliderID.substring(2)+" active");
	}			
}

function stopTouch(event){
	event.preventDefault();	
	
	SelectedSliderID = EventTargetIE8Compatible(event).id;
	SelectedSlider = document.getElementById(SelectedSliderID);
	SelectedSliderClass = SelectedSlider.className;

	clearInterval(GSendSliderPositionTimer);	
	SendSliderPosition(); // make sure last Slider value sent
	GSendSliderPositionTimer = null;		
	
	SelectedSlider.removeEventListener("touchmove", moveTouch);	// cleanup
	SelectedSlider.removeEventListener("touchcancel", stopTouch);
	SelectedSlider.removeEventListener("touchend", stopTouch);
	
	if (strcmp(SelectedSliderID.substring(0,2), "fd") == 0) {
		GFaderActive[SelectedSliderID.substring(2)] = false;
		console.log("Fader "+SelectedSliderID.substring(2)+" inactive");
	}
	else if (strcmp(SelectedSliderID.substring(0,2), "pn") == 0) {
		GPanActive[SelectedSliderID.substring(2)] = false;
		console.log("Pan "+SelectedSliderID.substring(2)+" inactive");
	}
}

function moveTouch(event){	
 	event.preventDefault();	
	
	SelectedSliderID = EventTargetIE8Compatible(event).id;
	SelectedSlider = document.getElementById(SelectedSliderID);
	SelectedSliderClass = SelectedSlider.className;

	if (SelectedSliderClass == "pan_slider" && GPanActive[SelectedSliderID.substring(2)]) // make sure last Slider value sent
		PansUpdateOnMove(event, 1);
	else if (GFaderActive[SelectedSliderID.substring(2)])
		FadersUpdateOnMove(event, 1); 
}

// Mute Button click 
function OnChangeMuteButton(event){	
	var buttonid1 = EventTargetIE8Compatible(event).id;	
	var button1 = document.getElementById(buttonid1);
	
	event.preventDefault();
	
	button1.checked = !button1.checked;
	FaderServerRequestSend(button1.id, button1.checked);	// Using this instead of ServerRequestSend fixes sucky mute button performance.
	MuteButtonImageUpdate(button1);
}

function MuteButtonImageUpdate(button){
	if (!button.checked){
		button.className = "mute_button_off";
	}else{
		button.className = "mute_button_on";	
	}
}
// SERVER INTERACTION -----------------------------------------------------------------------------

// TIMER that requests new Meter values
function SendMetersUpdate(){
	ServerRequestSend("status", "meters");								
}

// TIMER that sends updated values from Sliders
function SendSliderPosition(){

	for (var i=0, len = GFaderActive.length; i < len; i++) {
		if (strcmp(GFaderOldPx[i],GFaderPx[i]) != 0)
		{
			FaderServerRequestSend("fd"+i, GFaderPx[i]);
			GFaderOldPx[i]=GFaderPx[i];
		}
		if (strcmp(GPanOldPx[i],GPanPx[i]) != 0)
		{
			FaderServerRequestSend("pn"+i, GPanPx[i]);
			GPanOldPx[i]=GPanPx[i];
		}
	}
}

function SyncControlsUpdate(){
	ServerRequestSend("status", "controls");	
}

// Server Responses Callback for Workers (FF, Chrome, IE10 and upper)
function ServerResponseReceive(e){
	ServerResponseReceiveNoWorkers(e.data);	
}			

// Server Responses Callback for IE9 and lower
// ALL RESPONSES GO HERE
function ServerResponseReceiveNoWorkers(data){
	if (data == false)
	{
		tryNum++;
		if(GIsConnected !=false)
		{
			clearInterval(GSendMetersUpdateTimer);
			clearInterval(GSendControlsSyncTimer);
			setMeterUpdateAndControlSyncIntervalEx();
			GIsConnected = false;
			lostConnectionAtTryNum = tryNum;
		}
		if(tryNum>(lostConnectionAtTryNum+10)){
			var r=confirm("Connection lost! Press OK to retry or Cancel to quit.")
			if (r==true){
				//window.location.reload(); // if the server is restarted the web gui won't recover cleanly, so let's brute force refresh
				lostConnectionAtTryNum = tryNum; // this never happens
			}
			else{
				window.location.href = "about:blank";
			}
		}
		else {
			console.log((lostConnectionAtTryNum+10-tryNum)+" tries remaining until posting failure dialog.");
		}
		return;
	}
	
	if(GIsConnected == false)
	{
		GIsConnected = true;
		lostConnectionAtTryNum = 0;
		init();
		setMeterUpdateAndControlSyncInterval();
	}
	// Meters
	if (WebqueryVariableValue(data, "status") == "meters")
    {        
		for (var i = 0; i < GChannelCount; i++)
		{			
			// Meter Left
			var indicatormetername1 = "ml" + i;
			var indicatormetername2 = "mr" + i;
			var indv1 = data.charCodeAt(i*2+14);
			var indv2 = data.charCodeAt(i*2+15);
			if (indv1)
			{
                var indicatormeter1 = document.getElementById(indicatormetername1);
                var indicatormeter2 = document.getElementById(indicatormetername2);

                if (ie10 = "1") {
                    indicatormeter1.style.backgroundPosition = "0 -" + ( indv1 * 2 * GSizeRate ) + "px";	
                    indicatormeter2.style.backgroundPosition = "0 -" + ( indv2 * 2 * GSizeRate ) + "px";
				}else if(!IE) {
                    indicatormeter1.style.backgroundPosition = "0 -" + ( indv1 * 2 * GSizeRate )+ "px";
                    indicatormeter2.style.backgroundPosition = "0 -" + ( indv2 * 2 * GSizeRate )+ "px";
				}else{
					indicatormeter1.style.backgroundPositionY = indv1 * 2 + "px";	
					indicatormeter2.style.backgroundPositionY = indv2 * 2 + "px";
				}
			}
		}
	}

	// Controls 
	if (WebqueryVariableValue(data, "status") == "controls")
    {	        
		// No Controls sync while Slider values are changed: GSendSliderPositionTimer is on 
		if (!GSendSliderPositionTimer)
		{
			//console.log("Starting controls sync");
			for (var i = 0; i < GChannelCount; i++)
			{			
				// Fader slider
				var slidername1 = "fd" + i;
				var slidervalue1 = WebqueryVariableValue(data, slidername1.toLowerCase());
				if (slidervalue1)
                {
                    
					var slider1 = document.getElementById(slidername1);
                    if (slider1 && !GFaderActive[slidername1.substring(2)])
                        if (slider1.style.top != slidervalue1) {
                            var upslidervalue = (slidervalue1.slice(0, -2) * GSizeRate) + 'px';
                            slider1.style.top = upslidervalue;
							// calculate approx Fade info text value
							var bar1 = document.getElementById(slider1.customBar);												
							var infotext1 = document.getElementById(slider1.customInfotext);						
							var relativeheight1 = bar1.offsetHeight - 8;

                            GFaderPx[i] = upslidervalue ;
                            GFaderOldPx[i] = upslidervalue ;
							//console.log('GFaderPx['+i+"]='"+GFaderPx[i]+"'");

							var ov;
							var set_perc = (slider1.offsetTop) / (relativeheight1 - slider1.offsetHeight);
							set_perc = 127-(set_perc * 127).toFixed(0);
							if (set_perc>127) { set_perc=127; }
							if (set_perc >=50){ ov=((set_perc-50)/2)-20; }
							if (set_perc <10) { ov=set_perc*2-80; }
							if ((set_perc>=10) && (set_perc<50)) { ov=set_perc-70; }

							if (ov<-78) { ov = 'Off'; } else { ov=ov.toFixed(1); }	
							infotext1.innerHTML = ov;
							
                            //infotext1.innerHTML = (18.5 - 100 * (slider1.offsetTop) / (relativeheight1 - slider1.offsetHeight + 4)).toFixed(1);                            
                            var faderchanged1 = slidername1 + '=' + slidervalue1;                            
						}

				}		

				// PAN slider
				var slidername1 = "pn" + i;
				var slidervalue1 = WebqueryVariableValue(data, slidername1.toLowerCase());
				if (slidervalue1)
				{			
					var slider1 = document.getElementById(slidername1);
					if (slider1 && !GPanActive[slidername1.substring(2)])				
						if (slider1.style.left != slidervalue1){
							slider1.style.left = slidervalue1;
							var panchanged1 = slidername1 + '=' + slidervalue1;
							GPanPx[i] = slidervalue1;
							GPanOldPx[i] = slidervalue1;
							//console.log('GPanPx['+i+"]='"+GPanPx[i]+"'");
						}
				}				
				
				// Mute Button 
				var buttonname1 = "mu" + i;
				var buttonvalue1 = WebqueryVariableValue(data, buttonname1.toLowerCase());
				if (buttonvalue1)
				{								
					var button1 = document.getElementById(buttonname1);
					if (button1){	
						checked1 = buttonvalue1 == "true";
						if (checked1 != button1.checked){
							var	mutechanged1 = buttonname1 + '=' + checked1;	
							button1.checked = checked1;						
							MuteButtonImageUpdate(button1);				
						}
					}
				}		

				// EQ Button 
				/*var buttonname1 = "ClassEQButton" + i;
				var buttonvalue1 = WebqueryVariableValue(data, buttonname1.toLowerCase());
				if (buttonvalue1)
				{								
					var button1 = document.getElementById(buttonname1);
					if (button1){	
						checked1 = buttonvalue1 == "true";
						if (checked1 != button1.checked){
							var	mutechanged1 = buttonname1 + '=' + checked1;	
							button1.checked = checked1;						
							EQButtonImageUpdate(button1);				
						}
					}
				}*/	
				
            }            
		}
	}				
	
	// for dynamic CSS load
	if (WebqueryVariableValue(data, "loadcssfile"))
	{		
		LoadJsCssFile(WebqueryVariableValue(data, "loadcssfile"), "css");	
	}	
		
	// for dynamic JS load
	if (WebqueryVariableValue(data, "loadjsfile"))
	{		
		LoadJsCssFile(WebqueryVariableValue(data, "loadjsfile"), "js");	
	}
	
	// check for Init request
	InitChannels(data);
	
	// Display states in DebugConsole if it's loaded
	var debugconsolelog1 = document.getElementById("ClassDebugConsoleLog");
	if (debugconsolelog1)
	{
		if (WebqueryVariableValue(data, "status") == "controls"){
			// reacts on external controls update 		
			if (faderchanged1)
				debugconsolelog1.innerHTML = faderchanged1 + "<br>" + debugconsolelog1.innerHTML;
			if (panchanged1)
				debugconsolelog1.innerHTML = panchanged1 + "<br>" + debugconsolelog1.innerHTML;				
			if (mutechanged1)
				debugconsolelog1.innerHTML = mutechanged1 + "<br>" + debugconsolelog1.innerHTML;				
		}/*else{
			// reacts on internal controls update 		
			if ((data.search("fd") != -1) || 
					(data.search("pn") != -1) ||
					(data.search("mu") != -1))							
				debugconsolelog1.innerHTML = data + "<br>" + debugconsolelog1.innerHTML;						
		}*/
	}		
}		

// Meter Server Requests Sender
function ServerRequestSend(ParamName, ParamValue){	
	
	bobcount++;
	//ServerResponseReceiveNoWorkers(HTTPRequestSend(ServerUrl + "?" + ParamName + "=" + ParamValue + "&sessionid=" + GSessionID + HTTPRequestAntiCache()));
	if (!GWorkersNotSupported)
	{	
		GHTTPRequestWorker.postMessage(ServerUrl + "?b="+bobcount+"&" + ParamName + "=" + ParamValue + "&sessionid=" + GSessionID + HTTPRequestAntiCache());			
	}
	else
	{
		// IE9 compatible			
		ServerResponseReceiveNoWorkers(HTTPRequestSend(ServerUrl + "?" + ParamName + "=" + ParamValue + "&sessionid=" + GSessionID + HTTPRequestAntiCache()));
	}
}

function FaderServerRequestSend(ParamName, ParamValue){
	bobcount++;
	HTTPRequestSend2(ServerUrl + "?" + ParamName + "=" + ParamValue + "&sessionid=" + GSessionID + HTTPRequestAntiCache());
	//console.log('FaderServerRequestSend: '+ParamName+"="+ParamValue);
}

function LoadJsCssFile(filename, filetype){
 	if (filetype=="js"){	// external JavaScript file
	  var fileref=document.createElement("script");
	  fileref.setAttribute("type","text/javascript");
	  fileref.setAttribute("src", filename);
 	}
	else if (filetype=="css"){	// external CSS file
	  var fileref=document.createElement("link");
	  fileref.setAttribute("rel", "stylesheet");
	  fileref.setAttribute("type", "text/css");
	  fileref.setAttribute("href", filename);
 	}
 	if (typeof fileref!="undefined")
  	document.getElementsByTagName("head")[0].appendChild(fileref);
}

var xStart, yStart = 0;
 
document.addEventListener('touchstart',function(e) {
    xStart = e.touches[0].screenX;
    yStart = e.touches[0].screenY;
});
 
document.addEventListener('touchmove',function(e) {
    var xMovement = Math.abs(e.touches[0].screenX - xStart);
    var yMovement = Math.abs(e.touches[0].screenY - yStart);
    if((yMovement * 3) > xMovement) {
        e.preventDefault();
    }
});

function Authorization(login, GSessionID){
	var Login1 = "login=" + login;
	return HTTPRequestSend(ServerUrl + "?" + Login1 +  "&sessionid=" + GSessionID);	
}

function HTTPRequestSend(ServerUrlAndRequest){
	try
	{		
		var xrequest = new XMLHttpRequest();
		xrequest.open("GET", ServerUrlAndRequest, false);	 
		xrequest.send(null);
		return xrequest.responseText;	
	}
	catch(err)
	{	
		return "EXCEPTION: " + err; 
	}		
}
function HTTPRequestSend2(ServerUrlAndRequest){
	try
	{		
		var xrequest = new XMLHttpRequest();
		xrequest.open("GET", ServerUrlAndRequest, true);	 
		xrequest.send(null);
		return xrequest.responseText;	
	}
	catch(err)
	{	
		return "EXCEPTION: " + err; 
	}		
}

function HTTPRequestAntiCache(){
	var randomanticache = "&" + "anticache=" + Math.round(Math.random() * 9999) + "-" + Math.round(Math.random() * 9999);
	return randomanticache;
};

function WebqueryVariableValue(query, variable){
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++){
    var pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable){
    	return decodeURIComponent(unescape(pair[1])).replace(/(\r\n|\n|\r)/gm, "");
    }
  }
}

function WebqueryVariableCount(query){
  var vars = query.split("&");
	return vars.length;
}

function strcmp ( str1, str2 ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Waldo Malqui Silva
    // +      input by: Steve Hilder
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    revised by: gorthaur
    // *     example 1: strcmp( 'waldo', 'owald' );
    // *     returns 1: 1
    // *     example 2: strcmp( 'owald', 'waldo' );
    // *     returns 2: -1

    return ( ( str1 == str2 ) ? 0 : ( ( str1 > str2 ) ? 1 : -1 ) );
}

function resizeFunc() {
	//Update Menu and Title bar length    
    var mainconsole1 = document.getElementById("ClassMainConsole");
    var bfirst = true;
    var originalrate = GSizeRate;
    if (GOriginalHeight != 0) { bfirst = false; }
        
    if (GChannelCount > 0) {
        for (var i = 0; i < GChannelCount; i++) {                        
			document.getElementById('ClassConsole' + i).style.height = (document.documentElement.clientHeight - 42) + 'px';
			console.log('hight= ', document.documentElement.clientHeight);

            var selSlider = document.getElementById('fd' + i);            
            var bar1 = document.getElementById(selSlider.customBar);
            var slidergroup1 = document.getElementById(selSlider.customSlidergroup);
            var console1 = document.getElementById(selSlider.customConsole);
            var height = document.documentElement.clientHeight - (mainconsole1.offsetTop + bar1.offsetTop + slidergroup1.offsetTop + console1.offsetTop) - 40;
            var originalHeight = selSlider.offsetTop;            
            if (bfirst == false)
                originalHeight = selSlider.offsetTop / originalrate;
            
            if (GOriginalHeight == 0)
                GOriginalHeight = bar1.offsetHeight - 8 - selSlider.offsetHeight;
                        
            GSizeRate = (height - 8 - selSlider.offsetHeight) / GOriginalHeight;
            bar1.style.height = height + 'px';      
            selSlider.style.top = (originalHeight * GSizeRate) + 'px';            

            var theight = height - 80;
            document.getElementById('ClassDigits' + i).style.height = (height - selSlider.offsetHeight) + 'px';
            document.getElementById('ClassIndicator' + i).style.height = theight + 'px';
            document.getElementById('ClassIndicatorLight' + i).style.height = theight + 'px';
            document.getElementById('ml' + i).style.height = theight + 'px';
            document.getElementById('mr' + i).style.height = theight + 'px';            
        }

        var wWidth = GChannelCount * document.getElementById("ClassConsole0").offsetWidth;

	}
}

function toggleModal() {
    modal.classList.toggle("show-modal");
}

closeButton.addEventListener("click", toggleModal);
