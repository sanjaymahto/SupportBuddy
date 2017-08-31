//Including Mongoose file for database Connectivity...
var mongoose = require('mongoose');

//Including Express Module...
var express = require('express');
var app = express();

//Including body-parser to parse the header
var bodyParser = require('body-parser');

//includeing xoauth2
var xoauth2 = require('xoauth2');

//defining router...
var ticketRouter = express.Router();

//Including Models...
var User = mongoose.model('User');
var Ticket = mongoose.model('Ticket');

//response generating utility
var resGenerator = require('./../../libs/resGenerator');

//shortId to generate unique ticketNumber and to  ease the db accessing through unique id
var shortid = require('shortid');

//nodemailer for sending mail notifications
var nodemailer = require('nodemailer');

//creating new instance of event emitter for using node event emitter
var events = require('events');
var eventEmitter = new events.EventEmitter();

//requiring jwt authentication to check whether the user is authenticated or not...
var jwt = require('jsonwebtoken');

//defining decodeing Token Variable
var decodedToken;

var auth = function (req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret key and checks Whether its Expired or not.
        jwt.verify(token, "97hw9a73hr2q@#$#@mo8afjoeidha0e8doh", function (err, decoded) {

            if (err) {

                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });

            } else {

                // if everything is good, save to request for use in other routes
                decodedToken = decoded;

                //console.log("Decoded Token"); 
                //console.log(decodedToken);  
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
}

/***********************************************************************************************************************/
//sending mail Event...
eventEmitter.on('sendMail', function (data) {

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {

        user: "smarthealthcaresystem@gmail.com",
        pass: "Aditya@123"

    }
});

    var mailOptions = {
        from: 'Support Buddy <support@supportBuddy.com>',
        to: data.email,
        subject: 'Support Buddy Notifications',
        text: 'Answer received for ticket number : ' + data.ticketNumber,
        html: '<h1>Hello ' + data.name + '</h1><br><h2>Someone answered your query for ticket number : ' + data.ticketNumber + '</h2>'
    }

     transporter.sendMail(mailOptions, function (error, info) {

        if (error) {

            console.log(error);

        } else {

            console.log("Mail Sent : " + info.response);

        }
    });
});
//end Sending Mail event

/**********************************************************************************************************************/

//Sending new Mail whenever Status of your ticket changes.
eventEmitter.on('StatusChange', function (data) {

 var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {

        user: "smarthealthcaresystem@gmail.com",
        pass: "Aditya@123"
        
    }
});


    var mailOptions = {
        from: 'support Buddy <support@supportBuddy.com>',
        to: data.email,
        subject: 'Support Buddy Notifications',
        text: 'Your ticket status for ticket number ' + data.tno + " changed to :" + data.status,
        html: "<h1>Hello "+ data.name + "</h1><br><h2> Your ticket status for ticket number "+ data.tno +" changed to :"+data.status+"</h2>"
    }

    transporter.sendMail(mailOptions, function (error, info) {

        if (error) {
            console.log(error);
        } else {
          console.log(data);
            console.log("Mail Sent : " + info.response);
        }
    });

}); //end sendMail event

/**********************************************************************************************************************/

//route to show all tickets...
ticketRouter.get('/all', auth, function (req, res) {

    console.log("This is Router to get all the Tickets...");

    Ticket.find(function (error, result) {

        if (error) {

            var err = resGenerator.generate(true, "Something is not working, error : " + error, 500, null);
            res.send(err);

        } else if (result === null || result === undefined || result === [] || result === '') {

            var err = resGenerator.generate(true, "No result found , empty array", 204, null);
            res.send(err);

        } else {

            var response = resGenerator.generate(false, "All queries fetched successfully", 200, result);
            //console.log(result);
            res.send(result);

        }
    });

});
//end get all Tickets...

/*****************************************************************************************************************************/

