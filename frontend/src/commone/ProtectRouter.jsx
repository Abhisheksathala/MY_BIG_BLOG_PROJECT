import React, { useContext } from 'react';
import { UserContext } from '../context/Usercontext';

const ProtectRouter = ({ children }) => {
  const { userAuth } = useContext(UserContext);

  if (!userAuth.access_token) {
    return <div>You need to be logged in to access this page.</div>;
  }

  return <>{children}</>;
};

export default ProtectRouter;
