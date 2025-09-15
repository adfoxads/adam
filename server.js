const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Example: user credentials stored in memory (for demo, can be in file)
let users = [
    {
        username: 'admin',
        // password: '12345' hashed using bcrypt
        password: '$2a$10$6OZxURkGVxk4bJ6ZpN2kKuIoCwK9l5LxQ1wI2oFPnYhCrf3M8fOa2'
    }
];

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    res.json({ message: 'Login successful' });
});

const path = require('path');

// Add this route at the top of your server.js routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});




// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

