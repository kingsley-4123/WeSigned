import winston from "winston";


export default function logger() {
    process.on('uncaughtException', (ex) => {
        winston.error(ex.message, ex);
        console.log(ex.message, ex);
        process.exit(1);

    });

    process.on('unhandledRejection', (ex) => {
        throw ex;
        console.log(ex);
        process.exit(1);

    });

    // Setting winston transports...
    winston.add(new winston.transports.File({ filename: '../logfile.log' }));

    if (!process.env.JWT_SECRET_KEY) {
        console.log('FATAL error..');
        process.exit(1);
    }
}