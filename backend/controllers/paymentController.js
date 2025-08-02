const { Payment, Order } = require('../models');
const { initiatePayment, confirmPayment } = require('../utils/billdesk');

module.exports = {
  initiatePayment: async (req, res) => {
    try {
      const { order_id, method, amount } = req.body;
      if (!order_id || !method || !amount) return res.status(400).json({ error: 'Missing fields' });
      // Call BillDesk API stub
      const billdeskResult = await initiatePayment({ order_id, method, amount });
      const payment = await Payment.create({ order_id, method, amount, status: 'initiated', billdesk_txn_id: billdeskResult?.txn_id });
      res.json(payment);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  confirmPayment: async (req, res) => {
    try {
      const { billdesk_txn_id } = req.body;
      if (!billdesk_txn_id) return res.status(400).json({ error: 'Missing billdesk_txn_id' });
      // Call BillDesk API stub
      const result = await confirmPayment(billdesk_txn_id);
      const payment = await Payment.findOne({ where: { billdesk_txn_id } });
      if (!payment) return res.status(404).json({ error: 'Not found' });
      await payment.update({ status: result.status });
      res.json(payment);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getPayments: async (req, res) => {
    try {
      const payments = await Payment.findAll({ include: [Order] });
      res.json(payments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};