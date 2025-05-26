import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import {BrowserRouter} from 'react-router-dom';
import UserContextProvider from './context/Usercontext';
import EditorProvider from './context/Editorcontext';
import BlogProvider from "./context/Blogcontext.jsx";

createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <BlogProvider>
        <EditorProvider>
            <UserContextProvider>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </UserContextProvider>
        </EditorProvider>
    </BlogProvider>

    // </StrictMode>,
);
