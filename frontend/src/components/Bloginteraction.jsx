import { useContext, useEffect } from 'react';
import { Blogcontext } from '../context/Blogcontext.jsx';
import { CiHeart } from 'react-icons/ci';
import { FaRegComment, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/Usercontext.jsx';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseUrl } from '../App.jsx';

const Bloginteraction = () => {
  const { blogstate, isLikedByUser, setIsLikedByUser, setBlogstate, setCommentwraper } =
    useContext(Blogcontext);

  const {
    userAuth,
    userAuth: { access_token },
  } = useContext(UserContext);

  useEffect(async () => {
    if (access_token) {
      // make request to server to get like information
      try {
        const response = await axios.post(
          `${baseUrl}/api/v1/blog/isliked-by-user`,
          {
            _id,
          },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          },
        );
        // after the respons
        const data = response.data;
        if (data?.success) {
          console.log('isliked', data.islikedByUser);
          setIsLikedByUser(Boolean(data.islikedByUser));
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  const handelLike = async () => {
    if (access_token) {
      setIsLikedByUser((prev) => !prev);

      let updatedLikes = total_likes;

      if (!isLikedByUser) {
        updatedLikes += 1;
      } else {
        updatedLikes -= 1;
      }

      setBlogstate({
        ...blogstate,
        blogs: {
          ...blogstate.blogs,
          activity: {
            ...blogstate.blogs.activity,
            total_likes: updatedLikes,
          },
        },
      });
      //   like and dislike toast
      !isLikedByUser ? toast.success('Liked') : toast.success('Unliked');

      try {
        const response = await axios.post(
          `${baseUrl}/api/v1/blog/like-blog`,
          {
            _id,
            islikedByuser: isLikedByUser,
          },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          },
        );

        const data = response.data;
        if (data?.success) {
          console.log(data);
        }
      } catch (error) {
        console.log(error);
        toast.error('Error while updating like');
      }
    } else {
      toast.error('Please login to like this blog');
    }
  };
  //user name
  let username = userAuth?.user?.personal_info?.username || {};

  let {
    title,
    blog_id,
    activity,
    activity: { total_likes, total_comments },
    author: {
      personal_info: { username: author_username },
    },
    _id,
  } = blogstate.blogs;

  console.log(_id);

  return (
    <>
      <hr className={'border-gray-300 my-2'} />
      <div className="flex gap-6 items-center justify-between">
        <div className="flex gap-6 items-center mt-4">
          {/* Like Section */}
          <div className="flex gap-2 items-center">
            <button
              className={`p-2 rounded-full bg-gray-100 hover:bg-red-100 transition-all duration-200 shadow-sm ${
                isLikedByUser && 'bg-red-100'
              }`}
              onClick={handelLike}
            >
              <CiHeart
                className={`w-6 h-6 transition-colors duration-200 ${
                  isLikedByUser ? 'text-red-500' : 'text-gray-700'
                }`}
              />
            </button>
            <p className="text-lg text-gray-600">{total_likes}</p>
          </div>

          {/* Comment Section */}
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setCommentwraper((prev) => !prev)}
              className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition-all duration-200 shadow-sm"
            >
              <FaRegComment className="w-5 h-5 text-gray-700 hover:text-blue-500" />
            </button>
            <p className="text-lg text-gray-600">{total_comments}</p>
          </div>
        </div>

        <div className="flex gap-6 items-center">
          {username === author_username ? (
            <Link to={`/editor/${blog_id}`} className="text-black underline hover:underline">
              Edit Post
            </Link>
          ) : (
            <span className="text-gray-400 text-sm italic">Not your post</span>
          )}

          <Link to={`https://twitter.com/intent/tweet?text=Read${title}&url=${location.href}`}>
            <FaTwitter
              className={'text-xl hover:text-blue-400 transition-all  duration-300 ease-in-out'}
            />
          </Link>
        </div>
      </div>
      <hr className={'border-gray-300 my-2'} />
    </>
  );
};

export default Bloginteraction;
