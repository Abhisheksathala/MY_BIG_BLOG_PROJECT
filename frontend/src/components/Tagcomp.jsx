import React, { useState, useEffect, useContext } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { editorContext } from '../context/Editorcontext';
const Tagcomp = ({ tag }) => {
  let { blogState, setBlogState } = useContext(editorContext);

  const handleDelete = () => {
    const tagRe = (blogState.tags = blogState.tags.filter((t) => t !== tag));
    setBlogState({ ...blogState, tags: tagRe });
  };

  return (
    <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block">
      <p className="outline-none" contentEditable="true">
        {tag}
      </p>
      <button
        onClick={handleDelete}
        className="mt-[2px] text-sm rounded-full absolute right-1 top-1/2 -translate-y-1/2  "
      >
        <RxCross1 className="text-sm pointer-events-none cursor-pointer " />
      </button>
    </div>
  );
};

export default Tagcomp;
