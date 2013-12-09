function loadTemperatura()
{	
  var xmlhttp=new XMLHttpRequest();
  xmlhttp.open("GET","http://192.168.43.13/status.xml",false); 
  xmlhttp.send();
  document.getElementById('temp').innerHTML = xmlhttp.responseText.substring(42);
}

setTimeout("loadTemperatura()",200);

function ApagarLuz()
{
  var xmlhttp=new XMLHttpRequest();
  xmlhttp.open("GET","http://192.168.43.13/leds.cgi?led=1",false);
  xmlhttp.send();
  alert("Luz Apagada");
}

function EncenderLuz()
{
  var xmlhttp=new XMLHttpRequest();
  xmlhttp.open("GET","http://192.168.43.13/leds.cgi?led=0",false);
  xmlhttp.send();
  alert("Luz Encendida");
}

function volverInicio()
{
  alert("Cerrando sesion..");
  window.location.href="index.html";
}

function saveDatos(){

  alert("Guardando datos...");
  var xmlhttp=new XMLHttpRequest();
  var t = document.getElementById('temp').innerHTML;
  xmlhttp.open("GET","http://smartclassroom-uex.com/guardarTemp.php?temp="+t,false);
  xmlhttp.send();
  if(xmlhttp.responseText == 'OK'){
	alert("Datos guardados");
  }
}