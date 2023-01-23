const mongoose = require ('mongoose')
const objectId = mongoose.Schema.types.objectId

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    excerpt: {
        type: String,
        require: true,
        unique: true,
        trim: true,
    },
    userId:  {
        type: objectId,
        require: true,
        ref: 'User',
        trim: true
    },
    ISBN:{
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    category: {
        type: String,
        require: true,
        trim: true
    },
    subcategory:{
        type: String,
        require: true,
        trim: true
    },
    reviews: {
        type: Number,
        default: 0
    },
    deletedAt: {
        type: Date,
        default: null
    },
    deletedAt: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: Date,
        require: true
    }
},{timestamps: true})

module.exports =  mongoose.Model("Book",bookSchema)