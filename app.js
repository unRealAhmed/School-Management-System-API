// Load environmental variables
require("dotenv").config({ path: './config.env' });

// Import necessary modules
const express = require('express');
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const hpp = require('hpp');
const connectDatabase = require('./utils/dataBase');
const errorController = require("./controllers/errorController");
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

// Initialize Express app
const app = express();
const port = process.env.PORT || 8000;

// Enhance security with various middleware
app.use(helmet()); // Set various HTTP headers for security
app.use(mongoSanitize()); // Sanitize data against NoSQL injection attacks
app.use(xss()); // Prevent XSS attacks
app.use(hpp());

// Parse cookies, enable CORS, and handle JSON parsing
app.use(cookieParser(process.env.JWT_SECRET_KEY));
app.use(cors());
app.options("*", cors());
app.use(express.json({ limit: '100kb' }));

// Serve static files
app.use(express.static('./public'));

// Rate limiting middleware to prevent abuse
app.use('/api', rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
}));

//ROUTES

app.use('/api/v1/admins', adminRouter)
app.use('/api/v1/teachers', teacherRouter)
app.use('/api/v1/students', studentRouter)
app.use('/api/v1/academic-years', academicYearRouteR)
app.use('/api/v1/academic-terms', academicTermRouter)
app.use('/api/v1/class-levels', classLevelRouter)
app.use('/api/v1/programs', programRouter)
app.use('/api/v1/subjects', subjectRouter)
app.use('/api/v1/year-groups', yearGroupRouter)
app.use('/api/v1/exams', examRouter)
app.use('/api/v1/questions', questionRouter)

// Connect to the database
connectDatabase();

// Error Handling Middleware: Handle requests for undefined routes
app.all("*", (req, _, next) => {
  const err = new Error(`Can't Find ${req.originalUrl}`);
  err.status = "fail";
  err.statusCode = 404;
  err.isOperational = true;
  next(err);
});

app.use(errorController)

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
