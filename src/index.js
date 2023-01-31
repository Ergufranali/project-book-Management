const express= require('express')
const mongoose=require('mongoose')
const app=express()
const cors=require('cors')
const route =require('./routes/route')

app.use(cors())
app.use(express.json())

mongoose.set('strictQuery',true)


mongoose.connect("mongodb+srv://Paras_Anand:paras4321@cluster0.3z8igom.mongodb.net/group11Database",
    {useNewUrlParser:true}
)
.then(()=>console.log("MongoDB is Successfully Connected"))
.catch((err)=>console.log(err))



app.use('/',route)



app.listen(3000, function () {
    console.log('Express app running on port ',3000)
});