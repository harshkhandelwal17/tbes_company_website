'use client';

import { useState, useEffect } from 'react';
import { Project, ProjectFormData, FILTER_OPTIONS } from '@/types';
import AdminProjectForm from '../../../components/AdminProjectForm';
import AdminProjectList from '../../../components/AdminProjectList';

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();

      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        console.error('API returned non-array data:', data);
        setProjects([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
      setLoading(false);
    }
  };

  const handleCreateProject = async (formData: ProjectFormData, imageFiles: File[]) => {
    const uploadData = new FormData();

    // Append form data
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        uploadData.append(key, value.toString());
      }
    });

    // Append multiple images
    imageFiles.forEach((file, index) => {
      uploadData.append(`images`, file);
    });

    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        body: uploadData,
      });

      if (response.ok) {
        const newProject = await response.json();
        setProjects([...projects, newProject]);
        setShowForm(false);
        alert('Project created successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error creating project: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project');
    }
  };

  const handleUpdateProject = async (formData: ProjectFormData, imageFiles: File[]) => {
    if (!editingProject) return;

    const uploadData = new FormData();

    // Append form data
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        uploadData.append(key, value.toString());
      }
    });

    uploadData.append('id', editingProject.id);

    // Append new images if any
    if (imageFiles.length > 0) {
      imageFiles.forEach((file, index) => {
        uploadData.append(`images`, file);
      });
    }

    try {
      const response = await fetch('/api/admin/projects', {
        method: 'PUT',
        body: uploadData,
      });

      if (response.ok) {
        const updatedProject = await response.json();
        setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
        setEditingProject(null);
        setShowForm(false);
        alert('Project updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error updating project: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Error updating project');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/admin/projects?id=${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== projectId));
        alert('Project deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error deleting project: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  // Unified handler for both create and update
  const handleSubmit = (formData: ProjectFormData, imageFiles: File[]) => {
    if (editingProject) {
      handleUpdateProject(formData, imageFiles);
    } else {
      handleCreateProject(formData, imageFiles);
    }
  };

  const startEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setShowForm(false);
  };

  const startCreate = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <div className="space-x-4">
              <button
                onClick={startCreate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add New Project
              </button>
              <a
                href="/"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                View Projects
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
            <div className="text-gray-600">Total Projects</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-green-600">
              {new Set(projects.map(p => p.location)).size}
            </div>
            <div className="text-gray-600">Locations</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-purple-600">
              {projects.reduce((sum, p) => sum + p.area, 0).toLocaleString()}
            </div>
            <div className="text-gray-600">Total Area (sqm)</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-orange-600">
              {new Set(projects.map(p => p.projectType)).size}
            </div>
            <div className="text-gray-600">Project Types</div>
          </div>
        </div>

        {/* Project Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <AdminProjectForm
                project={editingProject}
                onSubmit={handleSubmit}
                onCancel={cancelEdit}
              />
            </div>
          </div>
        )}

        {/* Projects List */}
        <AdminProjectList
          projects={projects}
          onEdit={startEdit}
          onDelete={handleDeleteProject}
        />
      </div>
    </div>
  );
}