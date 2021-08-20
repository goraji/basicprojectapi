const mongoose = require('mongoose');
const user = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique:true
    },
    password: {
        type: String,
    },
    img:{
        type:String
    },
    address:[{
        houseno :{
            type: String
        },
        street:{
            type: String
        },
        landmark:{
            type:String
        },
        zip:{
            type:Number
        }
    }],
    date:{
        type: Date
    }
  })

const User = new mongoose.model('User', user);
module.exports = User;