const express = require("express");
const router = express.Router();
const upload = require("../uploadConfig");
const {
  createImage,
  getAllImages,
  getImageById,
  updateImage,
  deleteImage
} = require("../controllers/imageController");

router.post("/", upload.single("image"), createImage);
router.get("/", getAllImages);
router.get("/:id", getImageById);
router.put("/:id", upload.single("image"), updateImage);
router.delete("/:id", deleteImage);

module.exports = router;