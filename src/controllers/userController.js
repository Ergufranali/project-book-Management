const userModel =  require ('../models/userModel')
const {isValid} = require ("../validator/validation")
const validator = require ('validator')
const jwt = require ('jsonwebtoken')
// **************regex password********/
let validpassword = /^[a-zA-Z0-9!@#$%^&*]{8,16}$/

// create user ----------------------------------------
exports.createUser = async function (req, res){
    try {
        let data = req.body
        let {title,name,phone,email,password,address} =data
        let {street,city,pincode} = address
        if(Object.keys(data).length==0) return res.status(400).send({status:false, message:"body is mandotary"})
        if(!isValid(title)) return res.status(400).send({status:false,message:"title is mandotory"})
        if(!isValid(name)) return res.status(400).send({status:false,message:"name is mandotory"})
        if(!isValid(phone)) return res.status(400).send({status:false,message:"phone is mandotory"})
        if(!isValid(email)) return res.status(400).send({status:false,message:"email is mandotory"})
        if(!isValid(password)) return res.status(400).send({status:false,message:"password is mandotory"})
        if(!isValid(address)) return res.status(400).send({status:false,message:"address is mandotory"})
        if(!isValid(street)) return res.status(400).send({status:false,message:"street is mandotory"})
        if(!isValid(city)) return res.status(400).send({status:false,message:"city is mandotory"})
        if(!isValid(pincode)) return res.status(400).send({status:false,message:"pincode is mandotory"})
        
        // check validation for password---------------------------------------------------------------
        if(!validpassword.test(password)){
            return res.status(400).send({status:false, message:"please enter valid alphanumeric password min character 8"})
        }

        //check validation for email ---------------------------------------------------------------
        if (!validator.isEmail(email)) return res.status(400).send({ status: false, msg: "please enter valid email address!" })

         let checkEmail = await userModel.findOne({ email: email })
         if (checkEmail) return res.status(400).send({ status: false, message: "email is already exist" })

         //check validation for phone
         let checkPhone = await userModel.findOne({phone:phone})
         if(checkPhone) return res.status(400).send({status:false, message: "phone Number already exist"})
         

        let savedData = await userModel.create(data)
        return res.status(201).send({status: true, message: "Data created SuccesFully", data: savedData})
    } catch (error) {
            return res.status(500).send({status:false,message: error.message})
    }
}

// login user ---------------------------------------------
exports.login = async function (req, res){
    try {
        let { email, password} = req.body
        if(!isValid(email)) return res.status(400).send({status: false, msg: "please enter the email to login"})
        if(!isValid(password)) return res.status(400).send({status:false, msg: "please enter the password to login"})
        let Email = await userModel.findOne({email: email})
        if(!Email) return res.status(404).send({status:false, message: "Incorrect E-mail address"})
        let Password = await userModel.findOne({password: password})
        if(!Password) return res.status(404).send({status:false, message: "Incorrect Password"})

        //if email and password is correct-----------------------------------------

        let  userLogin = await userModel.findOne({email: email, password: password})

        // create token--------
        let key = jwt.sign(
            {id: userLogin._id},"GPT",{expiresIn:'1h'});
            
            res.setHeader("x-api-key", key);
    
            res.status(200).send({status:true,Token:key});
    } catch (error){
        res.status(500).send({status:false,message:error.message})
    }
}