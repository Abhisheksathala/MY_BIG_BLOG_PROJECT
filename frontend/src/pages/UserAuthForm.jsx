import React, { useContext, useState } from 'react';
import InputComponent from '../components/InputComponent';
import logo from '../assets/google.png';
import AnimationWarper from '../commone/AnimationWarper';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../App';
import toast, { Toaster } from 'react-hot-toast';
import { storeInSession } from '../components/Session';
import { UserContext } from '../context/Usercontext';

const UserAuthForm = ({ type }) => {
  const {
    userAuth: { access_token },
    userAuth,
    setUserAuth,
  } = useContext(UserContext);

  console.log(userAuth?.user?.personal_info?.username);

  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.trim(),
    }));
  };

  const handlesubmite = async (e) => {
    e.preventDefault();

    if (type === 'signup' && form.fullname.length < 3) {
      toast.error('Fullname must be at least 3 characters long');
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email)) {
      toast.error('Invalid email address');
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
    }
    try {
      const endpoint = type === 'signin' ? '/api/v1/user/signin' : '/api/v1/user/signup';

      const response = await axios.post(`${baseUrl}${endpoint}`, form);

      const data = response.data;

      if (data?.success) {
        console.log('user', data.user.personal_info.username);
        // console.log('storeuserInsession' + '  ' + storeuserInsession);
        storeInSession('user', data);
        setUserAuth(data);
        toast.success('User created successfully');
        navigate('/');
      } else {
        console.log('Error:', data?.message);
        toast.error('Error:', data?.message);
      }
    } catch (error) {
      console.error('Request failed:', error.response?.data || error.message);
      toast.error('Error:', error.message);
    }
  };

  return (
    <div>
      <AnimationWarper keyValue={type}>
        <section className={`min-h-[calc(100vh-80px)] flex items-center justify-center `}>
          <Toaster />
          <form action="" className={`w-[80%] max-w-[400px]`} onSubmit={handlesubmite}>
            <h1 className={`text-4xl capitalize text-center mb-24`}>
              {type === 'signin' ? 'welcom back' : 'Join us toady'}
            </h1>
            {type !== 'signin' ? (
              <InputComponent
                name={'fullname'}
                type={'text'}
                id={'fullname'}
                placeholder={'Full Name'}
                value={form.fullname}
                onChange={handleChange}
              />
            ) : (
              ''
            )}
            <InputComponent
              name={'email'}
              type={'email'}
              id={'email'}
              placeholder={'Email'}
              value={form.email}
              onChange={handleChange}
            />
            <InputComponent
              name={'password'}
              type={'password'}
              id={'password'}
              placeholder={'Password'}
              value={form.password}
              onChange={handleChange}
            />
            <button
              type="submit"
              className={`w-full flex justify-center items-center gap-2 py-4 px-6 bg-black text-white rounded-full cursor-pointer hover:bg-gray-800`}
            >
              {type === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
            <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold ">
              <hr className="w-1/2 border-black" />
              <p>Or</p>
              <hr className="w-1/2 border-black" />
            </div>
            <button className="`w-full flex justify-center items-center py-4 px-6 bg-black text-white rounded-full cursor-pointer hover:bg-gray-800 block mx-auto  gap-4 w-[90%]">
              <img src={logo} alt="" className="w-5" />
              Continue with Google
            </button>
            {type === 'signup' ? (
              <p className="mt-6 text-gray-400">
                Already have an account?{' '}
                <Link to="/signin" className="underline text-black text-xl ml-1">
                  Sign In
                </Link>
              </p>
            ) : (
              <p className="mt-6 text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="underline text-black text-xl ml-1">
                  Sign Up
                </Link>
              </p>
            )}
          </form>
        </section>
      </AnimationWarper>
    </div>
  );
};

export default UserAuthForm;
