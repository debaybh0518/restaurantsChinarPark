const { Notification, User } = require('../models');
const { sendEmail, sendSMS } = require('../utils/notification');

module.exports = {
  sendEmail: async (req, res) => {
    try {
      const { user_id, message } = req.body;
      const user = await User.findByPk(user_id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      await sendEmail(user.email, 'Notification', message);
      const notification = await Notification.create({ user_id, type: 'email', message, status: 'sent', sent_at: new Date() });
      res.json(notification);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  sendSMS: async (req, res) => {
    try {
      const { user_id, message } = req.body;
      const user = await User.findByPk(user_id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      await sendSMS(user.phone, message);
      const notification = await Notification.create({ user_id, type: 'sms', message, status: 'sent', sent_at: new Date() });
      res.json(notification);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getNotifications: async (req, res) => {
    try {
      const notifications = await Notification.findAll({ include: [User] });
      res.json(notifications);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};