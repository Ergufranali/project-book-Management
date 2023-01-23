const mongoose=require('mongoose')




const addressSchema = mongoose.Schema({
    street: String,
    city: String,
    pincode: String,
});

const userSchema =new mongoose.Schema({
    title:{
        type:String,
        enum:['Mr','Mrs','Miss'],
        required:true
    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,

    },
    address:{
        type:addressSchema
    }

},{timestamps:true})

module.exports=mongoose.model('user',userSchema)