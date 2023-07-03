// Import relevant modules
const moment = require('moment');

// ...

// Create new endpoint
router.get('/daily-analytics', async (req, res, next) => {
  try {
    // Get the current date and the date 24 hours ago
    const now = new Date();
    const oneDayAgo = moment(now).subtract(1, 'days').toDate();

    // Get users who have logged in within the last day
    const recentUsers = await User.find({ lastLogin: { $gte: oneDayAgo } });

    // Get the total tokens paid to OpenAI and used within the last day
    const tokenAnalytics = await TokenAnalytics.find({ date: { $gte: oneDayAgo } });

    // Sum up the tokens
    const totalPaidTokens = tokenAnalytics.reduce((sum, record) => sum + record.paidTokens, 0);
    const totalUsedTokens = tokenAnalytics.reduce((sum, record) => sum + record.usedTokens, 0);

    // Return the data
    res.json({
      recentUsers,
      totalPaidTokens,
      totalUsedTokens,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
