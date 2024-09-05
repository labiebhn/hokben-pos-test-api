const multerLib = require("multer");
const path = require("path");
const fs = require("fs");

const { SUPPORTED_MIMETYPE_IMAGE } = require("../config/mimeType");

exports.setResponse = (code, message, data) => {
  const SUCCESS_STATUS = [200, 201, 202, 203, 204, 205, 206, 207, 208, 226];
  let payload = {};
  payload.meta = {
    code,
    message,
    success: SUCCESS_STATUS.includes(code),
  };
  payload.data = data || {};
  return payload;
};

/**
 * Creates a multer configuration object for handling file uploads.
 *
 * @param {string} folderName - The public folder name where uploaded files will be saved. ex: product.
 * @returns {multer.Multer} - A multer instance with the specified storage and file filter configurations.
 */
exports.multer = (folderName) => {
  // storage image - multer
  const fileStorage = multerLib.diskStorage({
    destination: (req, file, callback) => {
      callback(null, `public/${folderName}`);
    },
    filename: (req, file, callback) => {
      callback(null, new Date().getTime() + "-" + file.originalname);
    },
  });
  // filter type of files - multer
  const fileFilter = (req, file, callback) => {
    if (SUPPORTED_MIMETYPE_IMAGE.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  };

  return multerLib({ storage: fileStorage, fileFilter: fileFilter });
};

exports.removeImage = (filePath) => {
  if (!filePath) return;
  filePath = path.join(__dirname, "../", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
