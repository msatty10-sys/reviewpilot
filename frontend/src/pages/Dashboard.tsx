import { 
  Send, 
  MessageSquare, 
  TrendingUp, 
  Star,
  CheckCircle2,
  ExternalLink,
  Mail
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useStats } from '../hooks/useStats';
import { useActivity } from '../hooks/useActivity';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const { data, isLoading } = useStats();
  const { activities } = useActivity();

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    { 
      label: 'Total Sent', 
      value: data.summary.sent_requests, 
      icon: Send, 
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    { 
      label: 'Reviews Received', 
      value: data.summary.completed_requests, 
      icon: MessageSquare, 
      color: 'bg-green-500',
      change: '+5%',
      changeType: 'positive'
    },
    { 
      label: 'Conversion Rate', 
      value: `${data.summary.conversion_rate}%`, 
      icon: TrendingUp, 
      color: 'bg-purple-500',
      change: '+2%',
      changeType: 'positive'
    },
    { 
      label: 'Average Rating', 
      value: '4.8', 
      icon: Star, 
      color: 'bg-yellow-500',
      change: '0.0',
      changeType: 'neutral'
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening with your reviews.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-5">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 text-${stat.color.split('-')[1]}-600`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 truncate">{stat.label}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <span className={`ml-2 text-xs font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-semibold text-gray-900">Review Trends</h3>
            <select className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.daily_trends}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '8px', 
                    border: '1px solid #f3f4f6',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {activities.map((activity, idx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {idx !== activities.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                          activity.type === 'completed' ? 'bg-green-500' :
                          activity.type === 'clicked' ? 'bg-blue-500' :
                          activity.type === 'opened' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}>
                          {activity.type === 'completed' && <CheckCircle2 className="h-4 w-4 text-white" />}
                          {activity.type === 'clicked' && <ExternalLink className="h-4 w-4 text-white" />}
                          {activity.type === 'opened' && <Mail className="h-4 w-4 text-white" />}
                          {activity.type === 'sent' && <Send className="h-4 w-4 text-white" />}
                        </span>
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">{activity.customerName}</span>
                          {' '}
                          {activity.type === 'completed' && 'left a review'}
                          {activity.type === 'clicked' && 'clicked the review link'}
                          {activity.type === 'opened' && 'opened the request email'}
                          {activity.type === 'sent' && 'was sent a review request'}
                        </div>
                        <div className="mt-0.5 text-xs text-gray-400">
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <button className="mt-6 w-full text-center text-sm font-medium text-blue-600 hover:text-blue-500">
            View all activity
          </button>
        </div>
      </div>
    </div>
  );
}
