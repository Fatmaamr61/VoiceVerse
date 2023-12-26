import fetch from "node-fetch";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getURL = asyncHandler(async (req, res, next) => {
  const { url } = req.body;
  const translator_response = await fetch(
    "http://flask-container:6000/translate",
    {
      method: "POST",
      body: JSON.stringify({
        audio_url: url,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );
  if (!translator_response.ok) {
    // Handle non-successful status code
    console.log("trans:  ", translator_response.json());
    throw new Error(`HTTP error! Status: ${translator_response.status}`);
  }

  const data = await translator_response.json();

  console.log(data);
  return res.json(data);
});