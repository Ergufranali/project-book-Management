const express= require('express')
const router=express.Router()
const userController=require('../controllers/userController')
const bookController=require('../controllers/bookController')
const reviewController=require('../controllers/reviewController')




router.post('/register',userController.createUser)
router.post('/login',userController.login)


router.post('/books',bookController.createBook)
router.get('/books',bookController.getBooks)
router.get('/books/:bookId',bookController.getBookById)
router.put('/books/:bookId',bookController.updateBookByID)
router.delete('/books/:bookId',bookController.deleteBookByID)


router.post('/books/:bookId/review', reviewController.addReview)
router.put('books/:bookId/review/:reviewId',reviewController.updateReviewByID)
router.delete('books/:bookId/review/:reviewId',reviewController.deleteReviewById)


module.exports=router