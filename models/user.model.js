const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        trim: true,
        lowercase:true,
        unique:true,
        minlength:[3,'Username must be at least 3 characters long']
    },

    email:{
        type:String,
        reuired:true,
        trim:true,
        lowercase:true,
        unique:true,
        minlength:[13,'Email must be atleast 13 characters long']
    },
    password:{
        type:String,
        reuired:true,
        trim:true,
        minlength:[5,'Email must be atleast 5 characters long']
    }
})

const user = mongoose.model('user',userSchema)

module.exports = user;