var Session = (function(){
	
	var singletonInstance;
	
	function init(){			
			var loginDiv = document.getElementById("session");
			var username;
			var password;
			var userkey = null;
			var UIState = 0;
			var serverState = false;
			
			var loginReset = function(){
				var usernameInput = document.getElementById("login_username").value="Luismi";
				var passwordInput = document.getElementById("login_password").value="1234";
			}
			
			var loginShow = function(){
				loginDiv.style.visibility='visible';
				UIState = 1;
			};
			var loginHide = function(){
				loginDiv.style.visibility='hidden';
				UIState = 0;
				loginReset();
			};
			
		return{
			
			start: function(){
				username = null;
				password = null;
				userkey = null;
				
				Sandbox.subscribe(this,"Navigations",singletonInstance.onNewNavRequest);
				Sandbox.subscribe(this,"Session",singletonInstance.onSessionResponse);
				Sandbox.subscribe(this,"Notifications",singletonInstance.onNewNotification);
			},

			onNewNotification: function(args){
				
				if(args[0]=="server"){
					if(args[1]=="On"){
						serverState = true;
					}else{
						serverState = false;
					}
				}
			},
			
			onNewNavRequest: function(args){

				if(args[0] == "Session"){
					if(args[1]== "open" && UIState==0){
						if(userkey!=null){
							userkey=null;
							Sandbox.publish("Notifications",["username","Off"]);
						}else if(serverState){
							loginShow();
						}else{
							//Notificar la falta de conectividad con el servidor.
						}
					}else if(args[1]=="close" && UIState==1){
						loginHide();
					}
				}
			},
			
			onSessionResponse: function(args){
				var responseType = args[0];
				if(responseType =="loginResponse"){
					if(args[1].indexOf("CorrectLoginResponse")!=-1){
						userkey=args[1].substring(29,37);
						Sandbox.publish("Notifications",["username",username]);
						Sandbox.publish("Notifications",["ukey",userkey]);
					}else if(args[1].indexOf("IncorrectLoginResponse")!=-1){
						Sandbox.publish("Notifications",["username","Off"]);
					}
				}else if(responseType == "signupResponse"){
					alert(args[1]);
				}
			},
			
			//Cuando se escribe en un campo de texto o de contraseña, elimina el contenido si es el predefinido.
			onWriting: function(context){
				var value = context.value;
				
				if(value =="Usuario" || value =="Clave" || value=="Email"){
					context.style.borderColor="white";
					context.value = "";
				}
				
			},
			
			//CUando se deselecciona un campo si no tiene nada escrito se vuelve a poner el texto predefinido.
			onBlur: function(context){
				var id = context.id;
				var value = context.value;
				
				if(value == null || value == ""){
					if(id == "login_username"){
						context.value = "Usuario";
					}else if(id == "login_password"){
						context.value = "Clave";
					}else if(id == "signup_username"){
						context.value = "Usuario";
					}else if(id == "signup_username"){
						context.value = "Clave";
					}else if(id == "signup_email"){
						context.value = "Email";
					}
				}
			},
			
			//Cuando se presiona el botton de login, se validan los datos introducidos y se envía la información al canal apropiado
			onLoginButtonPressed: function(){
				var usernameInput = document.getElementById("login_username");
				username = usernameInput.value;
				var passwordInput = document.getElementById("login_password");
				password = passwordInput.value;
				
				if(username == null || username=="" || username == "Usuario"){
					//Notificar que se debe rellenar el campo de usuario
					usernameInput.style.borderColor = "red";
					usernameInput.value="Usuario";
				}
				
				if(password == null || password=="" || password == "Clave"){
					//Notificar que debe introducir una contraseña
					passwordInput.style.borderColor = "red";
					passwordInput.value="Clave";
				}
				
				if(username !=null && username!="" && username!="Usuario" && password !=null && password != "" && password != "Clave"){
					//Notificar que se esta intentando hacer login
					Sandbox.publish("Session",["login", username, password]);
					loginHide();
					Sandbox.publish("Notifications",["username","..."]);
				}
			},
			
			onSignupButtonPressed: function(){
				var usernameInput = document.getElementById("login_username");
				username = usernameInput.value;
				var passwordInput = document.getElementById("login_password");
				password = passwordInput.value;
				var emailInput = document.getElementById("signup_email");
				email = emailInput.value;
				
				if(username == null || username=="" || username == "Usuario"){
					//Notificar que se debe rellenar el campo de usuario
					usernameInput.style.borderColor = "red";
					usernameInput.value="Usuario";
				}
				
				if(password == null || password=="" || password == "Clave"){
					//Notificar que debe introducir una contraseña
					passwordInput.style.borderColor = "red";
					passwordInput.value="Clave";
				}
				
				if(email == null || email=="" || email == "Email"){
					//Notificar que debe introducir una contraseña
					passwordInput.style.borderColor = "red";
					passwordInput.value="Email";
				}
				
				if(username !=null && username!="" && username!="Usuario" && password !=null && password != "" && password != "Clave"&& email != "Email"&& email != ""){
					//Notificar que se esta intentando hacer el registro
					Sandbox.publish("Session",["signup", username, password, email]);
					loginHide();
					
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
