function loadXMLDoc(){
  var xmlhttp=new XMLHttpRequest();
  xmlhttp.open("GET","http://smartclassroom-uex.com/accesoUsuarios.php?user="+$('#name').val()+"&pass="+$('#password').val(), false);
  xmlhttp.send();
	if(xmlhttp.responseText == 'OK'){
		alert('Bienvenido, el usuario ha accedido a la plataforma de SmartClassRoom');
		window.location.href="flyport.html";
	}
	else{
		alert('El usuario no tiene registro en la plataforma SmartClassRoom');
	}
}