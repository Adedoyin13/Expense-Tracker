const asyncHandler = require("express-async-handler");
const Expense = require("../model/expenseModel");

// Create and save a new expense
const createExpense = asyncHandler(async (req, res) => {
  try {
    const {title, amount, category, method} = req.body;

    if (!title || !amount || !category || !method) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const expense = await Expense.create({ title, amount, date: new Date(), category, method, user: userId });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Update Expense

const updateExpense = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.expenseId;
    const { title, amount, category, method } = req.body;

    const expense = await Expense.findById(userId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    expense.title = title || expense.title
    expense.amount = amount || expense.amount
    expense.category = category || expense.category
    expense.method = method || expense.method

    const updatedExpense = await expense.save();
    return res.status(200).json(updatedExpense);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getExpense = asyncHandler(async (req, res) => {
  try {
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId);
    if (expense) {
      return res.status(200).json(expense);
    } else {
      return res.status(404).json({ message: "Expense not found!" });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: 'Internal server error'})
}
});

// Get all expenses

const getAllExpenses = asyncHandler(async (req, res) => {
  try {
    const expenses = await Expense.find().populate('user').sort("-createdAt");

    if (!expenses) {
      return res.status(404).json({ message: "Expenses not found" });
    }
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//delete Expenses

const deleteExpenses = asyncHandler(async (req, res) => {
  try {
    const { expenseId } = req.params;
    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    await expense.deleteOne();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
});

module.exports = { createExpense, updateExpense, getAllExpenses, getExpense, deleteExpenses };