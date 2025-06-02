import notificationModel from '../models/notificationModel.js';
import { ObjectId } from 'mongodb';
export const newnotification = async (req, res) => {
  let user_Id = req.user;
  try {
    const notifcationExist = await notificationModel.exists({
      notification_for: user_Id,
      seen: false,
      user: { $ne: user_Id },
    });

    if (!notifcationExist) {
      return res.status(200).json({ message: 'No new notification', success: false });
    }

    return res
      .status(200)
      .json({ message: 'New notification', success: true, new_notification_available: true });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error.message || 'somthing went wrong in notifcation new ',
    });
  }
};

export const postnotifications = async (req, res) => {
  try {
    const user_id = req.user;
    console.log('Converted user_id:', user_id);

    let { page = 1, filter = 'all', deletedDocCount = 0 } = req.body;
    let maxLimit = 10;

    let findQuery = {
      notification_for: user_id,
      user: { $ne: user_id },
    };

    if (filter !== 'all') {
      findQuery.type = filter;
    }

    let skipDoc = Math.max(0, (page - 1) * maxLimit - deletedDocCount);

    const findnotification = await notificationModel
      .find(findQuery)
      .skip(skipDoc)
      .limit(maxLimit)
      .populate('blog', 'title blog_id')
      .populate('user', 'personal_info.fullname personal_info.username personal_info.profile_img')
      .populate('comment', 'comment')
      .populate('reply', 'comment')
      .sort({ createdAt: -1 })
      .select('createdAt type seen reply');

    if (!findnotification.length) {
      return res.status(404).json({
        success: false,
        message: 'No notifications found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notifications fetched successfully',
      notifications: findnotification,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const allnotificationcount = async (req, res) => {
  let user_id = req.user;

  let { filter } = req.body;

  let findquery = { notification_for: user_id, user: { $ne: user_id } };

  if (filter !== 'all') {
    findquery.type = filter;
  }
  try {
    const findallnotification = await notificationModel.countDocuments(findquery);

    if (findallnotification.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'no count founded',
      });
    }

    res.status(200).json({
      success: true,
      message: 'fond the count notification',
      totalDocs: findallnotification,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

// reva solution
