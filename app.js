const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARE

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

// security http headers

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'ws:'],
        connectSrc: [
          "'self'",
          'http://127.0.0.1:3000/',
          'http://localhost:3000',
          'https://api.stripe.com/',
          'ws://127.0.0.1:1234', // Add this line to allow WebSocket connections
          'https://*',
        ],
        scriptSrc: [
          "'self'",
          'https://cdnjs.cloudflare.com/',
          'https://api.mapbox.com/',
          'https://js.stripe.com/',
          'blob:',
        ],
        frameSrc: ["'self'", 'https://js.stripe.com/'],

        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        fontSrc: ["'self'", 'https:', 'data:'],
      },
    },
  }),
);

//middleware that modifies incoming REQUEST data
//logging
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests form this IP, please try again in an hour!',
});
app.use('/api', limiter);

// body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// cookie parser
app.use(cookieParser());

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// app.use((req, res, next) => {
//   console.log('hello from the middleware 👋');
//   next();
// });

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 3) ROUTES

//tourRouter is middleware
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

// 4) SERVER START
module.exports = app;
