import express from 'express';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { User } from '../models/user.js';

const router = express.Router();

// Route to fetch the latest 3 notifications
router.get('/notifications', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.id).select('notifications');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const latestNotifications = user.notifications
      .slice(-3)
      .reverse(); // Get the latest 3 notifications

    res.status(200).json({ notifications: latestNotifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Route to add a notification manually (for testing)
router.post('/notifications', isAuthenticated, async (req, res) => {
  try {
    const { message } = req.body;

    await User.updateOne(
      { _id: req.id },
      {
        $push: { notifications: { message, timestamp: new Date() } },
      }
    );

    res.status(200).json({ message: 'Notification added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;
