const express = require("express");
const router = express.Router();
const { createExpense, getExpense, updateExpense, getAllExpenses, deleteExpenses } = require("../../controller/expenseController");
const { protectUser } = require("../../middleware/authMiddleWare");

router.post("/createExpense", protectUser, createExpense);
router.get("/", protectUser, getAllExpenses);
router.get("/:expenseId", protectUser, getExpense);
router.patch("/:expenseId", protectUser, updateExpense);
router.delete("/:expenseId", protectUser, deleteExpenses);

module.exports = router;