//route to Open or Close the Ticket Status..
ticketRouter.post('/Ticket/:tno/statusChange', auth, function (req, res) {

    Ticket.findOne({

        "ticketNumber": req.params.tno

    }, function (error, result) {

        if (error) {

            var err = resGenerator.generate(true, "Some error occured : " + error, 500, null);
            res.send(err);

        } else if (result.tickets === null || result === undefined || result === []) {

            var err = resGenerator.generate(true, "No Tickets are there in Database...", 204, null);
            res.send(err);

        } else {

            var email = result.email;
            var name = result.name;
            var tno = req.params.tno;
            var status = result.ticketStatus;

            if (status === "Open") {
                result.ticketStatus = "Close";

                eventEmitter.emit('StatusChange', {
                    status: "Closed",
                    tno: tno,
                    email: email,
                    name: name
                });

            } else {
                result.ticketStatus = "Open";

                eventEmitter.emit('StatusChange', {
                    status: "Reopened",
                    tno: tno,
                    email: email,
                    name: name
                });

            }

            result.save(function (error) {
                if (error) {
                    // console.log(error);
                    res.end(error)
                } else {
                    var response = resGenerator.generate(false, "Ticket status chnaged successfully to : " + result.ticketStatus, 200, result);
                    // console.log(response)
                    res.send(response);
                }
            });

        }
    });

}); //end

/********************************************************************************************************************/

//Router to find a particular Ticket...
ticketRouter.get('/ticket/:tno', auth, function (req, res) {

    Ticket.findOne({
        "ticketNumber": req.params.tno
    }, function (error, result) {
        if (error) {
            var err = resGenerator.generate(true, "Some error occured : " + error, 500, null);
            res.send(err);
        } else if (result === null || result === undefined || result === []) {
            var err = resGenerator.generate(true, "No result found , empty array", 204, null);
            res.send(err);
        } else {
            var response = resGenerator.generate(false, "Query fetched successfully", 200, result);
            // console.log(response)
            res.send(response);
        }
    });

});
//end retrieve single Ticket...

/**************************************************************************************************************************/

//route to create new chat message
ticketRouter.post('/ticket/:tno/query', auth, function (req, res) {
    Ticket.findOne({
        "ticketNumber": req.params.tno
    }, function (error, result) {
        if (error) {
            var err = resGenerator.generate(true, "Some error occured : " + error, 500, null);
            res.send(err);
        } else if (result === null || result === undefined || result === []) {
            var err = resGenerator.generate(true, "No result found , empty array", 204, null);
            res.send(err);
        } else {
            var newChatText = req.body.queryText;
            var newMessage = {
                sender: decodedToken.name,
                queryText: newChatText
            }

            result.message.push(newMessage);
            result.save(function (error) {
                if (error) {
                    // console.log(error);
                    res.end(error)
                } else {
                    var name = decodedToken.name;
                    var email = decodedToken.email;
                    var data = result.ticketNumber;
                    eventEmitter.emit('sendMail', {
                        ticketNumber: data,
                        name: name,
                        email: email
                    });
                    var response = resGenerator.generate(false, "New chat Message created successfully", 200, result);
                    res.send(response);
                }
            });
        }
    });
});
//end create new chat message

/***************************************************************************************************************************/

//route to edit query details
ticketRouter.post('/ticket/:tno/query/edit', auth, function (req, res) {

    Ticket.findOne({
        "ticketNumber": req.params.tno
    }, function (error, result) {
        if (err) {
            var err = resGenerator.generate(true, "Some error occured : " + error, 500, null);
            res.send(err);
        } else if (result === null || result === undefined || result === []) {
            var err = resGenerator.generate(true, "No result found , empty array", 204, null);
            res.send(err);
        } else {

            result.queryTitle = req.body.queryTitle;
            result.queryDetails = req.body.queryDetails;

            result.save(function (error) {
                if (error) {
                    //console.log(error);
                    res.end(error)
                } else {
                    var response = resGenerator.generate(false, "Query edited successfully", 200, result);
                    console.log(response)
                    res.send(response);
                }
            });
        }
    });

}); //end edit query details
/**********************************************************************************************************************/

////////////////////////////////////////////////// ADMIN /////////////////////////////////////////////////////////////

