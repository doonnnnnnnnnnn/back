import express from 'express';
import Earning from '../../models/income/earnings.js';

const router = express.Router();

// router.post('/', async (req, res) => {
//   try {
//     const {earning ,platform}= new Earning(req.body);
//     const data={earning,platform}
//     await data.save();
//     res.status(201).json({ message: 'Earning saved!' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.post('/', async (req, res) => {
  try {
    const { amount, platform } = req.body;  // Changed from earning to amount to match schema
    const data = new Earning({ amount, platform });  // Create new Earning with the data
    await data.save();
    res.status(201).json({ message: 'Earning saved!', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;

    let query = {};

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1); // Next day

      query.date = {
        $gte: start,
        $lt: end
      };
    }

    const earning = await Earning.find(query);
    res.json(earning);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;
