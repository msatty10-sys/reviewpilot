import { useState, useEffect } from 'react';
import client from '../api/client';
import type { Customer, CustomerCreate } from '../types/customer';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await client.get('/customers/');
      // Enrich customers with mock status/last request for demo
      const enriched = response.data.map((c: any, i: number) => ({
        ...c,
        last_request_at: i % 2 === 0 ? '2024-05-25' : undefined,
        status: i % 3 === 0 ? 'completed' : (i % 3 === 1 ? 'sent' : 'pending')
      }));
      setCustomers(enriched);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch customers');
      // Mock for dev
      setCustomers([
        { id: 1, name: 'John Doe', email: 'john@example.com', phone_number: '123-456-7890', business_id: 1, created_at: '2024-05-20', last_request_at: '2024-05-25', status: 'completed' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone_number: '987-654-3210', business_id: 1, created_at: '2024-05-21', last_request_at: '2024-05-24', status: 'sent' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone_number: '555-555-5555', business_id: 1, created_at: '2024-05-22', status: 'pending' },
        { id: 4, name: 'Alice Williams', email: 'alice@example.com', phone_number: '111-222-3333', business_id: 1, created_at: '2024-05-23', status: 'sent' },
        { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', phone_number: '444-555-6666', business_id: 1, created_at: '2024-05-24', last_request_at: '2024-05-26', status: 'clicked' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const addCustomer = async (data: CustomerCreate) => {
    const response = await client.post('/customers/', data);
    setCustomers(prev => [...prev, { ...response.data, status: 'pending' }]);
    return response.data;
  };

  const updateCustomer = async (id: number, data: Partial<CustomerCreate>) => {
    const response = await client.put(`/customers/${id}`, data);
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...response.data } : c));
    return response.data;
  };

  const deleteCustomer = async (id: number) => {
    await client.delete(`/customers/${id}`);
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return { 
    customers, 
    isLoading, 
    error, 
    refetch: fetchCustomers, 
    addCustomer, 
    updateCustomer, 
    deleteCustomer 
  };
}
