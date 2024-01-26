const mongoose = require('mongoose')


const bookDoc=new mongoose.Schema({
    mobileDoc:{
        type:String,
        required:true
    },
    mobilePat:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    time:{
        type: String,
        required: true,
        validate: {
          validator: function(v) {
            return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
          },
          message: props => `${props.value} is not a valid time format (HH:mm)`
        }
      }
})


module.exports=mongoose.model('book',bookDoc);