//Authorization Factory to manage token
myApp.factory('authService' , ['$window' , function($window){

	var authToken = {};

	//accesing local storage through $window service
    var store = $window.localStorage;
    var key = 'auth-token';

    //function to get token from local storage
	authToken.getToken = function(){
		//console.log(store.getItem(key));
		return store.getItem(key);
	}

    //function to set token to local storage
	authToken.setToken = function(token){
		if(token){
			store.setItem(key, token);
		}else{
			store.removeItem(key);
		}
	}
	
	return authToken;

	
}]);