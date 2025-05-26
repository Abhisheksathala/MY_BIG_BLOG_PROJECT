import express from 'express';
import {
  signinUser,
  signupUser,
  changepassword,
  updateprofileimage,
  updateprofile,
} from '../controllers/userController.js'; // ✅ Fixed
import authMiddleware from '../middelwares/verifyjwt.js';

const userRoute = express.Router();

userRoute.post('/signup', signupUser);
userRoute.post('/signin', signinUser);
userRoute.post('/change-password', authMiddleware, changepassword);
userRoute.post('/update-profile-image', authMiddleware, updateprofileimage);
userRoute.post('/update-profile', authMiddleware, updateprofile);

export default userRoute;

// export const changepassword = async (req, res) => {
//
