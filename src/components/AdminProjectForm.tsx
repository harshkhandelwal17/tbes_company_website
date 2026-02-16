//AdminProjectForm.tsx
import { useState, useRef, useEffect } from 'react';
import { Project, ProjectFormData, FILTER_OPTIONS } from '@/types';

interface AdminProjectFormProps {
  project?: Project | null;
  onSubmit: (formData: ProjectFormData, imageFiles: File[]) => void;
  onCancel: () => void;
}

// Enhanced FormData interface (you'll need to update your types)
interface EnhancedProjectFormData extends Omit<ProjectFormData, 'sow' | 'area' | 'location'> {
  location: string; // Now a free text field
  areaSqm: number;
  areaSqft: number;
  softwareUsed: string[];
  trades: string[];
  services: string[];
}

const TRADE_OPTIONS = [
  'Architecture',
  'Mechanical',
  'Electrical',
  'Structure',
  'Plumbing'
];

const SERVICE_OPTIONS = [
  '3D Modeling',
  'Scan to BIM',
  'Shop Drawing',
  'Rendering',
  'Animation',
  'Visualization'
];

const SOFTWARE_OPTIONS = [
  'AutoCAD',
  'Revit',
  'SketchUp',
  'Rhino',
  '3ds Max',
  'Blender',
  'ArchiCAD',
  'Tekla',
  'Navisworks'
];

export default function AdminProjectForm({ project, onSubmit, onCancel }: AdminProjectFormProps) {
  const [formData, setFormData] = useState<EnhancedProjectFormData>({
    title: project?.title || '',
    description: project?.description || '',
    location: project?.location || '',
    lod: project?.lod || 300,
    projectType: project?.projectType || 'Office building',
    areaSqm: project?.area || 10000,
    areaSqft: Math.round((project?.area || 10000) * 10.764), // Convert sqm to sqft
    softwareUsed: [], // You might need to parse this from existing project data
    trades: [], // You might need to parse this from existing project data
    services: [] // You might need to parse this from existing project data
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(project?.imageUrl ? [project.imageUrl] : []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);

  // Convert sqm to sqft
  const convertSqmToSqft = (sqm: number): number => {
    return Math.round(sqm * 10.764);
  };

  // Convert sqft to sqm
  const convertSqftToSqm = (sqft: number): number => {
    return Math.round(sqft / 10.764);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'lod' ? parseInt(value) : value
    }));
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    
    if (name === 'areaSqm') {
      setFormData(prev => ({
        ...prev,
        areaSqm: numValue,
        areaSqft: convertSqmToSqft(numValue)
      }));
    } else if (name === 'areaSqft') {
      setFormData(prev => ({
        ...prev,
        areaSqft: numValue,
        areaSqm: convertSqftToSqm(numValue)
      }));
    }
  };

  const handleMultiSelectChange = (fieldName: 'softwareUsed' | 'trades' | 'services', value: string) => {
    setFormData(prev => {
      const currentValues = prev[fieldName];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [fieldName]: newValues
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      
      // Create previews for new files
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    // Only remove from imageFiles if it's not an existing project image
    if (index >= (project?.imageUrl ? 1 : 0)) {
      const fileIndex = index - (project?.imageUrl ? 1 : 0);
      setImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!project && imageFiles.length === 0) {
      alert('Please select at least one image for new projects');
      return;
    }

    if (formData.trades.length === 0 || formData.services.length === 0) {
      alert('Please select at least one trade and one service');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Convert back to original format for submission
      const submitData: ProjectFormData = {
        ...formData,
        area: formData.areaSqm, // Use sqm as primary area value
        sow: `${formData.trades.join(', ')} | ${formData.services.join(', ')}` // Combine trades and services
      };
      
      await onSubmit(submitData, imageFiles);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {project ? 'Edit Project' : 'Add New Project'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project title"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project description"
            />
          </div>

          {/* Location - Now a text input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country/Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter country or location"
            />
          </div>

          {/* LOD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LOD (Level of Detail) *
            </label>
            <select
              name="lod"
              value={formData.lod}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FILTER_OPTIONS.lods.filter(lod => lod !== 'All').map((lod) => (
                <option key={lod} value={parseInt(lod)}>
                  {lod}
                </option>
              ))}
            </select>
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Type *
            </label>
            <select
              name="projectType"
              value={formData.projectType}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FILTER_OPTIONS.projectTypes.filter(type => type !== 'All').map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Software Used */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Software Used *
            </label>
            <div className="border border-gray-300 rounded-md p-2 max-h-32 overflow-y-auto">
              {SOFTWARE_OPTIONS.map((software) => (
                <label key={software} className="flex items-center space-x-2 py-1">
                  <input
                    type="checkbox"
                    checked={formData.softwareUsed.includes(software)}
                    onChange={() => handleMultiSelectChange('softwareUsed', software)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{software}</span>
                </label>
              ))}
            </div>
            {formData.softwareUsed.length > 0 && (
              <div className="mt-1 text-xs text-gray-600">
                Selected: {formData.softwareUsed.join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Area - Dual Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area (Square Meters) *
            </label>
            <input
              type="number"
              name="areaSqm"
              value={formData.areaSqm}
              onChange={handleAreaChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter area in sqm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area (Square Feet) *
            </label>
            <input
              type="number"
              name="areaSqft"
              value={formData.areaSqft}
              onChange={handleAreaChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter area in sqft"
            />
          </div>
        </div>

        {/* Trades */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trades *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border border-gray-300 rounded-md p-3">
            {TRADE_OPTIONS.map((trade) => (
              <label key={trade} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.trades.includes(trade)}
                  onChange={() => handleMultiSelectChange('trades', trade)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{trade}</span>
              </label>
            ))}
          </div>
          {formData.trades.length > 0 && (
            <div className="mt-1 text-xs text-gray-600">
              Selected: {formData.trades.join(', ')}
            </div>
          )}
        </div>

        {/* Services */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Services *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border border-gray-300 rounded-md p-3">
            {SERVICE_OPTIONS.map((service) => (
              <label key={service} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.services.includes(service)}
                  onChange={() => handleMultiSelectChange('services', service)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{service}</span>
              </label>
            ))}
          </div>
          {formData.services.length > 0 && (
            <div className="mt-1 text-xs text-gray-600">
              Selected: {formData.services.join(', ')}
            </div>
          )}
        </div>

        {/* Multiple Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Images * (JPG/PNG)
          </label>
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageChange}
            accept="image/jpeg,image/png"
            multiple
            required={!project && imageFiles.length === 0}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-2 text-sm text-gray-600">
            You can select multiple images at once. Click "Choose Files" again to add more images.
          </div>
          
          {/* Image Previews Grid */}
          {imagePreviews.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Selected Images ({imagePreviews.length})
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      ×
                    </button>
                    <div className="text-xs text-gray-500 mt-1 text-center">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting 
              ? 'Saving...' 
              : project 
                ? 'Update Project' 
                : 'Create Project'
            }
          </button>
        </div>
      </form>
    </div>
  );
}