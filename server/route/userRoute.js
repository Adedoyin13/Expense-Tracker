const express = require("express");
const router = express.Router();

const { registerUser, loginUser, logoutUser, getUser, deleteUser, updateUser } = require("../../controller/userController");
const { protectUser } = require("../../middleware/authMiddleWare");

router.post("/register", registerUser);
router.post('/login', loginUser);
router.get('/:userId', protectUser, getUser);
router.patch('/:userId', protectUser, updateUser);
router.delete('/:userId', protectUser, deleteUser);
router.post('/logout', logoutUser);

module.exports = router;