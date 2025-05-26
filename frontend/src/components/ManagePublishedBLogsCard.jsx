import React from 'react';
import { Link } from 'react-router-dom';
import getDay from './date';
import Blogstats from './Blogstats';
import { deleteBlog } from './ManageBlogs';
import { UserContext } from '../context/Usercontext';

const ManagePublishedBLogsCard = ({ blog }) => {
  console.log('blog', blog);

  let { banner, blog_id, title, publishedAt, activity } = blog;

  const [showstat, setShowstat] = React.useState(false);

  const {
    userAuth: { access_token },
  } = React.useContext(UserContext);

  return (
    <>
      <div className="flex gap-10 border-b mb-6 max-md:px-4 border-gray-400 pb-6 items-center">
        <img
          src={banner}
          alt="img"
          className="max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-gray-300 object-cover"
        />
        <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
          <div>
            <Link
              to={`/blogs/${blog_id}`}
              className=" text-2xl font-medium leading-7 line-clamp-3 sm:line-clamp-2 mb-4 hover:text-black hover:underline"
            >
              {title ? title : 'no title'}
            </Link>
            <p className="line-clamp-1">Published At {getDay(publishedAt)}</p>
          </div>
          <div className="flex gap-6 mt-3">
            <Link to={`/editor/${blog_id}`} className="pr-4 py-2 underline">
              Edit
            </Link>

            <button
              className="pr-4 py-2 underline lg:hidden "
              onClick={() => setShowstat((prev) => !prev)}
            >
              stats
            </button>

            <button
              onClick={(e) => deleteBlog(blog, access_token, e.target)}
              className="pr-4 py-2 underline text-red-500"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="max-lg:hidden">
          <Blogstats stats={activity} />
        </div>
      </div>
      {showstat ? (
        <div className="lg:hidden">
          <Blogstats stats={activity} />
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default ManagePublishedBLogsCard;
