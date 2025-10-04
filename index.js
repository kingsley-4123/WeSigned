import express from 'express';
import dotenv from 'dotenv';
import logger from './logger/logs.js';
import routes from './startup/routes.js'
import dbConnect from './startup/db.js';
dotenv.config({path: './.env'});
const app = express();

logger();
dbConnect();
routes(app);

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${port}...`));