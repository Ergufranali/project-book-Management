const reviewModel = require('../models/reviewModel')
const bookModel =require('../models/bookModel')
const ObjectId = require('mongoose').Types.ObjectId;


const addReview =async function(req,res){
    const bookId= req.params.bookId
    const data = req.body
    if(Object.keys(data).length==0) return res.stauts(400).send({status:false,message:"body is empty" })

    
    if(!bookId) return res.stauts(400).send({status:false,message:"bookId is mandatory"})
    
    if(!ObjectId.isValid(bookId)) return res.status(400).send({status:false,message:"bookId is invalid"})
    const book = await bookModel.findOne({_id:bookId,isDeleted:false})
    if(!book) return res.status(400).send({status:false, message:"book is not found with provided id"})



    data.reviewedBy =data.reviewedBy.trim()
    if(!data.reviewedBy) return res.status(400).send({stauts:false,message:"reviewedBy is mandatory"})

    data.reviewedAt = Date.now()

    if(!data.rating) return res.status(400).send({status:false,message:"rating is mandatory"})

    
    data.bookId=bookId

    const saveData = await reviewModel.create(data)

    res.status(201).send({status:true, data:saveData})


}



const updateReviewByID =async function(req,res){
    const bookId= req.params.bookId
    const reviewId =req.params.reviewId
    const updationDetails =req.body

    if(!ObjectId.isValid(bookId)) return res.status(400).send({status:false,message:"bookId is invalid"})
    if(!ObjectId.isValid(reviewId)) return res.status(400).send({status:false,message:"bookId is invalid"})

    const book =await bookModel.findOne({_id:bookId,isDeleted:false})
    if(!book) return res.status(404).send({status:false,message:"book not found"})
    


    if(Object.keys(updationDetails).length==0) return res.status(400).send({status:false,message:"threre is no updation details"})

    const review =await reviewModel.findOneAndUpdate({_id:reviewId,isDeleted:false},{$set:updationDetails},{new:true})
    if(!review) return res.status(404).send({status:false,message:"review not found"})

    res.status(200).send({status:true,data:review})
    
}

const deleteReviewById=async function(req,res){

    const bookId= req.params.bookId
    const reviewId =req.params.reviewId
    

    if(!ObjectId.isValid(bookId)) return res.status(400).send({status:false,message:"bookId is invalid"})
    if(!ObjectId.isValid(reviewId)) return res.status(400).send({status:false,message:"bookId is invalid"})

    const book =await bookModel.findOne({_id:bookId,isDeleted:false})
    if(!book) return res.status(404).send({status:false,message:"book not found"})

    const review =await reviewModel.findOneAndUpdate({_id:reviewId,isDeleted:false},{$set:{isDeleted:true}},{new:true})
    if(!review) return res.status(404).send({status:false,message:"review not found"})

    res.status(200).send({status:true,data:review})
    

}

module.exports.addReview=addReview
module.exports.updateReviewByID=updateReviewByID
module.exports.deleteReviewById=deleteReviewById