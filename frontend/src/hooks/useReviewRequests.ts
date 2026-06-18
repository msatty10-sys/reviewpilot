import { useState, useEffect } from 'react';
import client from '../api/client';
import type { ReviewRequest } from '../types/reviewRequest';

export function useReviewRequests() {
  const [requests, setRequests] = useState<ReviewRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await client.get('/review-requests/');
      // Mock enrichment if needed
      setRequests(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch review requests');
      // Mock for dev
      setRequests([
        { id: 1, customer_id: 1, customer_name: 'John Doe', status: 'completed', sent_at: '2024-05-20 10:00', created_at: '2024-05-19' },
        { id: 2, customer_id: 2, customer_name: 'Jane Smith', status: 'sent', sent_at: '2024-05-21 11:30', created_at: '2024-05-20' },
        { id: 3, customer_id: 3, customer_name: 'Bob Johnson', status: 'pending', sent_at: null, created_at: '2024-05-21' },
        { id: 4, customer_id: 4, customer_name: 'Alice Williams', status: 'reminded', sent_at: '2024-05-22 09:15', created_at: '2024-05-21' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const remindRequest = async (id: number) => {
    const response = await client.post(`/review-requests/${id}/remind`);
    setRequests(prev => prev.map(r => r.id === id ? response.data : r));
    return response.data;
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return { requests, isLoading, error, refetch: fetchRequests, remindRequest };
}
