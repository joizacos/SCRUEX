

var Menu = (function(){
	
	var singletonInstance;
	
	function init(){
		
		var navigationOrders = [];
		
		var initNavigationOrders = function(){
			//navigationOrders[]=[ordername,ordertype,target,[order]];
			navigationOrders[0] = ["session","Navigations",["Session","open"]];
			navigationOrders[1] = ["settings","Navigations",["Settings","open"]];
			navigationOrders[2] = ["synchro","Navigations",["Synchronizer","open"]];
		}
		
		return{
			start: function(){

				document.addEventListener("menubutton",Menu.getInstance().toggleMenu,false);
				initNavigationOrders();
			},
			toggleMenu: function(){				
				var menu = document.getElementById("menu");
				if(menu.style.visibility=='hidden'){
					menu.style.visibility='visible';
				}else{
					menu.style.visibility='hidden';
				}
				
			},
			onLinkUsed: function(args){
				for(i=0; i<navigationOrders.length;i++){
					if(navigationOrders[i][0]==args){
						Sandbox.publish(navigationOrders[i][1],navigationOrders[i][2]);
					}
				}
				this.toggleMenu();
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
			singletonInstance = null;
		}
	};
	
})();
