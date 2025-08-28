import mongoose from "mongoose";
import winston from "winston";

function dbConnection() {
    
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => winston.info('Connection to DB was successful...'))   
    
    //why we are not catching rejected promise is because we defined a global
    //unhandled promise rejection.
}

export default dbConnection;
