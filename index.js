import express from 'express';
import dotenv from 'dotenv';
import logger from './logger.js/logs.js';
import routes from './startup/routes.js'
import dbConnect from './startup/db.js';
dotenv.config();
const app = express();

logger();
dbConnect();
routes(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));