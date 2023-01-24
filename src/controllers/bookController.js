const bookModel=require('../models/bookModel')
const reviewModel=require('../models/reviewModel')
const userModel =require('../models/userModel')
const ObjectId = require('mongoose').Types.ObjectId;
const moment =require('moment')



const createBook =async function(req,res){
    let data = req.body
    if(Object.keys(data).length ===0) return res.status(400).send({status : false, message : "Please provide data"})


    

    
    if(!data.title) return res.status(400).send({status : false , message : "title is mandatory"})
    data.title=data.title.trim()
    let book = await bookModel.findOne({title:data.title,isDeleted:false})
    if(book) return res.status(400).send({status:false, message:"book already created"})

    
    if(!data.excerpt) return res.status(400).send({status : false , message : "excerpt is mandatory"})
    data.excerpt=data.excerpt.trim()

    
    if(!data.userId) return res.status(400).send({ status : false , message : "userId is mandatory"})
    data.userId=data.userId.trim()
    if(!ObjectId.isValid(data.userId)) return res.status(400).send({status:false, message:"user id is not valid"})
    const user = await userModel.findById(data.userId)
    if(!user) return res.status(401).send({status:false, message:"user id not found"})


    
    if(!data.ISBN) return res.status(400).send({status:false,message:"ISBN is mandatory"})
    data.ISBN=data.ISBN.trim()
    if(data.ISBN.length !=13) return res.status(400).send({status:false, message:"ISBN is not valid"})
    book = await bookModel.findOne({ISBN:data.ISBN})
    if(book) return res.status(400).send({status:false, message:"ISBN must be unique"})

    
    if(!data.category) return res.status(400).send({status:false,message:"category is mandatory"})
    data.category=data.category.trim()

    
    if(!data.subcategory) return res.status(400).send({status:false, message:"subcategory is mandatory"})
    data.subcategory=data.subcategory.trim()

    data.releasedAt =moment(). format('YYYY-MM-DD')

    let savedata = await bookModel.create(data)
    res.status(201).send({status:true,data : savedata})
}

const getBooks= async function(req,res){
    let queries= req.query
    queries.isDeleted=false
    const books = await bookModel.find(queries).select({_id:1,title:1,excerpt:1,userId:1,category:1,releasedAt:1,reviews:1})
    if(books.length==0) return res.status(404).send({status:false,message:"books not found"})
    res.status(200).send({status:true,data:books})

}

const getBookById = async function(req,res){
    const bookId=req.params.bookId
    
    let book = await bookModel.findOne({_id:bookId,isDeleted:false})
    if(!book) return res.status(404).send({status:false, message: "book not found"})
    const reviewsData = await reviewModel.find({bookId:bookId,isDeleted:false})
    book=book.toObject()
    book.reviewsData=reviewsData
    book.reviews=reviewsData.length
    res.status(200).send({status:true,data:book})
    



}

const updateBookByID =async function(req,res){

    const updationDetails= req.body
    const bookId= req.params.bookId
    const book = await bookModel.findOne({_id:bookId,isDeleted:false})
    if(!book) return res.status(404).send({status:false,message:"book not found"})
    if(Object.keys(updationDetails).length==0) return res.status(400).send({status:false,message:"there is no details for updation"})
    const updatedBook = await bookModel.findByIdAndUpdate(bookId,{$set:updationDetails},{new:true})
    res.status(200).send({status:true,data:updatedBook})
    

}


const deleteBookByID =async function(req,res){
    const bookId=req.params.bookId
    const book = await bookModel.findOne({_id:bookId,isDeleted:false})

    if(!book) return res.status(404).send({status:false,message:"book not found"})
    const updatedBook = await bookModel.findByIdAndUpdate(bookId,{$set:{isDeleted:true, deletedAt:Date.now()}},{new:true})
    res.status(200).send({status:true,data:updatedBook})

}


module.exports.createBook=createBook
module.exports.getBooks=getBooks
module.exports.getBookById=getBookById
module.exports.updateBookByID=updateBookByID
module.exports.deleteBookByID=deleteBookByID











