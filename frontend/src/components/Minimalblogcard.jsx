import React from 'react';
import { Link } from 'react-router-dom';
import getDay from './date';

const Minimalblogcard = ({ blog, index }) => {
  const {
    title,
    blog_id: id,
    publishedAt,
    author: {
      personal_info: { fullname, username, profile_img },
    },
  } = blog;

  return (
    <Link
      to={`/blogs/${id}`}
      className="flex items-center gap-5 mb-8 p-3  border-b border-gray-200 rounded hover:bg-gray-50 transition-all"
    >
      <h1 className="text-4xl sm:text-3xl lg:text-5xl font-bold text-gray-300 leading-none ">
        {index < 10 ? '0' + (index + 1) : index}
      </h1>
      <div>
        <div className="flex gap-2 items-center mb-7">
          <img src={profile_img} className="w-6 h-6 rounded-full" alt="" />
          <p className="line-clamp-1">
            {fullname} @{username}
          </p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
        </div>
        <h1 className="text-4xl sm:text-3xl lg:text-3xl font-bold text-grey leading-none">
          {title}
        </h1>
      </div>
    </Link>
  );
};

export default Minimalblogcard;
