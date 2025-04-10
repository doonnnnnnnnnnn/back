import express from "express";
import cors from "cors";
import connectToMongoDB from "./src/models/mongodb.js";

import earningRoutes from './src/routes/income/earning.js';
import expenseRoutes from './src/routes/income/expense.js';
import reportRoutes from './src/routes/income/report.js';

const app = express(); // ✅ Must come before any use of `app`

// Connect to MongoDB
connectToMongoDB();

// Middleware
app.use(express.json());
app.use(cors());


// Routes
app.use('/earning', earningRoutes);
app.use('/expense', expenseRoutes);
app.use('/report', reportRoutes);

// Start server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
