var GSessionID;
var ServerUrl =  window.location.href;
function init(){	
	// check cookies
	GSessionID = getCookie('session'); 
	if (typeof GSessionID==="undefined") { 
	  GSessionID = HTTPRequestSend(ServerUrl + "?status=sessionid" + HTTPRequestAntiCache()); }
	setCookie('session',GSessionID,0);
	var Login1 = getCookie('login');
    if (typeof Login1 === "undefined") { Login1=''; }
	var Response1 = Authorization(Login1,GSessionID);	
	//if (Response1.search("accepted") != -1){
		window.open("main.html", "_self"); 
		return;
  	//  }
	document.getElementById("ClassLogin").focus();
}

function OnLoginEnter(event){
	if (event.keyCode == 13)
		OnSubmitClick();
}

function OnSubmitClick(){
var ServerUrl =  window.location.href;
    if (typeof GSessionID==="undefined") { 
	  GSessionID = HTTPRequestSend(ServerUrl + "?status=sessionid" + HTTPRequestAntiCache()); 
	  setCookie('session',GSessionID,0); }
	var Login1 = document.getElementById("ClassLogin").value;
//	var Password1 = document.getElementById("ClassPassword").value;
	var Response1 = Authorization(Login1, GSessionID);
	var Expire1 = "";
	if (document.getElementById("rem").checked){
		var Rem1 = 1; 
		var Expire1 = 365;
	}else{
		var Rem1 = 0; 
	}	
	if (Response1.search("accepted") != -1)
	{ // set cookies
		setCookie('rem', Rem1, Expire1);
		setCookie('login', Login1, Expire1);
      // end of set cookies
		window.location.replace("main.html");	
	
	}
	else
	{
		alert("Login and Password Declined");								
	}
return false;	
}

function Authorization(login, GSessionID){
	var Login1 = "login=" + login;
	return HTTPRequestSend(ServerUrl + "?" + Login1 +  "&sessionid=" + GSessionID);	
}