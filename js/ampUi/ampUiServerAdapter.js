
ampUi.serverAdapter = {};

// ++ HTTP 

ampUi.serverAdapter.httpRequestWorker = new Worker("js/worker-requestsend.js"); //new Worker("js/worker-requestsend.js");

ampUi.serverAdapter.serverUrl = window.location.href;
ampUi.serverAdapter.sessionId = null;

ampUi.serverAdapter.sendSliderPositionTimer = null;


ampUi.serverAdapter.metersUpdateRate = 75;
ampUi.serverAdapter.slidersSendRate = 250; 
ampUi.serverAdapter.controlsSyncRate = 3000; 
//ampUi.serverAdapter.disconnectedSyncRate=30000;

ampUi.serverAdapter.bobCount = 0; // Someone named it like that

ampUi.serverAdapter.httpRequest = function(url) {
	try
	{		
		var request = new XMLHttpRequest();
		request.open("GET", url, false);	 
		request.send(null);
		return request.responseText;	
	}
	catch(error)
	{	
		return error; 
	}		
};

ampUi.serverAdapter.httpRequest2 = function(url) {
	try
	{		
		var xrequest = new XMLHttpRequest();
		xrequest.open("GET", url, true);	 
		xrequest.send(null);
		return xrequest.responseText;	
	}
	catch(err)
	{	
		return "EXCEPTION: " + err; 
	}		
};





ampUi.serverAdapter.queryVariableValue = function(query, variable) {
	var variables = query.split("&");
	for (var i = 0; i < variables.length; i++) {
		var pair = variables[i].split("=");
		if (decodeURIComponent(pair[0]) == variable) {
			return decodeURIComponent(pair[1]).replace(/(\r\n|\n|\r)/gm, "");
		}
	}
};


ampUi.serverAdapter.authorization = function(login, sessionId){
	return this.httpRequest(this.serverUrl + "?" + "login=" + login +  "&sessionid=" + sessionId);	
}
ampUi.serverAdapter.getCookie = function(name) {
	var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}
ampUi.serverAdapter.setCookie = function(name, value, options) {
	options = options || {};
	var expires = options.expires;
	if (typeof expires == "number" && expires) {
		var d = new Date();
		d.setTime(d.getTime() + expires*24*60*60*1000);
		expires = options.expires = d;
	}
	if (expires && expires.toUTCString) { 
		options.expires = expires.toUTCString();
	}
	value = encodeURIComponent(value);
	var updatedCookie = name + "=" + value;
	for(var propName in options) {
		updatedCookie += "; " + propName;
		var propValue = options[propName];
		if (propValue !== true) {
			updatedCookie += "=" + propValue;
		}
	}
	document.cookie = updatedCookie;
};
ampUi.serverAdapter.httpRequestAntiCache = function(){
	return "&" + "anticache=" + Math.round(Math.random() * 9999) + "-" + Math.round(Math.random() * 9999);
};
ampUi.serverAdapter.serverRequestSend = function(parameter, value) { // Meter Server Requests Sender
	this.bobCount++;
	GHTTPRequestWorker.postMessage(this.serverUrl + "?b=" + this.bobCount + "&" + parameter + "=" + value + "&sessionid=" + this.sessionId + this.httpRequestAntiCache());			
};


ampUi.serverAdapter.initialLogin = function() {
	this.sessionId = this.getCookie('session'); 
	if (typeof this.sessionId === "undefined") this.sessionId = this.httpRequest(this.serverUrl + "?status=sessionid" + this.httpRequestAntiCache()); 
	this.setCookie('session', this.sessionId, 0);
	var login = this.getCookie('login');
    if (typeof login === "undefined") login = ''; 
	var response = this.authorization(login, this.sessionId);	
	return response.search("accepted") != -1;
};

ampUi.serverAdapter.initializeChannelsRequest = function() {
	return this.httpRequest(this.serverUrl + "?" + "status" + "=" + "init&sessionid=" + this.sessionId + this.httpRequestAntiCache());
};

	
// -- HTTP 





// ++ Meters
ampUi.serverAdapter.serverMeterToClient = function(serverValue) { // Char code 100 is max volume 
	var minValue = ampUi.globalSettings.volumeScaleMinimum;;
	return minValue + serverValue * (Math.abs(minValue) / 100);
	
};
// -- Meters



ampUi.serverAdapter.clientPanToServer = function(clientPan) { // 0px is min, 52px is max 
	return Math.round(52 / (ampUi.globalSettings.panMax - ampUi.globalSettings.panMin) * (clientPan - ampUi.globalSettings.panMin)) + "px";
};

ampUi.serverAdapter.serverPanToClient = function(serverPan) { // 0px is min, 52px is max 
	var numericServerPan = parseInt(serverPan.replace("px", ""));
	var step = (ampUi.globalSettings.panMax - ampUi.globalSettings.panMin) / 52;
	return Math.round(ampUi.globalSettings.panMin + numericServerPan * step);
};

ampUi.serverAdapter.clientVolumeToServer = function(clientVolume) { // 269px is min volume, 0px is max 
	return Math.round(269 - (269 / (ampUi.globalSettings.volumeMax - ampUi.globalSettings.volumeMin)) * (clientVolume - ampUi.globalSettings.volumeMin)) + "px";
}

ampUi.serverAdapter.serverVolumeToClient = function(serverVolume) { // 269px is min volume, 0px is max 
	var numericServerVolume = parseInt(serverVolume.replace("px", ""));
	var step = (ampUi.globalSettings.volumeMax - ampUi.globalSettings.volumeMin) / 269; 
	return Math.round(ampUi.globalSettings.volumeMax - numericServerVolume * step);
}



//ampUi.globalSettings.volumeMin ampUi.globalSettings.volumeMax


//https://www.instagram.com/inkymode/saved/


