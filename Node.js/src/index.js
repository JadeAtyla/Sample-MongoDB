const express = require('express');
const path = require('path');
// const bcrypt = require('bcrypt');
const collection = require('./config');
const http = require('http');

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

// Register User
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password //await bcrypt.hash(req.body.password, 10)
    };

    // check if the user already exist
    const existingUser = await collection.findOne({name: data.name});
    if(existingUser){
        res.send("User already existed");
    }else{
        try {
            const userdata = await collection.insertMany(data);
            console.log(userdata);
            res.status(201).send('User Registered Successfully');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error registering user');
        }
    }
});

const port = process.env.PORT || 5000;
const server = http.createServer(collection);
app.listen(port, () => {
    console.log("Server is running on port", port);
});