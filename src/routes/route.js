const express= require('express')
const middleware = require ('../Middleware/auth')
const router=express.Router()
const userController=require('../controllers/userController')
const bookController=require('../controllers/bookController')
const reviewController=require('../controllers/reviewController')



router.post('/register',userController.createUser)
router.post('/login',userController.login)



router.post('/books',middleware.Authentication,bookController.createBook)
router.get('/books',middleware.Authentication,bookController.getBooks)
router.get('/books/:bookId',middleware.Authentication,middleware.Authentication,bookController.getBookById)
router.put('/books/:bookId',middleware.Authentication,bookController.updateBookByID)
router.delete('/books/:bookId',middleware.Authentication,bookController.deleteBookByID)


router.post('/books/:bookId/review', reviewController.addReview)
router.put('/books/:bookId/review/:reviewId',reviewController.updateReviewByID)
router.delete('/books/:bookId/review/:reviewId',reviewController.deleteReviewById)


module.exports=router