const express = require('express');
const router = express.Router();

// Middleware
const authenticateToken = require('../config/auth');

// Controllers
const booksController = require('../controllers/Books');
const usersController = require('../controllers/Users');
const registerController = require('../controllers/Register');

// Routes for books
router.get('/get-book-details/:num', authenticateToken, booksController.getBookDetails);
router.get('/get-book-list', authenticateToken, booksController.getBookList);
router.post('/add-book', authenticateToken, booksController.addBookDetails);
router.post('/search', authenticateToken, booksController.search);

// Routes for reviews
router.post('/submit-reviews', authenticateToken, usersController.submitReviews);
router.put('/update-reviews', authenticateToken, usersController.updateReview);
router.delete('/delete-reviews', authenticateToken, usersController.deleteReviews);

// Routes for signup
router.post('/register', registerController.registerUser);
router.post('/login', registerController.login);

module.exports = router;
