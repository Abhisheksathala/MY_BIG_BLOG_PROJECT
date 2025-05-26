import React, { useContext, useEffect } from 'react';
import BlogeditorComp from '../components/BlogeditorComp';
import Publishformcomp from '../components/Publishformcomp';
import { editorContext } from '../context/Editorcontext';
import { UserContext } from '../context/Usercontext';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import axios from 'axios';
import { baseUrl } from '../App';
import { useParams } from 'react-router-dom';

const Editer = () => {
  const Navigate = useNavigate();

  const {
    userAuth: { access_token },
  } = useContext(UserContext);

  const { loadingstate, setLoadingstate, blogState, setBlogState } = useContext(editorContext);

  let { blog_id } = useParams();
  console.log('blog_id', blog_id);

  useEffect(async () => {
    if (!blog_id) {
      return setLoadingstate(false);
    }

    try {
      const respons = await axios.post(`${baseUrl}/api/v1/blog/get-blog`, {
        blog_id,
        draft: true,
        mode: 'edit',
      });

      const data = respons.data;

      if (data.success) {
        console.log('data edit', data);
        setBlogState(data.blogs);
        setLoadingstate(false);
      }
    } catch (error) {
      console.log(error);
      setLoadingstate(false);
      throw error;
    }
  }, []);

  const { editorstore } = useContext(editorContext);

  return (
    <div className={``}>
      {access_token === null ? (
        Navigate('/signin')
      ) : loadingstate ? (
        <Loader />
      ) : editorstore === 'editor' ? (
        <BlogeditorComp />
      ) : (
        <Publishformcomp />
      )}
    </div>
  );
};
export default Editer;
