import React from 'react';
import { UserContext } from '../context/Usercontext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseUrl } from '../App';

const NotificationCommentField = ({
  _id,
  blog_author,
  index = undefined,
  replyingTo = undefined,
  setIsReplying,
  notification_id,
  notificationData,
}) => {
  let [comment, setComment] = React.useState('');

  let { _id: user_id } = blog_author;
  let {
    userAuth: { access_token },
  } = React.useContext(UserContext);

  let {
    notifications,
    notifications: { resulte },
    setNotifications,
  } = notificationData;

  console.log('notificationData', notificationData);

  const handlecomment = async (e) => {
    if (!access_token) {
      return toast.error('Please login to comment');
    }
    if (!comment.length) {
      return toast.error('Comment cannot be empty 😅');
    }

    try {
      const respons = await axios.post(
        `${baseUrl}/api/v1/comment/add-comments`,
        {
          _id,
          blog_author: user_id,
          comment: comment.trim(),
          replying_to: replyingTo,
          notification_id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      const data = respons.data;

      if (data?.success) {
        console.log(data);
        setIsReplying ? setIsReplying(false) : '';
        resulte[index].reply = { comment, _id: data._id };
        setNotifications({ ...notifications, resulte });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="leave a reply..."
        className="w-full min-h-[140px] p-5 rounded-xl border border-gray-300
            bg-white text-gray-800 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-black/20
              focus:border-black/60
              resize-none shadow-md hover:shadow-lg
              transition-all duration-300 ease-in-out"
      />
      <button
        onClick={handlecomment}
        className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-black via-gray-900 to-gray-800 
            text-white font-semibold shadow-md hover:shadow-xl 
              transition-all duration-300 active:scale-95 ease-in-out"
      >
        reply
      </button>
    </div>
  );
};

export default NotificationCommentField;