//Route to post chat message by Admin....
ticketRouter.post('/Ticket/Admin/:tno', auth, function (req, res) {

    Ticket.findOne({
        "ticketNumber": req.params.tno
    }, function (error, result) {
        if (error) {
            var err = resGenerator.generate(true, "Some error occured : " + error, 500, null);
            res.send(err);
        } else if (result === null || result === undefined || result === []) {
            var err = resGenerator.generate(true, "No result found , empty array", 204, null);
            res.send(err);
        } else {
            var newChatText = req.body.queryText;
            var newMessage = {
                sender: "Admin",
                queryText: newChatText
            }
            result.message.push(newMessage);
            result.save(function (error) {
                if (error) {
                    // console.log(error);
                    res.end(error)
                } else {
                    var name = result.name;
                    var email = result.email;
                    var data = result.ticketNumber;
                    console.log(name + email + data)
                    eventEmitter.emit('sendMail', {
                        ticketNumber: data,
                        name: name,
                        email: email
                    });
                    var response = resGenerator.generate(false, "New message chat by Admin created successfully", 200, result);
                    res.send(response);
                }
            });

        }
    });

}); //end create new answer

/***********************************************************************************************************************************/

//delete a single query
ticketRouter.post('/ticket/:tno/delete', auth, function (req, res) {

    Ticket.findOne({
        "ticketNumber": req.params.tno
    }, function (error, result) {
        if (error) {
            var err = resGenerator.generate(true, "Some error occured : " + error, 500, null);
            res.send(err);
        } else if (result === null || result === undefined || result === []) {
            var err = resGenerator.generate(true, "No result found , empty array", 204, null);
            res.send(err);
        } else {

            result.remove();

            result.save(function (error) {
                if (error) {
                    //console.log(error);
                    res.end(error)
                } else {
                    var response = resGenerator.generate(false, "Ticket deleted successfully", 200, result);
                    console.log(response)
                    res.send(response);
                }
            });

        }
    });

}); //end delete a single query

/*********************************************************************************************************************************/

//route to get user details by id
ticketRouter.get('/current', auth, function (req, res) {
    res.send(decodedToken);
}); //end get user datails by id

/***********************************************************************************************************************/

//route to get all users' details
ticketRouter.get('/user/details', auth, function (req, res) {
    User.find(function (error, allUsers) {
        if (error) {
            var err = resGenerator.generate(true, "Some error occured : " + error, 500, null);
            res.send(err);
        } else if (allUsers === null || allUsers === undefined) {
            var err = resGenerator.generate(true, "No users yet", 500, null);
            res.send(err);
        } else {
            var response = resGenerator.generate(false, "All users' details fetched successfully", 200, allUsers);
            res.send(response);
        }
    });
}); //end get all users

/**********************************************************************************************************************************/

//route to fetch all queries by a particular user
ticketRouter.get('/allTickets/:userId', auth, function (req, res) {
    var userId = req.params.userId;
    console.log(userId);
    Ticket.find({
        'userId': userId
    }, function (error, result) {
        if (err) {
            var err = resGenerator.generate(true, "Some error occured : " + error, 500, null);
            res.send(err);
        } else if (result.length === 0) {
            var err = resGenerator.generate(true, "No queries asked", 204, null);
            res.send(err);
        } else {
            var response = resGenerator.generate(false, "All queries of " + result[0].name + " fetched successfully", 200, result);
            //console.log(response.data);
            res.send(response);
        }
    });

});
//end get all queries by a particular user

/********************************************************************************************************************************************/

//post query data
ticketRouter.post('/query', auth, function (req, res) {
    var userID = decodedToken.id;
   
    Ticket.findOne({
        'userId': userID
    }, function (error, ticket) {
        if (error) {
            var err = resGenerator.generate(true, "Some error occured : " + error, 500, null);
            res.send(err);
        } else {

            var newTicket = new Ticket({
                userId: decodedToken.id,
                name: decodedToken.name,
                email: decodedToken.email,
                mobileNumber: decodedToken.mobileNumber,
                ticketNumber: shortid.generate(),
                queryTitle: req.body.queryTitle,
                queryDetails: req.body.queryDetails
            });
            

            newTicket.save(function (error) {
                if (error) {
                    var err = resGenerator.generate(true, "Some error occured : " + error, 500, null);
                    res.send(err);
                } else {
                    //console.log(newTicket)
                    var response = resGenerator.generate(false, "Ticket fetched", 200, newTicket.ticketNumber);
                    res.send(response);
                }
            });
        }
    });
});


/********************************************************************************************************************************************/

//export queryrouter
module.exports = ticketRouter;
