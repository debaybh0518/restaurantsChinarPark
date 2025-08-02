import { useEffect, useState } from 'react';
import * as reportsApi from '../services/reports';

export default function ReportsPage() {
  const [sales, setSales] = useState([]);
  const [kots, setKOTs] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      reportsApi.getSalesReport(),
      reportsApi.getKOTReport(),
      reportsApi.getInventoryReport()
    ]).then(([sales, kots, inventory]) => {
      setSales(sales);
      setKOTs(kots);
      setInventory(inventory);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-xl mb-4">Reports</h2>
      {loading ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-bold mb-2">Sales Report</h3>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">{JSON.stringify(sales, null, 2)}</pre>
          </div>
          <div>
            <h3 className="font-bold mb-2">KOT Report</h3>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">{JSON.stringify(kots, null, 2)}</pre>
          </div>
          <div>
            <h3 className="font-bold mb-2">Inventory Report</h3>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">{JSON.stringify(inventory, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}