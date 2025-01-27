const express = require('express');
const app = express();
const path = require('path');
const crypto = require('crypto');

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Parse incoming requests with JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle the root route
app.get('/', (req, res) => {
    res.render('index'); // This will render views/index.ejs
});

// Password generation route
app.get('/generate-password', (req, res) => {
    const length = parseInt(req.query.length) || 18;
    const includeUppercase = req.query.uppercase === 'true';
    const includeLowercase = req.query.lowercase === 'true';
    const includeNumbers = req.query.numbers === 'true';
    const includeSymbols = req.query.symbols === 'true';

    // Generate password
    const password = generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols);

    // Return password as JSON
    res.json({ password });
});

// Password generation function
function generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols) {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';
    
    let charset = '';
    if (includeUppercase) charset += uppercaseChars;
    if (includeLowercase) charset += lowercaseChars;
    if (includeNumbers) charset += numberChars;
    if (includeSymbols) charset += symbolChars;

    if (charset.length === 0) return ''; // No options selected

    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return password;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
