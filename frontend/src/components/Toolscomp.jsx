import Embed from '@editorjs/embed';
import List from '@editorjs/list';
import LinkTool from '@editorjs/link'; // renamed to avoid conflicts
import ImageTool from '@editorjs/image';
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import { Uploade } from '../commone/Uploade';
// import Paragraph from '@editorjs/paragraph';

const uploadimageByUrl = (e) => {
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e);
    } catch (error) {
      reject(error);
    }
  });

  return link.then((url) => {
    return {
      success: 1,
      file: { url },
    };
  });
};

const uploadImageByFile = async (file) => {
  const url = await Uploade(file);

  if (url) {
    return {
      success: 1,
      file: { url },
    };
  } else {
    throw new Error('Image upload failed');
  }
};

export const Toolscomp = {
  embed: Embed,
  list: { class: List, inlineToolbar: true },
  link: LinkTool,
  image: {
    class: ImageTool,
    config: {
      uploader: {
        uploadByUrl: uploadimageByUrl,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  header: {
    class: Header,
    config: {
      levels: [1, 2, 3, 4, 5, 6],
      defaultLevel: 1,
    },
  },
  quote: { class: Quote, inlineToolbar: true },
  marker: Marker,
  inlineCode: InlineCode,
};
