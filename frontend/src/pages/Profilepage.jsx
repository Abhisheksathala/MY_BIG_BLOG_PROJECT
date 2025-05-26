import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../App';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import AnimationWarper from '../commone/AnimationWarper';
import { UserContext } from '../context/Usercontext';
import Aboutuser from '../components/Aboutuser';
import { Filterpagnation } from '../components/Filterpagnation';
import Inpagenavigation from '../components/Inpagenavigation';
import Nodatamessage from '../components/Nodatamessage';
import Blogcardcomp from '../components/Blogcardcomp';
import Minimalblogcard from '../components/Minimalblogcard';
import PageNotFound from '../components/PageNotFound'
import {
  useNavigate
} from 'react-router-dom'

const profileDataStrucuture = {
  personal_info: {
    fullname: '',
    username: '',
    profile_img: '',
    bio: '',
  },
  account_info: {
    total_posts: 0,
    total_reads: 0,
  },
  social_links: {},
  joinedAt: '',
};

const Profilepage = () => {
  let { id: profileId } = useParams();
  const { userAuth } = useContext(UserContext);

  const username = userAuth?.user?.personal_info?.username;

  // console.log("username",);

  const [profilestate, setProfilestate] = useState(profileDataStrucuture);
  const [loading, setLoading] = useState(true);
  const [blogsstate, setBlogsstate] = useState({});
  const [profileLLoaded, setProfileLoaded] = useState('');

  const navigete = useNavigate()

  console.log('blogsstate', blogsstate);

  let {
    personal_info: { fullname, username: profile_username, profile_img, bio },
    account_info: { total_posts, total_reads },
    joinedAt,
  } = profilestate;

  const fetchuserprofile = async () => {
    try {
      const respone = await axios.post(`${baseUrl}/api/v1/blog/get-profile`, {
        username: profileId,
      });
      const data = respone.data;
      console.log('da mn ta', data);

      if (data?.success) {
        setProfilestate(data.user);
        setProfileLoaded(profileId);
        await getBlogs({ user_id: data.user._id });
        setLoading(false);
      }if(!data?.status === 404){
        navigete('/')
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getBlogs = async ({ page = 1, user_id }) => {
    user_id = user_id == undefined ? blogsstate?.user_id : user_id;

    const respons = await axios.post(
      `${baseUrl}/api/v1/blog/get-blogs-by-tag-advance`,
      {
        author: user_id,
        page: String(page),
      },
    );

    const data = respons.data;
    console.log(respons.data);

    if (data.success) {
      const formatedDate = await Filterpagnation({
        state: blogsstate,
        data: data.blogs,
        page,
        countRoute: '/api/v1/blog/get-blogs-by-tag-advance',
        data_to_send: { author: user_id, page },
        create_new_array: page === 1,
      });

      if (
        formatedDate &&
        formatedDate.resulte &&
        formatedDate.resulte.length &&
        Array.isArray(formatedDate.resulte)
      ) {
        formatedDate.user_id = user_id;
        console.log('formatedDate before setBlogsstate:', formatedDate);
        const newBlogsState = { ...formatedDate, user_id };
        setBlogsstate(newBlogsState);
      } else {
        console.error('Error: Invalid format for formatedDate:', formatedDate);
      }
    }
  };

  useEffect(() => {
    if (profileId !== profileLLoaded) {
      setBlogsstate(null);
    }
    restates();
    fetchuserprofile();
  }, [profileId]);

  const restates = () => {
    setProfilestate(profileDataStrucuture);
    setLoading(true);
    setBlogsstate(null);
  };

  return (
    <AnimationWarper>
      {loading ? (
        <Loader />
      ) : profile_username.length ? (
        <section className="min-h-[calc(100vh-80px)] md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
          <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-gray-300 md:sticky md:top-[100px] md:py-10">
            <img
              src={profile_img}
              alt=""
              className="w-48 h-48 bg-gray-400 rounded-full md:w-32 md:h-32"
            />
            <h1 className="text-2xl font-medium">@{profile_username}</h1>
            <p className="text-base capitalize h-6">{fullname}</p>

            <p>
              {total_posts.toLocaleString()} Blogs -{' '}
              {total_reads.toLocaleString()} - Reads
            </p>

            <div className="flex gap-4 mt-2">
              {profileId === username ? (
                <Link
                  to="/settings/edit-profile"
                  className="text-gray-600 hover:text-black hover:underline"
                >
                  Edit Profile
                </Link>
              ) : null}
            </div>
            <Aboutuser
              className="max-md:hidden"
              bio={bio}
              social_links={profilestate.social_links}
              joinedAt={joinedAt}
            />
          </div>
          <div className="max-md:mt-12 w-full ">
            <>
              <Inpagenavigation
                routes={['Blogs published', 'About']}
                defaulthidden={['About']}
              >
                <>
                  {!blogsstate || !blogsstate.resulte ? (
                    <Loader />
                  ) : blogsstate.resulte.length > 0 ? (
                    blogsstate.resulte.map((blog, i) => (
                      <AnimationWarper
                        transaition={{ duration: 1, delay: i * 0.2 }}
                        key={blog.blog_id || i}
                      >
                        <Blogcardcomp
                          content={blog}
                          author={blog.author?.personal_info}
                        />
                      </AnimationWarper>
                    ))
                  ) : (
                    <Nodatamessage message="No blogs published yet" />
                  )}
                </>
                <>
                  <Aboutuser
                    className=""
                    bio={bio}
                    social_links={profilestate.social_links}
                    joinedAt={joinedAt}
                  />
                </>
              </Inpagenavigation>
            </>
          </div>
        </section>
      ) : <PageNotFound/>}
    </AnimationWarper>
  );
};

export default Profilepage;
