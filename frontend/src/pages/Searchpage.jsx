import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import Inpagenavigation from '../components/Inpagenavigation';
import Loader from '../components/Loader';
// import { editorContext } from '../context/Editorcontext';
import AnimationWarper from '../commone/AnimationWarper';
import Blogcardcomp from '../components/Blogcardcomp';
import Nodatamessage from '../components/Nodatamessage';
import Loadmoredata from '../components/Loadmoredata';

import { Filterpagnation } from '../components/Filterpagnation';
import { baseUrl } from '../App';
import axios from 'axios';
import toast from 'react-hot-toast';
import UserCard from '../components/UserCard';
import { CiUser } from 'react-icons/ci';

const Searchpage = () => {
  let { query } = useParams();
  const [getBlogState, setGetBlogState] = useState(null);
  const [userstate, setUserstate] = useState(null);

  const seacrhBlog = async ({ page = 1, create_new_array = false }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/blog/get-blogs-by-tag-advance`, // ✅ Corrected endpoint here
        {
          query,
          page,
        },
      );

      const data = response.data;

      if (data?.success && Array.isArray(data.blogs)) {
        console.log('blogs fetched successfully by search', data);

        let formatedata = await Filterpagnation({
          state: getBlogState,
          data: data.blogs,
          page: page,
          countRoute: '/api/v1/blog/get-blogs-by-tag-advance', // ✅ Good as is
          data_to_send: { query },
          create_new_array,
        });

        console.log('formatted data', formatedata);

        if (formatedata && formatedata.resulte) {
          return setGetBlogState(formatedata);
        } else {
          console.warn('No valid formatted data returned');
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    }
  };

  const fetchusers = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/blog/search-user`,
        {query},
      );
      const data = response.data;
      console.log('users fetched successfully by search', data);
      if (data?.success && Array.isArray(data.users)) {
        setUserstate(data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    resetstaet();
    seacrhBlog({ page: 1, create_new_array: true });
    fetchusers();
  }, [query]);

  const resetstaet = () => {
    setGetBlogState(null);
    setUserstate(null);
  };

  const UserCardwraper = () => {
    return (
      <>
        {userstate === null ? (
          <Loader />
        ) : userstate.length ? (
          userstate.map((user, i) => (
            <AnimationWarper
              transition={{
                duration: 1,
                delay: i * 0.8,
              }}
              key={i} // Prefer unique keys
            >
              <UserCard user={user} />
            </AnimationWarper>
          ))
        ) : (
          <Nodatamessage message="no user found" />
        )}
      </>
    );
  };

  return (
    <section className="min-h-[calc(100vh-80px)] flex justify-center gap-10">
      <div className="w-full">
        <Inpagenavigation
          routes={[`search resultes from ${query}`, 'Account Matched']}
          defaultHidden={['Account Matched']}
        >
          <>
            {getBlogState === null ? (
              <Loader />
            ) : getBlogState.resulte ? (
              getBlogState.resulte.map((blog, i) => (
                <AnimationWarper
                  transition={{
                    duration: 1,
                    delay: i * 0.2,
                  }}
                  key={i} // Prefer unique keys
                >
                  <Blogcardcomp
                    content={blog}
                    author={blog.author?.personal_info}
                  />
                </AnimationWarper>
              ))
            ) : (
              <Nodatamessage message="Data is not there" />
            )}
            <Loadmoredata state={getBlogState} featchdatafun={seacrhBlog} />
          </>
          <>
            <UserCardwraper />
          </>
        </Inpagenavigation>
      </div>
      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-gray-200 pl-8 py-6 pr-4 max-md:hidden">
        <h2 className="font-semibold text-xl mb-6 flex items-center gap-2 text-gray-800">
          Users related to your search
          <span className="text-2xl text-gray-600">
            <CiUser />
          </span>
        </h2>

        <UserCardwraper />
      </div>
    </section>
  );
};

export default Searchpage;
