require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// All API routes go through this one file
const apiRoutes = require('./app/config/Routes');
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
	res.send('Welcome to the Express app');
});

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
