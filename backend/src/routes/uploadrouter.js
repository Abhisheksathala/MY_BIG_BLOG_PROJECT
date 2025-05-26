import upload from '../middelwares/multer.js';
import express from 'express';
import { cloudinary } from '../cloudinary/cloudinary.js';

const uploadrouter = express.Router();

uploadrouter.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        // folder: 'your-folder-name',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Error:', error);
          return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ url: result.secure_url });
      },
    );

    stream.end(req.file.buffer);
  } catch (err) {
    console.error('Upload Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

export default uploadrouter;
