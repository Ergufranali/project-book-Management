const reviewModel = require('../models/reviewModel')
const bookModel = require('../models/bookModel')
const ObjectId = require('mongoose').Types.ObjectId;


// review api -----------------------------------------------------------------------------------------
const addReview = async function (req, res) {
    try {
        const BookId = req.params.bookId
        const data = req.body
        if (Object.keys(data).length == 0) return res.stauts(400).send({ status: false, message: "body is empty" })

        if (!ObjectId.isValid(BookId)) res.status(400).send({ status: false, message: "book id is not valid" })
        const book = await bookModel.findOne({ _id: BookId, isDeleted: false })// db call if bookId is present or not //
        if (!book) return res.status(400).send({ status: false, message: "book is not found with provided id" })


        if (data.reviewedBy != undefined) {
            data.reviewedBy = data.reviewedBy.trim()
            if (data.reviewedBy.length == 0) return res.status(400).send({ status: false, message: "reviewedBy is mandatory" })
        }


        if (!data.rating) return res.status(400).send({ status: false, message: "rating is mandatory" })
        if(data.rating>5 || data.rating<1) return res.status(400).send({status:false,message:"rating should be in range 1-5"})

        data.reviewedAt = Date.now() // adding date in reviewedAt
        data.bookId = BookId

        const saveData = await reviewModel.create(data)
        const { _id, bookId, reviewedBy, reviewedAt, rating, review } = saveData
        let updatedBook = await bookModel.findByIdAndUpdate(BookId, { $inc: { reviews: 1 } }, { new: true })
        updatedBook = updatedBook.toObject()
        updatedBook.review = { _id, bookId, reviewedBy, reviewedAt, rating, review }


        res.status(201).send({ status: true, message:"review created successfully",data: updatedBook })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}


// updateed reviewedById-------------------------------------------------------------------------------------------
const updateReviewByID = async function (req, res) {
    try {
        const BookId = req.params.bookId
        const reviewId = req.params.reviewId
        const updationDetails = req.body

        if (!ObjectId.isValid(BookId)) return res.status(400).send({ status: false, message: "bookId is invalid" })
        if (!ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, message: "bookId is invalid" })


        if (Object.keys(updationDetails).length == 0) return res.status(400).send({ status: false, message: "threre is no updation details" })

        let book = await bookModel.findOne({ _id: BookId, isDeleted: false }) // db call if book id is present or not
        if (!book) return res.status(404).send({ status: false, message: "book not found" }) // if not present //

        updationDetails.reviewedAt = Date.now() // adding updating time in reviewedAt //
        const updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { $set: updationDetails }, { new: true })
        if (!updatedReview) return res.status(404).send({ status: false, message: "review not found" }) // if review not present //
        const { _id, bookId, reviewedBy, reviewedAt, rating, review } = updatedReview
        book = book.toObject()
        book.review = { _id, bookId, reviewedBy, reviewedAt, rating, review }

        res.status(200).send({ status: true, messgae:"updated successfully",data: book })
    }
    catch {
        res.status(500).send({ status: false, message: error.message })
    }

}
// delete reviewedById ----------------------------------------------------------------------------------------
const deleteReviewById = async function (req, res) {

    try {
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        console.log(reviewId)
        if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "bookId is invalid" })
        if (!ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, message: "reviewId is invalid" })

        const book = await bookModel.findOne({ _id: bookId, isDeleted: false })// db call bookId is present or not in db //
        if (!book) return res.status(404).send({ status: false, message: "book not found" }) // if not present //

        const review = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { $set: { isDeleted: true } }, { new: true })  // db call check reviewId is present or not //
        console.log(review)
        if (!review) return res.status(404).send({ status: false, message: "review not found" }) // if not present reviewId

        let updatedBook = await bookModel.findByIdAndUpdate(bookId, { $inc: { reviews: -1 } }, { new: true })

        res.status(200).send({ status: true, message:"review deleted succesfully" })
    }
    catch {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.addReview = addReview
module.exports.updateReviewByID = updateReviewByID
module.exports.deleteReviewById = deleteReviewById