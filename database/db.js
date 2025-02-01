
const mongoose=require('mongoose');


const connectToDB=()=>{
    // connect to database(mongodb)
    mongoose.connect(process.env.DB_URL).then(()=>{
        console.log('Connected to database');
    }); 
}

module.exports=connectToDB;
