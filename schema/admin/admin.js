const mongoose = require('mongoose');
const Joi = require("joi");

const teacherS = new mongoose.Schema({
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
    }
  })

const Admin = new mongoose.model('Admin', teacherS);
const validate = () => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    return schema.validate(Admin);
};
module.exports = Admin, validate;