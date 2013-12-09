var Synchronizer = (function(){
	
	var singletonInstance;
	
	function init(){			
		
		var server = false;
		var mode = false;
		var ukey = null
		var operationInterval = null;
		var localDataTimeout = null;
		var ml = []; //Measures List
		var waitingLocalData = false;
		
		var rangeOfCoordinates = null;
		
		var checkExportConditions = function(){
			if(server == true && mode == true && ukey!=null && waitingLocalData == false){
				return true;
			}else{
				return false;
			}
		}
		
		var checkImportConditions = function(){
			if(server == true){
				return true;
			}else{
				return false;
			}
		}
			
		return{
			
			start: function(){
				Sandbox.subscribe(this,"Notifications",singletonInstance.onNewNotification);
				Sandbox.subscribe(this,"Session",singletonInstance.onNewNotification);
				Sandbox.subscribe(this,"Warehouse-Results",singletonInstance.onLocalData);
				Sandbox.subscribe(this,"ServerOpResponse",singletonInstance.onServerResponse);
				
				operationInterval = setInterval(singletonInstance.run,2000);
			},
			
			run: function(){
				if(checkExportConditions()){
					if(ml.length < 1){
						
						Sandbox.publish("Warehouse",["getAll","Synchronizer"]);
						waitingLocalData = true;
						setTimeout(singletonInstance.noWaitForLocalData,60000);
						console.log("Synchronizer: Requesting local data");
						
						
					}else if(ml[0].status == "Ready"){
						
						Sandbox.publish("ServerData",["sendData",[ml[0].mt, ml[0].long, ml[0].lat, ml[0].co2,ukey]]);
						ml[0].status = "Waiting Response";
						console.log("Synchronizer: sending insert data request");
						
					}else if(ml[0].status == "Received"){
						
						var data = ml.shift();
						Sandbox.publish("Warehouse",["del","",data.mt]);
						console.log("Synchronizer: order delete of element with timestamp: "+data.mt);
					}
				}
			},
			
			onLocalData: function(args){
				
				if(args[0] =="Synchronizer"){
					console.log("Synchronizer: local Data Received ("+args[1].length+")");
					
					for(var i=0;i<args[1].length;i++){
						ml[i] = args[1][i];
						ml[i].status = "Ready";
					}
					console.log("Synchronizer: local Data Initialized ("+ml.length+")");
					waitingLocalData = false;
				}
			},
			noWaitForLocalData: function(){
				waitingLocalData = false;
			},
			
			clean: function(){
				if(!checkExportConditions() && ml.length>0){
					console.log("limpiando");
					ml = [];
				}
			},
			
			onNewNotification: function(args){
				var type = args[0];
				var msg = args[1];
				
				if(type == "server"){
					if(msg == "On"){
						server = true;
						if(localDataTimeout != null){
							clearTimeout(localDataTimeout);
							localDataTimeout = null;
						}
					}else if(msg == "Off"){
						server = false;
						localDataTimeout = setTimeout(singletonInstance.clean,30000);
					}
				}else if(type == "username"){
					if(msg == "Off" && ukey !=null){
						ukey = null;
						clean();
					}
				}else if(type == "mode"){
					if(msg == "On"){
						mode = true;
					}else if(msg == "Off" && !mode){
						mode = false;
						clean();
					}
				}else if(type == "ukey"){
					ukey = msg;
				}
				
				else if(type == "bounds"){
					Sandbox.publish("ServerData",["getData",[args[1],args[2],args[3],args[4]]]);
				}
			},
			
			onServerResponse: function(args){
				if(args[0] == "serverResponse"){
					if(args[1].substr("InsertDataRequestResponse")!= -1){
						if(args[1].substr("OK")!= -1){
							ml[0].status = "Received";
						}
					}else if(args[1].substr("GetDataRequestResponse")!= -1){
						console.log(args[1]);
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