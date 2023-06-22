// fun for validateEmail
const validateEmail = (email)=> {
    const valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return valid.test(email)
};



// create adminSchema
const adminSchema=new mongoose.shcema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
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
    password:{
        type:String,
        required:true
    },
    isadmin:{
        type:Boolean,
        default:true
    },
    isactive:{
        type:Boolean,
        default:true
    }

})


const adminmodel=mongoose.model('admin',adminSchema);
module.exports=adminmodel;