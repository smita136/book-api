const express = require('express');
const app = express();
const pool = require('../config/Database');

const PORT = process.env.PORT || 3000;

/* 
	* API: submit-reviews
	* Method: POST
	* Description: API to submit reviews.
*/
exports.submitReviews = async (req, res) => {
	try {
		const { user_id, book_id, review } = req.body;
		if (!user_id || !book_id || !review) {
			return res.status(400).json({
			  status: 400,
			  success: false,
			  message: 'All fields are required'
			});
		}
		const reviewQuery = await pool.query(
			'INSERT INTO user_reviews (user_id, book_id, reviews) VALUES ($1, $2, $3) RETURNING *', [user_id, book_id, review]
		);
		if (reviewQuery.rows.length === 0) {
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
	* API: update-reviews
	* Method: PUT
	* Description: API to update reviews.
*/
exports.updateReview = async (req, res) => {
	try {
		const { review_id, review } = req.body;
		if (!review_id || !review) {
			return res.status(400).json({
			  status: 400,
			  success: false,
			  message: 'All fields are required'
			});
		}
		const reviewQuery = await pool.query(
			'UPDATE user_reviews SET reviews = $2 WHERE review_id = $1 RETURNING *', [review_id, review]
		);
		if (reviewQuery.rows.length === 0) {
			return res.status(404).json({
				code: 401,
				message: 'Failed to update data'
			});
		} else {
			res.status(200).json({
				code: 200,
				message: 'Data updated successfully'
			});
		}
	} catch (err) {
		console.error(err);
		res.status(500).send('Database error');
	}
};

/* 
	* API: delete-reviews
	* Method: DELETE
	* Description: API to delete reviews.
*/
exports.deleteReviews = async (req, res) => {
	try {
		const { review_id } = req.body;
		if (!review_id) {
			return res.status(400).json({
			  status: 400,
			  success: false,
			  message: 'All fields are required'
			});
		}
		const reviewQuery = await pool.query(
			'DELETE FROM user_reviews WHERE review_id = $1 RETURNING *', [review_id]
		);
		if (reviewQuery.rows.length === 0) {
			return res.status(404).json({
				code: 401,
				message: 'Failed to add data'
			});
		} else {
			res.status(200).json({
				code: 200,
				message: 'Data deleted successfully'
			});
		}
	} catch (err) {
		console.error(err);
		res.status(500).send('Database error');
	}
};
