import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AnimationWarper from '../commone/AnimationWarper';
import logo from '../assets/logo.png';
import bannerlogo from '../assets/blog banner.png';
import toast from 'react-hot-toast';
import { editorContext } from '../context/Editorcontext';
import EditorJS from '@editorjs/editorjs';
import { Toolscomp } from './Toolscomp';
import { Uploade } from '../commone/Uploade';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../App';
import { UserContext } from '../context/Usercontext';

const BlogeditorComp = () => {
  const [Imagebanner, setImageBanner] = useState(null);

  const { blogState, setBlogState, setEditerstore, textediterstate, setTextediterstate } =
    useContext(editorContext);
  const { userAuth } = useContext(UserContext);

  console.log('==', blogState, '==');

  const Naviget = useNavigate();

  // useeffect
  // Array.isArray(blogState.content) ? blogState.content[0] : blogState.content
  useEffect(() => {
    setTextediterstate(
      new EditorJS({
        holder: 'texteditor',
        data: Array.isArray(blogState.content) ? blogState.content[0] : blogState.content,
        tools: Toolscomp,
        placeholder: 'Start writing an awesome story...',
      }),
    );
  }, []);

  const handlebannerUpload = (file) => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size is too large');
    }

    if (file) {
      Uploade(file).then((url) => {
        if (url) {
          toast.success('File uploaded successfully 🎉');
          setImageBanner(url);
          setBlogState({ ...blogState, banner: url });
        } else {
          toast.error('Upload failed.');
        }
      });
    }

    toast.success('File uploaded successfully 🎉');
    console.log(file);
  };

  const handleonKey = (keydown) => {
    // console.log(keydown);
    if (keydown.keyCode === 13) {
      keydown.preventDefault();
      console.log('Enter key pressed');
    }
  };

  const handletitleChange = (e) => {
    let input = e.target;
    input.style.height = 'auto';
    input.style.height = `${input.scrollHeight}px`;
    setBlogState({ ...blogState, title: e.target.value });
  };

  const handlePublish = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!blogState.title) {
      toast.error('Please upload a title ');
      return;
    }
    if (!blogState.banner) {
      toast.error('Please upload a banner image');
      return;
    }

    if (textediterstate?.isReady) {
      textediterstate
        .save()
        .then((data) => {
          if (data.blocks && data.blocks.length) {
            console.log('Saved Editor Data:', data);

            const updatedBlog = {
              ...blogState,
              content: data.blocks,
            };
            setBlogState(updatedBlog);
            //console log the updated data
            console.log('updatedBlog', updatedBlog);

            toast.success('Blog published successfully 🎉');
            setEditerstore('publish');
          }
        })
        .catch((err) => {
          console.error('Error while saving text editor data:', err);
          toast.error('Error while saving text editor data');
        });
    } else {
      toast.error('Editor is not ready yet!');
    }
  };

  const handleDraft = async (e) => {
    e.preventDefault();
    // setEditerstore('draft');
    if (e.target.classList.contains('disable')) return;

    if (!blogState.title.length) {
      toast.error('Please upload a title');
      return;
    }
    // if (!blogState.des.length || blogState.des.length > charLimit) {
    //   toast.error(
    //     'Please upload a description and must be less than 200 chars 😊',
    //   );
    //   return;
    // }
    // if (!blogState.tags.length) {
    //   toast.error('Please upload tags');
    //   return;
    // }

    e.target.classList.add('disable');
    const loadingToast = toast.loading('saving draft blog... 👍');

    const obj = {
      title: blogState.title,
      banner: blogState.banner,
      des: blogState.des,
      content: blogState.content,
      tags: blogState.tags,
      draft: (blogState.draft = true),
    };

    try {
      const response = await axios.post(`${baseUrl}/api/v1/blog/create-blog`, obj, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userAuth.access_token}`,
        },
      });

      const data = response?.data || {};

      if (data?.success) {
        toast.dismiss(loadingToast);
        toast.success('saved as draft 🎉');
        e.target.classList.remove('disable');
        setTimeout(() => {
          Naviget('/dashboard/blogs?tab=draft');
        }, 500);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Something went wrong!');
      toast.dismiss(loadingToast);
      e.target.classList.remove('disable');
    }
  };

  return (
    <>
      <nav className="z-10 sticky flex items-center gap-12 w-full px-[5vw] py-5 h-[80px] border-b border-gray-300 bg-white justify-between">
        <Link to={'/'}>
          <img src={logo} alt="Logo" className="flex-none w-10" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full font-semibold">
          {blogState && blogState.title ? (
            <span>
              {blogState.title.length > 25 ? blogState.title.slice(0, 25) + '...' : blogState.title}
            </span>
          ) : (
            <span>untitled</span>
          )}
        </p>
        <div className="flex gap-4 ml-auto">
          <button
            className="py-1 px-6 text-base bg-black text-white rounded-full cursor-pointer hover:bg-gray-800"
            aria-label="Publish Blog"
            onClick={handlePublish}
          >
            Publish
          </button>
          <button
            className="flex items-center py-2 px-6 text-base bg-black text-white rounded-full cursor-pointer hover:bg-gray-800"
            aria-label="Save Draft"
            onClick={handleDraft}
          >
            Save Draft
          </button>
        </div>
      </nav>
      <AnimationWarper className="">
        <section className="p-2">
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-85 bg-white border border-gray-300 rounded-lg">
              <label htmlFor="uploadBanner">
                {blogState.banner ? (
                  <img
                    src={blogState.banner}
                    alt="bannerimage"
                    className=" w-full h-full object-cover rounded-lg
                    cursor-pointer hover:scale-101 transition-all duration-200"
                  />
                ) : (
                  <img src={bannerlogo} alt="bannerimage" />
                )}
                <input
                  type="file"
                  id="uploadBanner"
                  accept="image/*"
                  hidden
                  onChange={(file) => {
                    handlebannerUpload(file.target.files[0]);
                  }}
                />
              </label>
            </div>

            <textarea
              value={blogState.title}
              onKeyDown={handleonKey}
              onChange={handletitleChange}
              placeholder={'Blog Title'}
              className="text-4xl font-medium w-full h-20 py-5 outline-none resize-none placeholder:opacity-40 placeholder:text-black"
              name="title"
              id="title"
            ></textarea>
            <hr className="w-full opacity-10 my-5 " />

            <div id="texteditor" className=""></div>
          </div>
        </section>
      </AnimationWarper>
    </>
  );
};

export default BlogeditorComp;
