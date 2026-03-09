'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { houseApi, locationApi, sublocationApi } from '@/lib/api';
import { Location, SubLocation, House } from '@/types';
import { ArrowLeft, Upload, X, Trash2, Play, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function EditHousePage() {
  const router = useRouter();
  const params = useParams();
  const houseId = parseInt(params.id as string);

  const [locations, setLocations] = useState<Location[]>([]);
  const [sublocations, setSublocations] = useState<SubLocation[]>([]);
  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const [newImages, setNewImages] = useState<File[]>([]);

  useEffect(() => {
    fetchData();
  }, [houseId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [houseResponse, locationsResponse, sublocationsResponse] = await Promise.all([
        houseApi.getById(houseId),
        locationApi.getAll(),
        sublocationApi.getAll(),
      ]);

      const houseData = houseResponse.data;
      setHouse(houseData);
      setLocations(locationsResponse.data.results || []);
      setSublocations(sublocationsResponse.data.results || []);

      setFormData({
        name: houseData.name,
        description: houseData.description,
        price: houseData.price,
        type: houseData.type,
        status: houseData.status,
        location: houseData.location.toString(),
        sublocation: houseData.sublocation?.toString() || '',
        amenities: {
          wifi: houseData.amenities?.wifi ?? false,
          parking: houseData.amenities?.parking ?? false,
          kitchen: houseData.amenities?.kitchen ?? false,
          air_conditioning: houseData.amenities?.air_conditioning ?? false,
          heating: houseData.amenities?.heating ?? false,
          tv: houseData.amenities?.tv ?? false,
          washer: houseData.amenities?.washer ?? false,
          pool: houseData.amenities?.pool ?? false,
        },
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load house details');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const deleteExistingImage = async (imageId: number) => {
    if (!confirm('Are you sure you want to delete this media?')) return;

    try {
      await houseApi.deleteImage(imageId);
      if (house) {
        setHouse({
          ...house,
          images: house.images?.filter(img => img.id !== imageId),
        });
      }
      toast.success('Media deleted successfully!');
    } catch (error) {
      console.error('Error deleting media:', error);
      toast.error('Failed to delete media');
    }
  };

  const setPrimaryImage = async (imageId: number) => {
    try {
      // Update via API to set as primary
      await houseApi.uploadImage(houseId, new FormData());
      
      // Update local state
      if (house && house.images) {
        const updatedImages = house.images.map(img => ({
          ...img,
          is_primary: img.id === imageId
        }));
        setHouse({ ...house, images: updatedImages });
      }
      toast.success('Primary image updated!');
    } catch (error) {
      console.error('Error setting primary image:', error);
      toast.error('Failed to update primary image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      // Update house details
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

      await houseApi.update(houseId, houseData);

      // Upload new images if any
      for (let i = 0; i < newImages.length; i++) {
        const formDataImage = new FormData();
        formDataImage.append('image', newImages[i]);
        formDataImage.append('is_primary', (!house?.images?.length && i === 0) ? 'true' : 'false');

        await houseApi.uploadImage(houseId, formDataImage);
      }

      toast.success(`House "${formData.name}" updated successfully!`);
      router.push('/admin/houses');
    } catch (error: any) {
      console.error('Error updating house:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'Failed to update house. Please try again.' });
      }
    } finally {
      setSaving(false);
    }
  };

  const filteredSublocations = formData.location
    ? sublocations.filter(sl => sl.location === parseInt(formData.location))
    : sublocations;

  if (loading) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

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
            <h1 className="text-4xl font-bold mb-2">Edit House</h1>
            <p className="text-dark-400">Update property details and images</p>
          </div>

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
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field min-h-[120px]"
              />
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
                />
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

            {/* Existing Images & Videos */}
            {house?.images && house.images.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-3">Current Media ({house.images.length})</label>
                <div className="grid grid-cols-3 gap-4">
                  {house.images.map((media) => (
                    <div key={media.id} className="relative group bg-dark-900 rounded-lg overflow-hidden border border-dark-700">
                      {media.media_type === 'VIDEO' ? (
                        <div className="relative w-full h-32 bg-black">
                          <video
                            src={media.image_url}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-32">
                          <Image
                            src={media.image_url}
                            alt="House media"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Action buttons */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {media.media_type === 'IMAGE' && !media.is_primary && (
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(media.id)}
                            className="bg-primary-500 hover:bg-primary-600 text-white p-1.5 rounded-full"
                            title="Set as primary"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteExistingImage(media.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        {media.is_primary && (
                          <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Primary
                          </span>
                        )}
                        {media.media_type === 'VIDEO' && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            <Play className="w-3 h-3" />
                            Video
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images & Videos */}
            <div>
              <label className="block text-sm font-medium mb-2">Add New Media</label>
              <div className="border-2 border-dashed border-dark-700 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
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
                <p className="text-dark-500 text-sm mt-2">Supports images and videos</p>
              </div>

              {newImages.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {newImages.map((file, index) => (
                    <div key={index} className="relative group bg-dark-900 rounded-lg overflow-hidden border border-dark-700">
                      {file.type.startsWith('video/') ? (
                        <div className="relative w-full h-32 bg-black">
                          <video
                            src={URL.createObjectURL(file)}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Upload className="w-8 h-8 text-white" />
                          </div>
                          <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            <Play className="w-3 h-3" />
                            Video
                          </span>
                        </div>
                      ) : (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
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
              <Link href="/admin/houses" className="btn-secondary flex-1 text-center">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
