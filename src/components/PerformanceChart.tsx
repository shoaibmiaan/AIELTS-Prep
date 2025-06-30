'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useBandProgress } from '@/lib/hooks/useBandProgress';

type Props = {
  userId: string;
};

export default function PerformanceChart({ userId }: Props) {
  const { data, loading } = useBandProgress(userId);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mt-10">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">📈 Band Score Progress</h2>

      {loading ? (
        <div className="text-gray-500">Loading progress chart...</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis domain={[5.5, 9]} stroke="#6b7280" tickCount={8} />
            <Tooltip contentStyle={{ borderRadius: 8 }} />
            <Legend />
            <Line type="monotone" dataKey="Task1" stroke="#3b82f6" strokeWidth={2} name="Task 1" />
            <Line type="monotone" dataKey="Task2" stroke="#10b981" strokeWidth={2} name="Task 2" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
