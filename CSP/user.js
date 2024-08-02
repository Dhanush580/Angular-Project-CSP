const express = require('express');
const router = express.Router();
const connection = require('./connection');

// Get all registrations
router.get('/registration', (req, res) => {
    const query = "SELECT * FROM registration";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

// Delete a registration by username
router.delete('/registration/:username', (req, res) => {
    const username = req.params.username;
    const query = "DELETE FROM registration WHERE username = ?";
    connection.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error deleting registration:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Registration deleted successfully' });
    });
});

// Update a registration by username
router.patch('/registration/:username', (req, res) => {
  const username = req.params.username;
  const { email, password } = req.body;
  const query = "UPDATE registration SET email = ?, password = ? WHERE username = ?";
  connection.query(query, [email, password, username], (err, results) => {
      if (err) {
          console.error('Error updating registration:', err);
          return res.status(500).json({ error: err.message });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User updated successfully" });
  });
});
// Register a new user
// Register a new user
router.post('/registration', (req, res) => {
  const { username, email, password } = req.body;
  
  // Check if username already exists
  const checkQuery = "SELECT * FROM registration WHERE username = ?";
  connection.query(checkQuery, [username], (err, results) => {
      if (err) {
          console.error('Error checking username:', err);
          return res.status(500).send('Server error');
      }
      if (results.length > 0) {
          return res.status(400).json({ message: 'Username already taken' });
      }
      
      // Insert new user if username is unique
      const insertQuery = "INSERT INTO registration (username, email, password) VALUES (?, ?, ?)";
      connection.query(insertQuery, [username, email, password], (err) => {
          if (err) {
              console.error('Error registering user:', err);
              return res.status(500).send('Error registering user');
          }
          console.log('User registered successfully');
          return res.status(200).json({ message: 'User registered successfully' });
      });
  });
});

// Login a user
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Find user by username
  const query = "SELECT * FROM registration WHERE username = ? AND password = ?";
  connection.query(query, [username, password], (err, results) => {
      if (err) {
          console.error('Error during login:', err);
          return res.status(500).send('Server error');
      }
      if (results.length === 0) {
          return res.status(401).json({ message: 'No user exists with these credentials' });
      }
      res.status(200).json({ message: 'Login successful' });
  });
});


module.exports = router;
