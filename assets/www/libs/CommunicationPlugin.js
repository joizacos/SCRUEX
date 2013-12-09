/**
 *  Javascript API of UAirPollCommunicationPlugin
 *  API: 0.3.2 (master)
 *  Corresponds: UAirPollCommunicationPlugin 0.3.0 (master)
 *  Author: Luis Miguel Domínguez Peinado. 
 *  Date: 08/02/2012
 */

var Communication = function() {
};

Communication.prototype.login = function(data,successCallback, failureCallback) {
	 return PhoneGap.exec(    successCallback,    //Success callback from the plugin

	      failureCallback,     //Error callback from the plugin

	      'CommunicationPlugin',  //Tell PhoneGap to run "DirectoryListingPlugin" Plugin

	      'login',              //Tell plugin, which action we want to perform

	      data);        //Passing list of args to the plugin

	};
	
Communication.prototype.signup = function(data,successCallback, failureCallback) {
	 return PhoneGap.exec(    successCallback,    //Success callback from the plugin

	      failureCallback,     //Error callback from the plugin

	      'CommunicationPlugin',  //Tell PhoneGap to run "DirectoryListingPlugin" Plugin

	      'signup',              //Tell plugin, which action we want to perform

	      data);        //Passing list of args to the plugin

	};
	
Communication.prototype.sendData = function(data,successCallback, failureCallback) {
	 return PhoneGap.exec(    successCallback,    //Success callback from the plugin

			 failureCallback,     //Error callback from the plugin

	      'CommunicationPlugin',  //Tell PhoneGap to run "DirectoryListingPlugin" Plugin

	      'sendData',              //Tell plugin, which action we want to perform

	      data);        //Passing list of args to the plugin

	};
	
Communication.prototype.getData = function(data,successCallback, failureCallback) {
	 return PhoneGap.exec(    successCallback,    //Success callback from the plugin

			 failureCallback,     //Error callback from the plugin

	      'CommunicationPlugin',  //Tell PhoneGap to run "DirectoryListingPlugin" Plugin

	      'getData',              //Tell plugin, which action we want to perform

	      data);        //Passing list of args to the plugin

	};

Communication.prototype.setServerAddress = function(data,Callback) {
	 return PhoneGap.exec(    Callback,    //Success callback from the plugin

			 Callback,     //Error callback from the plugin

	      'CommunicationPlugin',  //Tell PhoneGap to run "DirectoryListingPlugin" Plugin

	      'setUAPServerAddress',  //Tell plugin, which action we want to perform

	      data);        //Passing list of args to the plugin

	};


 
Cordova.addConstructor(function() {

	if(!window.Cordova){
		window.Cordova = cordova;
	}
	
	if(!window.plugins){
		window.plugins = {};
	}

	window.plugins.communication = new Communication();
});