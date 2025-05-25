const express = require('express');
const app = express();
const pool = require('../config/Database');

const PORT = process.env.PORT || 3000;

/* 
	* API: get-book-details
	* Method: GET
	* Description: API to get details of book by book id.
*/
exports.getBookDetails = async (req, res) => {
	try {
		const bookId = req.params.num;
		const result = await pool.query('SELECT * FROM books WHERE book_id = $1', [bookId]);
		if (result.rows.length === 0) {
			return res.status(404).json({
				code: 404,
				message: 'Book not found'
			});
		} else {
			res.status(200).json({
				code: 200,
				message: 'Data fetched successfully',
				data: result.rows[0]
			});
		}
	} catch (err) {
		console.error(err);
		res.status(500).send('Database error');
	}
};

/* 
	* API: get-book-list
	* Method: GET
	* Description: API to get list of books.
*/
exports.getBookList = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const offset = (page - 1) * limit;

		// Main paginated query
		const bookList = await pool.query(
			'SELECT * FROM books LIMIT $1 OFFSET $2', [limit, offset]
		);

		// Total count query
		const totalCountResult = await pool.query('SELECT COUNT(*) FROM books');
		const total_books = parseInt(totalCountResult.rows[0].count);
		const total_pages = Math.ceil(total_books / limit);

		if (bookList.rows.length === 0) {
			return res.status(404).json({
				code: 404,
				message: 'No Data found',
			});
		}

		res.status(200).json({
			code: 200,
			message: 'Data fetched successfully',
			data: bookList.rows,
			extra_info: {
				total_books,
				total_pages,
				current_page: page,
				limit,
			},
		});
	} catch (err) {
		console.error(err);
		res.status(500).send('Database error');
	}
};

/* 
	* API: add-book
	* Method: POST
	* Description: API to add new book details.
*/
exports.addBookDetails = async (req, res) => {
	try {
		const { book_name, reviews, author_name, genres } = req.body;
		if (!book_name || !reviews || !author_name || !genres) {
			return res.status(400).json({
			  status: 400,
			  success: false,
			  message: 'All fields are required'
			});
		}
		const bookQuery = await pool.query(
			'INSERT INTO books (book_name, reviews, author_name, genres) VALUES ($1, $2, $3, $4) RETURNING *', [book_name, reviews, author_name, genres]
		);
		if (bookQuery.rows.length === 0) {
			return res.status(404).json({
				code: 401,
				message: 'Failed to add data'
			});
		} else {
			res.status(200).json({
				code: 200,
				message: 'Data added successfully'
			});
		}
	} catch (err) {
		console.error(err);
		res.status(500).send('Database error');
	}
};

/* 
	* API: search
	* Method: POST
	* Description: API to search by book name or author name.
*/
exports.search = async (req, res) => {
	try {
		const { search_value } = req.body;
		if (!search_value) {
			return res.status(400).json({
			  status: 400,
			  success: false,
			  message: 'Input is required'
			});
		}
		const searchQuery = await pool.query(
			`SELECT * FROM books WHERE book_name ILIKE $1 OR author_name ILIKE $1`,
			[`%${search_value}%`]
		);
		if (searchQuery.rows.length === 0) {
			return res.status(404).json({
				code: 401,
				message: 'No data found'
			});
		} else {
			res.status(200).json({
				code: 200,
				message: 'Data fetched successfully',
				data: searchQuery.rows
			});
		}
	} catch (err) {
		console.error(err);
		res.status(500).send('Database error');
	}
};
