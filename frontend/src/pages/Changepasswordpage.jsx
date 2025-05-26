import React, { useState, useContext } from 'react';
import AnimationWarper from '../commone/AnimationWarper';
import InputComponent from '../components/InputComponent';
import { FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { UserContext } from '../context/Usercontext';
import axios from 'axios';
import { baseUrl } from '../App';

const Changepasswordpage = () => {
  const {
    userAuth: { access_token },
  } = useContext(UserContext);

  console.log('access_token', access_token);

  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const onchangehnadler = (e) => {
    const { name, value } = e.target;
    setPassword({
      ...password,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.currentPassword || !password.newPassword) {
      toast.error('Please fill all the fields');
      return;
    }
    if (
      !passwordRegex.test(password.newPassword) ||
      !passwordRegex.test(password.currentPassword)
    ) {
      toast.error(
        'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
      );
      return;
    }

    e.target.setAttribute('disabled', true);

    let loadingToast = toast.loading('Please wait updating...');

    try {
      const { currentPassword, newPassword } = password;
      const responsed = await axios.post(
        `${baseUrl}/api/v1/user/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      const data = responsed.data;

      if (data.success) {
        toast.success(data.message);
        e.target.removeAttribute('disabled');
        toast.dismiss(loadingToast);
      }
    } catch (error) {
      console.log(error);
      toast.dismiss(loadingToast);
      e.target.removeAttribute('disabled');
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <>
      <AnimationWarper className="w-full">
        <form onSubmit={handleSubmit}>
          <h1 className="max-md:hidden">change-password</h1>

          <div className="py-10 w-full md:max-w-[600px] ">
            <InputComponent
              onChange={onchangehnadler}
              value={password.currentPassword}
              name={'currentPassword'}
              type={'password'}
              className="w-full rounded-md p-4 bg-gray-300 pl-12 border border-gray-300 focus:bg-transparent placeholder:text-black md:w-full"
              placeholder={'currentPassword'}
              icon={<FaLock />}
            />
            <InputComponent
              onChange={onchangehnadler}
              value={password.newPassword}
              name={'newPassword'}
              type={'password'}
              className="w-full rounded-md p-4 bg-gray-300 pl-12 border border-gray-300 focus:bg-transparent placeholder:text-black md:w-full"
              placeholder={'newPassword'}
              icon={<FaLock />}
            />
            <button
              className="px-10 whitespace-nowrap bg-black text-white rounded-full py-3  text-xl capitalize cursor-pointer mt-5"
              type="submit"
              onClick={handleSubmit}
            >
              change password
            </button>
          </div>
        </form>
      </AnimationWarper>
    </>
  );
};

export default Changepasswordpage;
