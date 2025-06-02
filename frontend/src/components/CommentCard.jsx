import React, { useState, useContext } from 'react';
import getDay from './date';
import toast from 'react-hot-toast';
import CommentField from './CommentField';
import { LuMessageCircleMore } from 'react-icons/lu';
import { Blogcontext } from '../context/Blogcontext';
import axios from 'axios';
import { baseUrl } from '../App';
import AnimationWarper from '../commone/AnimationWarper';
import { UserContext } from '../context/Usercontext';
import { MdDeleteOutline } from 'react-icons/md';

const CommentCard = ({ index, leftVal, commentData }) => {
  const {
    commented_by: {
      personal_info: { fullname, username: comented_by_username, profile_img },
    },
    comment,
    _id,
  } = commentData;

  const children = commentData.children;

  const {
    blogstate: {
      blogs: {
        comments: { results: commentArr },
        activity,
        activity: { total_parent_comments },
      },
    },
    setBlogstate,
    blogstate,

    setTotalparentcommentsLoaded,
  } = useContext(Blogcontext);

  // const { total_parent_comments } = activity;

  // console.log('activity', activity);

  const {
    userAuth: { access_token },
    userAuth,
  } = useContext(UserContext);

  const username = userAuth?.user?.personal_info?.username;

  console.log('username', userAuth);

  const [isReplay, setIsReplay] = useState(false);

  // condsol log comments
  // console.log('commentArr', blogstate.blogs.comments);

  const getParentIndex = () => {
    let startingpoint = index - 1;
    try {
      while (commentArr[startingpoint].childrenLevel >= commentData.childrenLevel) {
        startingpoint--;
      }
    } catch (error) {
      startingpoint = undefined;
    }
    return startingpoint;
  };

  const removeCommentsCards = (startingPoint, isDelete = false) => {
    if (commentArr[startingPoint]) {
      while (commentArr[startingPoint].childrenLevel > commentData.childrenLevel) {
        commentArr.splice(startingPoint, 1);
        if (!commentArr[startingPoint]) break;
      }
    }
    if (isDelete) {
      let parentIndex = getParentIndex();
      if (parentIndex !== undefined) {
        commentArr[parentIndex].children = commentArr[parentIndex].children.filter(
          (child) => child !== _id,
        );

        if (!commentArr[parentIndex].children.length) {
          commentArr[parentIndex].isReplyLoaded = false;
        }
      }
      commentArr.splice(index, 1);
    }
    if (commentData.childrenLevel === 0 && isDelete) {
      setTotalparentcommentsLoaded((prev) => prev - 1);
    }
    setBlogstate({
      ...blogstate,
      comments: { resulte: commentArr },
      activity: {
        ...activity,
        total_parent_comments:
          total_parent_comments - (commentData.childrenLevel == 0 && isDelete ? 1 : 0),
      },
    });
  };

  const hidereplies = () => {
    commentData.isReplyLoaded = false;
    removeCommentsCards(index + 1);
  };

  const loadreplies = async ({ skip = 0 }) => {
    if (commentData.children.length) {
      hidereplies();
      try {
        const response = await axios.post(`${baseUrl}/api/v1/comment/get-replies`, {
          _id,
          skip,
        });
        const data = response.data;

        console.log('response.data', data);

        if (data.success) {
          commentData.isReplyLoaded = true;
          for (let i = 0; i < data.replies.length; i++) {
            data.replies[i].childrenLevel = commentData.childrenLevel + 1;

            commentArr.splice(index + 1 + i + skip, 0, data.replies[i]);

            setBlogstate((prevstate) => ({
              blogs: {
                ...prevstate.blogs,
                comments: { ...prevstate.blogs.comments, results: commentArr },
              },
            }));
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  let accessToken = access_token;

  const handlereplay = async () => {
    if (!accessToken) {
      return toast.error('Please login to replay');
    }
    setIsReplay((prev) => !prev);
  };

  // del;

  const handleDeletecomment = async (e) => {
    e.preventDefault();
    e.target.setAttribute('disabled', true); // ✅ fixed here

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/comment/delete-comment`,
        { _id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data = response.data;

      if (data.success) {
        e.target.removeAttribute('disabled');
        removeCommentsCards(index + 1, true);
        toast.success(data.message);
      }

      e.target.removeAttribute('disabled');
    } catch (error) {
      console.log(error);
      e.target.removeAttribute('disabled');
      toast.error('Failed to delete comment');
    }
  };

  return (
    <AnimationWarper>
      <div className="w-full mb-5" style={{ paddingLeft: `${leftVal * 12}px` }}>
        <div className="p-5 rounded-md border border-gray-200 bg-white hover:shadow-md transition-all duration-200">
          <div className="flex gap-3 items-center mb-4">
            <img src={profile_img} alt="profile" className="w-8 h-8 rounded-full object-cover" />
            <div className="flex flex-col">
              <p className="font-semibold text-sm text-gray-800">
                {fullname} <span className="text-gray-500">@{comented_by_username}</span>
              </p>
              <p className="text-xs text-gray-400">{getDay(commentData?.commentedAt)}</p>
            </div>
          </div>
          <p className="text-base text-gray-700 ml-2 leading-relaxed">{comment}</p>
          <div className="flex gap-5 item-center mt-5">
            {commentData.isReplyLoaded ? (
              <button
                className="text-gray-400 p-2 px-3 hover:bg-gray-300/30 rounded-md hover:text-black flex items-center gap-2 cursor-pointer"
                onClick={hidereplies}
              >
                <LuMessageCircleMore /> Hide replay
              </button>
            ) : (
              <button
                className="text-gray-400 p-2 px-3 hover:bg-gray-300/30 rounded-md hover:text-black flex items-center gap-2 cursor-pointer"
                onClick={loadreplies}
              >
                <LuMessageCircleMore /> {commentData.children.length} replays
              </button>
            )}

            <button
              className="underline  
          text-gray-400 p-2 px-3 hover:bg-gray-300/30 rounded-md hover:text-black flex items-center gap-2 cursor-pointer
          "
              onClick={handlereplay}
            >
              Replay
            </button>
            {username === comented_by_username && (
              <button
                className="p-1 rounded transition duration-300 hover:scale-110 hover:bg-white/10 text-black hover:text-red-500"
                title="Delete comment"
                onClick={handleDeletecomment}
              >
                <MdDeleteOutline size={18} />
              </button>
            )}
          </div>
          {isReplay ? (
            <div className="mt-8">
              <CommentField
                action="reply"
                index={index}
                replyingTo={_id}
                setReplying={setIsReplay}
              />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </AnimationWarper>
  );
};

export default CommentCard;
