import React, { useContext, useState } from 'react';
import { Blogcontext } from '../context/Blogcontext';
import { UserContext } from '../context/Usercontext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseUrl } from '../App';

const CommentField = ({ action, index = undefined, replyingTo = undefined, setReplying }) => {
  const {
    commentstate,
    setCommentstate,
    blogstate,
    setBlogstate,
    totalparentcommentsLoaded,
    setTotalparentcommentsLoaded,
  } = useContext(Blogcontext);

  const {
    _id,
    author: { _id: blog_author },
    comments,
    comments: { results: commentsArr },
    activity,
  } = blogstate.blogs;

  console.log('blog_author', blog_author);

  let {
    userAuth: { access_token },
    userAuth: {
      user: {
        personal_info: { username, fullname, profile_img },
      },
    },
    userAuth,
  } = useContext(UserContext);

  console.log('fullname', blogstate.blogs);
  // console.log(' blogstate?.blogs?.comment', commentsArr);

  const onchangehandeler = (e) => {
    setCommentstate(e.target.value);
  };

  const handlecomment = async () => {
    if (!access_token) {
      return toast.error('Please login to comment');
    }
    if (!commentstate.length) {
      return toast.error('Comment cannot be empty 😅');
    }

    try {
      const respons = await axios.post(
        `${baseUrl}/api/v1/comment/add-comments`,
        {
          _id,
          blog_author,
          comment: commentstate.trim(),
          replying_to: replyingTo,
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
        setCommentstate('');
        data.commented_by = {
          personal_info: {
            username,
            fullname,
            profile_img,
          },
        };
        data.children = [];

        let newcommentarr;
        // replaying function
        if (replyingTo) {
          commentsArr[index].children.push(data._id);
          data.childrenLevel = commentsArr[index].childrenLevel + 1;
          data.parentIndex = index;
          commentsArr[index].isReplyLoaded = true;
          commentsArr.splice(index + 1, 0, data);
          newcommentarr = [...commentsArr];
          setReplying(false);
        } else {
          data.childrenLevel = 0;
          newcommentarr = [data, ...commentsArr];
        }

        let parentcommentIncrementval = replyingTo ? 0 : 1;

        setBlogstate((prevState) => ({
          blogs: {
            ...prevState.blogs,
            comments: {
              ...prevState.blogs.comments,
              results: newcommentarr,
            },
            activity: {
              ...prevState.blogs.activity,
              total_comments: prevState.blogs.activity.total_comments + 1,
              total_parent_comments: prevState.blogs.activity.total_parent_comments + 1,
            },
          },
        }));

        setTotalparentcommentsLoaded((preVal) => preVal + parentcommentIncrementval);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <textarea
        value={commentstate}
        onChange={onchangehandeler}
        placeholder="Write your comment..."
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
        {action}
      </button>
    </div>
  );
};

export default CommentField;
