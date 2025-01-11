const asyncHandler = require("express-async-handler");
const Expense = require("../model/expenseModel");

// Create and save a new expense
const createExpense = asyncHandler(async (req, res) => {
  try {
    const { title, amount, category, method } = req.body;

    if (!title || !amount || !category || !method) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const expense = await Expense.create({ 
      title, 
      amount, 
      date: new Date(), 
      category, 
      method, 
      user: req.userId // Get user ID from auth middleware
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Update Expense
const updateExpense = asyncHandler(async (req, res) => {
  try {
    const expenseId = req.params.expenseId;
    const { title, amount, category, method } = req.body;

    const expense = await Expense.findOne({ 
      _id: expenseId,
      user: req.userId // Only find expense belonging to current user
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }

    expense.title = title || expense.title;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.method = method || expense.method;

    const updatedExpense = await expense.save();
    return res.status(200).json(updatedExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get single expense
const getExpense = asyncHandler(async (req, res) => {
  try {
    const { expenseId } = req.params;

    const expense = await Expense.findOne({
      _id: expenseId,
      user: req.userId // Only find expense belonging to current user
    });

    if (expense) {
      return res.status(200).json(expense);
    } else {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all expenses for current user
const getAllExpenses = asyncHandler(async (req, res) => {
  try {
    const expenses = await Expense.find({ 
      user: req.userId // Only find expenses belonging to current user
    })
    .sort("-createdAt");

    if (!expenses) {
      return res.status(404).json({ message: "No expenses found" });
    }
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete expense
const deleteExpenses = asyncHandler(async (req, res) => {
  try {
    const { expenseId } = req.params;
    
    const expense = await Expense.findOne({
      _id: expenseId,
      user: req.userId // Only find and delete expense belonging to current user
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }

    await expense.deleteOne();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
});

module.exports = { createExpense, updateExpense, getAllExpenses, getExpense, deleteExpenses };