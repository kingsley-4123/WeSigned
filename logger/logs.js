export default function logger() {
    process.on('uncaughtException', (ex) => {
        console.log(ex.message, ex);
        process.exit(1);

    });

    process.on('unhandledRejection', (ex) => {
        throw ex;
        console.log(ex);
        process.exit(1);

    });

    if (!process.env.JWT_SECRET_KEY) {
        console.log('FATAL error..');
        process.exit(1);
    }
}