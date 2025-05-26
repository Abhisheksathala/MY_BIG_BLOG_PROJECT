import React, { useEffect, useContext, useState } from 'react';
import AnimationWarper from '../commone/AnimationWarper';
import Inpagenavigation from '../components/Inpagenavigation';
import { baseUrl } from '../App';
import axios from 'axios';
import toast from 'react-hot-toast';
import { editorContext } from '../context/Editorcontext';
import Loader from '../components/Loader';
import Blogcardcomp from '../components/Blogcardcomp';
import Minimalblogcard from '../components/Minimalblogcard';
import { IoMdTrendingUp } from 'react-icons/io';
import { activetab } from '../components/Inpagenavigation';
import Nodatamessage from '../components/Nodatamessage';
import { Filterpagnation } from '../components/Filterpagnation';
import Loadmoredata from '../components/Loadmoredata';
// const btmRef = useRef();
//   const activetab = useRef();
const Homepage = () => {
  const { getBlogState, setGetBlogState, treandingBlogstate, setTrendingBlogstate } =
    useContext(editorContext);

  let [pagestate, setPagestate] = useState('home');

  // console.log('getBlogState: ', getBlogState);
  // console.log('treandingBlogstate: ', treandingBlogstate);

  const categories = [
    'programming',
    'web development',
    'data science',
    'filim making',
    'art',
    'cooking',
    'teach',
    'poem',
  ];

  const featchBlogs = async ({ page = 1 }) => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/blog/get-all-blogs`, { page });
      const data = response.data;
      console.log('data for load more', data);

      if (data?.success && Array.isArray(data.blogs)) {
        console.log('blogs fetched successfully');

        let formatedata = await Filterpagnation({
          state: getBlogState,
          data: data.blogs,
          page: page,
          countRoute: '/api/v1/blog/all-latest-blogs-count-load-more',
          create_new_array: page === 1,
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
      toast.error(error?.response?.data?.message);
    }
  };

  const featchBlogsByCategory = async ({ page = 1 }) => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/blog/get-blogs-by-tag`, {
        tag: pagestate,
        page,
      });
      const data = response.data;

      if (data?.success && Array.isArray(data.blogs)) {
        console.log('blogs fatched successfully by category', data);

        let formatedata = await Filterpagnation({
          state: getBlogState,
          data: data.blogs,
          page: page,
          countRoute: '/api/v1/blog/get-blogs-by-tag-advance',
          data_to_send: { tag: pagestate },
          create_new_array: page === 1,
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
      toast.error(error?.response?.data?.message);
    }
  };
  const featchTreandingBlogs = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/blog/get-trending-blogs`);
      const data = response.data;
      if (data?.success && Array.isArray(data.blogs)) {
        console.log('trending blogs fatched successfully' + data.blogs);
        setTrendingBlogstate(data.blogs);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const loadblogbytag = async (e) => {
    let category = e.target.innerText.toLowerCase();
    console.log(category);
    setGetBlogState([]);

    if (pagestate === category) {
      return setPagestate('home');
    }
    return setPagestate(category);
  };

  useEffect(() => {
    activetab.current.click();
    if (pagestate === 'home') {
      featchBlogs({ page: 1 });
    } else {
      featchBlogsByCategory({
        page: 1,
      });
    }
    if (treandingBlogstate) {
      featchTreandingBlogs();
    }
  }, [pagestate]);

  return (
    <AnimationWarper>
      <section className="min-h-[calc(100vh-80px)] bg-white flex justify-center gap-10">
        {/* latest blogs */}
        <div className="w-full">
          <Inpagenavigation
            routes={[pagestate, 'trending blogs']}
            defaultHidden={['trending blogs']}
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
                    <Blogcardcomp content={blog} author={blog.author?.personal_info} />
                  </AnimationWarper>
                ))
              ) : (
                <Nodatamessage message="Data is not there" />
              )}
              <Loadmoredata
                state={getBlogState}
                featchdatafun={pagestate === 'home' ? featchBlogs : featchBlogsByCategory}
              />
            </>
            <>
              {treandingBlogstate.length === 0 || treandingBlogstate === null ? (
                <Loader />
              ) : treandingBlogstate.length ? (
                treandingBlogstate.map((blog, i) => {
                  return (
                    <AnimationWarper
                      transaition={{
                        duration: 1,
                        delay: i * 0.2,
                      }}
                      key={i}
                    >
                      <Minimalblogcard
                        key={i}
                        blog={blog}
                        index={i}
                        author={blog.author.personal_info}
                      />
                    </AnimationWarper>
                  );
                })
              ) : (
                <Nodatamessage message={'data is not there'} />
              )}
            </>
          </Inpagenavigation>
        </div>

        {/* filter and trending blogs */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-1 border-gray-200 pl-8 pt-5 max-md:hidden bg-white">
          <div>
            <h1 className="font-medium text-xl mb-8">stories From the internet</h1>
            <div className="flex gap-3 flex-wrap">
              {categories.map((category, i) => {
                return (
                  <button
                    onClick={loadblogbytag}
                    className={`p-3 bg-gray-200 rounded-full px-6 capitalize cursor-pointer ${
                      pagestate == category ? 'bg-gray-900 text-white' : ''
                    }`}
                    key={i}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h1 className="font-medium text-xl mb-8 flex items-center justify-start gap-1">
              Trending
              <IoMdTrendingUp />
            </h1>
            {!treandingBlogstate || treandingBlogstate.length === 0 ? (
              <Loader />
            ) : treandingBlogstate.length ? (
              treandingBlogstate.map((blog, i) => (
                <AnimationWarper
                  transaition={{
                    duration: 1,
                    delay: i * 0.2,
                  }}
                  key={blog.blog_id || i} // better keying
                >
                  <Minimalblogcard blog={blog} index={i} author={blog.author?.personal_info} />
                </AnimationWarper>
              ))
            ) : (
              <Nodatamessage message="no trending blog" />
            )}
          </div>
        </div>
      </section>
    </AnimationWarper>
  );
};

export default Homepage;
