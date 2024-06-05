const mongoose = require('mongoose')
// const connect = mongoose.connect("mongodb://localhost:27017/account")
const connect = mongoose.connect("mongodb+srv://user5000:ayllaview44@cluster0.czkfeze.mongodb.net/school")

connect.then(() => {
    console.log("Database Connected.");
}).catch((err) => {
    console.log("Connection error in Database.", err);
})

// Create a Schema 
const LoginSchema = new  mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Collection Part 
const collection = new mongoose.model("students", LoginSchema);

module.exports = collection;