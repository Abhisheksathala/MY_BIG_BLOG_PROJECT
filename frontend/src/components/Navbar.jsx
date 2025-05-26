import React, { useContext, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaSearchengin } from 'react-icons/fa';
import { RiFileEditLine } from 'react-icons/ri';
import logo from '../assets/logo.png';
import { UserContext } from '../context/Usercontext';
import { FaRegBell } from 'react-icons/fa6';
import Usernavigationpanel from './Usernavigationpanel';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../App';
import axios from 'axios';

const Navbar = () => {
  const [searchboxVisibilities, setSearchboxVisibilities] = useState(false);
  const {
    userAuth,
    setUserAuth,
    userAuth: { new_notification_available },
  } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');

  const [showmore, setShowmore] = useState(false);

  const access_token = userAuth?.access_token;
  const profile_img = userAuth?.user?.personal_info?.profile_img;

  const navigate = useNavigate();

  const handleSearchQuery = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.keyCode == 187 && searchQuery.trim().length) {
      e.preventDefault();
      navigate(`/search/${searchQuery.trim()}`);
    }
  };

  // console.log('new_notification_available', new_notification_available);

  React.useEffect(() => {
    if (access_token) {
      const fetchNotifications = async () => {
        try {
          if (access_token) {
            const response = await axios.get(`${baseUrl}/api/v1/notification/new-notification`, {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            });

            const data = response.data;
            if (data.success) {
              setUserAuth((userAuth) => ({
                ...userAuth,
                ...data,
              }));
              console.log('data', data);
            }
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchNotifications();
    }
  }, [access_token]);

  return (
    <div>
      <nav className=" sticky top-0 flex items-center gap-12 w-full px-[5vw] py-5 h-[80px] border-b border-gray-300 bg-white justify-between z-50">
        <Link to={'/'}>
          <img src={logo} alt="Logo" className="flex-none w-10" />
        </Link>
        <p>{new_notification_available}</p>
        <div
          className={`absolute bg-white w-full left-0 top-full border-b border-gray-300 p-4 px-[5vw] transition-all duration-200 
            md:relative md:inset-0 md:border-0 md:p-0 md:w-auto
            ${
              searchboxVisibilities
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'
            }`}
        >
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search..."
              className="w-full md:w-auto bg-gray-200 p-4 pl-6 pr-12 md:pr-6 rounded-full placeholder:text-black"
              name="search"
              id="search"
              value={searchQuery}
              onChange={handleSearchQuery}
              onKeyDown={handleSearchSubmit}
            />

            <FaSearchengin className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-gray-500" />
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <button
            className="md:hidden bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center"
            onClick={() => setSearchboxVisibilities(!searchboxVisibilities)}
          >
            <FaSearchengin className="text-2xl text-gray-600" />
          </button>
          <Link
            to={'/editor'}
            className="hidden md:flex gap-3 text-gray-600 hover:text-black hover:bg-gray-300 p-3 px-4 opacity-75 items-center"
          >
            <RiFileEditLine />
            <p>Write</p>
          </Link>

          {access_token ? (
            <>
              <Link to={`/dashboard/notifications`}>
                <button
                  className={`w-12 h-12 rounded-full bg-gray-300 relative hover:bg-black/10 cursor-pointer flex items-center justify-center`}
                >
                  <FaRegBell className={``} />
                  {new_notification_available ? (
                    <span className="bg-red-400  w-3 h-3 rounded-full absolute z-10 top-2 right-2"></span>
                  ) : (
                    ''
                  )}
                </button>
              </Link>
              <div className={`relative `}>
                <button
                  className={`w-12 h-12 rounded-full bg-gray-300 relative hover:bg-black/10 cursor-pointer flex items-center justify-center`}
                >
                  <img
                    onClick={() => setShowmore(!showmore)}
                    src={profile_img || '/default-avatar.png'}
                    alt="profile"
                    className="w-10 h-10 object-cover rounded-full"
                  />
                </button>
                {showmore ? <Usernavigationpanel /> : ''}
              </div>
            </>
          ) : (
            <>
              <Link to={'/signin'}>
                <div className="text-white bg-black rounded-full px-4 py-3 text-center">
                  Sign In
                </div>
              </Link>
              <Link to={'/signup'}>
                <p className="text-white p-3 px-4 bg-black rounded-full">Sign Up</p>
              </Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default Navbar;
