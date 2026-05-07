const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// #region agent log
const UP_DBG = path.join(__dirname, '..', '..', '.cursor', 'debug-39af4b.log');
function upDebug(payload) {
  try {
    fs.appendFileSync(
      UP_DBG,
      `${JSON.stringify({ sessionId: '39af4b', runId: 'pre', timestamp: Date.now(), ...payload })}\n`
    );
  } catch (_) {}
}
// #endregion

// ── Cloudinary (used in production when env vars are present) ─────────────────
const useCloudinary =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

let cloudinary;
if (useCloudinary) {
  cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// ── Multer storage ─────────────────────────────────────────────────────────────
// When Cloudinary is active we only need the file in memory; otherwise save to disk.
const storage = useCloudinary
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
      },
    });

const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
  // #region agent log
  upDebug({
    hypothesisId: 'H4',
    location: 'upload.js:post_entry',
    message: 'upload_handler',
    data: { hasFile: !!req.file, size: req.file?.size, mime: req.file?.mimetype },
  });
  // #endregion
  if (!req.file) return res.status(400).send('No file uploaded.');

  try {
    if (useCloudinary) {
      // Upload buffer directly to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'eppl-inventory', resource_type: 'image' },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(req.file.buffer);
      });
      // #region agent log
      upDebug({
        hypothesisId: 'H4',
        location: 'upload.js:cloudinary_ok',
        message: 'upload_done',
        data: { ok: true, hasUrl: !!result.secure_url },
      });
      // #endregion
      return res.status(200).json({ filePath: result.secure_url });
    }

    // Local disk fallback
    // #region agent log
    upDebug({
      hypothesisId: 'H4',
      location: 'upload.js:local_ok',
      message: 'upload_done',
      data: { filePath: `/uploads/${req.file.filename}` },
    });
    // #endregion
    res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
  } catch (err) {
    console.error('Upload error:', err);
    // #region agent log
    upDebug({
      hypothesisId: 'H4',
      location: 'upload.js:catch',
      message: 'upload_error',
      data: { err: String(err?.message || err) },
    });
    // #endregion
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
