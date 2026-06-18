import { useState, useEffect } from 'react';
import { 
  Globe, 
  CreditCard, 
  Shield, 
  User,
  Bell,
  Mail,
  Smartphone
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../contexts/AuthContext';
import client from '../api/client';

const settingsSchema = z.object({
  business_name: z.string().min(2, 'Business name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().optional(),
  google_business_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  facebook_page_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  notify_email: z.boolean(),
  notify_sms: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function Settings() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      business_name: user?.name || '',
      email: user?.email || '',
      phone_number: '',
      google_business_url: '',
      facebook_page_url: '',
      notify_email: true,
      notify_sms: false,
    }
  });

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await client.get('/businesses/me');
        const b = response.data;
        setValue('business_name', b.name);
        setValue('email', b.email);
        setValue('phone_number', b.phone_number || '');
        setValue('google_business_url', b.google_business_url || '');
        setValue('facebook_page_url', b.facebook_page_url || '');
      } catch (err) {
        console.error('Failed to fetch business profile', err);
      }
    };
    fetchBusiness();
  }, [setValue]);

  const onSubmit = async (data: SettingsFormValues) => {
    setIsLoading(true);
    setSuccessMessage(null);
    try {
      await client.put('/businesses/me', {
        name: data.business_name,
        email: data.email,
        phone_number: data.phone_number,
        google_business_url: data.google_business_url,
        facebook_page_url: data.facebook_page_url,
      });
      setSuccessMessage('Settings updated successfully!');
    } catch (error) {
      console.error('Failed to update settings', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your business profile and account preferences.</p>
      </div>

      {successMessage && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700 border border-green-200">
          {successMessage}
        </div>
      )}

      {/* Business Profile */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <User className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Business Profile</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Business Name" 
              {...register('business_name')}
              error={errors.business_name?.message}
            />
            <Input 
              label="Email Address" 
              type="email" 
              {...register('email')}
              error={errors.email?.message}
            />
            <Input 
              label="Phone Number" 
              type="tel" 
              placeholder="+1 (555) 000-0000" 
              {...register('phone_number')}
              error={errors.phone_number?.message}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 border-b border-gray-100 pb-2">
              <Globe className="h-4 w-4" />
              Review Links
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <Input 
                label="Google Business URL" 
                placeholder="https://search.google.com/local/writereview?placeid=..." 
                {...register('google_business_url')}
                error={errors.google_business_url?.message}
              />
              <Input 
                label="Facebook Page URL" 
                placeholder="https://facebook.com/..." 
                {...register('facebook_page_url')}
                error={errors.facebook_page_url?.message}
              />
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 border-b border-gray-100 pb-2">
              <Bell className="h-4 w-4" />
              Notification Preferences
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                    <p className="text-xs text-gray-500">Receive an email when a customer clicks your review link.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  {...register('notify_email')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-xs text-gray-500">Receive a text message for every new review completed.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  {...register('notify_sms')}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button isLoading={isLoading} type="submit">
              Save Changes
            </Button>
          </div>
        </div>
      </form>

      {/* Subscription */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Subscription</h2>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Starter Plan</p>
            <p className="text-sm text-gray-500">Up to 50 review requests/month. $29/month.</p>
          </div>
          <Button variant="outline">Upgrade Plan</Button>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <Shield className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Security</h2>
        </div>
        <div className="p-6">
          <Button variant="outline">Change Password</Button>
        </div>
      </div>
    </div>
  );
}
