import { useState, useEffect } from 'react';
import client from '../api/client';
import type { AnalyticsDashboard } from '../types/analytics';

export function useStats() {
  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await client.get('/analytics/dashboard');
        setData(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch analytics');
        // Mock data for development
        setData({
          summary: {
            total_requests: 150,
            sent_requests: 145,
            opened_requests: 120,
            clicked_requests: 85,
            completed_requests: 42,
            conversion_rate: 28.9,
          },
          daily_trends: [
            { date: '2024-05-01', count: 5 },
            { date: '2024-05-02', count: 8 },
            { date: '2024-05-03', count: 12 },
            { date: '2024-05-04', count: 7 },
            { date: '2024-05-05', count: 15 },
            { date: '2024-05-06', count: 20 },
            { date: '2024-05-07', count: 18 },
          ],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { data, isLoading, error };
}
