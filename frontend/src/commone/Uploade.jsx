import axios from 'axios';
import { baseUrl } from '../App';

export const Uploade = async (img) => {
  let imageUrl = null;
  try {
    const formData = new FormData();
    formData.append('image', img); 
    const res = await axios.post(
      `${baseUrl}/api/v1/upload/upload-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    imageUrl = res.data.url; 

    return imageUrl; 
  } catch (err) {
    console.error('Image upload failed:', err);
    return null;
  }
};
