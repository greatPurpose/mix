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

function HTTPRequestAntiCache(){
	var randomanticache = "&" + "anticache=" + Math.round(Math.random() * 9999) + "-" + Math.round(Math.random() * 9999);
	return randomanticache;
};

function WebqueryVariableValue(query, variable){
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++){
    var pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable){
    	return decodeURIComponent(pair[1]).replace(/(\r\n|\n|\r)/gm, "");
    }
  }
}

function WebqueryVariableCount(query){
  var vars = query.split("&");
	return vars.length;
}