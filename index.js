// importing Packages
const express = require('express');
const dotenv=require('dotenv');
const connectToDB = require('./database/db');
const cors = require('cors');

// creating an express app
const app = express();
// configuring dotenv to use the .env file
dotenv.config();

// Cors config to accept request from frontend
const corsOptions={
    origin:true,
    credentials:true,
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

// connecting to database
connectToDB();
// accepting json data
app.use(express.json());
// Defining routes
app.use('/api/user',require('./routes/userRoutes'));




// Defining port
const PORT = process.env.PORT;
//running the server on port 5000
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
});

