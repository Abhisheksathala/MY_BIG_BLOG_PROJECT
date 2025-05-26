import React from 'react';

const Blogstats = ({ stats }) => {
  return (
    <div className="flex gap-2 mb-6 pb-6 border-gray-200 border-b max-lg:border-b">
      {Object.keys(stats).map((key, i) => {
        // Only render if key includes 'parent'
        if (!key.includes('parent')) {
          return (
            <div
              key={i}
              className={
                'flex flex-col gap-1 items-center w-full h-full justify-center p-4 px-6' +
                (i === 0 ? ' bg-gray-50 border-l' : '')
              }
            >
              <h1 className="text-xl lg:text-2xl mb-2">{Number(stats[key]).toLocaleString()}</h1>
              <p className="max-lg:text-gray-400 capitalize">{key.split('_')[1] || key}</p>
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};

export default Blogstats;
