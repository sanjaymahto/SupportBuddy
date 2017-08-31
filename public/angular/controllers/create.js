myApp.controller('createCtrl', ['$http', '$location', '$routeParams', 'queryService', 'authService', function ($http, $location, $routeParams, queryService, authService) {

    //check if logged
    this.logged = function () {

        // console.log("this is logged function");
        // console.log(queryService.log);

        if (queryService.log == 1) {
            return 1;
        } else {
            if (queryService.log == 0) {
                $location.path('/');
            }
        }
    }

    //Get the name of the user
    this.getName = function () {
        //get user if logged in
        queryService.getUser()
            .then(function successCallBack(response) {
                main.user = response.data.name;
                queryService.log = 1;
            });
    }

    var main = this;
    this.userId = $routeParams.userId;

    //createQuery
    this.createQuery = function () {

        var data = {
            queryTitle: main.queryTitle,
            queryDetails: main.queryDetails
        }

        var userId = main.userId;

        queryService.newQuery(userId, data)
            .then(function successCallBack(response) {
                main.ticketNumber = response.data.data;
                // console.log(main.ticketNumber);
                main.queryTitle = '';
                main.queryDetails = '';
                setTimeout(function () {
                    alert(" : Thank You for Submitting your Query :");
                }, 100);

            }, function errorCallBack(response) {
                alert("Error check console");
                //console.log(response);
            });
    } //end create query

    //logout
    this.logout = function () {
        authService.setToken();
        main.user = '';
        queryService.logged = 0;
        $location.path('/');
    }


}]);
