const express = require('express');
const { Pool } = require('pg');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Database connection pool
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

app.use(express.static('backend')); // Ensure 'backend' is the correct folder name

// Test route
// app.get('/', (req, res) => {
//     res.send('Hello world!');
// });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Update path based on your folder structure
});


// Route to fetch all table names from the database
app.get('/tables', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public';
        `);
        res.json(result.rows); // Send result as JSON
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Example route to fetch data from database
app.get('/data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM your_table_name'); // Replace with your table name
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
