const express= require('express')
const mongoose=require('mongoose')
const app=express()

const route =require('./routes/route')


app.use(express.json())

mongoose.set('strictQuery',true)


mongoose.connect("",
    {useNewUrlParser:true}
)
.then(()=>console.log("mongodb connected"))
.catch((err)=>console.log(err))



app.use('/',route)



app.listen(3000,function(){
    console.log('running on server ', 3000)
})