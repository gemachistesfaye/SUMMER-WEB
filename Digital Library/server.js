const express = require('express');
const path = require('path');
const sql = require('mssql');

const app = express();
const PORT = process.env.PORT || 3000;

// SQL Server configuration
const sqlConfig = {
    server: 'GEMACHIS\SQLEXPRESS', // Use double backslash for escaping
    database: 'Bookstore',           // Remove trailing space from database name
    options: {
        encrypt: true,                // Use encryption if required (for Azure, etc.)
        trustServerCertificate: true   // Change to false if not using self-signed certs
    }
};

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Example route to get data from SQL Server
app.get('/api/books', async (req, res) => {
    try {
        // Connect to the database
        await sql.connect(sqlConfig);
        
        // Query the database
        const result = await sql.query('SELECT title FROM Books'); // Use quotes around the query string
        
        // Send the result as JSON
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Error connecting to the database');
    } finally {
        // Close the connection
        await sql.close();
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(Server is running on http://localhost:${PORT}); // Use backticks for template literals
});
