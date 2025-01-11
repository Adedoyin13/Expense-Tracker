const express = require("express");
const router = express.Router();
const multer = require("multer");

// Configure Multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() });
const { registerUser,uploadProfilePicture, loginUser, logoutUser, getUser, deleteUser, updateUser } = require("../controller/userController");
const { protectUser } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post('/login', loginUser);
router.post('/upload-profile-picture/:userId', upload.single('profilePicture'),uploadProfilePicture);
router.get('/:userId', protectUser, getUser);
router.patch('/:userId', protectUser, updateUser);
router.delete('/:userId', protectUser, deleteUser);
router.post('/logout', logoutUser);

module.exports = router;