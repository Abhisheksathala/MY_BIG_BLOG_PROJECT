import React from 'react';
import { CiHeart } from 'react-icons/ci';
import getDay from './date';
import { Link } from 'react-router-dom';

const Blogcardcomp = ({ content, author }) => {
  const {
    publishedAt,
    tags,
    title,
    des,
    banner,
    activity: { total_likes },
    blog_id: id,
  } = content;
  const { fullname, username, profile_img } = author;
  return (
    <>
      <Link
        to={`/blogs/${id}`}
        className="flex gap-8 items-center border-b border-gray-200 pb-5 mb-4"
      >
        <div className="w-full">
          <div className="flex gap-2 items-center mb-7">
            <img
              src={profile_img}
              alt="profile"
              className="w-6 h-6 aspect-square rounded-full object-cover"
            />

            <p className="font-semibold text-sm text-gray-700 line-clamp-1">
              {fullname} @{username}
            </p>
            <p className="min-w-fit">{getDay(publishedAt)}</p>
          </div>
          <h1 className="text-4xl  sm:text-3xl lg:text-3xl font-bold text-black leading-none">
            {title}
          </h1>
          <p className="my-3 text-xl text-black leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
            {des.length > 100 ? des.slice(0, 150) + '...' : des}
          </p>
          <div className="mt-4 flex gap-4">
            <span className="bg-gray-200 py-1 px-4 text-sm text-black rounded-full capitalize">
              {tags[0]}
            </span>
            <span className="ml-3 flex items-center gap-2 text-black">
              <CiHeart className="text-xl" />

              {total_likes}
            </span>
          </div>
        </div>
        <div className="h-28 aspect-square bg-gray-200">
          <img src={banner} alt="" />
        </div>
      </Link>
    </>
  );
};

export default Blogcardcomp;
