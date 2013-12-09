var Captor = (function(){
	
	var singletonInstance;
	
	function init(){			
		var flyportState = false;
		var flyportIP = "192.168.43.14";
		var lastCounter = 0;
		var operationInterval;
		var xmlSensor;
		var measure = {lat:null,lng:null,timestamp:null,co2:null};
		
		return{
			
			start: function(){
				Sandbox.subscribe(this,"Notifications",singletonInstance.onNewNotification);
				Sandbox.subscribe(this,"Geolocations",singletonInstance.onNewLocation);
				if(flyportState){
					operationInterval = setInterval(singletonInstance.requestData,3000);
				}
			},
			
			onNewLocation: function(args){
				if(args.length==4){
					measure.lat = args[1];
					measure.lng = args[2];
				}
			},
			
			onNewNotification: function(args){
				
				if(args[0]=="flyport"){
					if(args[1]=="On"){
						flyportState = true;
						operationInterval = setInterval(singletonInstance.requestData,15000);
					}else{
						flyportState = false;
						clearInterval(operationInterval);
					}
				}
			},
			
			requestData: function(){
				var xmlHttp = new window.XMLHttpRequest();
				xmlHttp.open("GET","http://"+flyportIP+"/status.xml",false);
				xmlHttp.send();
				xmlSensor = xmlHttp.responseXML;
				if(xmlSensor != null){
					
					if(lastCounter < xmlSensor.getElementsByTagName("measures")[0].getElementsByTagName("counter")[0].childNodes[0].nodeValue)
					{
						var d = new Date();
						lastCounter = xmlSensor.getElementsByTagName("measures")[0].getElementsByTagName("counter")[0].childNodes[0].nodeValue;
						measure.co2 = xmlSensor.getElementsByTagName("measures")[0].getElementsByTagName("value")[0].childNodes[0].nodeValue;
						measure.timestamp = ""+d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
						Sandbox.publish("Warehouse",["set","Captor",measure.timestamp,measure.lat,measure.lng,measure.co2]);
					}
				}
			}
			
		};
	}
	
	return{
		getInstance: function(){
			if(!singletonInstance){
				singletonInstance = init();
			}
			return singletonInstance;
		},
		destroyInstance: function(){
			singletonInstance.destroy();
			singletonInstance = null;
		}
	};
	
})();