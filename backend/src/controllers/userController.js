import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js'; // Make sure the path is correct

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '7d' });
};

const emailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const generateUsername = async (email) => {
  let base = email.split('@')[0];
  let username = base;
  let exists = await userModel.exists({ 'personal_info.username': username });

  while (exists) {
    username = base + Math.floor(Math.random() * 10000);
    exists = await userModel.exists({ 'personal_info.username': username });
  }

  return username;
};

export const signupUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields', success: false });
    }
    if (fullname.length < 3) {
      return res
        .status(400)
        .json({ message: 'Full name must be at least 3 characters long', success: false });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format', success: false });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
        success: false,
      });
    }

    const existingUser = await userModel.findOne({ 'personal_info.email': email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use', success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = await generateUsername(email);

    const user = new userModel({
      personal_info: {
        fullname,
        email,
        password: hashedPassword,
        username: username,
      },
    });

    await user.save();

    const access_token = createToken(user._id);

    return res
      .status(201)
      .json({ message: 'User created successfully', success: true, user, access_token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false, error: error.message });
  }
};

export const signinUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields', success: false });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format', success: false });
  }

  try {
    const user = await userModel.findOne({ 'personal_info.email': email });

    if (!user) {
      return res
        .status(404)
        .json({ message: 'User not found, please register first', success: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.personal_info.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password', success: false });
    }

    const access_token = createToken(user._id);

    return res
      .status(200)
      .json({ message: 'User signed in successfully', success: true, user, access_token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false, error: error.message });
  }
};

export const changepassword = async (req, res) => {
  let { currentPassword, newPassword } = req.body;
  const userId = req.user;
  try {
    if (!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character. ',
        success: false,
      });
    }

    const user = await userModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.personal_info.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password', success: false });
    }

    const hashpassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await userModel.findByIdAndUpdate(
      { _id: userId },
      {
        $set: {
          'personal_info.password': hashpassword,
        },
      },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(400).json({ message: 'User not found', success: false });
    }
    return res.status(200).json({ message: 'Password changed successfully', success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false, error: error.message });
  }
};

export const updateprofileimage = async (req, res) => {
  const { url } = req.body;
  const userId = req.user;
  try {
    const finduserandupdate = await userModel.findByIdAndUpdate(
      {
        _id: userId,
      },
      {
        'personal_info.profile_img': url,
      },
      {
        new: true,
      },
    );

    if (!finduserandupdate) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    return res.status(200).json({ message: 'Profile image updated successfully', success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false, error: error.message });
  }
};

export const updateprofile = async (req, res) => {
  const userId = req.user;

  const { username, bio, social_links } = req.body;
  const biolimit = 150;

  console.log({
    username,
    bio,
    social_links,
  });

  const sociallinksArr = Object.keys(social_links);

  if (username.length < 3) {
    return res
      .status(400)
      .json({ message: 'Username must be at least 3 characters', success: false });
  }

  if (bio.length > biolimit) {
    return res
      .status(400)
      .json({ message: 'Bio must be less than 150 characters', success: false });
  }

  try {
    for (let i = 0; i < sociallinksArr.length; i++) {
      if (social_links[sociallinksArr[i]]) {
        let hostname = new URL(social_links[sociallinksArr[i]]).hostname;
        if (!hostname.includes(`${sociallinksArr[i]}.com`) && sociallinksArr[i] !== 'website') {
          return res.status(400).json({ message: 'Invalid social link', success: false });
        }
      }
    }

    let updateobj = {
      'personal_info.username': username,
      'personal_info.bio': bio,
      social_links,
    };

    const findeuserandupdatelinks = await userModel.findByIdAndUpdate(
      {
        _id: userId,
      },
      updateobj,
      {
        runValidators: true,
      },
    );

    if (!findeuserandupdatelinks) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    return res.status(200).json({
      message: 'Profile updated successfully',
      success: true,
      username,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username already exists', success: false });
    }
    return res
      .status(500)
      .json({ message: 'Internal server error', success: false, error: error.message });
  }
};
