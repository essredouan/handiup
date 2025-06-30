import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// ⛔️ __dirname ما خداماش فـ ES Modules → خاصنا نرجعوها هكذا:
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ photo storage
const photoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    if (file) {
      const filename =
        new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname;
      cb(null, filename);
    } else {
      cb(null, false);
    }
  },
});

// ✅ photo upload middleware
const photoUpload = multer({
  storage: photoStorage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb({ message: "unsupported file format" }, false);
    }
  },
  limits: { fileSize: 1024 * 1024 * 2 }, // 2MB
});

export default photoUpload;
