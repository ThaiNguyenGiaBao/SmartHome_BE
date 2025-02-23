// configs/multerConfig.ts
import multer from "multer";

// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Use memory storage to hold files in memory
const upload = multer({ storage }); // Create the multer instance with storage options

export default upload;
