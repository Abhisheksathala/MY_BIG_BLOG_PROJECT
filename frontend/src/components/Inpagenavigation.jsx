import React, { useState, useRef, useEffect } from 'react';

export let btmRef;
export let activetab;
const Inpagenavigation = ({
  routes,
  defaultValue = 0,
  defaultHidden = [],
  children,
}) => {
  btmRef = useRef();
  activetab = useRef();
  const [inpagenavigation, setInpagenavigation] = useState(defaultValue);

  const chnagepagestate = (btn, index) => {
    let { offsetWidth, offsetLeft } = btn;
    btmRef.current.style.width = offsetWidth + 'px';
    btmRef.current.style.left = offsetLeft + 'px';
    setInpagenavigation(index);
  };

  useEffect(() => {
    chnagepagestate(activetab.current, defaultValue);
  }, []);

  return (
    <div>
      <div className="relative mb-8 bg-white border-b border-gray-300 flex flex-wrap overflow-x-auto">
        {routes.map((route, index) => {
          return (
            <div
              key={index}
              className="p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block"
            >
              <button
                ref={index === defaultValue ? activetab : null}
                className={
                  'p-4 px-5 capitalize cursor-pointer ' +
                  (inpagenavigation === index
                    ? 'text-black'
                    : 'text-gray-500 ') +
                  (defaultHidden.includes(route) ? 'md:hidden ' : '')
                }
                onClick={(e) => chnagepagestate(e.target, index)}
              >
                {route}
              </button>
            </div>
          );
        })}
        <hr ref={btmRef} className="absolute bottom-0 duration-500" />
      </div>
      {Array.isArray(children) ? children[inpagenavigation] : children}
    </div>
  );
};

export default Inpagenavigation;
