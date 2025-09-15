const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));


// ✅ Example: user credentials stored in memory
// Regenerated bcrypt hash for password "12345"
let users = [
    {
        username: 'admin',
        password: '$2a$10$P66vM/aXU1l.DijTz/ExUu8elLd7/5bYvPjZnH7bEgm6ymC4d.XkK' // hash for "12345"
    }
];

// ✅ Serve login.html when user visits root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html')); // filename should match exactly
});

// ✅ Login API route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log(`🔎 Login attempt: username=${username}`);

    const user = users.find(u => u.username === username);
    if (!user) {
        console.log('❌ Username not found');
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log('❌ Password mismatch');
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    console.log('✅ Login successful');
    res.json({ message: 'Login successful' });
});

// ✅ Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

