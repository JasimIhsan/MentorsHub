import multer from "multer";

// Store files in memory
const storage = multer.memoryStorage();

export const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
	fileFilter: (req, file, cb) => {
		// ✅ Allow all file types
		cb(null, true);
	},
});
