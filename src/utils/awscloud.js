import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // ES Modules import
import dotenv from "dotenv";

dotenv.config();

export const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
});



const uploadFile = async () => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: "imagefile.png",
    Body: "../../icons8-play-90.png",
  };
  const command = new PutObjectCommand(params);

  try {
    await s3.send(command);
    console.log("File uploaded successfully.");
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

// Call the async function to upload the file
uploadFile().catch(console.error);
