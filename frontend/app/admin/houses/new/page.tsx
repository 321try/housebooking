'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { houseApi, locationApi, sublocationApi } from '@/lib/api';
import { Location, SubLocation } from '@/types';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function NewHousePage() {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [sublocations, setSublocations] = useState<SubLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    type: 'HOUSE' as 'HOUSE' | 'BNB',
    status: 'AVAILABLE' as 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE' | 'UNAVAILABLE',
    location: '',
    sublocation: '',
    amenities: {
      wifi: false,
      parking: false,
      kitchen: false,
      air_conditioning: false,
      heating: false,
      tv: false,
      washer: false,
      pool: false,
    },
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      await Promise.all([fetchLocations(), fetchSublocations()]);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await locationApi.getAll();
      setLocations(response.data.results || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations([]);
    }
  };

  const fetchSublocations = async () => {
    try {
      const response = await sublocationApi.getAll();
      setSublocations(response.data.results || []);
    } catch (error) {
      console.error('Error fetching sublocations:', error);
      setSublocations([]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Create house
      const houseData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        type: formData.type,
        status: formData.status,
        location: parseInt(formData.location),
        sublocation: formData.sublocation ? parseInt(formData.sublocation) : null,
        amenities: formData.amenities,
      };

      const response = await houseApi.create(houseData);
      const houseId = response.data.id;

      // Upload images if any
      for (let i = 0; i < imageFiles.length; i++) {
        const formDataImage = new FormData();
        formDataImage.append('image', imageFiles[i]);
        formDataImage.append('is_primary', i === 0 ? 'true' : 'false');

        await houseApi.uploadImage(houseId, formDataImage);
      }

      toast.success(`House "${formData.name}" created successfully!`);
      router.push('/admin/houses');
    } catch (error: any) {
      console.error('Error creating house:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'Failed to create house. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredSublocations = formData.location
    ? sublocations.filter(sl => sl.location === parseInt(formData.location))
    : sublocations;

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin/houses" className="text-primary-500 hover:text-primary-400 inline-flex items-center mb-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Houses
            </Link>
            <h1 className="text-4xl font-bold mb-2">Add New House</h1>
            <p className="text-dark-400">Fill in the details to create a new property listing</p>
          </div>

          {loadingData ? (
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                <span className="ml-3 text-dark-300">Loading form data...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Form */}
          <form onSubmit={handleSubmit} className="card p-8 space-y-6">
            {errors.general && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
                {errors.general}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">House Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="Beautiful Beach House"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field min-h-[120px]"
                placeholder="Describe the property, its features, and what makes it special..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Price, Type, Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price per Night ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input-field"
                  placeholder="150.00"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'HOUSE' | 'BNB' })}
                  className="input-field"
                >
                  <option value="HOUSE">House</option>
                  <option value="BNB">Bed & Breakfast</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="input-field"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="BOOKED">Booked</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="UNAVAILABLE">Unavailable</option>
                </select>
              </div>
            </div>

            {/* Location & Sublocation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Location *</label>
                <select
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value, sublocation: '' })}
                  className="input-field"
                >
                  <option value="">Select a location</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sublocation</label>
                <select
                  value={formData.sublocation}
                  onChange={(e) => setFormData({ ...formData, sublocation: e.target.value })}
                  className="input-field"
                  disabled={!formData.location}
                >
                  <option value="">None (Optional)</option>
                  {filteredSublocations.map((subloc) => (
                    <option key={subloc.id} value={subloc.id}>
                      {subloc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium mb-3">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.keys(formData.amenities).map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities[amenity as keyof typeof formData.amenities]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amenities: { ...formData.amenities, [amenity]: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-primary-500 bg-dark-800 border-dark-700 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm capitalize">{amenity.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium mb-2">Images & Videos</label>
              <div className="border-2 border-dashed border-dark-700 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-dark-600 mx-auto mb-4" />
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="btn-secondary cursor-pointer inline-block">
                  Choose Images & Videos
                </label>
                <p className="text-dark-400 text-sm mt-2">Upload property images and videos (first image will be primary)</p>
              </div>

              {imageFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      {file.type.startsWith('video/') ? (
                        <div className="w-full h-32 bg-dark-900 rounded-lg relative overflow-hidden">
                          <video
                            src={URL.createObjectURL(file)}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Upload className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      ) : (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && !file.type.startsWith('video/') && (
                        <span className="absolute bottom-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </span>
                      )}
                      {file.type.startsWith('video/') && (
                        <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                          <Upload className="w-3 h-3" />
                          Video
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create House'}
              </button>
              <Link href="/admin/houses" className="btn-secondary flex-1 text-center">
                Cancel
              </Link>
            </div>
          </form>
          </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
