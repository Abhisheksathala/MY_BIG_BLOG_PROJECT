import React, { useState, useContext, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/Usercontext';
import { IoDocumentOutline } from 'react-icons/io5';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { TfiWrite } from 'react-icons/tfi';
import { FaUserEdit } from 'react-icons/fa';
import { FaBarsStaggered } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';
const Sidebar = () => {
  const {
    userAuth: { access_token, new_notification_available },
  } = useContext(UserContext);

  const location = useLocation();
  let page = location.pathname.split('/')[2];

  const navigate = useNavigate();
  let [pagestate, setPagestate] = useState(page.replace('-', ' '));
  let [showSidenav, setShowSidenav] = useState(false);

  if (!access_token && access_token === null) {
    return navigate('/signin');
  }
  let activeTabLine = useRef();
  let sidebaricoan = useRef();
  let pagestateRef = useRef();
  const changepage = (e) => {
    let { offsetWidth, offsetLeft } = e.currentTarget;
    if (activeTabLine.current) {
      activeTabLine.current.style.width = offsetWidth + 'px';
      activeTabLine.current.style.left = offsetLeft + 'px';
    }

    if (e.currentTarget === sidebaricoan.current) {
      setShowSidenav(true);
    } else {
      setShowSidenav(false);
    }
  };

  useEffect(() => {
    setShowSidenav(false);
    pagestateRef.current.click();
  }, [pagestate]);

  return (
    <>
      <section className="relative flex gap-10 py-0 m-0 max-md:flex-col">
        <div className="sticky top-[80px] z-30">
          <div className="md:hidden  py-1 border-b border-gray-300 flex flex-nowrap overflow-x-auto gap-2 px-6 bg-white">
            <button
              ref={sidebaricoan}
              className="p-5 capitalize cursor-pointer bg-red-50"
              title="Menu"
              onClick={changepage}
            >
              <FaBarsStaggered />
            </button>
            <button
              ref={pagestateRef}
              onClick={changepage}
              className="p-5 capitalize cursor-pointer"
              title="Page State"
            >
              {pagestate}
            </button>

            <hr
              ref={activeTabLine}
              className="absolute bottom-0 left-0 h-[2px] w-[40px] duration-500"
            />
          </div>

          <div
            className={
              'min-w-[300px] h-[calc(100vh-80px-60px)] md:min-h-[calc(100vh-80px)] md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-gray-400 md:border-r md:border-dashed absolute max-md:top-[64px] bg-white max-md:w-screen  max-md:px-16 max-md:-ml-7 duration-500 ' +
              (!showSidenav
                ? 'max-md:opacity-0 max-md:pointer-events-none'
                : 'opacity-100 pointer-events-auto')
            }
          >
            <h1 className="text-xl text-gray-500 mb-3">Dashboard</h1>
            <hr className="border-t-2 border-dashed border-gray-400 my-4" />

            <NavLink
              to={'/dashboard/blogs'}
              onClick={(e) => setPagestate(e.target.innerText)}
              className={({ isActive }) =>
                `flex gap-4 items-center py-5 text-dark-grey hover:text-black active:text-black ${
                  isActive
                    ? 'text-black border-r-2 border-black pl-6 bg-gray-300 -ml-6 md:rounded-tl-lg md:rounded-bl-lg max-md:border-none'
                    : ''
                }`
              }
            >
              <IoDocumentOutline /> Blog
            </NavLink>

            <NavLink
              to={'/dashboard/notifications'}
              onClick={(e) => setPagestate(e.target.innerText)}
              className={({ isActive }) =>
                `flex gap-4 items-center py-5 text-dark-grey hover:text-black active:text-black ${
                  isActive
                    ? 'text-black border-r-2 border-black pl-6 bg-gray-300 -ml-6 md:rounded-tl-lg md:rounded-bl-lg max-md:border-none'
                    : ''
                }`
              }
            >
              <IoMdNotificationsOutline />
              {new_notification_available ? (
                <span className="bg-red-400  w-2 h-2 rounded-full absolute z-10 top-2 right-2"></span>
              ) : (
                ''
              )}
              Notifications
            </NavLink>

            <NavLink
              to={'/editor'}
              onClick={(e) => setPagestate(e.target.innerText)}
              className={({ isActive }) =>
                `flex gap-4 items-center py-5 text-dark-grey hover:text-black active:text-black ${
                  isActive
                    ? 'text-black border-r-2 border-black pl-6 bg-gray-300 -ml-6 md:rounded-tl-lg md:rounded-bl-lg max-md:border-none'
                    : ''
                }`
              }
            >
              <TfiWrite /> Write
            </NavLink>

            <h1 className="text-xl text-gray-500 mb-5 mt-20">Settings</h1>
            <hr className="border-t-2 border-dashed border-gray-400 my-4" />

            <NavLink
              to={'/settings/edit-profile'}
              onClick={(e) => setPagestate(e.target.innerText)}
              className={({ isActive }) =>
                `flex gap-4 items-center py-5 text-dark-grey hover:text-black active:text-black ${
                  isActive
                    ? 'text-black border-r-2 border-black pl-6 bg-gray-300 -ml-6 md:rounded-tl-lg md:rounded-bl-lg max-md:border-none'
                    : ''
                }`
              }
            >
              <IoMdNotificationsOutline /> Edit Profile
            </NavLink>

            <NavLink
              to={'/settings/change-password'}
              onClick={(e) => setPagestate(e.target.innerText)}
              className={({ isActive }) =>
                `flex gap-4 items-center py-5 text-dark-grey hover:text-black active:text-black ${
                  isActive
                    ? 'text-black border-r-2 border-black pl-6 bg-gray-300 -ml-6 md:rounded-tl-lg md:rounded-bl-lg max-md:border-none'
                    : ''
                }`
              }
            >
              <FaUserEdit /> Change Password
            </NavLink>
          </div>
        </div>
        <Outlet />
      </section>
    </>
  );
};

export default Sidebar;
