

var Splash = ( function(){
	
	var singletonInstance;
	
	function init(){
		var splashDiv = document.getElementById('splash');
		var splashDivOpacity = 1.0;
		var minTime = 2; //In seconds
		var maxTime = 5; //In seconds
		var step= ((33 * 100) / ((maxTime - minTime)*1000))/100;
		var interval;
		
		return {
			start: function(){
				
				setTimeout("Splash.getInstance().fade()", minTime * 1000);
				
			},
			
			fade: function(){
				interval = setInterval("Splash.getInstance().fadeStep()",30);
			},
			
			fadeStep: function(){
				
				splashDivOpacity -=step;
				if(splashDivOpacity <0){
					
					splashDivOpacity =0;
					clearInterval(interval);
					splashDiv.style.display='none';
				}
				splashDiv.style.opacity= splashDivOpacity.toString();
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