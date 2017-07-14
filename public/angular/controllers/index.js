myApp.controller('indexCtrl' , [ '$http' , '$location' ,'queryService' , 'authService' ,function($http , $location , queryService, authService ){

var main = this;
	this.log = 0;
	this.sign = 0;

	queryService.log = this.log;
	queryService.sign = this.sign;

    //check if logged
    this.logged = function(){
    	//console.log("this is logged function");
    	//console.log(queryService.log);
		if(queryService.log == 1){
			return 1;
		}else{
			
			return 0;
		}
	}

//Get the name of the user
	 this.getName = function(){
    	//get user if logged in
    	queryService.getUser()
    	.then(function successCallBack(response){
    		main.user = response.data.name;
    		queryService.log = 1;
    	});
    }

    //function to process login
	this.submitLog = function(){

		var data = {
			email: main.email,
			password: main.password
		}

		queryService.login(data)
		.then(function successCallBack(response){
			if(response.data.error === true){
				alert(response.data.message);
			}else{

    			var userId;
    			var data = response.data.data;
    			//console.log(data);
        		//hide login/signup modal
        			 angular.element('#loginModal').modal('hide');
                //set logged status  
                queryService.log = 1;
                //console.log(response.data.token);
                authService.setToken(response.data.token);
    			$location.path('/dashboard/'+data._id);
			}
		} , function errorCallBack(response){
			//console.log(response);
			alert("Error!! Check console");
		});
	}//end submitLog

    //function to process signup
	this.submitSign = function(){

		var data = {
			name: main.name,
			email: main.email,
			password: main.password,
			mobileNumber: main.mobileNumber
		}
		queryService.signUp(data)
		.then(function successCallBack(response){
			//console.log(response);
			if(response.data.error === true){
				alert(response.data.message)
			}else{
				//hide signup modal
        		angular.element('#signupModal').modal('hide');
                queryService.log = 1;
				authService.setToken(response.data.token);
				var data = response.data.data;
				$location.path('/dashboard/'+data._id);
			}
		} , function errorCallBack(response){
			//console.log(response);
            if(response.status === 400){
            	alert(response.data);
            }else {
            	alert(response.data.message);
            }
		});

	}//end submitSign
	
}]);
