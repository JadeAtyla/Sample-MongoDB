const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

// creating the app
const app = express();

// Convert data into JSON format
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render('login');
});

app.get("/signup", (req, res) => {
    res.render('signup');
});

app.get("/home", (req, res) => {
    res.render('home');
});

// Function to generate a verification token
function generateVerificationToken() {
    return uuidv4(); // Using UUID for generating unique tokens
}

// Register User
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: await bcrypt.hash(req.body.password, 10),
        verified: false, 
        verificationToken: generateVerificationToken()
    };

    try {
        console.log("User data before insertion:", data);

        const userdata = await collection.insertMany(data);
        console.log("Inserted user data:", userdata);

        // Craft the verification link
        const verificationLink = `https://sample-mongodb.onrender.com/verify?token=${data.verificationToken}`;

        // Send email for verification
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "jecaticonstructionsevices@gmail.com",
                pass: "yni5qk2534qo"
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: "jecaticonstructionsevices@gmail.com",
            to: "jamadigal@gmail.com",
            subject: "Sample MongoDB User Request",
            html: `This request is from the Sample MongoDB Website. Click <a href="${verificationLink}">here</a> to verify your account. Account user: ${req.body.username}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).send('Error sending verification email');
            } else {
                console.log("Verification email sent: " + info.response);
                res.status(201).send('Please check your email for verification');
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
});

// Verify User
app.get("/verify", async (req, res) => {
    const token = req.query.token;
    console.log("Verification token:", token);

    try {
        // Find the user with the verification token
        const user = await collection.findOne({ verificationToken: token });
        console.log("User found with token:", user);

        if (!user) {
            return res.status(400).send('Invalid verification token');
        }
        // Mark the user as verified in the database
        await collection.updateOne({ _id: user._id }, { $set: { verified: true } });
        console.log("User verified:", user);

        res.status(201).send('Account verified successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error verifying account');
    }
});

// Login User
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await collection.findOne({ name: username });

        if (!user) {
            return res.status(400).send('Invalid username');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send('Invalid password');
        }

        if (!user.verified) {
            return res.status(400).send('Please verify your account before logging in');
        }

        // // Set user in session
        // req.session.user = user;

        res.redirect('/home');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error logging in');
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Server is running on port", port);
});
