// src/routes/notificationroute.js
import express from 'express';
import {
  newnotification,
  postnotifications,
  allnotificationcount,
} from '../controllers/notification.js';
import authMiddleware from '../middelwares/verifyjwt.js';

const notificationRouter = express.Router();

notificationRouter.get('/new-notification', authMiddleware, newnotification);
notificationRouter.post('/notifications', authMiddleware, postnotifications);
notificationRouter.post('/notifications-count', authMiddleware, allnotificationcount);

export default notificationRouter;
