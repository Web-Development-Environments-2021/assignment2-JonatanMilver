loginValidation = (username, password) => {
	if(!(username in users) || users[username].password !== password){
		$('#loginAlert').toggle();
		return false;
	}
	$('#welcomePage').hide();
	$('#loginPage').toggle();
	$('#settingsPage').toggle();
	document.getElementById('loginForm').reset();
	return true;
}

closeBtns = () => {
	let close = document.getElementsByClassName("closebtn");
	let i;

	for (i = 0; i < close.length; i++) {
	close[i].onclick = function(){
		var div = this.parentElement;
		div.style.opacity = "0";
		setTimeout(function(){ div.style.display = "none"; }, 600);
		}
	}
}