import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { baseUrl } from '../App';
import { UserContext } from '../context/Usercontext';
import { Filterpagnation } from './Filterpagnation';
import toast from 'react-hot-toast';
import { CiSearch } from 'react-icons/ci';
import Inpagenavigation from './Inpagenavigation';
import Loader from './Loader';
import Nodatamessage from './Nodatamessage';
import AnimationWarper from '../commone/AnimationWarper';
import ManagePublishedBLogsCard from './ManagePublishedBLogsCard';
import ManageDraftBlogsCard from './ManageDraftBlogsCard';
import Loadmoredata from './Loadmoredata';

export const deleteBlog = async (blog, access_token, target) => {
  let { index, blog_id, setStatefunc } = blog;
  target.setAttribute('disabled', true);
  try {
    const respons = await axios.post(
      `${baseUrl}/api/v1/blog/delete-blog`,
      {
        blog_id,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    const data = respons.data;
    if (data?.success) {
      target.setAttribute('disabled', true);
      setStatefunc((prev) => {
        let { deletedDocCount, totalDocs, resulte } = prev;
        if (!deletedDocCount) {
          deletedDocCount = 0;
        }
        deletedDocCount += 1;
        totalDocs -= 1;
        resulte.splice(index, 1);
        if (!resulte.length && totalDocs - 1 > 0) {
          return null;
        }
        return { ...prev, deletedDocCount, totalDocs, resulte };
      });
    }
  } catch (error) {
    console.log(error);
    target.setAttribute('disabled', true);
  }
};

const ManageBlogs = () => {
  const {
    userAuth: { access_token },
  } = useContext(UserContext);

  const [blogs, setBlogs] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);

  const getblogs = async ({ page, draft, deletedDocCount = 0 }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/blog/user-Written-blogs`,
        {
          page: page,
          draft,
          query,
          deletedDocCount,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      const data = response.data;

      if (data?.success && Array.isArray(data.blogs)) {
        const formData = await Filterpagnation({
          state: draft ? drafts : blogs,
          data: data.blogs,
          page,
          user: access_token,
          countRoute: '/api/v1/blog/user-Written-blogs-count',
          data_to_send: {
            draft,
            query,
          },
        });
        if (draft) {
          setDrafts(formData);
        } else {
          setBlogs(formData);
        }
        setError(null);
      } else {
        setError('Unexpected response. Please try again.');
        console.warn('Invalid response:', data);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError(err.response?.data?.message || 'Something went wrong while fetching blogs.');
    }
  };

  useEffect(() => {
    if (access_token) {
      if (blogs.length === 0) {
        getblogs({ page: 1, draft: false });
      }
      if (drafts.length === 0) {
        getblogs({ page: 1, draft: true });
      }
    }
  }, [access_token, query, blogs, drafts]);

  const handlesearch = (e) => {
    let searchQuery = e.target.value;
    setQuery(searchQuery);
    if (e.keyCode === 13) {
      setBlogs([]);
      setDrafts([]);
    }
  };

  const handlechnage = (e) => {
    if (!e.target.value.length) {
      setQuery('');
      setBlogs([]);
      setDrafts([]);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 max-md:hidden">Manage Blogs</h2>
      <div className="relative w-full max-w-md mx-auto mb-10 mt-6 md:mt-10">
        <div className="relative group rounded-lg p-[2px] bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 animate-rainbow-border">
          <input
            onKeyDown={handlesearch}
            // onChange={handlechnage}
            name="search"
            id="search"
            autoComplete="off"
            type="text"
            placeholder="Search by title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-12 py-2 rounded-lg bg-white text-gray-800 focus:outline-none"
          />
          <CiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl pointer-events-none" />
        </div>
      </div>
      <Inpagenavigation routes={['published Blogs', 'drafts']}>
        <>
          {blogs.length === 0 ? (
            <Loader />
          ) : blogs.resulte?.length ? (
            blogs.resulte.map((blog, index) => {
              return (
                <AnimationWarper key={index} transition={{ duration: 1, delay: index * 0.8 }}>
                  <ManagePublishedBLogsCard blog={{ ...blog, index, setStatefunc: setBlogs }} />
                </AnimationWarper>
              );
            })
          ) : (
            <Nodatamessage message={'No blogs found'} />
          )}
          <Loadmoredata
            state={blogs}
            featchdatafun={getblogs}
            additionalparams={{ draft: false, deletedDocCount: blogs.deletedDocCount }}
          />
        </>
        <>
          {drafts.length === 0 ? (
            <Loader />
          ) : drafts.resulte?.length ? (
            drafts.resulte.map((blog, index) => {
              return (
                <AnimationWarper key={index} transition={{ duration: 1, delay: index * 0.8 }}>
                  <ManageDraftBlogsCard blog={{ ...blog, index, setStatefunc: setDrafts }} />
                </AnimationWarper>
              );
            })
          ) : (
            <Nodatamessage message={'No blogs found'} />
          )}
          <Loadmoredata
            state={drafts}
            featchdatafun={getblogs}
            additionalparams={{ draft: true, deletedDocCount: drafts.deletedDocCount }}
          />
        </>
      </Inpagenavigation>
    </div>
  );
};

export default ManageBlogs;
