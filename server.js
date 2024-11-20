// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// Initialize the Express application
const app = express();
const PORT = 3000; // Define the port on which the server will listen

// Use bodyParser middleware to parse JSON request bodies
app.use(bodyParser.json());
// Serve static files (like HTML, CSS, JS) from the current directory
app.use(express.static(__dirname));
// Handle MongoDB connection events
mongoose.connect('mongodb+srv://tejajakka:JKteja@crudapp.0m9np.mongodb.net/CRUDAPP?retryWrites=true&w=majority&appName=CRUDAPP');

const connect = mongoose.connection;

connect.on('error', console.error.bind(console, 'MongoDB connection error:')); // Log connection errors

connect.once('open', () => {
    console.log('Connected to MongoDB');// Log successful connection to the database
});
// Define the user schema for MongoDB
const userSchema = new mongoose.Schema({
    name: String, // Name field (String)
    email: String, // Email field (String)
    age: Number // Age field (Number)

});
// Create a User model from the schema (collection will be pluralized as 'users')
const User = mongoose.model('User', userSchema);
// Serve the static HTML file on the root URL ('/')
app.get('/', async (request, response) => {
    response.sendFile(__dirname + '/user.html');
});
// Create a new user (POST request handler)
app.post('/users', async (request, response) => {
       // Create a new user instance from request body data
    const user = new User({
        name : request.body.name,
        email : request.body.email,
        age : request.body.age
    });
    // Save the new user to the database
    const newItem = await user.save();
    // Respond with a success status and message
    response.status(201).json({scuccess:true});
});
// Retrieve all users from the database (GET request handler)
app.get('/users', async (request, response) => {
     // Find all users in the collection
    const users = await User.find();
    // Respond with the list of users in JSON format
    response.status(200).json(users);
});
// Retrieve a user by ID (GET request handler)
app.get('/users/:id', async (request, response) => {
        // Find a user by ID
    const user = await User.findById(request.params.id);
       // Respond with the user details in JSON format
    response.status(200).json(user);
});
// Update a user by ID (PUT request handler)
app.put('/users/:id', async (request, response) => {
    const userId = request.params.id;// Get the user ID from the URL parameters
    // Fetch the user from the database
    const user = await User.findById(userId);
     // Update the user details with new values from the request body
    user.name = request.body.name;
    user.email = request.body.email;
    user.age = request.body.age;
    // Save the updated user back to the database
    const updatedItem = await user.save();
     // Respond with the updated user details
    response.status(200).json(updatedItem);
});
// Delete a user by ID (DELETE request handler)
app.delete('/users/:id', async (request, response) => {
    const userId = request.params.id;
    // Fetch the user from the database
    const user = await User.findById(userId);
    await user.deleteOne();// Delete the user document
    // Respond with a confirmation message
    response.status(200).json({ message : 'Deleted item' });
});
// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);// Log that the server is running http://localhost:3000/
});