import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import error from '../middlewares/error.js';
import login from '../routes/login.js'
import attendanceSession from '../routes/attendance_session.js';
import excelExport from '../routes/excelExport.js';
import pdfExport from '../routes/pdfExport.js';
import attendance from '../routes/attendance.js';
import user from '../routes/user.js'
import helmet from 'helmet';

function routeHandler(app) {
  app.use(express.json());
  app.use(helmet());
  app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
  app.use(cookieSession({
    name: 'sess',
    keys: [process.env.SESSION_SECRET],
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }));
  app.use('/api/signup', user);
  app.use('/api/attendance.xlsx', excelExport);
  app.use('/api/attendance.pdf', pdfExport);
  app.use('/api/attendance-session', attendanceSession);
  app.use('/api/attendance', attendance);
  app.use('/api/login', login);
  app.use(error); 
}

export default routeHandler;