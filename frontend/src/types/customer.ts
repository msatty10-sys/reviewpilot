export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone_number?: string;
  business_id: number;
  created_at: string;
  last_request_at?: string;
  status?: 'pending' | 'sent' | 'opened' | 'clicked' | 'completed' | 'failed' | 'reminded';
}

export interface CustomerCreate {
  name: string;
  email?: string;
  phone_number?: string;
}
