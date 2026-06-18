import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Star, Globe, Loader2, MessageSquare } from 'lucide-react';
import client from '../api/client';

interface ReviewLandingData {
  business_name: string;
  google_url?: string;
  facebook_url?: string;
}

export default function ReviewLanding() {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ReviewLandingData | null>(null);

  // Tracking info
  const utmSource = searchParams.get('utm_source') || 'review_request';
  const utmMedium = searchParams.get('utm_medium') || 'sms';

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        // Mark as clicked immediately when page loads
        // We use the token to identify the request
        try {
          await client.post(`/review-requests/public/${token}/click`);
        } catch (e) {
          console.warn('Click tracking failed', e);
        }

        // Fetch business info for the review page
        const response = await client.get(`/review-requests/public/${token}`);
        setData(response.data);
      } catch (err: any) {
        setError('Invalid or expired review link.');
        // Mocking for development if API fails
        setData({
          business_name: 'Acme Plumbing',
          google_url: 'https://search.google.com/local/writereview?placeid=mock_id',
          facebook_url: 'https://www.facebook.com/mock_page/reviews'
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchReviewData();
    }
  }, [token]);

  const handleReviewClick = async (platform: string) => {
    try {
      await client.post(`/review-requests/public/${token}/complete`, { platform });
    } catch (e) {
      console.warn('Completion tracking failed', e);
    }
  };

  const addUtmParams = (url: string) => {
    if (!url) return '';
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=reviewpilot`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
          <div className="mb-4 flex justify-center text-red-500">
            <Star className="h-12 w-12 fill-current" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Oops!</h1>
          <p className="text-gray-600">{error || 'Something went wrong.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-blue-100 p-3 text-blue-600">
            <Star className="h-8 w-8 fill-current" />
          </div>
        </div>
        
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Thank You!</h1>
        <p className="mb-8 text-gray-600">
          We hope you had a great experience with <span className="font-semibold text-gray-900">{data?.business_name || 'us'}</span>. 
          Your feedback helps us grow!
        </p>

        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Leave a review on</p>
          
          {data?.google_url && (
            <a 
              href={addUtmParams(data.google_url)} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => handleReviewClick('google')}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-white border-2 border-gray-100 p-4 font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95"
            >
              <Globe className="h-6 w-6 text-blue-500" />
              Google Review
            </a>
          )}

          {data?.facebook_url && (
            <a 
              href={addUtmParams(data.facebook_url)} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => handleReviewClick('facebook')}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-white border-2 border-gray-100 p-4 font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95"
            >
              <MessageSquare className="h-6 w-6 text-blue-600" />
              Facebook Review
            </a>
          )}
        </div>

        <div className="mt-8">
          <button 
            className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-4"
            onClick={() => window.close()} // Or just a "Maybe later" message
          >
            No thanks, I'll skip
          </button>
        </div>

        <p className="mt-10 text-xs text-gray-400">
          Powered by <span className="font-semibold">ReviewPilot</span>
        </p>
      </div>
    </div>
  );
}
