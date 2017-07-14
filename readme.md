# Support Buddy - Ticket Based Support System


## Description
A generic ticket based support system for resolving queries on a platform. 


## Features

```
   Features of the platform -  
 
*) Ticket Raising panel - User facing 

*) Ticket Resolution panel - Admin facing 
 
 1) Ticket Raising panel - user end 

a) A view to login and Signup. 
b) A View to create a ticket. Get all the necessary information like name, email, phone number, Query title and Query details. ​File upload is optional. 
c) A View to view all queries raised by the person.  
d) A view to show the details of a particular query. It should include the original question as well as the answer from admin and person in form of a conversation (chat like UI). This view should also have the option to set the status of the ticket to ‘open’ or ‘closed’ depending on whether the query is resolved or not.  
 
 
2) Ticket Resolution Panel - Admin end 

a) View to Display ticket by status - This should list all tickets received by the support system. There should be a drop down menu to filter through the status of ticket. Ticket can be of status ‘open’ or ‘closed’ depending on whether the query is resolved or not.  
b) A view to show the details of a particular query. It should include the original question as well as the answer from admin and person in form of a conversation (chat like UI). This view should also have the option to set the status of the ticket to ‘open’ or ‘closed’ depending on whether the query is resolved or not. The answer created here 
 
 ```

## Prerequisites

Git

NodeJs

NPM

MongoDB

## Running

  running mongodb:
```
    1). Open Command Prompt and change directory to where mongodb is installed in bin folder.
    2). Type 'mongod' in the command prompt.
    3). press enter database server will start.
```
  installing dependencies:
```
    (Make sure the command prompt is running for mongoDB and open a new Command Prompt.)
    1). Unzip the downloaded file.
    2). Open the extracted folder.
    3). open the server folder 
    4). Type Command : npm install and press enter. This will install all dependencies shown in package.json file.
```
  running project:
```
    Install all dependencies by : npm install and run the application Using: node app.js in new command prompt.

    1.)Update Email and Password in ticket Controller for nodemailer event.
```
 Open As Admin:
```
    To Run the Application as an admin please signup into Application Using name as "Admin".
    1.)As this is demo Application, all the users having name as Admin will be admin of this application.
    2.)you Will be able to open and close the status of the queries.
```    
     Open As User:
```
    To Run the Application as an user please signup into Application Using name other than (Admin or '').
```
    
## Built With

OS : Windows 10

API Tool : Postman

Editor : Sublim Text

Frontend Technologies allowed - HTML 5, CSS3, Javascript, Jquery and AngularJS.

Backend Technologies allowed - NodeJs, ExpressJS, MongoDB.
