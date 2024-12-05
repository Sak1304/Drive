const multer = require('multer');
const path = require('path');

// Configure multer storage and file filtering
console.log("Config started")
const multerConfig = {
  // Memory storage to work with Supabase upload
  storage: multer.memoryStorage(),
  
  // File filter to validate file uploads
  fileFilter: (req, file, cb) => {
    // Define allowed file types
    const allowedFileTypes = [
      'image/jpeg', 
      'image/png', 
      'image/gif', 
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    // Check file type
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.log("error throw at multer allowed file check")
      cb(new Error('Invalid file type. Only images, PDFs, and Word documents are allowed.'), false);
    }
  },

  // Limit file size (5MB in this example)
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
};

// Create multer upload middleware
const upload = multer(multerConfig);

// Optional: Custom error handler for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    return res.status(400).json({
      error: 'File upload error',
      message: err.message
    });
  } else if (err) {
    // An unknown error occurred when uploading.
    return res.status(500).json({
      error: 'Upload failed',
      message: err.message
    });
  }
  next();
};

module.exports = {
  upload,
  handleMulterError
};