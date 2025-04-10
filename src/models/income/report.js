import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  target: Number,
  totalEarnings: Number,
  totalExpenses: Number,
  balance: Number,
  earnings: [{ amount: Number, platform: String }],
  expenses: [{ amount: Number, type: String }],
  date: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', ReportSchema);

export default Report;
