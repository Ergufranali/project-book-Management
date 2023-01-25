const bookModel = require('../models/bookModel')
const reviewModel = require('../models/reviewModel')
const userModel = require('../models/userModel')
const ObjectId = require('mongoose').Types.ObjectId;
const moment = require('moment')

// creating a book---------------------------------
const createBook = async function (req, res) {
    let data = req.body
    if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Please provide data" })


    //Authorization -----------------------------------------------------------------------------------------
    if (req.decode.id != data.userId) return res.status(403).send({ status: false, message: "you are not authorized" })



    // validation for title//
    if (!data.title) return res.status(400).send({ status: false, message: "title is mandatory" })
    data.title = data.title.trim()// trim title
    let book = await bookModel.findOne({ title: data.title, isDeleted: false })
    if (book) return res.status(400).send({ status: false, message: "book already created" })

    // validation for excerpt//
    if (!data.excerpt) return res.status(400).send({ status: false, message: "excerpt is mandatory" })
    data.excerpt = data.excerpt.trim()// trim excerpt

    // validation for userId //
    if (!data.userId) return res.status(400).send({ status: false, message: "userId is mandatory" })
    data.userId = data.userId.trim()// trim title
    if (!ObjectId.isValid(data.userId)) return res.status(400).send({ status: false, message: "user id is not valid" })
    // const user = await userModel.findById(data.userId)
    // if (!user) return res.status(401).send({ status: false, message: "user id not found" })

    // validation for ISBN//
    if (!data.ISBN) return res.status(400).send({ status: false, message: "ISBN is mandatory" })
    data.ISBN = data.ISBN.trim()// trim ISBN
    if (data.ISBN.length != 13) return res.status(400).send({ status: false, message: "ISBN is not valid" })
    book = await bookModel.findOne({ ISBN: data.ISBN })
    if (book) return res.status(400).send({ status: false, message: "ISBN must be unique" })

    // validation for category //
    if (!data.category) return res.status(400).send({ status: false, message: "category is mandatory" })
    data.category = data.category.trim()

    // validation for subcategory //
    if (!data.subcategory) return res.status(400).send({ status: false, message: "subcategory is mandatory" })
    data.subcategory = data.subcategory.trim()

    data.releasedAt = moment().format('YYYY-MM-DD')// adding a current  date in releasedAt

    let savedata = await bookModel.create(data)
    res.status(201).send({ status: true, data: savedata })
}
// get books -----------------------------------------------------------------------------------------------
const getBooks = async function (req, res) {
    let queries = req.query
    queries.isDeleted = false

    const books = await bookModel.find(queries).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
    if (books.length == 0) return res.status(404).send({ status: false, message: "books not found" })
    res.status(200).send({ status: true, data: books })

}
// get books by ID -----------------------------------------------------------------------------------------
const getBookById = async function (req, res) {
    const bookId = req.params.bookId

    let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!book) return res.status(404).send({ status: false, message: "book not found" })

    const reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
    book = book.toObject()
    book.reviewsData = reviewsData
    book.reviews = reviewsData.length
    res.status(200).send({ status: true, data: book })

}
// update by ID ----------------------------------------------------------------------------------------------
const updateBookByID = async function (req, res) {

    const updationDetails = req.body
    const bookId = req.params.bookId
    const book = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!book) return res.status(404).send({ status: false, message: "book not found" })// if book not present in DB
    console.log(updationDetails)// console 
    //authorization
    if (req.decode.id != book.userId) return res.status(403).send({ status: false, message: "you are not authorized" })

    if (Object.keys(updationDetails).length == 0) return res.status(400).send({ status: false, message: "there is no details for updation" })// if data is empty//
    const bookWithTitle = await bookModel.findOne({ $or: [{ title: updationDetails.title.toUpperCase() }, { ISBN: updationDetails.ISBN }] }) // Db call if title is present //

    if (bookWithTitle) {
        if (bookWithTitle.title == updationDetails.title.toUpperCase()) return res.status(400).send({ status: false, message: "title with that you want to update already exist" })// if title already  present in Db //

        if (bookWithTitle.ISBN == updationDetails.ISBN) return res.status(400).send({ status: false, message: "ISBN with that you want to update already exist" }) // if ISBN is already present in Db //
    }
    updationDetails.releasedAt = moment().format('YYYY-MM-DD') // adding updating time in releasedAt
    const updatedBook = await bookModel.findByIdAndUpdate(bookId, { $set: updationDetails }, { new: true })
    res.status(200).send({ status: true, data: updatedBook })
}

// delete by id --------------------------------------------------------------------------------------------
const deleteBookByID = async function (req, res) {
    const bookId = req.params.bookId
    const book = await bookModel.findOne({ _id: bookId, isDeleted: false })

    if (!book) return res.status(404).send({ status: false, message: "book not found" })// if book not present in Db

    //authorization
    if (req.decode.id != book.userId) return res.status(403).send({ status: false, message: "you are not authorized" })
    const updatedBook = await bookModel.findByIdAndUpdate(bookId, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
    res.status(200).send({ status: true, data: updatedBook })

}


module.exports.createBook = createBook
module.exports.getBooks = getBooks
module.exports.getBookById = getBookById
module.exports.updateBookByID = updateBookByID
module.exports.deleteBookByID = deleteBookByID











