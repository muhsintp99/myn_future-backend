const multer = require('multer');
const path = require('path');
const fs = require('fs');

function createUpload(folderName) {
    // 👇 Go to root-level public folder
    const uploadPath = path.join(__dirname, '../../public', folderName);

    // Ensure the directory exists
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadPath),
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
            const uniqueName = `${Date.now()}_${base}${ext}`;
            cb(null, uniqueName);
        }
    });

    const fileFilter = (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const isValidMime = allowedTypes.test(file.mimetype);
        const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());

        if (isValidMime && isValidExt) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)!'), false);
        }
    };

    return multer({
        storage,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
        fileFilter
    }).single('image');
}

module.exports = createUpload;
