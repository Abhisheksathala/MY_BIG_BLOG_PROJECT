import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../App.jsx';
import { useContext, useEffect, useState } from 'react';
import AnimationWarper from '../commone/AnimationWarper.jsx';
import Loader from '../components/Loader.jsx';
import getDay from '../components/date.jsx';
import Bloginteraction from '../components/Bloginteraction.jsx';
import Blogcardcomp from '../components/Blogcardcomp.jsx';
import { Blogcontext } from '../context/Blogcontext.jsx';
import BlogContent from '../components/BlogContent.jsx';
import CommentsContainer from '../components/CommentsContainer.jsx';
import { fetchcomment } from '../components/CommentsContainer.jsx';

const Blogpage = () => {
  const {
    blogstate,
    setBlogstate,
    commentwraper,
    setCommentwraper,
    totalparentcommentsLoaded,
    setTotalparentcommentsLoaded,
  } = useContext(Blogcontext);

  const [similerblogsState, setSimilerblogsState] = useState({});

  const { blog_id: blogParams } = useParams();
  const [loadingstate, setLoadingstate] = useState(true);

  const fetchblog = async () => {
    try {
      setLoadingstate(true);
      const response = await axios.post(`${baseUrl}/api/v1/blog/get-blog`, {
        blog_id: blogParams,
      });

      const data = response?.data;
      console.log(data);
      if (data?.success) {
        setBlogstate(data);
        console.log('datadata', data);
        // console.log('datadata', data.blogs.comments);

        const comments = await fetchcomment({
          blog_id: data.blogs._id,
          setParentCommentCountFun: setTotalparentcommentsLoaded,
        });

        data.blogs.comments = comments;

        console.log('datadata befor', data);
        const blog = data.blogs;
        const tag = blog?.tags?.[0];

        const similerblogs = await axios.post(`${baseUrl}/api/v1/blog/get-blogs-by-tag-advance`, {
          tag: tag,
        });
        const smilierdata = similerblogs.data;
        console.log('smilierdata', smilierdata);
        if (smilierdata.success) {
          setSimilerblogsState(smilierdata.blogs || []);
        } else {
          console.error('Failed to get blog post or there is no similer blogs');
        }

        setLoadingstate(false);
      }
    } catch (err) {
      console.error('Failed to fetch blog:', err);
      setLoadingstate(false);
    }
  };

  useEffect(() => {
    resetState();
    fetchblog();
  }, [blogParams]);

  const resetState = () => {
    setBlogstate({});
    setSimilerblogsState({});
    setLoadingstate(true);
    // setCommentwraper(false);
    setTotalparentcommentsLoaded(0);
  };

  const {
    title,
    content,
    tags,
    banner,
    publishedAt,
    author: { personal_info: { fullname, username: author_username, profile_img } = {} } = {},
  } = blogstate.blogs || {};

  console.log('content', content);

  return (
    <AnimationWarper>
      {loadingstate ? (
        <Loader />
      ) : (
        <>
          <CommentsContainer />
          <div className={'max-w-[900px] block mx-auto py-10 max-lg:px-[5vw]'}>
            <img src={banner} className={'aspect-video object-cover  w-full     '} alt="" />
            <div className="mt-12">
              <h2
                className={
                  'text-4xl leading-normal font-bold max-md:text-3xl max-md:leading-snug !important'
                }
              >
                {title}
              </h2>
              <div className="flex max-sm:flex-col justify-between my-8">
                <div className="flex gap-5 items-start">
                  <img src={profile_img} className={'w-12 h-12 rounded-full'} alt="" />
                  <p className={'capitalize'}>
                    {fullname}
                    <br />@
                    <Link className={'underline'} to={`/user/${author_username}`}>
                      {author_username}
                    </Link>
                  </p>
                </div>

                <p className={'text-gray-400 opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5'}>
                  published on {getDay(publishedAt)}
                </p>
              </div>
            </div>

            <Bloginteraction />
            <div className="my-12 font-gelasio text-xl leading-10 md:text-2xl">
              {content?.map((block, i) => (
                <div key={block.id || i} className="my-4 md:my-8">
                  <BlogContent block={block} />
                </div>
              ))}
            </div>

            <Bloginteraction />

            {similerblogsState.length ? (
              <>
                <h1 className={'text-2xl mt-14 mb-10 font-medium'}>similer blogs</h1>

                {similerblogsState.map((blog, i) => {
                  let {
                    author: { personal_info },
                  } = blog;
                  return (
                    <AnimationWarper key={i} transition={{ duration: 1, delay: 2 }}>
                      <Blogcardcomp content={blog} author={personal_info} />
                    </AnimationWarper>
                  );
                })}
              </>
            ) : null}
          </div>
        </>
      )}
    </AnimationWarper>
  );
};

export default Blogpage;
