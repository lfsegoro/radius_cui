const express = require('express');
const { Pool } = require('pg');
const app = express();
// require("dotenv").config();

const mystring = process.env.HOST_IP || "localhost";


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
app.get("/config", (req, res) => {
    // const mystring = "192.168.22.254" || "localhost";
    res.json({ mystring });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Update path based on your folder structure
});

app.get('/columns/:tableName', async (req, res) => {
    const { tableName } = req.params;

    try {
        const result = await pool.query(`
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = $1 AND table_schema = 'public';
        `, [tableName]);
        res.json(result.rows); // Returns column names as JSON
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to add a row to a specific table
app.post('/add/:tableName', async (req, res) => {
    const { tableName } = req.params; // Get the table name from the URL
    const rowData = req.body; // Get the form data sent from the front-end

    try {
        // Filter out fields with empty values
        const filteredRowData = Object.entries(rowData).reduce((acc, [key, value]) => {
            if (value !== '' && value !== null) { // Exclude empty fields
                acc[key] = value;
            }
            return acc;
        }, {});

        // Construct the SQL query dynamically
        const columns = Object.keys(filteredRowData).join(', '); // Get column names as a comma-separated string
        const values = Object.values(filteredRowData)
            .map((val) => `'${val.replace(/'/g, "''")}'`) // Escape single quotes to prevent SQL injection
            .join(', '); // Get values as a comma-separated string

        if (columns.length === 0 || values.length === 0) {
            return res.status(400).send('No valid data provided for insertion.'); // Handle case where all fields are empty
        }

        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;

        // Execute the query
        await pool.query(query);
        res.status(200).send('Row added successfully!');
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: err.message }); // Respond with error if the query fails
    }
});



app.post('/update/:tableName', async (req, res) => {
    const { tableName } = req.params;
    const { keys, updates } = req.body; // Keys for identifying rows, updates for modifying

    // Construct WHERE clause to identify rows
    const whereClause = Object.keys(keys)
        .map((key) => `${key} = '${keys[key]}'`)
        .join(' AND ');

    // Construct SET clause for updates
    const setClause = Object.keys(updates)
        .map((key) => `${key} = '${updates[key]}'`)
        .join(', ');

    try {
        const query = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;
        await pool.query(query);
        res.status(200).send('Row updated successfully!');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post('/search/:tableName', async (req, res) => {
    const { tableName } = req.params;
    const criteria = req.body; // Data for filtering rows

    // Construct dynamic WHERE clause
    const conditions = Object.keys(criteria)
        .map((key) => `${key} = '${criteria[key]}'`)
        .join(' AND ');

    try {
        const query = `SELECT * FROM ${tableName} WHERE ${conditions}`;
        const result = await pool.query(query);
        res.json(result.rows); // Return matched rows as JSON
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to search rows in a table based on criteria
app.post('/search/:tableName', async (req, res) => {
    const { tableName } = req.params;
    const criteria = req.body; // Search criteria sent from the front-end

    try {
        // Build the WHERE clause dynamically based on search criteria
        const conditions = Object.keys(criteria)
            .map((key) => `${key} = '${criteria[key].replace(/'/g, "''")}'`)
            .join(' AND ');

        const query = `SELECT * FROM ${tableName} WHERE ${conditions}`;
        const result = await pool.query(query);

        res.json(result.rows); // Return matched rows as JSON
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: err.message });
    }
});
// Route to update a row in a table
app.post('/update/:tableName', async (req, res) => {
    const { tableName } = req.params;
    const { keys, updates } = req.body; // Keys to identify the row, updates to modify it

    try {
        // Build WHERE clause for identifying the row
        const whereClause = Object.keys(keys)
            .map((key) => `${key} = '${keys[key].replace(/'/g, "''")}'`)
            .join(' AND ');

        // Build SET clause for updates
        const setClause = Object.keys(updates)
            .map((key) => `${key} = '${updates[key].replace(/'/g, "''")}'`)
            .join(', ');

        const query = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;
        await pool.query(query);

        res.status(200).send('Row updated successfully!');
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: err.message });
    }
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
app.listen(PORT, () => console.log(`Server running on http://${mystring}:${PORT}`));
