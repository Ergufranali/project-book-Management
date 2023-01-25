const reviewModel = require('../models/reviewModel')
const bookModel =require('../models/bookModel')
const ObjectId = require('mongoose').Types.ObjectId;

// review api -----------------------------------------------------------------------------------------
const addReview =async function(req,res){
    
    const BookId= req.params.bookId
    const data = req.body
    if(Object.keys(data).length==0) return res.stauts(400).send({status:false,message:"body is empty" })
    
    if(!ObjectId.isValid(BookId)) return res.status(400).send({status:false,message:"bookId is invalid"})
    const book = await bookModel.findOne({_id:BookId,isDeleted:false})// db call if bookId is present or not //
    if(!book) return res.status(400).send({status:false, message:"book is not found with provided id"})


    if(!data.reviewedBy) return res.status(400).send({stauts:false,message:"reviewedBy is mandatory"})
    data.reviewedBy =data.reviewedBy.trim()

    if(!data.rating) return res.status(400).send({status:false,message:"rating is mandatory"})

    data.reviewedAt = Date.now() // adding date in reviewedAt
    data.bookId=BookId

    const saveData = await reviewModel.create(data)
    const {_id,bookId,reviewedBy,reviewedAt,rating,review}=saveData

    res.status(201).send({status:true, data:{_id,bookId: bookId,reviewedBy,reviewedAt,rating,review}})
}


// updateed reviewedById-------------------------------------------------------------------------------------------
const updateReviewByID =async function(req,res){
    const bookId= req.params.bookId
    const reviewId =req.params.reviewId
    const updationDetails =req.body

    if(!ObjectId.isValid(bookId)) return res.status(400).send({status:false,message:"bookId is invalid"})
    if(!ObjectId.isValid(reviewId)) return res.status(400).send({status:false,message:"bookId is invalid"})

    
    if(Object.keys(updationDetails).length==0) return res.status(400).send({status:false,message:"threre is no updation details"})

    const book =await bookModel.findOne({_id:bookId,isDeleted:false}) // db call if book id is present or not
    if(!book) return res.status(404).send({status:false,message:"book not found"}) // if not present //
    
    updationDetails.reviewedAt=Date.now() // adding updating time in reviewedAt //
    const review =await reviewModel.findOneAndUpdate({_id:reviewId,isDeleted:false},{$set:updationDetails},{new:true})
    if(!review) return res.status(404).send({status:false,message:"review not found"}) // if review not present //

    res.status(200).send({status:true,data:review})
    
}
 // delete reviewedById ----------------------------------------------------------------------------------------
const deleteReviewById=async function(req,res){

    const bookId= req.params.bookId
    const reviewId =req.params.reviewId
    

    if(!ObjectId.isValid(bookId)) return res.status(400).send({status:false,message:"bookId is invalid"})
    if(!ObjectId.isValid(reviewId)) return res.status(400).send({status:false,message:"reviewId is invalid"})

    const book =await bookModel.findOne({_id:bookId,isDeleted:false})// db call bookId is present or not in db //
    if(!book) return res.status(404).send({status:false,message:"book not found"}) // if not present //

    const review =await reviewModel.findOneAndUpdate({_id:reviewId,isDeleted:false},{$set:{isDeleted:true}},{new:true})  // db call check reviewId is present or not //
    if(!review) return res.status(404).send({status:false,message:"review not found"}) // if not present reviewId//

    res.status(200).send({status:true,data:review})
    
}

module.exports.addReview=addReview
module.exports.updateReviewByID=updateReviewByID
module.exports.deleteReviewById=deleteReviewById