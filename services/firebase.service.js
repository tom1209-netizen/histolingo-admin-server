import bucket from "../config/firebase.config.js";

export const uploadImageToFirebase = (file) => {
  return new Promise((resolve, reject) => {
    const blob = bucket.file(`countryImage/${Date.now()}_${file.originalname}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (err) => {
      reject(err);
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};