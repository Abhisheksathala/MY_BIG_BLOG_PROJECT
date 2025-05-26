import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../context/Usercontext';
import axios from 'axios';
import { baseUrl } from '../App';
import AnimationWarper from '../commone/AnimationWarper';
import Loader from '../components/Loader';
import InputComponent from '../components/InputComponent';
import toast from 'react-hot-toast';

// icons
import { FaYoutube } from 'react-icons/fa6';
import { FaInstagramSquare } from 'react-icons/fa';
import { FaGithubAlt } from 'react-icons/fa';
import { CgWebsite } from 'react-icons/cg';
import { FaFacebookF } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';

// upload
import { Uploade } from '../commone/Uploade';
import { storeInSession } from '../components/Session';

const Editprofilepage = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  const [image, setImage] = useState(null);
  const [imgprev, setImgprev] = useState(null);

  const iconMap = {
    youtube: <FaYoutube />,
    instagram: <FaInstagramSquare />,
    github: <FaGithubAlt />,
    website: <CgWebsite />,
    facebook: <FaFacebookF />,
    twitter: <FaSquareXTwitter />,
  };

  let {
    userAuth: { access_token },
    userAuth: {
      user: {
        personal_info: { username, profile_img, fullname, email, bio },
      },
      user: {
        personal_info: { username: profile_username },
      },
    },
    userAuth: {
      user: {
        social_links,
        // social_links: {  },
      },
    },
    userAuth,
    setUserAuth,
  } = useContext(UserContext);

  // console.log('username', userAuth);

  useEffect(async () => {
    try {
      setLoading(true);
      if (access_token) {
        const response = await axios.post(`${baseUrl}/api/v1/blog/get-profile`, {
          username: username,
        });
        const data = response.data;
        if (data.success) {
          setProfile(data);
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleimageprev = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imagePreview = URL.createObjectURL(file);
      setImgprev(imagePreview);
      setImage(file);
    }
  };

  const handleimagefun = async (e) => {
    e.preventDefault();
    try {
      if (image) {
        let loading = toast.loading('Please wait updating...');
        e.target.setAttribute('disabled', true);
        const response = await Uploade(image);
        const response2 = await axios.post(
          `${baseUrl}/api/v1/user/update-profile-image`,
          {
            url: response,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access_token}`,
            },
          },
        );
        if (response2.data.success) {
          let newuser = {
            ...userAuth,
            user: {
              ...userAuth.user,
              personal_info: {
                ...userAuth.user.personal_info,
                profile_img: response,
              },
            },
          };
          storeInSession('user', newuser);
          setUserAuth(newuser);
          toast.dismiss(loading);
          e.target.removeAttribute('disabled');
          toast.success('Profile image updated successfully');
        }
      }
    } catch (error) {
      console.log(error);
      e.target.removeAttribute('disabled');
      toast.dismiss(loading);
    }
  };

  const editprileref = useRef(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let form = new FormData(editprileref.current);
    let formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }
    let { username, bio, youtube, instagram, github, website, facebook, twitter } = formData;

    if (username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    if (bio.length > maxlimit) {
      toast.error('Bio must be less than 150 characters');
      return;
    }

    let loading = toast.loading('Please wait updating...');
    e.target.setAttribute('disabled', true);

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/user/update-profile`,
        {
          username,
          bio,
          social_links: {
            youtube,
            instagram,
            github,
            website,
            facebook,
            twitter,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      const data = response.data;
      if (data.success) {
        if (userAuth.user.personal_info.username !== data.username) {
          let newUser = {
            ...userAuth,
            user: {
              ...userAuth.user,
              personal_info: {
                ...userAuth.user.personal_info,
                username: data.username,
              },
            },
          };
          storeInSession('user', newUser);
          setUserAuth(newUser);
        }
        toast.dismiss(loading);
        e.target.removeAttribute('disabled');
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const maxlimit = 150;
  const [charaectersLeft, setCharaectersLeft] = useState(maxlimit);

  return (
    <AnimationWarper>
      {loading ? (
        <Loader />
      ) : (
        <form ref={editprileref}>
          <h1 className="md:hidden">edit profile</h1>
          <div className="flex flex-col lg:flex-row text-start py-10 gap-8 lg:gap-10">
            <div className="max-lg:block max-lg:mx-auto mb-5">
              <label htmlFor="upload" id="profileImageLable">
                <div className="w-48 h-48 rounded-full relative block overflow-hidden bg-white">
                  <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/100 opacity-0 hover:opacity-50 curser-pointer font-bold">
                    upload
                  </div>
                  <img src={imgprev ? imgprev : profile_img} alt="" className="" />
                </div>
              </label>

              <input onChange={handleimageprev} type="file" id="upload" accept="image/*" hidden />

              <button
                className="mt-4 bg-black hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-all duration-300 cursor-pointer max-lg:mx-auto max-lg:block"
                onClick={handleimagefun}
              >
                Upload
              </button>
            </div>
            {/*  */}
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                <div className="">
                  <InputComponent
                    name="fullname"
                    type="text"
                    id="fullname"
                    disable={true}
                    value={fullname}
                    placeholder="Full name"
                  />
                </div>
                <div className="">
                  <InputComponent
                    name="email"
                    type="email"
                    id="fullname"
                    disable={true}
                    value={email}
                    placeholder="Full name"
                  />
                </div>
              </div>
              <InputComponent
                name="username"
                type="text"
                id="username"
                defaultValue={profile_username}
                placeholder="Username"
              />
              <p className="text-sm text-gray-500 -mt-3 mb-3">
                user name will use to search user and will be visable to all user
              </p>
              <textarea
                name="bio"
                defaultValue={bio}
                // id="bio"
                spellCheck="true"
                placeholder="Bio"
                cols="30"
                rows="10"
                maxLength={maxlimit}
                className="w-full rounded-md p-4 bg-gray-300 pl-12 border border-gray-300 focus:bg-transparent placeholder:text-black h-64 mt-5 lg:h-40 resize-none leading-7"
                onChange={(e) => {
                  setCharaectersLeft(maxlimit - e.target.value.length);
                }}
              ></textarea>
              <p>{charaectersLeft} -charaectersLeft</p>
              <p className="my-6 text-gray-500">Add social midea links</p>
              <div className="md:grid md:grid-cols-2 gap-x-6">
                {Object.keys(social_links).map((key, i) => {
                  const link = social_links[key];
                  const Icon = iconMap[key];
                  return (
                    <InputComponent
                      key={i}
                      name={key}
                      type="text"
                      icon={Icon}
                      defaultValue={link}
                      placeholder="https://"
                    />
                  );
                })}
              </div>
              <button
                className="mt-4 bg-black hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-all duration-300 cursor-pointer max-lg:mx-auto max-lg:block"
                type="submit"
                onClick={handleSubmit}
              >
                update
              </button>
            </div>
          </div>
        </form>
      )}
    </AnimationWarper>
  );
};

export default Editprofilepage;
