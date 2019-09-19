// 1
function One()
{
  // Tabs
  document.getElementById('FirstTab').className = 'SelectedTab';
  document.getElementById('SecondTab').className = 'Tab';
 
  // Pages
  load_PageOne();
  
  document.getElementById('PageOne').style.display = 'block';
  //document.getElementById('FirstTab').className = 'SelectedTab';
  document.getElementById('PageTwo').style.display = 'none'; 
}

// 2
function Two()
{
  // Tabs
  document.getElementById('FirstTab').className = 'Tab';
  document.getElementById('SecondTab').className = 'SelectedTab';
 
  // Pages
  load_PageTwo();
  
  document.getElementById('PageOne').style.display = 'none';
  document.getElementById('PageTwo').style.display = 'block';
}

/*Get Document body width*/
function getDocumentWidth() {
	return (document.body.scrollWidth > document.body.offsetWidth) ? document.body.scrollWidth : document.body.offsetWidth;
}

/*Get Document body height*/
function getDocumentHeight() {
	return (document.body.scrollHeight > document.body.offsetHeight) ? document.body.scrollHeight : document.body.offsetHeight;
}

/*Control panel show*/
function cpan_show(){
	/*Load content for defoult page*/
	load_PageOne();	
	/*Set 'ClassShadow' div parameters*/
	document.getElementById('ClassShadow').style.width=getDocumentWidth()+'px';
	document.getElementById('ClassShadow').style.height=getDocumentHeight()+'px';
	document.getElementById('ClassShadow').style.display='block';
	/*Show the cpanel*/	
	/*Calculate control panel css 'left' position 50% with screen x offset*/	
	var new_position_x=Math.ceil(((document.body.offsetWidth/100)*50)+document.body.scrollLeft);

	/*Set new left position and show cpan div*/	
	document.getElementById('control_panel').style.left=new_position_x + 'px';	
	document.getElementById('control_panel').style.display='block';	
}

/*Control panel hide*/
function cpan_hide(){
	document.getElementById('ClassShadow').style.display='none';
	document.getElementById('control_panel').style.display='none';		
}

/*Tab`s content*/
/*Checkbox state*/
function showPass(){
	sp = document.getElementById('show_pass');
	if (sp.checked)	{var show_password='text';}else{var show_password='password'}
}

/*First tab content*/
function load_PageOne(){
	var old_username = getCookie('login');
	if (old_username == undefined)
		old_username = "";
	var content = '<span style="position:absolute; left:170px; top:0px;"><h1>Login / Password management</h1></span>' +
								'<label for="old_username" style="position:absolute; left:20px; top:55px;">Old User Name:</label>' +
								'<input style="position:absolute; left:120px; top:52px;" name="old_username" type="text" id="old_username" tabindex="1" value="' + old_username + '">' +
								'<label for="new_username" style="position:absolute; left:278px; top:55px;">New User Name:</label>' +
								'<input style="position:absolute; left:395px; top:52px;" name="new_username" type="text" id="new_username" tabindex="2">' +
								'<label for="old_pass" style="position:absolute; left:20px; top:102px;">Old Password:</label>' +
								'<input style="position:absolute; left:120px; top:97px;" name="old_pass" type="password" id="old_pass" tabindex="3">' +
								'<label for="new_pass" style="position:absolute; left:278px; top:102px;">New Password:</label>' +
								'<input style="position:absolute; left:395px; top:97px;" name="new_pass" type="password" id="new_pass" tabindex="4">' +
								'<input style="position:absolute; left:117px; top:143px;" type="checkbox" name="show_pass" id="show_pass">' +
								'<label for="show_pass" style="position:absolute; left:145px; top:145px;">Show password</label>' +
								'<label for="confirm_pass" style="position:absolute; left:278px; top:145px;">Confirm Password:</label>' +
								'<input style="position:absolute; left:395px; top:142px;" name="confirm_pass" type="password" id="confirm_pass" tabindex="5">' +
								'<div id="error_screen" style="position:absolute; left:20px; top:245px; color:#FFDFDF; font-weight:bold;">ERROR: Content for New Div Tag Goes Here</div>' +
								'<input style="position:absolute; left:215px; top:280px;" type="button"; name="change_btn" id="change_btn" value=" Change ">';
	document.getElementById("PageOne").innerHTML = content;
}

/*Second tab content*/
function load_PageTwo(){
	var content = '<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To be continued . . .</p>';
	document.getElementById("PageTwo").innerHTML = content;
}