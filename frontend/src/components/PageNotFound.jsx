import React from 'react';
import { useNavigate } from 'react-router-dom';
import img404 from '../assets/404.png';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-[calc(100vh-80px)] px-6 py-10 flex flex-col items-center justify-center gap-8 text-center bg-gray-50">
      <img
        src={img404}
        alt="404"
        className="select-none border border-gray-300 w-64 aspect-square object-contain rounded-xl shadow-sm"
      />
      <h1 className="text-4xl font-extrabold text-gray-800">
        Oops! Page Not Found
      </h1>
      <p className="text-gray-600 max-w-md">
        The page you’re looking for doesn’t exist or has been moved. Don’t
        worry, let’s get you back on track!
      </p>
      <button
        onClick={() => navigate('/')}
        className="mt-4 bg-black hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-all duration-300 cursor-pointer"
      >
        Go to Home
      </button>
      <p className="text-gray-600">
        Dive into a world of stories — millions await.
      </p>
    </section>
  );
};

export default PageNotFound;
