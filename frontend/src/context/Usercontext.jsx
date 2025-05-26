import { createContext, useState, useEffect } from 'react';
import { lookInSession } from '../components/Session'; // make sure this points correctly

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [userAuth, setUserAuth] = useState(() => lookInSession('user') || {});

  useEffect(() => {
    const storedUser = lookInSession('user');
    if (storedUser) {
      setUserAuth(storedUser);
    }
  }, []);

  const userContextValue = {
    userAuth,
    setUserAuth,
  };

  return <UserContext.Provider value={userContextValue}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
