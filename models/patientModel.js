// fun for validateEmail
const validateEmail = (email)=> {
    const valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return valid.test(email)
};




//create patientShcema
const patientShcema=new mongoose.schema({
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
    isadmin:{
        type:Boolean,
        default:false
    },
    isactive:{
        type:Boolean,
        default:true
    }
})



const patientmodel=mongoose.model('patient',patientShcema);
module.exports=patientmodel;