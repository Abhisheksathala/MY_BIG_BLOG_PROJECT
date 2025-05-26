import express from 'express';
import 'dotenv/config';

import userRoute from './src/routes/userRoute.js';
import uploadrouter from './src/routes/uploadrouter.js';
import blogRoute from './src/routes/blogroute.js';
import commentRouter from './src/routes/commentroute.js';
import notificationRouter from './src/routes/notificationroute.js';

import { requestLogger, addTimeStamp } from './src/utlis/globelerrorhandler.js';
import { configureCors } from './src/utlis/corsconfig.js';
import { globalErrorhandler } from './src/utlis/uniErrorhandler.js';

const app = express();

// Middleware
app.use(configureCors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(requestLogger);
app.use(addTimeStamp);

// Routes
app.use('/api/v1/upload', uploadrouter);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/blog', blogRoute);
app.use('/api/v1/comment', commentRouter);
app.use('/api/v1/notification', notificationRouter);

// Error handler should come last
app.use(globalErrorhandler);

export default app;
