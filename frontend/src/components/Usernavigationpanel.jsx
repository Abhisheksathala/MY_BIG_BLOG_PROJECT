import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimationWarper from '../commone/AnimationWarper';
import { RiFileEditLine } from 'react-icons/ri';
import { UserContext } from '../context/Usercontext';
import { CgProfile } from 'react-icons/cg';
import { MdDashboard } from 'react-icons/md';
import { IoIosSettings } from 'react-icons/io';

const Usernavigationpanel = () => {
  const { userAuth, setUserAuth } = useContext(UserContext);
  const navigate = useNavigate();

  const logoutHanddler = () => {
    setUserAuth({ access_token: null });
    console.log('logout');
    navigate('/signin');
  };

  const linkClasses =
    'flex items-center gap-2  pl-8 py-4 text-gray-600 hover:text-black hover:bg-gray-100 px-4 block';

  return (
    <div>
      <AnimationWarper className="absolute right-0 z-50" transition={{ duration: 0.2 }}>
        <div className="bg-white absolute right-0 border border-gray-300 w-60 overflow-hidden duration-200">
          <Link to="/editor" className={`${linkClasses} ml-3`}>
            <RiFileEditLine />
            <p>Write</p>
          </Link>
          <Link
            to={`/user/${userAuth?.user?.personal_info?.username || 'user1234'}`}
            className={`${linkClasses} ml-4`}
          >
            <CgProfile />
            Profile
          </Link>
          <Link to="/dashboard/blogs" className={`${linkClasses} ml-4`}>
            <MdDashboard />
            Dashboard
          </Link>
          <Link to="/settings/edit-profile" className={`${linkClasses} ml-4`}>
            <IoIosSettings />
            Settings
          </Link>
          <span className="absolute border border-gray-300 -ml-6 w-[200%]"></span>
          <button
            onClick={logoutHanddler}
            className="text-left cursor-pointer w-full p-4 hover:bg-gray-200 pl-8 py-4"
          >
            <h1 className="font-bold text-xl">Sign Out</h1>
            <p className="text-gray-400 text-[0.8rem]">
              @{userAuth?.user?.personal_info?.username}
            </p>
          </button>
        </div>
      </AnimationWarper>
    </div>
  );
};

export default Usernavigationpanel;
