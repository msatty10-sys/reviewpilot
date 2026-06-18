import { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  MessageSquare,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { useTemplates } from '../hooks/useTemplates';
import type { ReviewTemplate } from '../hooks/useTemplates';
import { useAuth } from '../contexts/AuthContext';

const templateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  message_body: z.string().min(10, 'Message body must be at least 10 characters'),
  is_default: z.boolean(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

export default function Templates() {
  const { user } = useAuth();
  const { templates, isLoading, addTemplate, updateTemplate, deleteTemplate } = useTemplates();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReviewTemplate | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: '',
      message_body: '',
      is_default: false,
    }
  });

  const messageBody = useWatch({
    control,
    name: 'message_body',
    defaultValue: ''
  });

  const getPreview = (body: string) => {
    return body
      .replace(/{name}/g, 'John Doe')
      .replace(/{link}/g, 'https://rvp.io/r/abcd123')
      .replace(/{{customer_name}}/g, 'John Doe')
      .replace(/{{review_link}}/g, 'https://rvp.io/r/abcd123')
      .replace(/{{business_name}}/g, user?.name || 'ReviewPilot Business');
  };

  const openAddModal = () => {
    setEditingTemplate(null);
    reset({ name: '', message_body: '', is_default: false });
    setIsModalOpen(true);
  };

  const openEditModal = (template: ReviewTemplate) => {
    setEditingTemplate(template);
    setValue('name', template.name);
    setValue('message_body', template.message_body);
    setValue('is_default', template.is_default);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: TemplateFormValues) => {
    try {
      if (editingTemplate) {
        await updateTemplate(editingTemplate.id, data);
      } else {
        await addTemplate(data);
      }
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to save template', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate(id);
      } catch (error) {
        console.error('Failed to delete template', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Templates</h1>
          <p className="text-gray-500">Customize the messages sent to your customers.</p>
        </div>
        <Button className="flex items-center" onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-500">Loading templates...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    {template.is_default && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => openEditModal(template)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(template.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 mb-6 flex-grow italic">
                "{template.message_body}"
              </div>

              <div className="flex items-center text-xs text-gray-400 gap-4">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Supports {"{name}"}, {"{link}"}
                </span>
              </div>
            </div>
          ))}
          
          {templates.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No templates found. Create your first one!</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Template Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTemplate ? 'Edit Template' : 'Create New Template'}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Template Name"
              placeholder="e.g., Default Request"
              {...register('name')}
              error={errors.name?.message}
            />
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Message Body</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm min-h-[120px]"
                placeholder="Hi {name}, thanks for using our service! Please leave a review at {link}"
                {...register('message_body')}
              />
              {errors.message_body && (
                <p className="text-xs text-red-600">{errors.message_body.message}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {['{name}', '{link}'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const current = messageBody;
                      setValue('message_body', current + tag);
                    }}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-600 border border-gray-200 transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_default"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                {...register('is_default')}
              />
              <label htmlFor="is_default" className="text-sm text-gray-700">
                Set as default template
              </label>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">
                {editingTemplate ? 'Update Template' : 'Create Template'}
              </Button>
            </div>
          </form>

          {/* Preview Panel */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
              <Eye className="h-4 w-4" />
              Live Preview
            </div>
            
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden max-w-[280px] mx-auto">
                <div className="bg-gray-100 px-4 py-2 text-[10px] text-gray-500 border-b border-gray-200 flex justify-between items-center">
                  <span>iMessage</span>
                  <span>Today 10:42 AM</span>
                </div>
                <div className="p-3">
                  <div className="bg-blue-600 text-white rounded-2xl p-3 text-sm rounded-br-none">
                    {messageBody ? getPreview(messageBody) : (
                      <span className="text-blue-200 italic">Start typing to see preview...</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-gray-500">How your customers will see it on their mobile devices.</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
