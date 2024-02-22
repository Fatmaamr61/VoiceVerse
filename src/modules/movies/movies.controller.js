import { Movies } from "../../../db/models/movies.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { nanoid } from "nanoid";
// add movie
export const newMovie = asyncHandler(async (req, res, next) => {
  // unique cloud folder name
  const cloudFolder = nanoid();
  let images = [];

  // upload image
  for (const file of req.files.subImages) {
    console.log(secure_url, public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.FOLDER_CLOUD_NAME}/product/${cloudFolder}` }
    );
    images.push({ id: public_id, url: secure_url });
  }

  // add movie
  const { movieName, movieRating, year, cast, trailer, tags } = req.body;

  const movie = await Movies.create({
    movieName,
    movieRating,
    year,
    cast,
    trailer,
    tags,
  });
  return res.json({
    success: true,
    message: "movie added successfully",
    results: movie,
  });
});
