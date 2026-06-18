export interface AnalyticsSummary {
  total_requests: number;
  sent_requests: number;
  opened_requests: number;
  clicked_requests: number;
  completed_requests: number;
  conversion_rate: number;
}

export interface DailyTrend {
  date: string;
  count: number;
}

export interface AnalyticsDashboard {
  summary: AnalyticsSummary;
  daily_trends: DailyTrend[];
}

export interface ActivityItem {
  id: string;
  type: 'sent' | 'opened' | 'clicked' | 'completed';
  customerName: string;
  timestamp: string;
}
