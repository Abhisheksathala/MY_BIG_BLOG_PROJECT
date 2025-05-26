import React from 'react';

const Loadmoredata = ({ state, featchdatafun, additionalparams }) => {
  return (
    <button
      onClick={() => featchdatafun({ ...additionalparams, page: state.page + 1 })}
      className="text-gray-200 p-2 px-3 hover:bg-gray-300/30 rounded-md hover:text-black flex items-center gap-2 mt-3 cursor-pointer"
    >
      Load More
    </button>
  );
};

export default Loadmoredata;
