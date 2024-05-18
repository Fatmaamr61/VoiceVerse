import multer, { diskStorage } from "multer";

const filterObject = {
  image: ["image/png", "image/jpeg", "image/jpg"],
  pdf: ["application/pdf"],
  video: ["video/mp4"],
  audio: ["audio/wav"],
};

function fileFilter(req, file, cb) {
  // Check if the uploaded file's mimetype matches any of the accepted mimetypes for video
  if (filterObject.video.includes(file.mimetype)) {
    // Accept the file if its mimetype matches any of the accepted mimetypes for video
    return cb(null, true);
  }
  if (filterObject.image.includes(file.mimetype)) {
    // Accept the file if its mimetype matches any of the accepted mimetypes for video
    return cb(null, true);
  }
  if (filterObject.audio.includes(file.mimetype)) {
    // Accept the file if its mimetype matches any of the accepted mimetypes for video
    return cb(null, true);
  }

  // Reject the file if its mimetype doesn't match any of the accepted mimetypes for video
  cb(new Error("Invalid file"));
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
