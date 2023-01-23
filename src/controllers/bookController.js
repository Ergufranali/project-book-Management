const bookModel=require('../models/bookModel')
const router = require('../routes/route')
const reviewModel=require('../models/reviewModel')



const createBook =async function(req,res){
    const data =req.body

}

const getBooks= async function(req,res){
    let queries= req.query
    queries.isDeleted=falseg
    const books = await bookModel.find(queries).select({_id:1,title:1,excerpt:1,userId:1,category:1,releasedAt:1,reviews:1})
    if(books.length==0) return res.status(404).send({status:false,message:"books not found"})
    res.status(200).send({status:true,data:books})

}

const getBookById = async function(req,res){
    const bookId=req.param.bookId
    let book = await bookModel.findOne({_id:bookId,isDeleted:false})
    if(!book) return res.status(404).send({status:false, message: "book not found"})
    const reviewsData = await reviewModel.find({bookId:bookId,isDeleted:false})
    book=book.toObject()
    book.reviewsData=reviewsData
    res.status(200).send({status:true,data:book})
    



}

const updateBookByID =async function(req,res){

    const updationDetails= req.body
    const bookId= req.param.bookId
    const book = await bookModel.findOne({_id:bookId,isDeleted:false})
    if(!book) return res.status(404).send({status:false,message:"book not found"})
    if(Object.keys(updationDetails).length==0) return res.status(400).send({status:false,message:"there is no details for updation"})
    const updatedBook = await bookModel.findByIdAndUpdate(bookId,{$set:updationDetails},{new:true})
    res.status(200).send({status:true,data:updatedBook})
    

}


const deleteBookByID =async function(req,res){
    const bookId=req.param.bookId
    const book = await bookModel.findOne({_id:bookId,isDeleted:false})

    if(!book) return res.status(404).send({status:false,message:"book not found"})
    const updatedBook = await bookModel.findById(bookId,{$set:{isDeleted:true}},{new:true})
    res.status(200).send({status:true,data:updatedBook})

}


module.exports.createBook=createBook
module.exports.getBooks=getBooks
module.exports.getBookById=getBookById
module.exports.updateBookByID=updateBookByID
module.exports.deleteBookByID=deleteBookByID