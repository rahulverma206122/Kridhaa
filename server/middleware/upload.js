const multer = require("multer");

// ========================================
// Multer Configuration
// ========================================
// We are using memoryStorage because we need
// the uploaded image as a Buffer.
//
// The image will NOT be permanently saved
// on the server.
//
// This is useful because Gemini can directly
// process the image buffer.
// ========================================

const storage = multer.memoryStorage();

// ========================================
// File Filter
// ========================================
// Only allow image files.
// ========================================

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image files are allowed"),
      false
    );
  }
};

// ========================================
// Multer Upload Configuration
// ========================================

const upload = multer({
  storage: storage,

  fileFilter: fileFilter,

  limits: {
    // Maximum image size = 5 MB
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;