import mongoose from "mongoose";

function dbConnection() {
    
    mongoose.connect(process.env.MONGODB_URL_OFFLINE)
        .then(() => console.log('Connection to DB was successful...'))   
    
    //why we are not catching rejected promise is because we defined a global
    //unhandled promise rejection.
}

export default dbConnection;
