var Notifier = (function(){

	var singletonInstance;
	
	var init = function(){
		var status = [];
		var checkInterval = 1000;
		
		var initialize = function(){
			status[0] = ["username", "off"];
			status[1] = ["gps", "off"];
			status[2] = ["mode", "off"];
			status[3] = ["flyport", "off"];
			status[4] = ["server", "off"];

		};
		
		return {

			updateUI: function(){
				var notification;
				for(i=0; i<status.length;i++){
					notification = document.getElementById(status[i][0]);
					notification.innerHTML = status[i][0]+": "+status[i][1];
				}
			},
			
			onNewNotification: function(args){
				for(i=0; i<status.length;i++){
					if(status[i][0]==args[0]){
						status[i][1] = args[1];
					}
					
				}
				this.updateUI();
			},
			
			start: function(){
				initialize();
				
				Sandbox.subscribe(this,"Notifications",singletonInstance.onNewNotification);
				
				this.updateUI();
			}
		}
	}
	return{
		getInstance: function(){
			if(!singletonInstance){
				singletonInstance = init();
			}
			return singletonInstance;
		},
		destroyInstance: function(){
			singletonInstance = null;
		}
	};
	
})();
