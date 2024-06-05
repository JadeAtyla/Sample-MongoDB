const mongoose = require('mongoose')
// const connect = mongoose.connect("mongodb://localhost:27017/account")
const connect = mongoose.connect("mongodb+srv://jamadigal:FBY0YLh9RuDHobfL@cluster0.seva5ff.mongodb.net/school")

connect.then(() => {
    console.log("Database Connected.");
}).catch(() => {
    console.log("Connection error in Database.");
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
const collection = new mongoose.model("Student", LoginSchema);

module.exports = collection;