import express from 'express';
import authMiddleware from '../middelwares/verifyjwt.js';

import {
  createBloge,
  getAllBlogs,
  getblogbyid,
  getpoastbytagadvance,
  getPostBytag,
  getprofile,
  gettrendingblogs,
  loadmoreposts,
  usersearch,
  likeblog,
  isliked,
  userWrittenblogs,
  userwrittenblogcount,
  deleteblog,
} from '../controllers/blogController.js';

const blogRoute = express.Router();

blogRoute.post('/create-blog', authMiddleware, createBloge);
blogRoute.post('/get-all-blogs', getAllBlogs);
blogRoute.get('/get-trending-blogs', gettrendingblogs);
blogRoute.post('/get-blogs-by-tag', getPostBytag);
blogRoute.post('/all-latest-blogs-count-load-more', loadmoreposts);
blogRoute.post('/get-blogs-by-tag-advance', getpoastbytagadvance);
blogRoute.post('/search-user', usersearch);
blogRoute.post('/get-profile', getprofile);
blogRoute.post('/get-blog', getblogbyid);
blogRoute.post('/like-blog', authMiddleware, likeblog);
blogRoute.post('/isliked-by-user', authMiddleware, isliked);
blogRoute.post('/user-Written-blogs', authMiddleware, userWrittenblogs);
blogRoute.post('/user-Written-blogs-count', authMiddleware, userwrittenblogcount);
blogRoute.post('/delete-blog', authMiddleware, deleteblog);

export default blogRoute;
