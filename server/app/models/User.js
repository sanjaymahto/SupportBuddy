//Including Mongoose model...
var mongoose = require('mongoose');
//creating object 
var Schema = mongoose.Schema;

//bcrypt-nodejs for hashing password for secure password storing in Database
var bcrypt = require('bcrypt-nodejs');

//Schema for user
var userSchema = new Schema({

    name             : {type: String, required: true },
    email            : {type: String, required: true },
    mobileNumber     : {type: Number, required: true },
    password         : {type: String , required: true }
});

//generating hashed password
userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password , bcrypt.genSaltSync(8) ,null);
};
//method to compare hashed password and password entered by user
userSchema.methods.compareHash = function(password){
    return bcrypt.compareSync(password , this.password);
};

//model for userschema
mongoose.model('User' , userSchema);
