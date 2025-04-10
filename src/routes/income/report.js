import express from 'express';
import axios from 'axios';
import Report from '../../models/income/report.js';


const router = express.Router();


router.post('/generate', async (req, res) => {
  const { date, target = 0 } = req.body;

  try {
    // Use environment variable for base URL
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';

    // Format date properly for queries
    const queryDate = new Date(date).toISOString().split('T')[0];
    
    const [earningsRes, expensesRes] = await Promise.all([
      axios.get(`${baseUrl}/earning?date=${queryDate}`),
      axios.get(`${baseUrl}/expense?date=${queryDate}`)
    ]);

    const earnings = earningsRes.data || [];
    const expenses = expensesRes.data || [];

    // Validate data structure
    if (!Array.isArray(earnings) || !Array.isArray(expenses)) {
      throw new Error('Invalid data structure received from APIs');
    }

    // Process earnings
    const earningsByPlatform = earnings.reduce((acc, { amount, platform }) => {
      if (!platform) return acc;
      acc[platform] = (acc[platform] || 0) + (amount || 0);
      return acc;
    }, {});

    const totalEarnings = Object.values(earningsByPlatform).reduce((sum, amount) => sum + amount, 0);

    // Process expenses
    const expensesByType = expenses.reduce((acc, { amount, type }) => {
      if (!type) return acc;
      acc[type] = (acc[type] || 0) + (amount || 0);
      return acc;
    }, {});

    const totalExpenses = Object.values(expensesByType).reduce((sum, amount) => sum + amount, 0);

    const balance = totalEarnings - totalExpenses;

    // Format for saving
    const formattedEarnings = Object.entries(earningsByPlatform)
      .map(([platform, amount]) => ({ platform, amount }));
      
    const formattedExpenses = Object.entries(expensesByType)
      .map(([type, amount]) => ({ type, amount }));

    const newReport = new Report({
      date: new Date(date),
      target,
      totalEarnings,
      totalExpenses,
      balance,
      earnings: formattedEarnings,
      expenses: formattedExpenses
    });

    await newReport.save();

    res.status(201).json({ 
      message: 'Report generated and saved successfully',
      report: newReport 
    });

  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).json({ 
      error: 'Failed to generate report',
      details: err.message 
    });
  }
});


export default router;
