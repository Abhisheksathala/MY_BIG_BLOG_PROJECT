import { createContext, useState } from 'react';
import { useParams } from 'react-router-dom';

export const editorContext = createContext();

const EditorProvider = ({ children }) => {
  const blogstructure = {
    title: '',
    banner: '',
    content: [],
    tags: [],
    des: '',
    author: { personal_info: {} },
  };

  const [editorState, setEditorState] = useState('');
  const [blogState, setBlogState] = useState(blogstructure);
  const [editorstore, setEditerstore] = useState('editor');
  const [textediterstate, setTextediterstate] = useState({
    isReady: false,
  });
  // get from backend
  const [getBlogState, setGetBlogState] = useState(null);
  const [treandingBlogstate, setTrendingBlogstate] = useState([]);

  // edit

  const [loadingstate, setLoadingstate] = useState(true);

  const editorcontextvalues = {
    editorState,
    setEditorState,
    blogState,
    setBlogState,
    editorstore,
    setEditerstore,
    textediterstate,
    setTextediterstate,
    getBlogState,
    setGetBlogState,
    treandingBlogstate,
    setTrendingBlogstate,

    loadingstate,
    setLoadingstate,
  };

  return <editorContext.Provider value={editorcontextvalues}>{children}</editorContext.Provider>;
};

export default EditorProvider;
