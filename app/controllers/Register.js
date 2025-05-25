const express = require('express');
const app = express();
const pool = require('../config/Database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 3000;

/* 
	* API: register
	* Method: POST
	* Description: API to register a new user.
*/
exports.registerUser = async (req, res) => {
	try {
		const { user_firstname, user_lastname, user_email, user_password } = req.body;
		if (!user_firstname || !user_lastname || !user_email || !user_password) {
			return res.status(400).json({
			  status: 400,
			  success: false,
			  message: 'All fields are required'
			});
		  }
		const existingEmail = await pool.query('SELECT * FROM users WHERE user_email = $1', [user_email]);
		if (existingEmail.rows.length > 0) {
			return res.status(409).json({
				message: 'User already exists with this email'
			});
		}
		const hashed_password = await bcrypt.hash(user_password, 10);
		const registerQuery = await pool.query(
			'INSERT INTO users (user_firstname, user_lastname, is_logged_in, user_email, user_password) VALUES ($1, $2, $3, $4, $5) RETURNING *', [user_firstname, user_lastname, 0, user_email, hashed_password]
		);
		if (registerQuery.rows.length === 0) {
			return res.status(404).json({
				code: 401,
				message: 'Failed to register user'
			});
		} else {
			res.status(200).json({
				code: 200,
				message: 'User registered successfully'
			});
		}
	} catch (err) {
		console.error(err);
		res.status(500).send('Database error');
	}
};

/* 
	* API: login
	* Method: POST
	* Description: API for login.
*/
exports.login = async (req, res) => {
	try {
		const { user_email, user_password } = req.body;
		// Validate input
		if (!user_email || !user_password) {
		return res.status(400).json({
			status: 400,
			success: false,
			message: 'Email and password are required'
		});
		}
		// Find user
		const result = await pool.query('SELECT * FROM users WHERE user_email = $1', [user_email]);
	
		if (result.rows.length === 0) {
			return res.status(401).json({
			status: 401,
			success: false,
			message: 'Invalid email or password'
			});
		}
	
		const user = result.rows[0];
	
		// Compare password
		const match = await bcrypt.compare(user_password, user.user_password);
		if (!match) {
			return res.status(401).json({
			status: 401,
			success: false,
			message: 'Invalid email or password'
			});
		}
	
		// Generate JWT
		const token = jwt.sign(
			{ userId: user.user_id, email: user.user_password },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);

		const reviewQuery = await pool.query(
			'UPDATE users SET is_logged_in = 1 WHERE user_id = $1 RETURNING *', [user.user_id]
		);
		return res.status(200).json({
			code: 200,
			message: 'Login successful',
			token
		});
	
		} catch (err) {
		console.error('Login error:', err);
		return res.status(500).json({
			status: 500,
			success: false,
			message: 'Server error during login'
		});
	}
};
