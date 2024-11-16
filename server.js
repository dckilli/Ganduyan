// Import required modules
const express = require('express');  // Express to manage routing
const mysql = require('mysql2');    // MySQL2 for connecting to MySQL database
const path = require('path');       // Path module to resolve file paths
const fs = require('fs');           // File system to create directories
const multer = require('multer');   // Multer for handling file uploads

// Initialize the Express app
const app = express();
const port = 3000;  // You can choose any available port (3000 is common)

// Ensure the 'uploads' folder exists, and create it if it doesn't
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Uploads folder created');
}

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Store files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Store files with a unique name to prevent overwriting
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create a MySQL database connection
const connection = mysql.createConnection({
  host: 'localhost',    // Database host (usually 'localhost' for local dev)
  user: 'root',         // Your MySQL username (default is 'root' for local)
  password: 'Tour1sm-pr0ject!',         // Your MySQL password
  database: 'tourism_database' // Your MySQL database name
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the MySQL database');
});

// Middleware to parse JSON and form data
app.use(express.json());  // For parsing application/json
app.use(express.urlencoded({ extended: true }));  // For parsing application/x-www-form-urlencoded

// Serve static files (HTML, CSS, JS) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Serve index.html
});

// API route to handle tourist registration (form submission)
app.post('/register', upload.single('valid_id'), (req, res) => {
  // Extract form data
  const { name, age, sex, nationality } = req.body;
  const validId = req.file ? req.file.filename : null;  // Get the file name from the uploaded file

  // Logging for debugging purposes
  console.log('Form data received:', { name, age, sex, nationality, validId });
  console.log('File received:', req.file);  // Log the uploaded file info

  // Validate required fields
  if (!name || !age || !sex || !validId || !nationality) {
    console.error('Validation error: Missing required fields');
    return res.status(400).send('All fields are required');
  }

  // SQL query to insert the tourist's data into the 'tourists' table
  const query = 'INSERT INTO tourists (name, age, sex, valid_id, nationality) VALUES (?, ?, ?, ?, ?)';

  // Insert data into the database
  connection.query(query, [name, age, sex, validId, nationality], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Error saving data');  // Error response if database insertion fails
    }
    console.log('Data inserted successfully:', results);
    res.send('Registration successful');  // Success message if data is saved
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
