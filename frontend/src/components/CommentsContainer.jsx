import React, { useContext } from 'react';
import { Blogcontext } from '../context/Blogcontext';
import { ImCross } from 'react-icons/im';
import CommentField from './CommentField';
import axios from 'axios';
import { baseUrl } from '../App';
import Nodatamessage from './Nodatamessage';
import AnimationWarper from '../commone/AnimationWarper';
import CommentCard from './CommentCard';

export const fetchcomment = async ({
  skip = 0,
  blog_id,
  setParentCommentCountFun,
  comment_array = null,
}) => {
  try {
    let res;
    const response = await axios.post(`${baseUrl}/api/v1/comment/get-blog-comments`, {
      blog_id,
      skip,
    });

    const data = response.data;
    const commentList = data.comments;

    const updatedComments = commentList.map((comment) => ({
      ...comment,
      childrenLevel: 0,
    }));

    setParentCommentCountFun((preVal) => preVal + updatedComments.length);

    res = comment_array
      ? { results: [...comment_array, ...updatedComments] }
      : { results: updatedComments };

    return res;
  } catch (error) {
    console.error('Error in fetchcomment:', error);
  }
};

const CommentsContainer = () => {
  const {
    commentwraper,
    blogstate,
    setBlogstate,
    setCommentwraper,
    totalparentcommentsLoaded,
    setTotalparentcommentsLoaded,
  } = useContext(Blogcontext);

  const { title } = blogstate.blogs;
  const {
    comments: { results: commentsArr },
    activity: { total_parent_comments },
  } = blogstate.blogs;

  const loadmoreFun = async () => {
    let newcommmentsArr = await fetchcomment({
      skip: totalparentcommentsLoaded,
      blog_id: blogstate.blogs._id,
      setParentCommentCountFun: setTotalparentcommentsLoaded,
      comment_array: commentsArr,
    });

    setBlogstate({ ...blogstate, blogs: { ...blogstate.blogs, comments: newcommmentsArr } });
  };

  return (
    <AnimationWarper>
      <div
        className={`fixed z-50 h-full bg-white shadow-2xl p-6 sm:p-8 
      overflow-y-auto overflow-x-hidden transition-all duration-500 ease-in-out 
      max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:top-auto max-sm:h-[80%] 
      sm:top-0 sm:right-0 sm:w-[50%]
      transform 
      ${
        commentwraper
          ? 'sm:translate-x-0 max-sm:translate-y-0'
          : 'sm:translate-x-full max-sm:translate-y-full'
      }
    `}
      >
        <div className="relative">
          <h1 className="text-2xl font-bold">Comments</h1>
          <div className="text-base mt-1 mb-4 w-[80%] text-gray-600 line-clamp-2">{title}</div>

          <button
            onClick={() => setCommentwraper((prev) => !prev)}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 
            text-gray-600 hover:bg-gray-200 hover:text-black 
            shadow-sm transition-all duration-300 ease-in-out 
            focus:outline-none focus:ring-2 focus:ring-gray-300 hover:rotate-90"
            aria-label="Close Comments Panel"
          >
            <ImCross className="w-4 h-4" />
          </button>
        </div>

        {/* separator */}
        <hr className="my-6 h-px border-0 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200" />

        {/* Comment input field */}
        <CommentField action="comment" />

        {/* Comments list */}
        <div className="mt-8 space-y-6">
          {commentsArr && commentsArr.length > 0 ? (
            commentsArr.map((comment, i) => (
              <AnimationWarper key={i}>
                <CommentCard commentData={comment} index={i} leftVal={comment.childrenLevel * 4} />
              </AnimationWarper>
            ))
          ) : (
            <Nodatamessage message="No comments found" />
          )}
        </div>

        {/* Load more button */}
        {total_parent_comments > totalparentcommentsLoaded && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={loadmoreFun}
              className="text-gray-600 hover:text-amber-600 border border-gray-300 px-5 py-2 rounded-full hover:bg-amber-50 transition-all duration-200"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </AnimationWarper>
  );
};

export default CommentsContainer;
