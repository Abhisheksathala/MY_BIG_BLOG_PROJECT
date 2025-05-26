import React from 'react';
import AnimationWarper from '../commone/AnimationWarper';
import toast from 'react-hot-toast';
import { RxCross1 } from 'react-icons/rx';
import { useContext } from 'react';
import { editorContext } from '../context/Editorcontext';
import Tagcomp from './Tagcomp';
import axios from 'axios';
import { baseUrl } from '../App';
import { UserContext } from '../context/Usercontext';
import { useNavigate } from 'react-router-dom';
const Publishformcomp = () => {
  const charLimit = 200;

  const { blogState, setBlogState, setEditerstore } = useContext(editorContext);
  const { userAuth } = useContext(UserContext);
  const Naviget = useNavigate();

  const handlecloseevent = () => {
    setEditerstore('editor');
  };

  const handlekeydown = (e) => {
    // let input = e.target
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handlekeydowntag = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();
      let tag = e.target.value;
      if (blogState.tags.length < 100) {
        if (!blogState.tags.includes(tag) && tag.length) {
          setBlogState({ ...blogState, tags: [...blogState.tags, tag] });
        } else {
          toast.error('Tag already exist or you reached max tag limit', 100);
        }

        e.target.value = '';
      }
    }
  };

  const publishBlog = async (e) => {
    e.preventDefault();

    if (e.target.classList.contains('disable')) return;

    if (!blogState.title.length) {
      toast.error('Please upload a title');
      return;
    }
    if (!blogState.des.length || blogState.des.length > charLimit) {
      toast.error('Please upload a description and must be less than 200 chars 😊');
      return;
    }
    if (!blogState.tags.length) {
      toast.error('Please upload tags');
      return;
    }

    e.target.classList.add('disable');
    const loadingToast = toast.loading('Publishing blog... 👍');

    try {
      const response = await axios.post(`${baseUrl}/api/v1/blog/create-blog`, blogState, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userAuth.access_token}`,
        },
      });

      const data = response.data;

      if (data?.success) {
        toast.dismiss(loadingToast);
        toast.success('Blog published successfully 🎉');
        e.target.classList.remove('disable');
        setTimeout(() => {
          Naviget('/dashboard/blogs'); // 👇 see point 2
        }, 500);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Something went wrong!');
      toast.dismiss(loadingToast);
      e.target.classList.remove('disable'); // 👈 allow retry
    }
  };

  return (
    <AnimationWarper className="publish-form ">
      <section className="w-full min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-14 overflow-hidden px-4">
        <button
          className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
          onClick={handlecloseevent}
        >
          <RxCross1 />
        </button>

        {/* previe */}
        <div className="max-w-[550px] block mx-auto">
          <p className="text-gray-500 mb-1">Preview</p>
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-400 mt-4">
            <img src={blogState.banner} alt="" className="w-full h-full object-cover" />
          </div>

          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
            {blogState.title.length > 50 ? `${blogState.title.slice(0, 50)}...` : blogState.title}
          </h1>
          <p className="line-clamp-2 text-xl leading-7 mt-4">
            {blogState.des.length > 80 ? (
              <span>{blogState.des.slice(0, 80)}...</span>
            ) : (
              blogState.des
            )}
          </p>
        </div>
        {/* another part */}
        <div className="border-gray-300 lg:border-1 lg:pl-8">
          {/* title */}
          <p className="text-gray-500 mb-2 mt-9">Blog title</p>
          <input
            className="w-full rounded-md p-4 bg-gray-300 pl-12 border border-gray-300 focus:bg-transparent placeholder:text-black"
            type="text"
            placeholder="Blog title"
            value={blogState.title}
            onChange={(e) => setBlogState({ ...blogState, title: e.target.value })}
          />
          {/* des */}
          <p className="text-gray-500 mb-2 mt-9">short dec about your Blog</p>
          <textarea
            maxLength={charLimit}
            className="w-full rounded-md p-4 bg-gray-300 pl-12 border border-gray-300 focus:bg-transparent placeholder:text-black"
            type="text"
            placeholder="Blog title"
            value={blogState.des}
            onChange={(e) => setBlogState({ ...blogState, des: e.target.value })}
            onKeyDown={handlekeydown}
          />
          {/* length */}
          <p className="text-gray-500 mb-2 mt-9 text-sm text-right">
            {charLimit - blogState.des.length} characters left
          </p>
          <p className="text-gray-400 mb-2 mt-9">
            Topics - ( help is searching and ranking your blog post )
          </p>
          <div className="relative w-full rounded-md p-4 bg-gray-200 pl-12 border border-gray-300 focus:bg-transparent placeholder:text-black">
            <input
              type="text"
              placeholder="Topic"
              className="w-full rounded-md p-4 bg-white border border-gray-400 focus:bg-white placeholder:text-black"
              onKeyDown={handlekeydowntag}
            />

            {blogState.tags.map((tag, i) => {
              return <Tagcomp tag={tag} key={i} />;
            })}

            <p className="mt-1 mb-4 text-gray-300 text-right">{100}</p>
          </div>

          <button
            className="whitespace-nowrap bg-black text-white rounded-full mt-3 mb-3 py-3 px-6 text-xl capitaliz cursor-pointer"
            onClick={publishBlog}
          >
            publish
          </button>
        </div>
      </section>
    </AnimationWarper>
  );
};

export default Publishformcomp;
