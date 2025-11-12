// import { ErrorResponse } from '../utils/errorResponse.js';

const handleUpload = (fieldName, maxCount) => {
  return (req, res, next) => {
    const uploadMiddleware =
      maxCount === 1
        ? upload.single(fieldName)
        : upload.array(fieldName, maxCount);

    uploadMiddleware(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          return next(new ErrorResponse(`File upload error: ${err.message}`, 400));
        }
        return next(new ErrorResponse(err.message, 400));
      }

      if (maxCount === 1 && !req.file) {
        return next(new ErrorResponse(`Please upload a ${fieldName}`, 400));
      }

      if (maxCount > 1 && (!req.files || req.files.length === 0)) {
        return next(new ErrorResponse(`Please upload at least one ${fieldName}`, 400));
      }

      next();
    });
  };
};


export default handleUpload;