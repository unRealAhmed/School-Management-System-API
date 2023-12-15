const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const hpp = require('hpp');
const compression = require('compression');
const errorController = require('./controllers/errorController');
const adminRouter = require('./routes/staff/adminRoutes');
const teacherRouter = require('./routes/staff/teacherRoutes');
const studentRouter = require('./routes/Academic/studentRoutes');
const academicYearRouteR = require('./routes/Academic/academicYearRoutes');
const academicTermRouter = require('./routes/Academic/academicTermRoutes');
const classLevelRouter = require('./routes/Academic/classLevelRoutes');
const programRouter = require('./routes/Academic/programRoutes');
const subjectRouter = require('./routes/Academic/subjectRoutes');
const yearGroupRouter = require('./routes/Academic/yearGroupRoutes');
const examRouter = require('./routes/Academic/examRoutes');
const questionRouter = require('./routes/Academic/questionRoutes');
const examResultsRouter = require('./routes/Academic/examReusltsRoutes');

const apiVersion = '/api/v1';

const app = express();

app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(compression());

app.use(cookieParser(process.env.JWT_SECRET_KEY));
app.use(cors());
app.options('*', cors());
app.use(express.json({ limit: '100kb' }));

app.use(express.static('./public'));

app.use(
  '/api',
  rateLimit({
    max: 200,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
  })
);

app.use(`${apiVersion}/admins`, adminRouter);
app.use(`${apiVersion}/teachers`, teacherRouter);
app.use(`${apiVersion}/students`, studentRouter);
app.use(`${apiVersion}/academic-years`, academicYearRouteR);
app.use(`${apiVersion}/academic-terms`, academicTermRouter);
app.use(`${apiVersion}/class-levels`, classLevelRouter);
app.use(`${apiVersion}/programs`, programRouter);
app.use(`${apiVersion}/subjects`, subjectRouter);
app.use(`${apiVersion}/year-groups`, yearGroupRouter);
app.use(`${apiVersion}/exams`, examRouter);
app.use(`${apiVersion}/questions`, questionRouter);
app.use(`${apiVersion}/exam-results`, examResultsRouter);

app.all('*', (req, _, next) => {
  const err = new Error(`Can't Find ${req.originalUrl}`);
  err.status = 'fail';
  err.statusCode = 404;
  err.isOperational = true;
  next(err);
});

app.use(errorController);

module.exports = app;
