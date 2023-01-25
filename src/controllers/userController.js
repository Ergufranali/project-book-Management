const userModel =  require ('../models/userModel')
const {isValid} = require ("../validator/validation")
const validator = require ('validator')
const jwt = require ('jsonwebtoken')

// create user ----------------------------------------
const createUser = async function (req, res){
    try {
        let data = req.body

        if(Object.keys(data).length==0) return res.status(400).send({status:false, message:"body is mandotary"})
        let {title,name,phone,email,password,address} =data // destructure //
        let {street,city,pincode} = address // destructure //

        // keys validation
        if(!isValid(title)) return res.status(400).send({status:false,message:"title is mandotory"})
        if(!isValid(name)) return res.status(400).send({status:false,message:"name is mandotory"})
        if(!isValid(phone)) return res.status(400).send({status:false,message:"phone is mandotory"})
        if(!isValid(email)) return res.status(400).send({status:false,message:"email is mandotory"})
        if(!isValid(password)) return res.status(400).send({status:false,message:"password is mandotory"})
        if(!isValid(address)) return res.status(400).send({status:false,message:"address is mandotory"})
        if(!isValid(street)) return res.status(400).send({status:false,message:"street is mandotory"})
        if(!isValid(city)) return res.status(400).send({status:false,message:"city is mandotory"})
        if(!isValid(pincode)) return res.status(400).send({status:false,message:"pincode is mandotory"})

        if (!(["Mr", "Mrs", "Miss"].includes(title))) return res.status(400).send({ status: false, message: "you can use only Mr, Mrs, Miss" })  // this line will check Mr, Mrs, and Miss is present or not

        if(!(phone.match(/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/))) return res.status(400).send({ status: false, message: "phone number is not valid" }) // validation for phone number by regex //

        //check validation for phone
        let checkPhone = await userModel.findOne({phone:phone})
        if(checkPhone) return res.status(400).send({status:false, message: "phone Number already exist"})
        
        //check validation for email ---------------------------------------------------------------
        if (!validator.isEmail(email)) return res.status(400).send({ status: false, msg: "please enter valid email address!" }) // email must be have @ and .com 

        let checkEmail = await userModel.findOne({ email: email })
        if (checkEmail) return res.status(400).send({ status: false, message: "email is already exist" })

        // check validation for password---------------------------------------------------------------
        if (!(password.match(/(?=.{8,15})/))) return res.status(400).send({ status: false, error: "Password should be of atleast 8 charactors" }) // passsword must be min 8 and max 15//
        if (!(password.match(/.*[a-zA-Z]/))) return res.status(400).send({ status: false, error: "Password should contain alphabets" }) // password must be alphabetic //
        if (!(password.match(/.*\d/))) return res.status(400).send({ status: false, error: "Password should contain digits" })// we can use number also //

        let savedData = await userModel.create(data)
        return res.status(201).send({status: true, message: "Data created SuccesFully", data: savedData})
    }
    catch(err){
        res.status(500).send({status:false,message:err})
    }

}    
         


// login user ---------------------------------------------
const login = async function (req, res){
    try {
        let { email, password} = req.body
        if(!isValid(email)) return res.status(400).send({status: false, msg: "please enter the email to login"})
        if(!isValid(password)) return res.status(400).send({status:false, msg: "please enter the password to login"})

        let Email = await userModel.findOne({email: email}) // db call email is present or not in Db //
        if(!Email) return res.status(404).send({status:false, message: "Incorrect E-mail address"})// if not //

        let Password = await userModel.findOne({password: password}) // password is present or not in Db //
        if(!Password) return res.status(404).send({status:false, message: "Incorrect Password"}) // if not //

        //if email and password is correct-----------------------------------------
        let  userLogin = await userModel.findOne({email: email, password: password}) 

        // create token--------
        let key = jwt.sign(
            {id: userLogin._id},"Ghufran-Tarun-Paras-Aradhay-project4",{expiresIn:'1h'});
            res.setHeader("x-api-key", key);
            res.status(200).send({status:true,message:"Success",Token:key});
    } catch (error){
        res.status(500).send({status:false,message:error.message})
    }
}




module.exports.createUser=createUser
module.exports.login=login