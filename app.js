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

// Function to generate a password
function generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols) {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '~!@#$%^&*()_+-=[]{}|;:,.<>?\"/';

    let characterPool = '';
    if (includeUppercase) characterPool += uppercaseChars;
    if (includeLowercase) characterPool += lowercaseChars;
    if (includeNumbers) characterPool += numberChars;
    if (includeSymbols) characterPool += symbolChars;

    if (!characterPool) return ''; // If no character set is selected, return empty string

    let password = '';
    let usedChars = new Set();

    // Ensure the password is generated with no repeated characters
    while (password.length < length) {
        const randomIndex = Math.floor(Math.random() * characterPool.length);
        const randomChar = characterPool[randomIndex];

        // Add character if it hasn't been used already
        if (!usedChars.has(randomChar)) {
            password += randomChar;
            usedChars.add(randomChar);
        }
    }

    return password;
}

// Handle the root route
app.get('/', (req, res) => {
    res.render('index'); // This will render views/index.ejs
});

// Handle password generation
app.get('/generate-password', (req, res) => {
    const { length, uppercase, lowercase, numbers, symbols } = req.query;

    // Call the function to generate a password without duplicate characters
    const password = generatePassword(
        parseInt(length),
        uppercase === 'true',
        lowercase === 'true',
        numbers === 'true',
        symbols === 'true'
    );

    res.json({ password });
});

// Listen on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
