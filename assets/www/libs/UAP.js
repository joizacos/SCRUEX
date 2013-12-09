

var Sandbox = (function(){
	var channels = [];
	
	return{
		subscribe: function(context,channel,callback){
			if(!channels[channel]){
				channels[channel] = {
						type:"normal",
						subs: []
				};
			}
			channels[channel].subs.push({context:context, callback: callback});
			return this;
		},
		subscribeSpecialCh: function(context,channel,callback){
			if(!channels[channel]){
				channels[channel] = {
						type:"special",
						subs: [],
						lock: false,
						queue: []
				};
			}
			if(channels[channel].subs.length<1){
				channels[channel].subs.push({context:context, callback: callback});
			}else{
				console.log("Only one subscriber is allowed in special channels");
			}
			return this;
		},
		
		publish: function(channel){
			if(!channels[channel]) return false;
			var ch = channels[channel];
			
			var args = Array.prototype.slice.call(arguments,1);
			
			if(ch.type == "normal"){
				for(var i = 0, l = channels[channel].subs.length;i<l;i++){
					var subscription = channels[channel].subs[i];
					subscription.callback.apply(subscription.context, args);
				}
			}else if(ch.type == "special"){
				var subscription = ch.subs[0];
				if(!ch.lock && ch.queue.length==0){
					subscription.callback.apply(subscription.context, args);
					ch.lock = true;
					console.log("Sandbox->>("+channel+") free");
				}else if(!ch.lock && ch.queue.length > 0){
					ch.queue.push({context: subscription.context, callback: subscription.callback, arguments: args});
					var queued = ch.queue.shift();
					queued.callback.apply(queued.context,queued.arguments);
					ch.lock = true;
					console.log("Sandbox-locking->>("+channel+") ocupation: "+ch.queue.length);
				}else if(ch.lock){
					ch.queue.push({context: subscription.context, callback: subscription.callback, arguments: args});
					console.log("Sandbox-locked->>("+channel+") ocupation: "+ch.queue.length);
				}
			}
			return this;
		},
		
		unlockChannel: function(channel){
			var ch = channels[channel];
			if(ch.type=="special" && ch.lock){
				
				if(ch.queue.length > 0){
					var queued = ch.queue.shift();
					queued.callback.apply(queued.context,queued.arguments);
					ch.lock = true;
					console.log("Sandbox-unlock->>("+channel+") ocupation: "+ch.queue.length);
				}else{
					ch.lock = false;
				}
			}
		}
	}
}());

var UAP = (function(){
	
	var modules = [];
	var serverAddress =  "85.59.149.164";
	var flyportAddress = "192.168.43.14";
	
	var isRegistered = function(id){
		if(modules[id]!==undefined){
			return true;
		}else{
			return false;
		}
	};
	
	var checkServerStatus = function(){
		var http = new XMLHttpRequest();
		
		http.onreadystatechange = function (){
			if(http.readyState == http.DONE &&  http.status==200){
				Sandbox.publish("Notifications",["server","On"]);

			}else{
				Sandbox.publish("Notifications",["server","Off"]);

			}
		}
		http.open("GET","http://"+serverAddress+":8080/UAirPoll/connectivityCheck.do",true);
		http.send();
		
	};
	
	var checkFlyportStatus = function(){
			var http = new XMLHttpRequest();
			
			http.onreadystatechange = function (){
				if(http.readyState == http.DONE &&  http.status==200){
					Sandbox.publish("Notifications",["flyport","On"]);
				}else{
					Sandbox.publish("Notifications",["flyport","Off"]);
				}
			}
			http.open("GET","http://"+flyportAddress+"/connectivityCheck.html",true);
			http.send();
	};
	
	return{
	
		registerModule: function(id, api){
			if(modules[id]===undefined){
				modules[id] = {
						nombre: id,
						instance: null,
						api: api 
				};

			}
		},
		
		startModule: function(id){
			if(!(modules[id]===undefined)){	
				if(modules[id].instance ===null){
					modules[id].instance = modules[id].api.getInstance();
					modules[id].instance.start();
				}
			}
			
		},
		
		stopModule: function(id){
			if(!(modules[id]===undefined)){	
				modules[id].api.destroyInstance();
			}
		},
		
		startAllModules: function(){
			var length = modules.length;
			var i = 0;
			for(i=0;i<length;i++){
				startModule(modules[i]);
			}
			
		},
		
		onLoginResponse: function(arg){	
		
			Sandbox.publish("Session",["loginResponse",arg.result]);
		},
		
		onSignupResponse: function(arg){
			Sandbox.publish("Session",["signupResponse",arg.result]);
		},
		
		onLoginErrorResponse: function(arg){	
			Sandbox.publish("Notifications",["username","Off"]);
		},
		
		onSignupErrorResponse: function(arg){
			console.log("La cuenta no se ha podido crear correctamente.");
		},
		
		sendSessionToServer: function(args){
			var action = args[0];
			if(action=="login"){
				var data = [];
				data [0] = args[1];
				data [1] = args[2];
				window.plugins.communication.login(data,UAP.onLoginResponse,UAP.onLoginErrorResponse);
			}else if(action=="signup"){
				var data = [];
				data [0] = args[1];
				data [1] = args[2];
				data [2] = args[3];
				window.plugins.communication.signup(data,UAP.onSignupResponse,UAP.onSessionErrorResponse);
			}
			
		},
		
		operateWithServer: function(args){
			var action = args[0];
			if(action=="sendData"){
				var data = args[1];				
				window.plugins.communication.sendData(data,UAP.onServerResponse,UAP.onServerResponse);
			}else if(action=="getData"){
				var data = args[1];
				console.log("Requesting data->>ne: "+data[0]+"lat - "+data[1]+"lng  "+"so: "+data[2]+"lat - "+data[3]+"lng")
				window.plugins.communication.getData(data,UAP.onServerResponse,UAP.onServerErrorResponse);
			}
			
		},
		
		onServerResponse: function(args){
			Sandbox.publish("ServerOpResponse",["serverResponse",args.result]);
		},
		
		onServerErrorResponse: function(args){
			console.log("error"+args);
		},
		
		getGeolocation: function(){
			navigator.geolocation.getCurrentPosition(
					function(position){
						Sandbox.publish("Notifications",["gps","On<br>("+(position.coords.accuracy/100)+"%)"]);
						Sandbox.publish("Geolocations",[position.timestamp,position.coords.latitude,position.coords.longitude,position.coords.accuracy]);
					},
					function(error){
						Sandbox.publish("Notifications",["gps","Off"]);
					},
					{maximumAge:1000, timeout:5000, enableHighAccuracy:true}
			);
		},
		
		
		
		checkList: function(){
			//server connectivity check
			checkServerStatus();
			checkFlyportStatus();
		},
		
		init: function(){
			window.plugins.communication.setServerAddress(serverAddress,"8080");
			
			//Registrando acción de menu
			Sandbox.subscribe(this,"Session",UAP.sendSessionToServer);
			Sandbox.subscribe(this,"ServerData",UAP.operateWithServer);
			
			setTimeout(UAP.checkList,5000);
			setInterval(UAP.checkList,20000);
			setInterval(UAP.getGeolocation,2000);
			
			

		}
	}
})();
 