/*EQ panel hide*/
function eq_hide(){
	document.getElementById('ClassEQIDPanel').style.display='none';		
}

function eq_show(){
	/*Show the eq panel*/	
	/*Calculate eq panel css 'left' position 50% with screen x offset*/	
	var eq_position_x=Math.ceil(((document.body.offsetWidth/100)*50)+document.body.scrollLeft);
	
	/*Set new left position and show eq div*/	
	document.getElementById('ClassEQIDPanel').style.left=eq_position_x + 'px';	
	document.getElementById('ClassEQIDPanel').style.display='block';	
}