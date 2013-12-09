var Settings = (function(){
	
	var singletonInstance;
	
	function init(){			
		var settings = window.localStorage;
			
		return{
			
			start: function(){
				Sandbox.subscribe(this,"Settings",singletonInstance.settingRequest);
			},
			
			//formato de la petición: tipo(set/get/del), remitente, setting's name, [setting's value]
			settingRequest: function(args){
				
				if(args.length<=0)
				{
					return;
				}
				var type = args[0];
				if(type == "add"){
					if(settings.getItem(args[2]==undefined)){
						settings.setItem(args[2],args[3]);
					}else{
						var setting = settings.getItem(args[2]);
						Sandbox.publish("Settings",[args[1],args[2],setting]);
					}
				}else if(type == "set"){
					settings.setItem(args[2],args[3]);
				}else if(type == "get"){
					var setting = settings.getItem(args[2]);
					Sandbox.publish("Settings",[args[1],args[2],setting]);
				}else if(type == "del"){
					settings.removeItem(args[2]);
				}else if(type == "removeall"){
					settings.clear();
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
