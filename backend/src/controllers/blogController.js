import blogModel from '../models/blogmodel.js';
import userModel from '../models/usermodel.js';
import notificationModel from '../models/notificationModel.js';
import commentModel from '../models/comment.js';
import { nanoid } from 'nanoid';

export const createBloge = async (req, res) => {
  try {
    const authorId = req.user;

    const { title, banner, content, tags, des, draft = false } = req.body;

    if (!draft) {
      // Validation
      if (!title?.length) {
        return res.status(403).json({ message: 'Title is required', success: false });
      }
      if (!banner?.length) {
        return res.status(403).json({ message: 'Banner is required', success: false });
      }
      if (!des?.length || des.length > 200) {
        return res.status(403).json({
          message: 'Description is required and should be less than 200 characters',
          success: false,
        });
      }
      if (!content?.length) {
        return res.status(403).json({ message: 'Content is required', success: false });
      }
      if (!tags?.length) {
        return res.status(403).json({ message: 'Tags are required', success: false });
      }
    }

    const normalizedTags = tags.map((t) => t.toLowerCase());

    const blog_id =
      title
        .replace(/[^a-zA-Z0-9]/g, '')
        .replace(/\s+/g, '-')
        .trim() + nanoid();

    const blog = new blogModel({
      title,
      banner,
      content,
      tags: normalizedTags,
      des,
      author: authorId,
      blog_id,
      draft: Boolean(draft),
    });

    const newBlog = await blog.save();

    const incrementVal = draft ? 0 : 1;
    await userModel.findOneAndUpdate(
      { _id: authorId },
      {
        $inc: { 'account_info.total_posts': incrementVal },
        $push: { blogs: blog._id },
      },
    );

    return res.status(201).json({
      message: 'Blog created successfully',
      success: true,
      blog: newBlog,
      id: blog.blog_id,
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    return res.status(500).json({
      message: 'Something went wrong while creating the blog',
      success: false,
    });
  }
};

export const getAllBlogs = async (req, res) => {
  let { page } = req.body;
  try {
    let skip = (page - 1) * 5;
    const maxlimit = 5;
    const blogs = await blogModel
      .find({ draft: false })
      .populate(
        'author',
        'personal_info.profile_img personal_info.username personal_info.fullname -_id',
      )
      .sort({ publishedAt: -1 })
      .select('blog_id title banner des content activity tags publishedAt -_id')
      .skip(skip)
      .limit(maxlimit);

    if (!blogs.length) {
      return res.status(404).json({ message: 'No blogs found', success: false });
    }

    return res.status(200).json({ message: 'Blogs retrieved successfully', success: true, blogs });
  } catch (error) {
    return res.status(500).json({
      message: `${error.message}` || 'Something went wrong while retrieving the blogs',
      success: false,
    });
  }
};

export const gettrendingblogs = async (req, res) => {
  try {
    const maxlimit = 5;

    const trendingblogs = await blogModel
      .find({ draft: false })
      .populate(
        'author',
        'personal_info.profile_img personal_info.username personal_info.fullname -_id',
      )
      .sort({
        'activity.total_likes': -1,
        'activity.total_read': -1,
        publishedAt: -1,
      })
      .select('blog_id title publishedAt -_id')
      .limit(maxlimit);

    if (!trendingblogs.length) {
      return res.status(404).json({ message: 'Trending blogs not found', success: false });
    }

    return res.status(200).json({
      message: 'Trending blogs retrieved successfully',
      success: true,
      blogs: trendingblogs,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Something went wrong while retrieving the trending blogs',
      success: false,
    });
  }
};

export const loadmoreposts = async (req, res) => {
  try {
    const count = await blogModel.countDocuments({ draft: false });

    if (!count && count !== 0) {
      return res.status(404).json({ message: 'Unable to load blogs', success: false });
    }

    return res.status(200).json({
      message: 'Loaded',
      success: true,
      totalDocs: count,
    });
  } catch (error) {
    console.error('Error loading more posts:', error);
    res.status(500).json({
      message: error.message || 'Server error while loading blogs',
      success: false,
    });
  }
};

// search and tag

export const getpoastbytagadvance = async (req, res) => {
  try {
    let { tag, page, query, author } = req.body;
    const limit = 5;
    let findbyquery;
    if (tag) {
      console.log('Received tag:', tag);
      findbyquery = { tags: tag, draft: false };
    } else if (query && query.trim().length) {
      console.log('Received query:', query);
      findbyquery = { draft: false, title: new RegExp(query, 'i') };
    } else if (page) {
      findbyquery = { author, draft: false };
    } else {
      return res.status(400).json({ message: 'No tag or query provided', success: false });
    }

    const findQuery = await blogModel
      .find(findbyquery)
      .populate(
        'author',
        'personal_info.profile_img personal_info.username personal_info.fullname -_id',
      )
      .sort({ publishedAt: -1 })
      .select('blog_id title banner des content activity tags publishedAt -_id')
      .skip((page - 1) * limit)
      .limit(limit);

    console.log('Querying blogs with:', findbyquery);

    if (!findQuery) {
      return res.status(404).json({ message: 'No blog found with this tag', success: false });
    }

    res.status(200).json({
      message: 'Blogs retrieved successfully',
      success: true,
      blogs: findQuery,
    });
  } catch (error) {
    console.error('Error getting post by tag advance:', error);
    res.status(500).json({
      message: error.message || 'Server error while getting post by tag',
      success: false,
    });
  }
};

export const getPostBytag = async (req, res) => {
  const { tag, page } = req.body;

  try {
    const query = { tags: tag, draft: false };
    const limit = 5;

    const posts = await blogModel
      .find(query)
      .populate(
        'author',
        'personal_info.profile_img personal_info.username personal_info.fullname -_id',
      )
      .sort({ publishedAt: -1 })
      .select('blog_id title banner des content activity tags publishedAt -_id')
      .skip((page - 1) * limit)
      .limit(limit);

    if (!posts.length) {
      return res.status(404).json({ message: 'No blog found with this tag', success: false });
    }

    return res.status(200).json({
      message: 'Blogs retrieved successfully',
      success: true,
      blogs: posts,
    });
  } catch (error) {
    console.error('Error fetching blogs by tag:', error);
    return res.status(500).json({
      message: error.message || 'Something went wrong while retrieving the blog',
      success: false,
    });
  }
};

export const usersearch = async (req, res) => {
  let { query } = req.body;

  try {
    const finduser = await userModel
      .find({ 'personal_info.username': new RegExp(query, 'i') })
      .limit(20)
      .select('personal_info.profile_img personal_info.username personal_info.fullname -_id');

    if (!finduser.length) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    return res.status(200).json({
      message: 'Users retrieved successfully',
      success: true,
      users: finduser,
    });
  } catch (error) {
    console.error('Error fetching users by search:', error);
    return res.status(500).json({
      message: error.message || 'Something went wrong while retrieving the user',
      success: false,
    });
  }
};

// user click and see controller

export const getprofile = async (req, res) => {
  const { username } = req.body;

  try {
    const finduser = await userModel
      .findOne({
        'personal_info.username': username,
      })
      .select('-personal_info.password  -updateAt -blogs');

    if (!finduser) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    return res.status(200).json({
      message: 'User retrieved successfully',
      success: true,
      user: finduser,
    });
  } catch (error) {
    console.error('Error fetching user by username:', error);
    return res.status(500).json({
      message: error.message || 'Something went wrong while retrieving the user',
      success: false,
    });
  }
};

export const getblogbyid = async (req, res) => {
  const { blog_id, draft, mode } = req.body;

  if (!blog_id) {
    return res.status(404).json({ message: 'blog id is required', success: false });
  }

  try {
    let incrementval = mode !== 'edit' ? 1 : 0;

    const findblog = await blogModel
      .findOneAndUpdate({ blog_id }, { $inc: { 'activity.total_reads': incrementval } })
      .populate('author', 'personal_info.username personal_info.fullname personal_info.profile_img')
      .select('title des content activity tags publishedAt blog_id banner comments');

    console.log(findblog.author.personal_info.username);
    if (!findblog) {
      return res.status(404).json({ message: 'blog not found by that id', success: false });
    }
    if (findblog) {
      const userReadUpdate = userModel.findOneAndUpdate(
        {
          'personal_info.username': findblog.author.personal_info.username,
        },
        { $inc: { 'account_info.total_reads': incrementval } },
      );

      if (!userReadUpdate) {
        return res.status(404).json({ message: 'User not found', success: false });
      }
    }

    if (findblog.draft && !draft) {
      return res.status(500).json({ message: 'you can not access draf blog', success: false });
    }

    return res.status(200).json({
      message: 'Blogs retrieved successfully',
      success: true,
      incrementval: incrementval,
      blogs: findblog,
    });
  } catch (err) {
    console.error('Error fetching blogs by blog id', err);
    return res.status(500).json({
      message: err || 'Error fetching blogs by blog id',
      success: false,
    });
  }
};

export const likeblog = async (req, res) => {
  const user_id = req.user;
  const { _id, islikedByuser } = req.body;

  if (!user_id) {
    return res.status(401).json({ message: 'User not authenticated', success: false });
  }

  const incrementVal = !islikedByuser ? 1 : -1;

  try {
    const blog = await blogModel.findOneAndUpdate(
      { _id },
      { $inc: { 'activity.total_likes': incrementVal } },
      // { new: true },
    );

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found by that id', success: false });
    }

    if (!islikedByuser) {
      const likeNotification = new notificationModel({
        type: 'like',
        blog: _id,
        notification_for: blog.author,
        user: user_id,
      });

      await likeNotification.save();
    } else {
      await notificationModel.deleteOne({
        type: 'like',
        blog: _id,
        user: user_id,
      });
    }

    return res.status(200).json({
      message: `Blog ${!islikedByuser ? 'liked' : 'unliked'} successfully`,
      success: true,
      blog,
    });
  } catch (error) {
    console.error('Error liking blog:', error);
    return res.status(500).json({
      message: error.message || 'Something went wrong while liking the blog',
      success: false,
    });
  }
};

export const isliked = async (req, res) => {
  const user_id = req.user;

  let { _id } = req.body;

  if (!user_id) {
    return res.status(401).json({ message: 'User not authenticated', success: false });
  }

  try {
    const islikedByUser = await notificationModel.exists({
      user: user_id,
      blog: _id,
      type: 'like',
    });

    return res.status(200).json({
      message: 'Blogs retrieved successfully',
      success: true,
      islikedByUser: islikedByUser ? true : false,
    });
  } catch (error) {
    console.error('Error checking like status:', error);
    return res.status(500).json({
      message: error.message || 'Something went wrong while liking the blog',
      success: false,
    });
  }
};

export const userWrittenblogs = async (req, res) => {
  const user_id = req.user;

  let { page, draft, query, deletedDocCount } = req.body;

  try {
    let maxlimit = 5;

    let skipDoc = (page - 1) * maxlimit;

    if (deletedDocCount) {
      skipDoc = skipDoc - deletedDocCount;
    }

    const finduserWrittenblogs = await blogModel
      .find({
        author: user_id,
        draft,
        title: new RegExp(query, 'i'),
      })
      .skip(skipDoc)
      .limit(maxlimit)
      .sort({ publishedAt: -1 })
      .select(' title banner publishedAt blog_id activity des draft -_id');

    if (!finduserWrittenblogs) {
      res.status(400).json({
        success: false,
        message: 'not found any blogs by this user',
      });
    }
    res.status(200).json({
      success: true,
      message: 'blogs found successfull',
      blogs: finduserWrittenblogs,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'no blog or error in the server',
    });
  }
};

export const userwrittenblogcount = async (req, res) => {
  let user_id = req.user;

  let { draft, query } = req.body;

  try {
    const finduserwrittercount = await blogModel.countDocuments({
      author: user_id,
      draft,
      title: new RegExp(query, 'i'),
    });

    if (!finduserwrittercount) {
      res.status(400).json({
        success: false,
        message: 'not found any blogs by this user',
      });
    }
    res.status(200).json({
      success: true,
      message: 'blogs found successfull',
      totalDocs: finduserwrittercount,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'no blog or error in the server',
    });
  }
};

export const deleteblog = async (req, res) => {
  const user_id = req.user;
  const { blog_id } = req.body;

  try {
    const deleteblog = await blogModel.findOneAndDelete({ blog_id });

    if (!deleteblog) {
      return res.status(404).json({ message: 'blog not found by that id', success: false });
    }

    await notificationModel.deleteMany({ blog: deleteblog._id });

    await commentModel.deleteMany({ blog_id: deleteblog._id });

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: user_id },
      {
        $pull: { blog: deleteblog._id },
        $inc: { 'account_info.total_posts': -1 },
      },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    return res.status(200).json({
      message: 'blog deleted successfully',
      success: true,
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return res.status(500).json({
      message: error.message || 'Something went wrong while deleting the blog',
      success: false,
    });
  }
};
