import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import * as ordersApi from '../services/orders';
import * as paymentsApi from '../services/payments';
import * as inventoryApi from '../services/inventory';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function DashboardWidgets() {
  const [orderCount, setOrderCount] = useState(0);
  const [paymentTotal, setPaymentTotal] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [ordersByType, setOrdersByType] = useState({});
  const [paymentsByMethod, setPaymentsByMethod] = useState({});
  const [inventoryPie, setInventoryPie] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      ordersApi.getOrders().catch(() => []),
      paymentsApi.getPayments().catch(() => []),
      inventoryApi.getInventory().catch(() => []),
    ]).then(([orders, payments, items]) => {
      setOrderCount(orders.length);
      const typeCounts = orders.reduce((acc, o) => {
        acc[o.type] = (acc[o.type] || 0) + 1;
        return acc;
      }, {});
      setOrdersByType(typeCounts);
      setPaymentTotal(payments.reduce((sum, p) => sum + Number(p.amount || 0), 0));
      const methodCounts = payments.reduce((acc, p) => {
        acc[p.method] = (acc[p.method] || 0) + 1;
        return acc;
      }, {});
      setPaymentsByMethod(methodCounts);
      setLowStock(items.filter(i => Number(i.quantity) <= Number(i.low_stock_threshold)).length);
      const available = items.filter(i => Number(i.quantity) > Number(i.low_stock_threshold)).length;
      const low = items.filter(i => Number(i.quantity) <= Number(i.low_stock_threshold)).length;
      setInventoryPie({ available, low });
      setLoading(false);
    }).catch(err => {
      setError('Failed to load dashboard data');
      setLoading(false);
    });
    // Add a timeout fallback in case APIs hang
    const timeout = setTimeout(() => setLoading(false), 8000);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-lg">Loading dashboard...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-blue-100 p-4 rounded shadow">
        <div className="text-lg font-bold">Total Orders</div>
        <div className="text-2xl">{orderCount}</div>
        {Object.keys(ordersByType).length > 0 && (
          <Bar
            data={{
              labels: Object.keys(ordersByType),
              datasets: [{
                label: 'Orders by Type',
                data: Object.values(ordersByType),
                backgroundColor: ['#2563eb', '#22d3ee', '#f59e42'],
              }],
            }}
            options={{ plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false, height: 120 }}
            height={120}
          />
        )}
      </div>
      <div className="bg-green-100 p-4 rounded shadow">
        <div className="text-lg font-bold">Total Payments</div>
        <div className="text-2xl">₹{paymentTotal}</div>
        {Object.keys(paymentsByMethod).length > 0 && (
          <Pie
            data={{
              labels: Object.keys(paymentsByMethod),
              datasets: [{
                label: 'Payments by Method',
                data: Object.values(paymentsByMethod),
                backgroundColor: ['#16a34a', '#f59e42', '#2563eb'],
              }],
            }}
            options={{ plugins: { legend: { position: 'bottom' } }, responsive: true, maintainAspectRatio: false, height: 120 }}
            height={120}
          />
        )}
      </div>
      <div className="bg-yellow-100 p-4 rounded shadow">
        <div className="text-lg font-bold">Low Stock Items</div>
        <div className="text-2xl">{lowStock}</div>
        {typeof inventoryPie.available === 'number' && typeof inventoryPie.low === 'number' && (
          <Pie
            data={{
              labels: ['Available', 'Low Stock'],
              datasets: [{
                label: 'Inventory',
                data: [inventoryPie.available, inventoryPie.low],
                backgroundColor: ['#fde047', '#f87171'],
              }],
            }}
            options={{ plugins: { legend: { position: 'bottom' } }, responsive: true, maintainAspectRatio: false, height: 120 }}
            height={120}
          />
        )}
      </div>
    </div>
  );
}