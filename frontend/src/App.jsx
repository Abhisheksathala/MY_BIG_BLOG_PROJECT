import React, { useContext, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import { Route, Routes } from 'react-router-dom';

import UserAuthForm from './pages/UserAuthForm.jsx';
import { lookInSession } from './components/Session.jsx';
import { UserContext } from './context/Usercontext.jsx';
import Editer from './pages/Editer.jsx';
import { Toaster } from 'react-hot-toast';
import Homepage from './pages/Homepage.jsx';
import Searchpage from './pages/Searchpage.jsx';
import PageNotFound from './components/PageNotFound.jsx';
import Profilepage from './pages/Profilepage.jsx';
import Blogpage from './pages/Blogpage.jsx';
import Sidebar from './components/Sidebar.jsx';
import Changepasswordpage from './pages/Changepasswordpage.jsx';
import Editprofilepage from './pages/Editprofilepage.jsx';
import Notificationpage from './pages/Notificationpage.jsx';
import ManageBlogs from './components/ManageBlogs.jsx';

export const baseUrl = 'http://localhost:4000';

const App = () => {
  const { userAuth, setUserAuth } = useContext(UserContext);

  useEffect(() => {
    let userSession = lookInSession('user')?.access_token || '{}';

    userSession.access_token
      ? setUserAuth(userSession)
      : setUserAuth({
          access_token: null,
        });
  }, []);

  return (
    <div className="bg-white">
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/editor" element={<Editer />} />
        <Route path="/editor/:blog_id" element={<Editer />} />
        <Route path="/" element={<Navbar />}>
          <Route index element={<Homepage />} />
          <Route path="dashboard" element={<Sidebar />}>
            <Route path="blogs" element={<ManageBlogs />} />
            <Route path="notifications" element={<Notificationpage />} />
          </Route>
          <Route path="settings" element={<Sidebar />}>
            <Route path="edit-profile" element={<Editprofilepage />} />
            <Route path="change-password" element={<Changepasswordpage />} />
          </Route>
          <Route path="signin" element={<UserAuthForm type="signin" />} />
          <Route path="signup" element={<UserAuthForm type="signup" />} />
          <Route path="search/:query" element={<Searchpage />} />
          <Route path="/user/:id" element={<Profilepage />} />
          <Route path="blogs/:blog_id" element={<Blogpage />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </div>
  );
};
export default App;

// StrongP@ss123
