import multer, { diskStorage } from "multer";

/* export const filterObject = {
  image: ["image/png", "image/jpg"],
  pdf: ["application/pdf"],
  video: ["video/mp4"],
};
 */
/*export const fileUpload = (filterArray) => {
  const fileFilter = (req, file, cb) => {
    if (!filterArray.includes(file.mimetype)) {
      return cb(new Error("invalid file formate!"), false);
    }
    return cb(null, true);
  };
  //return multer({ storage: diskStorage({}), fileFilter });
    return multer({ storage: diskStorage({}), fileFilter }).single(
      "image"
    );

}; */
/* function fileFilter(req, file, cb) {
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted

  // To reject this file pass `false`, like so:
  cb(null, false);

  // To accept the file pass `true`, like so:
  cb(null, true);

  // You can always pass an error if something goes wrong:
  cb(new Error("I don't have a clue!"));
}

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const fileUpload = multer({ storage: storage });
 */

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

export const fileUpload = multer({
  storage: storage,
  fileFilter: fileFilter, // Set the file filter function
});


