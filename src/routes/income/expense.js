import express from 'express';
import Expense from '../../models/income/expense.js';

const router = express.Router();

// POST endpoint
router.post('/', async (req, res) => {
  try {
    const { amount, type } = req.body;  // Changed from expense to amount
    const data = new Expense({ amount, type });
    await data.save();
    res.status(201).json({ message: 'Expense saved!', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const query = {};

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);

      query.date = {
        $gte: start,
        $lt: end
      };
    }

    const expenses = await Expense.find(query);
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



export default router;