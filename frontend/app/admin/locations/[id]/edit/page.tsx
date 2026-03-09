'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { locationApi } from '@/lib/api';
import { Location } from '@/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function EditLocationPage() {
  const router = useRouter();
  const params = useParams();
  const locationId = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    setLoading(true);
    try {
      const response = await locationApi.getById(locationId);
      const location = response.data;
      setFormData({
        name: location.name,
        description: location.description || '',
      });
    } catch (error) {
      console.error('Error fetching location:', error);
      alert('Failed to load location details');
      router.push('/admin/locations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      await locationApi.update(locationId, formData);
      toast.success(`Location "${formData.name}" updated successfully!`);
      router.push('/admin/locations');
    } catch (error: any) {
      console.error('Error updating location:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'Failed to update location. Please try again.' });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <div className="min-h-screen py-12 px-4">
          <div className="max-w-2xl mx-auto flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/admin/locations" 
              className="text-primary-500 hover:text-primary-400 inline-flex items-center mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Locations
            </Link>
            <h1 className="text-4xl font-bold mb-2">Edit Location</h1>
            <p className="text-dark-400">Update location details</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-dark-800 rounded-lg border border-dark-700 p-6">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
                {errors.general}
              </div>
            )}

            {/* Location Name */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Location Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="e.g., Nairobi, Mombasa, Kisumu"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field resize-none"
                rows={4}
                placeholder="Brief description of this location..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link href="/admin/locations" className="btn-secondary flex-1 text-center">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
