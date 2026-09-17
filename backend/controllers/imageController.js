const Image = require("../models/Image");
const cloudinary = require("../config/cloudinary");

// Helper function to upload image buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "image-crud",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });
};

// ==============================
// Create Image
// ==============================
exports.createImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an image file.",
      });
    }

    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title is required.",
      });
    }

    // Upload image to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    // Save image information in MongoDB
    const newImage = new Image({
      title: title.trim(),
      description: description?.trim() || "",
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });

    const savedImage = await newImage.save();

    res.status(201).json(savedImage);
  } catch (error) {
    res.status(500).json({
      message: "Error creating image",
      error: error.message,
    });
  }
};

// ==============================
// Get All Images
// ==============================
exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });

    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching images",
      error: error.message,
    });
  }
};

// ==============================
// Get Image By ID
// ==============================
exports.getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching image",
      error: error.message,
    });
  }
};

// ==============================
// Update Image
// ==============================
exports.updateImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    const { title, description } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: "Title is required.",
        });
      }
      image.title = title.trim();
    }

    if (description !== undefined) {
      image.description = description.trim();
    }

    // If a new image was uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (image.publicId) {
        await cloudinary.uploader.destroy(image.publicId);
      }

      // Upload new image to Cloudinary
      const result = await uploadToCloudinary(req.file.buffer);

      // Update Cloudinary information
      image.imageUrl = result.secure_url;
      image.publicId = result.public_id;
    }

    const updatedImage = await image.save();

    res.status(200).json(updatedImage);
  } catch (error) {
    res.status(500).json({
      message: "Error updating image",
      error: error.message,
    });
  }
};

// ==============================
// Delete Image
// ==============================
exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    // Delete image from Cloudinary
    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    // Delete image record from MongoDB
    await Image.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting image",
      error: error.message,
    });
  }
};
