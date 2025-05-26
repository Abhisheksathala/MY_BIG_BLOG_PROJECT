import React from 'react';
import Loaderlogo from '../assets/1483.gif';
import Loaderlogo2 from '../assets/1484.gif';

const Loader = () => {
  return (
    <div className=" mt-32 inset-0 flex items-center justify-center bg-white/70 z-50">
      <img src={Loaderlogo2} alt="Loading..." className="w-16 h-16" />
    </div>
  );
};

export default Loader;
