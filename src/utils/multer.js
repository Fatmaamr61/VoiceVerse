import multer, { diskStorage } from "multer";

const filterObject = {
  image: ["image/png", "image/jpeg"],
  pdf: ["application/pdf"],
  video: ["video/mp4"],
};

function fileFilter(req, file, cb) {
  // Check if the uploaded file's mimetype matches any of the accepted mimetypes for each type
  for (const type in filterObject) {
    if (filterObject[type].includes(file.mimetype)) {
      // Accept the file if its mimetype matches any of the accepted mimetypes
      return cb(null, true);
    }
  }
  // Reject the file if its mimetype doesn't match any of the accepted mimetypes
  cb(new Error("invalid formate"), false);
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



/* const storage = multer.memoryStorage();
export const upload = multer({ storage: storage }); */
