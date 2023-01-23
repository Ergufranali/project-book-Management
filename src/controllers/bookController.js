const bookModel=require('../models/bookModel')
const router = require('../routes/route')



const createBook =async function(req,res){
    let data = req.body
    if(Object.keys(data).length ===0) return res.status(400).send({status : false, message : "Please provide data"})

    const {title, excerpt, userId, ISBN, category, subcategory, releasedAt} = data

    if(!title) return res.status(400).send({ status : false , message : "title is mandatory"})
    if(typeof title !=="string") return res.status(400).send({status : false , message : "title will only accept string"})
    if(!title.trim()) return res.status(400).send({status : false , message : "title is mandatory"})
  
    if(!excerpt) return res.status(400).send({ status : false , message : "excerpt is mandatory"})
    if(typeof title !=="string") return res.status(400).send({status : false , message : "excerpt will only accept string"})

    

    let savedata = await bookModel.create(data)
    res.send({data : savedata})
}

const getBooks= async function(req,res){

}

const getBookById = async function(req,res){

}

const updateBookByID =async function(req,res){

}


const deleteBookByID =async function(req,res){

}


module.exports.createBook=createBook
module.exports.getBooks=getBooks
module.exports.getBookById=getBookById
module.exports.updateBookByID=updateBookByID
module.exports.deleteBookByID=deleteBookByID