self.onmessage = function(e) {
	var response = HTTPRequestWorker(e.data);
  self.postMessage(response);
};

function HTTPRequestWorker(ServerUrlAndRequest){
	try
	{		
		var xrequest = new XMLHttpRequest();
		xrequest.open("GET", ServerUrlAndRequest, false);	 
		xrequest.send();
		if(xrequest.readyState==4 && xrequest.status==200){
			return xrequest.responseText;
		}
		//console.log("no response text");
		return false;
			
	}
	catch(err)
	{	
		//console.log(err);
		return false;		
	}		
}