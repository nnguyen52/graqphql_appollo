import cloudinary from 'cloudinary';

// A simple function to upload to Cloudinary
export const uploadFile = async (file) => {
  if (!file) return null;
  //   The Upload scalar return a a promise
  const { createReadStream } = await file;
  const fileStream = createReadStream();
  //   Initiate Cloudinary with your credentials
  cloudinary.v2.config({
    upload_preset: 'Reddis',
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
  //   Return the Cloudinary object when it's all good
  return new Promise((resolve, reject) => {
    const cloudStream = cloudinary.v2.uploader.upload_stream(
      { folder: 'Reddis' },
      function (err, fileUploaded) {
        // In case something hit the fan
        if (err) {
          reject(err);
        }
        // All good :smile:
        resolve(fileUploaded);
      }
    );
    fileStream.pipe(cloudStream);
  });
  //   cloudinary.config({
  //     cloud_name: process.env.CLOUDINARY_NAME,
  //     api_key: process.env.CLOUDINARY_APIKEY,
  //     api_secret: process.env.CLOUDINARY_SECRET,
  //   });
  //   const photo = await cloudinary.uploader.upload(fileToBeUpload, { folder: 'Reddis' });
  //   return photo;
};
