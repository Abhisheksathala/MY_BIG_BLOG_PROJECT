import { createContext, useState } from 'react';

export const Blogcontext = createContext();

const BlogProvider = ({ children }) => {
  const [blogstate, setBlogstate] = useState([]);
  const [isLikedByUser, setIsLikedByUser] = useState(false);

  const [commentwraper, setCommentwraper] = useState(false);
  const [commentstate, setCommentstate] = useState([]);
  const [totalparentcommentsLoaded, setTotalparentcommentsLoaded] = useState(0);

  const Blogvalue = {
    blogstate,
    setBlogstate,
    isLikedByUser,
    setIsLikedByUser,
    commentwraper,
    setCommentwraper,
    totalparentcommentsLoaded,
    setTotalparentcommentsLoaded,
    commentstate,
    setCommentstate,
  };

  return <Blogcontext.Provider value={Blogvalue}>{children}</Blogcontext.Provider>;
};

export default BlogProvider;
