import multer from "multer";
import path from "path";

// Optional: configure storage if saving locally
const storage = multer.memoryStorage();

const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
	fileFilter: (req, file, cb) => {
		const fileTypes = /jpeg|jpg|png|webp/;
		const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
		const mimetype = fileTypes.test(file.mimetype);

		if (extname && mimetype) {
			return cb(null, true);
		} else {
			cb(new Error("Only image files are allowed"));
		}
	},
});

export default upload;
