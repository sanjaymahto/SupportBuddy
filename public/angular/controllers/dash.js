myApp.controller('dashCtrl' , [ '$filter' ,'$http' , '$location' ,'$routeParams' ,'queryService' , 'authService',function($filter ,$http , $location, $routeParams , queryService ,authService){


   //check if logged
    this.logged = function(){
    	//console.log("this is logged function");
    	//console.log(queryService.log);
		if(queryService.log == 1){
			return 1;
		}else{
			
		$location.path('/');
		
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

	var main = this;
	this.userId = $routeParams.userId;

	//to hide and show parts of query cards
	this.show = false;

	//get current user(checking if admin)
    this.getUser = function(){
    	queryService.getUser()
    	.then(function successCallBack(response){
    		main.user = response.data.name;
    		//console.log(main.user);
    		if(main.user){

    	        //get all queries for admin dashboard
    	    	queryService.allQueries()
    	    	.then(function successCallBack(response){
    	    		if(response.data.error === true){
    	    			//console.log(response)
    	    			main.noQueriesMsg = response.data.message;
    	    			main.noQueriesDiv = 1;
    	    		}else{
    	    			//console.log(response);
    	    			main.adminQueries = response.data;
    	    			main.getQueries();
    	    		}
    	    	});


    		}
    	});
    }

    this.getUser();

    //get all queries of logged in user
	this.getQueries= function(){
        //console.log(main.user === "Admin")
		if(main.user === "Admin"){
			//console.log("is Admin");
			main.heading = "All The Queries Are Listed Below";
			main.allQueries = main.adminQueries;
			main.queries = main.adminQueries;
			//console.log(main.allQueries)
			//console.log(main.queries)
		}else{
			main.heading = "All Your Queries Are Listed Below";
			queryService.allQueriesOfAUser(main.userId)
			.then(function successCallBack(response){
				var data = response.data.data;
				// console.log(response);
				if(response.data.error){
					//console.log("error")
					//console.log(response)
					main.allQueries = [];
					main.queries = [];
				}else{
					main.allQueries = response.data.data;
					//console.log(main.allQueries);
					main.queries = response.data.data;
					//console.log(main.queries)
				}
			} , function errorCallBack(response){
				alert("Error!! Check console");
			});
		}

	}//end getQueries

    //filter open tickets
	this.open = function(){
		main.queries = $filter('filter')(main.allQueries , {ticketStatus : "Open"});
	}//end

	//filter closed tickets
	this.close = function(){
		main.queries = $filter('filter')(main.allQueries , {ticketStatus : "Close"});
	}//end

	//filter closed tickets
	this.all = function(){
		main.queries = main.allQueries;
	}//end

	//filter closed tickets
	this.allUserQueries = function(){
		 queryService.allQueries()
    	    	.then(function successCallBack(response){
    	    		if(response.data.error === true){
    	    			//console.log(response)
    	    			main.noQueriesMsg = response.data.message;
    	    			main.noQueriesDiv = 1;
    	    		}else{
    	    			//console.log(response);
    	    			main.queries = $filter('filter')(response.data , {ticketStatus : "Open"});
    	    			//main.getQueries();
    	    		}
    	    	});
	}//end

	//filter closed tickets
	this.allUserQueriesC = function(){
		 queryService.allQueries()
    	    	.then(function successCallBack(response){
    	    		if(response.data.error === true){
    	    			//console.log(response)
    	    			main.noQueriesMsg = response.data.message;
    	    			main.noQueriesDiv = 1;
    	    		}else{
    	    			//console.log(response);
    	    			main.queries = $filter('filter')(response.data , {ticketStatus : "Close"});
    	    			//main.getQueries();
    	    		}
    	    	});
	}//end


    //delete query
	this.deleteQuery = function(tno , index){
        //console.log(tno)
        queryService.deleteAQuery(tno)
        .then(function successCallBack(response){
        	//console.log("deleted successfully");
        	main.queries.splice(index , 1);
        	//console.log(response)
        } , function errorCallBack(response){
        	alert("Error!! Check console");
        });

	}//end deleteQuery

    //open/close a query
	this.openclose = function(tno){
		//console.log(tno);

		queryService.openClose(tno)
		.then(function successCallBack(response){
			main.getQueries();
			// console.log(response)
		} , function errorCallBack(response){
			alert("Error!! Check console");
		});
	}//end open/close

    //get status of query(open/close)
	this.getStatus = function(index){

		var query = main.queries[index];
		// console.log(query)
		var status = query.ticketStatus;
		if(status === "Open"){
			return "Close Ticket";
		}else{
			return "Reopen Ticket"
		}
	}//end get status

	//logout
	this.logout = function(){
		authService.setToken();
		main.user = '';
		queryService.logged = 0;
		$location.path('/');
	}

}]);
