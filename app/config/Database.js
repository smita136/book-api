const { Pool } = require('pg');

const pool = new Pool({
	user: process.env.DB_USER || 'postgres',
	host: process.env.DB_HOST || 'localhost',
	database: process.env.DB_NAME || 'book_reviews',
	password: process.env.DB_PASS || 'pgDB@12',
	port: Number(process.env.DB_PORT) || 5432,
});

module.exports = pool;
