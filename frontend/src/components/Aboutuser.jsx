import React from 'react';
import { FaYoutube } from 'react-icons/fa6';
import { FaInstagramSquare } from 'react-icons/fa';
import { FaGithubAlt } from 'react-icons/fa';
import { CgWebsite } from 'react-icons/cg';
import { FaFacebookF } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';
import {Getfullday } from "./date"
const Aboutuser = ({ bio, social_links, joinedAt, className = '' }) => {
  const iconMap = {
    youtube: <FaYoutube />,
    instagram: <FaInstagramSquare />,
    github: <FaGithubAlt />,
    website: <CgWebsite />,
    facebook: <FaFacebookF />,
    twitter: <FaSquareXTwitter />,
  };
  const mm = ()=>{
    console.log(social_links)
  }

  return (
    <div className={`md:w-[90%] md:mt-7 ${className}`}>
      <p className="text-xl leading-7">
        {bio?.length ? bio : 'Nothing here to read'}
      </p>

      <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-gray-500">
        {Object.keys(social_links || {}).map((key, i) => {
          const link = social_links[key];
          const Icon = iconMap[key];
          return link ? (
            <a
              key={i}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black hover:underline flex gap-2 items-center no-underline "
            >
              {Icon}
              {key}
            </a>
          ) : null;
        })}
      </div>

      <p className='text-xl leading-7 text-gray-500'>Joined {Getfullday(joinedAt)}</p>
    </div>
  );
};

export default Aboutuser;
