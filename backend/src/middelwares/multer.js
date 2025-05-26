import multer from "multer";

const storage = multer.memoryStorage(); // Store file in memory for direct upload

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, and WEBP are allowed."), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter,
});

export default upload;
