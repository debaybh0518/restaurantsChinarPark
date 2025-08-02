import { useEffect, useState } from 'react';
import TableService from '../services/TableService';
import api from '../services/api';

const STATUS_COLORS = {
  Available: 'bg-green-200 border-green-600',
  Reserved: 'bg-gray-300 border-gray-400',
  Occupied: 'bg-red-200 border-red-600',
  Cleaning: 'bg-blue-200 border-blue-600',
  Partial: 'bg-yellow-200 border-yellow-600',
};

export default function TableLayout() {
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [showReservation, setShowReservation] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [reservationName, setReservationName] = useState('');
  const [partySize, setPartySize] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    TableService.getAll().then(res => setTables(res.data));
    api.get('/reservations').then(res => setReservations(res.data));
  }, []);

  // Add Table form state
  const [form, setForm] = useState({ name: '', capacity: '', status: 'Available', branch_id: 1 });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await TableService.create({
        name: form.name,
        capacity: Number(form.capacity),
        status: form.status,
        branch_id: form.branch_id || 1
      });
      setForm({ name: '', capacity: '', status: 'Available', branch_id: 1 });
      const res = await TableService.getAll();
      setTables(res.data);
    } catch (err) {
      setMessage('Failed to add table. Please check your input and try again.');
    }
  };

  // Reservation logic (dummy, replace with API call as needed)
  const handleReserve = (table) => {
    setSelectedTable(table);
    setShowReservation(true);
    setMessage('');
  };
  const handleReservationSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/reservations', {
        customer_name: reservationName,
        table_id: selectedTable.id || selectedTable.table_id,
        branch_id: selectedTable.branch_id,
        party_size: Number(partySize),
        status: 'Reserved',
        reserved_at: new Date().toISOString(),
      });
      setMessage(`Reserved table ${selectedTable.name} for ${reservationName} (party of ${partySize})`);
      setShowReservation(false);
      setReservationName('');
      setPartySize('');
      // Refresh tables to update status
      const res = await TableService.getAll();
      setTables(res.data);
    } catch (err) {
      setMessage('Failed to reserve table. Please try again.');
    }
  };

  // Canvas/grid size
  const gridSize = 40;
  const maxX = Math.max(...tables.map(t => t.layout_x || 0), 10);
  const maxY = Math.max(...tables.map(t => t.layout_y || 0), 10);

  // Calculate grid positions to avoid overlap
  const positions = {};
  let nextX = 1, nextY = 1;
  tables.forEach((t, i) => {
    if (!t.layout_x && !t.layout_y) {
      positions[t.id || t.table_id] = { x: nextX, y: nextY };
      nextX += 3;
      if (nextX > 12) { nextX = 1; nextY += 3; }
    } else {
      positions[t.id || t.table_id] = { x: t.layout_x || 1, y: t.layout_y || 1 };
    }
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Table Layout Setup</h1>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2 flex-wrap">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Table Name" className="border p-2" required />
        <input name="capacity" value={form.capacity} onChange={handleChange} placeholder="Capacity" type="number" className="border p-2" required />
        <select name="status" value={form.status} onChange={handleChange} className="border p-2">
          <option>Available</option>
          <option>Reserved</option>
          <option>Occupied</option>
          <option>Cleaning</option>
        </select>
        <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded">Add Table</button>
      </form>
      <div className="relative border bg-gray-50 dark:bg-slate-800 rounded-lg mt-8" style={{ width: (maxX+2)*gridSize, height: (maxY+2)*gridSize, minHeight: 400 }}>
        {tables.map(table => {
          const pos = positions[table.id || table.table_id] || { x: 1, y: 1 };
          let status = table.status;
          let availableChairs = table.capacity;
          // Find reservation for this table
          const reservation = reservations.find(r => (r.table_id === table.id || r.table_id === table.table_id) && r.status === 'Reserved');
          return (
            <div
              key={table.id || table.table_id}
              className={`absolute flex flex-col items-center justify-center border-2 rounded-full shadow-lg cursor-pointer transition-all duration-200 ${STATUS_COLORS[status] || 'bg-gray-200 border-gray-400'}`}
              style={{
                left: pos.x * gridSize,
                top: pos.y * gridSize,
                width: gridSize * 2,
                height: gridSize * 2,
                zIndex: 2,
              }}
              title={table.name}
            >
              <span className="font-bold text-lg">{table.name || table.table_id}</span>
              <span className="text-xs">{availableChairs} chairs</span>
              <span className="text-xs font-semibold">{status}</span>
              {status === 'Available' && (
                <button className="mt-2 px-2 py-1 bg-green-600 text-white rounded text-xs" onClick={() => handleReserve(table)}>Reserve</button>
              )}
              {status === 'Reserved' && reservation && (
                <>
                  <span className="mt-2 text-xs text-gray-700">Reserved</span>
                  <span className="text-xs text-gray-700">By: {reservation.customer_name}</span>
                  <span className="text-xs text-gray-700">At: {reservation.reserved_at ? new Date(reservation.reserved_at).toLocaleString() : ''}</span>
                </>
              )}
              {status === 'Occupied' && (
                <span className="mt-2 text-xs text-red-700">Occupied</span>
              )}
              {status === 'Partial' && (
                <span className="mt-2 text-xs text-yellow-700">Partially Reserved</span>
              )}
            </div>
          );
        })}
      </div>
      {showReservation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <form onSubmit={handleReservationSubmit} className="bg-white p-6 rounded shadow-lg flex flex-col gap-2">
            <h2 className="font-bold text-lg mb-2">Reserve Table {selectedTable?.name}</h2>
            <input value={reservationName} onChange={e => setReservationName(e.target.value)} placeholder="Customer Name" className="border p-2" required />
            <input value={partySize} onChange={e => setPartySize(e.target.value)} placeholder="Party Size" type="number" className="border p-2" required />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Confirm Reservation</button>
            <button type="button" className="text-red-500 mt-2" onClick={() => setShowReservation(false)}>Cancel</button>
          </form>
        </div>
      )}
      {message && <div className="mt-4 text-green-700 font-bold">{message}</div>}
    </div>
  );
}