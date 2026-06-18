export type ReviewRequestStatus = 'pending' | 'sent' | 'opened' | 'clicked' | 'completed' | 'failed' | 'reminded';

export interface ReviewRequest {
  id: number;
  customer_id: number;
  customer_name: string;
  status: ReviewRequestStatus;
  sent_at: string | null;
  created_at: string;
}
