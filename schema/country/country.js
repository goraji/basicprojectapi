const mongoose = require('mongoose');
const world = new mongoose.Schema({
     country: { 
       cname:String,
      state:{
        sname:Array,
        city:[{
          dname:Array
        }]
      }
    }
  })

const Country = new mongoose.model('Country', world);
module.exports = Country;
