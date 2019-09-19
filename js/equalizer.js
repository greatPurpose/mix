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

var GOriginalHeight = 0;
var GSizeRate = 0.0;

var bobcount=0;
var tryNum=0;
var lostConnectionAtTryNum=0;
// Touch
var GIsTouch;
var ServerUrl = window.location.href;
var envarray = ['Mixing Plateform', 'Equalizer Plateform'];
var bSelectedMix = false;
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
    envselector.onchange = function () { setenv() };
	
}

function setenv() {
    bSelectedMix = (!bSelectedMix);
    if (bSelectedMix) {
        window.open("main.html", "_self");
    } else {
        window.open("equalizer.html", "_self");
    }    
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

// TIMER that requests new Meter values
function SendMetersUpdate(){
	ServerRequestSend("status", "meters");								
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
	}
	
	if(GIsConnected == false)
	{
		GIsConnected = true;
		lostConnectionAtTryNum = 0;
		init();
		setMeterUpdateAndControlSyncInterval();
	}
	
	// Controls 
	if (WebqueryVariableValue(data, "status") == "controls")
    {	        
		
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

var xStart, yStart = 0;

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
    ampUi.channelEdit(
        ampUi.globalSettings.filtersControllersContext,
        function () {
            alert('View Groups Pressed!')
        },
        function () {
            alert('Mixes Pressed!')
        },
        function () {
            alert('Options Pressed!')
        },
        function () {
            alert('Exit Pressed!')
        }
    );
}

