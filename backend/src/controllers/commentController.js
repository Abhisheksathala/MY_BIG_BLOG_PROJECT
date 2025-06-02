import CommentModel from '../models/comment.js';
import blogModel from '../models/blogmodel.js';
import notificationModel from '../models/notificationModel.js';

export const addcomment = async (req, res) => {
  const user_id = req.user;

  if (!user_id) return res.status(401).json({ message: 'User not authenticated', success: false });

  const { _id, comment, replying_to, blog_author, notification_id } = req.body;

  if (!_id) return res.status(400).json({ message: 'Blog ID is required', success: false });

  if (!comment?.trim())
    return res.status(400).json({ message: 'Comment cannot be empty', success: false });

  try {
    const commentObj = new CommentModel({
      blog_id: _id,
      blog_author,
      comment: comment.trim(),
      commented_by: user_id,
      // isReplay: replaying_to ? true : false,
      // parent: replaying_to ? replaying_to : null,
    });

    if (replying_to) {
      commentObj.isReply = true;
      commentObj.parent = replying_to;
    }

    const savedComment = await commentObj.save();

    // Update blog with comment reference
    await blogModel.findOneAndUpdate(
      { _id },
      {
        $push: { comments: savedComment._id },
        $inc: {
          'activity.total_comments': 1,
          'activity.total_parent_comments': replying_to ? 0 : 1,
        },
      },
    );

    // Create a notification for the blog author
    const notification = new notificationModel({
      type: replying_to ? 'reply' : 'comment',
      blog: _id,
      notification_for: blog_author,
      user: user_id,
      comment: savedComment._id,
    });

    if (replying_to) {
      notification.replied_on_comment = replying_to;
      const replyingToCommentDoc = await CommentModel.findOneAndUpdate(
        { _id: replying_to },
        { $push: { children: savedComment._id } },
      );
      notification.notification_for = replyingToCommentDoc.commented_by;

      if (notification_id) {
        await notificationModel.findOneAndUpdate(
          { _id: notification_id },
          { reply: savedComment._id },
        );
      }
    }

    await notification.save();

    return res.status(201).json({
      message: 'Comment added successfully',
      success: true,
      comment: savedComment.comment,
      commentedAt: savedComment.commentedAt,
      _id: savedComment._id,
      user_id,
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};

export const getblogcomments = async (req, res) => {
  let { blog_id, skip } = req.body;
  console.log('REQ BODY:', req.body);

  if (!blog_id) {
    return res.status(400).json({ success: false, message: 'Blog ID is required' });
  }

  let limit = 5;

  try {
    const findcomments = await CommentModel.find({
      blog_id,
      isReply: false,
    })
      .populate(
        'commented_by',
        'personal_info.username personal_info.fullname personal_info.profile_img',
      )
      .skip(skip)
      .limit(limit)
      .sort({
        commentedAt: -1,
      });

    if (!findcomments) {
      return res.status(404).json({ message: 'No comments found', success: false });
    }

    return res.status(200).json({
      message: 'Comments retrieved successfully',
      success: true,
      comments: findcomments,
    });
  } catch (error) {
    console.error('Error fetching blog comments:', error);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};

export const getreplies = async (req, res) => {
  const { _id, skip = 0 } = req.body;
  const maxlimit = 5;

  try {
    const comment = await CommentModel.findOne({ _id }).populate({
      path: 'children',
      options: {
        limit: maxlimit,
        skip: skip,
        sort: { commentedAt: -1 },
      },
      populate: {
        path: 'commented_by',
        select: 'personal_info.username personal_info.fullname personal_info.profile_img',
      },
      select: '-blog_id -updatedAt',
    });

    if (!comment) {
      return res.status(404).json({ message: 'No comment found', success: false });
    }

    return res.status(200).json({
      message: 'Replies retrieved successfully',
      success: true,
      replies: comment.children,
    });
  } catch (error) {
    console.error('Error fetching replies:', error);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};

export const deletecomment = async (req, res) => {
  const user_id = req.user;
  const { _id } = req.body;

  console.log('USER ID:', user_id);
  console.log('COMMENT ID:', _id);

  if (!_id) {
    return res.status(400).json({ message: 'Comment ID is required', success: false });
  }

  if (!user_id) {
    return res.status(401).json({ message: 'User not authenticated', success: false });
  }
  try {
    const comment = await CommentModel.findOne({ _id });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found', success: false });
    }

    if (user_id == comment.commented_by || user_id == comment.blog_author) {
      await CommentModel.findOneAndUpdate({ _id: comment.parent }, { $pull: { children: _id } });
      return res.status(200).json({ message: 'Comment deleted successfully', success: true });
    }

    await notificationModel.findByIdAndDelete({ comment: _id });
    await notificationModel.findByIdAndUpdate({ reply: _id }, { $unset: { reply: 1 } });
    await blogModel
      .findOneAndUpdate(
        { _id: comment.blogModel },
        {
          $pull: { comment: _id },
          $inc: { 'activity.total_comments': -1 },
          'activity.total_parent_comments': comment.parent ? 0 : -1,
        },
      )
      .then((blog) => {
        if (comment.children.length) {
          comment.childern.map((replies) => {
            deletecomment(replies);
          });
        }
      })
      .catch((error) => {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
      });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};
