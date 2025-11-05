import { ErrorResponse } from '../utils/errorResponse.js';

const handleUpload = (fieldName, maxCount) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.array(fieldName, maxCount);
    
    uploadMiddleware(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          return next(new ErrorResponse(`File upload error: ${err.message}`, 400));
        }
        return next(new ErrorResponse(err.message, 400));
      }
      
      if (!req.files || req.files.length === 0) {
        return next(new ErrorResponse(`Please upload at least one ${fieldName}`, 400));
      }
      
      next();
    });
  };
};

export default handleUpload;