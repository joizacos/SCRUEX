var Warehouse = (function(){
	
	var singletonInstance;
	
	function init(){			
		
		var database = window.openDatabase("UAPoll-Warehouse","1.0","UAPWarehouse",15360);
		var query;
		var caller;
		var type;
		
		var createTable = function(tx){
		//	tx.executeSql('DROP TABLE IF EXISTS MEASUREMENTS');
			tx.executeSql('CREATE TABLE IF NOT EXISTS MEASUREMENTS (mt,lat,long,co2)');
		};
		
		var executeQuery = function(tx){
			tx.executeSql(query,[],successQuery,errorQuery);
		}
		var errorQuery = function(err){
			console.log("query: "+query);
			Sandbox.unlockChannel("Warehouse");
		}
		
		var successQuery = function(tx, results){
			if(caller != null){
				if((type == "get" || type == "getAll") && results.rows.length>0){
					var data = [];
					for(var i=0; i<results.rows.length;i++){
						data[i] = results.rows.item(i);
					}
					console.log("Warehouse: selected "+data.length+" items.");
					Sandbox.publish("Warehouse-Results",[caller,data]);
				}else if(type == "set"){
					Sandbox.publish("Warehouse-Results",[caller,results.rowsAffected]);
				}
			}
			Sandbox.unlockChannel("Warehouse");
		}
		
		var successGet = function(tx, results){
			var len = results.rows.length;
			console.log("affected: "+len);
		}
		
		return{
			
			start: function(){
				database.transaction(createTable);		
				Sandbox.subscribeSpecialCh(this,"Warehouse",singletonInstance.dataBaseRequest);
			},
				
			dataBaseRequest: function(args){
				
				if(args.length <=0){
					return;
				}
				
				type = args[0];
				
				caller = args[1];
				
				if(type == "set"){
					caller = args[1]
					query = 'INSERT INTO MEASUREMENTS (mt,lat,long,co2) VALUES ("'+args[2]+'","';
					query += args[3]+'","'+args[4]+'","'+args[5]+'")';
					database.transaction(executeQuery);
					
				}else if( type == "getAll"){
					query = "SELECT * FROM MEASUREMENTS";
					database.transaction(executeQuery);
					
				}else if( type == "get"){
					query = "SELECT * FROM MEASUREMENTS WHERE long = "+args[2]+" AND lat = "+args[3];
					database.transaction(executeQuery);
				}else if( type == "del"){
					query = 'DELETE FROM MEASUREMENTS WHERE mt="'+args[2]+'"';
					database.transaction(executeQuery);
				
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
