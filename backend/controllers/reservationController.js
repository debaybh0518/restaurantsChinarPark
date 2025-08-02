// Reservation controller
const { Reservation, Table } = require('../models');

module.exports = {
  createReservation: async (req, res) => {
    try {
      const { customer_name, customer_phone, table_id, branch_id, status, reserved_at, party_size } = req.body;
      if (!customer_name || !table_id || !branch_id || !party_size) return res.status(400).json({ error: 'Missing fields' });
      const reservation = await Reservation.create({ customer_name, customer_phone, table_id, branch_id, status, reserved_at, party_size });
      // Optionally update table status to Reserved
      const table = await Table.findByPk(table_id);
      if (table) await table.update({ status: 'Reserved' });
      res.json(reservation);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getReservations: async (req, res) => {
    try {
      const reservations = await Reservation.findAll();
      res.json(reservations);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getReservationById: async (req, res) => {
    try {
      const reservation = await Reservation.findByPk(req.params.id);
      if (!reservation) return res.status(404).json({ error: 'Not found' });
      res.json(reservation);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  updateReservation: async (req, res) => {
    try {
      const reservation = await Reservation.findByPk(req.params.id);
      if (!reservation) return res.status(404).json({ error: 'Not found' });
      await reservation.update(req.body);
      res.json(reservation);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  deleteReservation: async (req, res) => {
    try {
      const reservation = await Reservation.findByPk(req.params.id);
      if (!reservation) return res.status(404).json({ error: 'Not found' });
      await reservation.destroy();
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
