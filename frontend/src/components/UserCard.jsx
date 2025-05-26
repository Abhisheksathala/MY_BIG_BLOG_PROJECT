import React from 'react';
import {Link} from 'react-router-dom';

const UserCard = ({ user }) => {
  const {
    personal_info: { fullname, username, profile_img },
  } = user;
  return (
    <Link to={`/user/${username}`} className="flex gap-5 items-center mb-5">
      <img src={profile_img} alt="pic" className="w-12 h-12 rounded-full" />
      <div className="font-medium text-xl line-clamp-2">{fullname}</div>
      <p className="text-gray-400">@{username}</p>
    </Link>
  );
};

export default UserCard;
