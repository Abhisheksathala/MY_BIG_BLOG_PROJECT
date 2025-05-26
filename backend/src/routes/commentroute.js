import express from 'express';
import {
  addcomment,
  getblogcomments,
  getreplies,
  deletecomment,
} from '../controllers/commentController.js';
import authMiddleware from '../middelwares/verifyjwt.js';

const commentRouter = express.Router();

commentRouter.post('/add-comments', authMiddleware, addcomment);
commentRouter.post('/get-blog-comments', getblogcomments);
commentRouter.post('/get-replies', getreplies);
commentRouter.post('/delete-comment', authMiddleware, deletecomment);

export default commentRouter;
