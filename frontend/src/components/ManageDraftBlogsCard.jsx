import React from 'react';
import { deleteBlog } from './ManageBlogs';
import { UserContext } from '../context/Usercontext';
import { Link } from 'react-router-dom';
const ManageDraftBlogsCard = ({ blog }) => {
  const { title, des, blog_id, index } = blog;

  const {
    userAuth: { access_token },
  } = React.useContext(UserContext);

  return (
    <div className="flex  border-gray-300 lg:gap-10 pb-6 border-b mb-6 gap-5 ">
      <h1 className="text-4xl sm:text-3xl lg:text-5xl font-bold text-grey leading-none text-center pl-4 md:pl-6 flex-none">
        {index < 10 ? '0' + (index + 1) : index}
      </h1>
      <div className="w-full">
        <h1 className="text-2xl font-medium leading-7 line-clamp-3 sm:line-clamp-2">{title}</h1>
        <p className="line-clamp-1 font-normal">{des.length ? des : 'no description'}</p>
        <div className="flex gap-6 mt-3">
          <Link to={`/editor/${blog_id}`} className="pr-4 py-2 underline">
            edit
          </Link>
          <button
            onClick={(e) => deleteBlog(blog, access_token, e.target)}
            className="pr-4 py-2 underline text-red-500"
          >
            delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageDraftBlogsCard;
