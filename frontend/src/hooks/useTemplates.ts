import { useState, useEffect } from 'react';
import client from '../api/client';

export interface ReviewTemplate {
  id: number;
  name: string;
  message_body: string;
  is_default: boolean;
  business_id: number;
}

export function useTemplates() {
  const [templates, setTemplates] = useState<ReviewTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const response = await client.get('/templates/');
      setTemplates(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch templates');
      // Mock for dev if needed
      setTemplates([
        { id: 1, name: 'Default Template', message_body: 'Hi {name}, thank you for choosing us! Could you leave us a review? {link}', is_default: true, business_id: 1 },
        { id: 2, name: 'Short & Sweet', message_body: 'Thanks for your business! Please rate us: {link}', is_default: false, business_id: 1 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const addTemplate = async (data: Partial<ReviewTemplate>) => {
    const response = await client.post('/templates/', data);
    setTemplates(prev => [...prev, response.data]);
    return response.data;
  };

  const updateTemplate = async (id: number, data: Partial<ReviewTemplate>) => {
    const response = await client.put(`/templates/${id}`, data);
    setTemplates(prev => prev.map(t => t.id === id ? response.data : t));
    return response.data;
  };

  const deleteTemplate = async (id: number) => {
    await client.delete(`/templates/${id}`);
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return { templates, isLoading, error, refetch: fetchTemplates, addTemplate, updateTemplate, deleteTemplate };
}
