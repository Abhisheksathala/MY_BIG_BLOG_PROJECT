import React from 'react';
import { Link } from 'react-router-dom';
import getDay from './date';
import NotificationCommentField from '../components/NotificationCommentField';
import { UserContext } from '../context/Usercontext';
import axios from 'axios';
import { baseUrl } from '../App';

const NotificationCard = ({ data, index, notificationState }) => {
  const {
    type,
    comment,
    reply,
    createdAt,
    replied_on_comments,
    user,
    user: {
      personal_info: { profile_img, fullname, username },
    },
    blog: { _id, blog_id, title },
    _id: notification_id,
  } = data;

  const {
    userAuth: {
      access_token,
      user: {
        personal_info: {
          username: author_username,
          profile_img: author_profile_img,
          fullname: author_fullname,
        },
      },
    },
  } = React.useContext(UserContext);

  let {
    notifications: { resulte, totalDocs },
    setNotifications,
    notifications,
  } = notificationState;

  console.log('datacommentsssssss', data);

  const [isReplying, setIsReplying] = React.useState(false);

  const handleReplyClick = async (e) => {
    setIsReplying((prev) => !prev);
  };

  const handleDelete = async (comment_id, type, target) => {
    try {
      target.setAttribute('disabled', true);

      const response = await axios.post(
        `${baseUrl}/api/v1/comment/delete-comment`,
        {
          _id: comment_id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      const data = response.data;
      if (data.success) {
        if (type === 'comment') {
          notificationState.resulte.splice(index, 1);
        } else {
          delete resulte[index].replya[comment_id];
        }
      }
      target.removeAttribute('disabled');
      setNotifications({
        ...notifications,
        resulte,
        totalDocs: totalDocs - 1,
        deletedDocCount: notifications.deletedDocCount + 1,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-5 border-b border-gray-200">
      <div className="flex gap-3">
        <img
          src={profile_img}
          alt="profile_pic"
          className="w-12 h-12 rounded-full object-cover border border-gray-300"
        />
        <div className="flex flex-col">
          <h1 className="text-gray-800 font-medium text-base">
            <span className="capitalize hidden lg:inline">{fullname}</span>{' '}
            <Link to={`/user/${username}`} className="text-blue-300 hover:underline ml-1">
              @{username}
            </Link>{' '}
            <span className="text-gray-600 font-normal">
              {type === 'like'
                ? 'liked your blog'
                : type === 'comment'
                ? 'commented on your blog'
                : 'replied on'}
            </span>
          </h1>

          {type == 'reply' ? (
            <div className="p-4 mt-4 rounded-md bg-gray-400 ">
              <p>{replied_on_comments?.comment}</p>
            </div>
          ) : (
            <Link
              to={`/blogs/${blog_id}`}
              className="font-medium text-gray-400 hover:underline line-clamp-1"
            >{` "${title}" `}</Link>
          )}
        </div>
      </div>

      {type !== 'like' ? (
        <p className="ml-14 pl-5 font-gelasio text-xl my-5">{comment ? comment.comment : ''}</p>
      ) : (
        ''
      )}

      <div className="ml-14 pl-5 mt-3 text-gray-500 flex gap-8">
        <p>{getDay(createdAt)}</p>

        {type !== 'like' ? (
          <>
            {!reply ? (
              <button
                onClick={handleReplyClick}
                className="underline hover:text-black cursor-pointer"
              >
                reply
              </button>
            ) : (
              ''
            )}

            <button
              onClick={(e) => {
                handleDelete(comment._id, 'comment', e.target);
              }}
              className="underline hover:text-black cursor-pointer"
            >
              delete
            </button>
          </>
        ) : (
          ''
        )}
      </div>

      {isReplying ? (
        <div className="mt-8">
          <NotificationCommentField
            _id={_id}
            blog_author={user}
            index={index}
            replyingTo={comment._id}
            setIsReplying={setIsReplying}
            notification_id={notification_id}
            notificationData={notificationState}
          />
        </div>
      ) : (
        ''
      )}

      {reply && (
        <div className="ml-20 p-5 bg-[#0d0d0d] mt-5 rounded-lg border border-[#2a2a2a] text-gray-200">
          <div className="flex gap-4 items-start mb-3">
            <img
              src={author_profile_img}
              className="w-12 h-12 rounded-full object-cover border border-gray-400"
              alt="profile"
            />
            <div>
              <h1 className="font-medium text-sm sm:text-base">
                <Link to={`/user/${author_username}`} className="text-blue-400 hover:underline">
                  @{author_fullname}
                </Link>{' '}
                <span className="font-normal text-gray-400">replied to</span>{' '}
                <Link to={`/user/${username}`} className="text-blue-400 hover:underline">
                  @{username}
                </Link>
              </h1>
            </div>
          </div>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{reply.comment}</p>
          <button
            onClick={(e) => {
              handleDelete(comment._id, 'replay', e.target);
            }}
            className="underline hover:text-black cursor-pointer ml-14 mt-2"
          >
            delete
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationCard;
