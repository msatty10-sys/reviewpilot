import { useState } from 'react';
import { 
  Search, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw 
} from 'lucide-react';
import { Button } from '../components/Button';
import { useReviewRequests } from '../hooks/useReviewRequests';
import type { ReviewRequestStatus } from '../types/reviewRequest';

const statusConfig: Record<ReviewRequestStatus, { icon: any, color: string, bg: string }> = {
  pending: { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100' },
  sent: { icon: Send, color: 'text-blue-600', bg: 'bg-blue-100' },
  completed: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
  failed: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
  reminded: { icon: RefreshCw, color: 'text-purple-600', bg: 'bg-purple-100' },
  opened: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  clicked: { icon: RefreshCw, color: 'text-indigo-600', bg: 'bg-indigo-100' },
};

export default function ReviewRequests() {
  const [searchTerm, setSearchTerm] = useState('');
  const { requests, isLoading, remindRequest } = useReviewRequests();

  const filteredRequests = requests.filter(request => 
    request.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemind = async (id: number) => {
    try {
      await remindRequest(id);
      alert('Reminder sent!');
    } catch (e) {
      console.error('Failed to send reminder', e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Requests</h1>
          <p className="text-gray-500">Monitor and manage review requests sent to customers.</p>
        </div>
        <Button className="flex items-center">
          <Send className="mr-2 h-4 w-4" />
          Send New Request
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-500">Loading requests...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sent At</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRequests.map((request) => {
                    const config = statusConfig[request.status] || statusConfig.pending;
                    return (
                      <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{request.customer_name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                            <config.icon className="mr-1 h-3 w-3" />
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {request.sent_at || 'Not sent'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => handleRemind(request.id)}
                            disabled={request.status === 'completed'}
                          >
                            Resend
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No review requests found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
