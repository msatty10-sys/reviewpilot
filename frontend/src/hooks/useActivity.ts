import { useState, useEffect } from 'react';
import type { ActivityItem } from '../types/analytics';

export function useActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This could be a real endpoint later
    const mockActivities: ActivityItem[] = [
      { id: '1', type: 'completed', customerName: 'John Doe', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
      { id: '2', type: 'clicked', customerName: 'Jane Smith', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
      { id: '3', type: 'sent', customerName: 'Robert Brown', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
      { id: '4', type: 'opened', customerName: 'Emily White', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
      { id: '5', type: 'completed', customerName: 'Michael Scott', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
    ];

    setActivities(mockActivities);
    setIsLoading(false);
  }, []);

  return { activities, isLoading };
}
