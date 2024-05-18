import multer, { diskStorage } from "multer";

const filterObject = {
  image: ["image/png", "image/jpeg", "image/jpg"],
  pdf: ["application/pdf"],
  video: ["video/mp4"],
  audio: ["audio/wav"],
};

// File filter function
function fileFilter(req, file, cb) {
  console.log("sent file:  ", file);
  // Check if the uploaded file's mimetype matches any of the accepted mimetypes
  if (
    filterObject.video.includes(file.mimetype) ||
    filterObject.image.includes(file.mimetype) ||
    filterObject.audio.includes(file.mimetype)
  ) {
    return cb(null, true); // Accept the file
  }
  // Reject the file if its mimetype doesn't match any of the accepted mimetypes
  cb(new Error("Invalid file type"));
}

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter, // Set the file filter function
});
