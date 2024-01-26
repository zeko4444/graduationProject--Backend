// fun for validateEmail
const validateEmail = (email)=> {
    const valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return valid.test(email)
};
const mongoose = require('mongoose')
const bcrypt=require('bcrypt')



//create patientShcema
const patientShcema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate: validateEmail,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    Nid:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
 
    isactive:{
        type:Boolean,
        default:true
    }
})
patientShcema.pre("save", function(next) {
    if(!this.isModified("password")) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});


const patientmodel=mongoose.model('patient',patientShcema);
module.exports=patientmodel;