import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.resolve(__dirname, '../public/temp');
     // console.log(`Saving file to directory: ${dir}`);
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      //console.log(`Uploading file: ${file.originalname}`);
      cb(null, file.originalname);
    },
  });
  

export const upload = multer({
  storage,
});
