var Cartographer = (function(){
	
	var singletonInstance;
	
	function init(){
		var position;
		var map;
		var mapDiv = document.getElementById("map");
		var latlng;
		var bounds;
		
		return{
			start: function(){
				
				Sandbox.subscribe(this,"Geolocations",singletonInstance.onLocationChange);
				
				var latlng = new google.maps.LatLng(40.030564,-6.088272);
			    var myOptions = {
			      zoom: 18,
			      center: latlng,
			      disableDefaultUI: true,
			      
			      mapTypeId: google.maps.MapTypeId.ROADMAP
			    };
			    map = new google.maps.Map(mapDiv, myOptions);
			    
			    position = new google.maps.Marker({
			    	position: latlng,
			    	title:"Estas aquí."
			    });
			    position.setMap(map);
			},
		
			onLocationChange: function(args){
				map.setCenter( new google.maps.LatLng(parseFloat(args[1]),parseFloat(args[2])));
				position.setPosition(new google.maps.LatLng(parseFloat(args[1]),parseFloat(args[2])));
				
				if(map.getBounds()!=bounds){
					bounds = map.getBounds();
				
					Sandbox.publish("Notifications",["bounds",
				                                 bounds.getNorthEast().lat(),
				                                 bounds.getNorthEast().lng(),
				                                 bounds.getSouthWest().lat(),
				                                 bounds.getSouthWest().lng()]);
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
			singletonInstance = null;
		}
	};
	
})();

/*var Cartographer = (function(){

	var position;
	var map;
	var latlng;
	return {
		init: function(){
			
			var latlng = new google.maps.LatLng(40.030564,-6.088272);
		    var myOptions = {
		      zoom: 18,
		      center: latlng,
		      disableDefaultUI: true,
		      
		      mapTypeId: google.maps.MapTypeId.ROADMAP
		    };
		    map = new google.maps.Map(document.getElementById("map"),
		        myOptions);
		    
		    position = new google.maps.Marker({
		    	position: latlng,
		    	title:"Estas aquí."
		    });
		    position.setMap(map);
		},
		start: function(){
			this.init();
		}
	}
});*/