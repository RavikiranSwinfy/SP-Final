import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const JobOpenings: React.FC = () => {
  const { jobs, addJob, loading } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    da_name: '',
    company_name: '',
    phone_number: '',
    job_link: '',
    file_name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.da_name && formData.job_link && formData.company_name) {
      setSubmitting(true);
      try {
        await addJob({
          da_name: formData.da_name,
          company_name: formData.company_name,
          phone_number: formData.phone_number || null,
          job_link: formData.job_link,
          file_name: formData.file_name || null,
        });
        setFormData({
          da_name: '',
          company_name: '',
          phone_number: '',
          job_link: '',
          file_name: '',
        });
        setShowForm(false);
        alert('Job opening added successfully!');
      } catch (error) {
        console.error('Error adding job:', error);
        alert('Failed to add job opening. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file_name: file.name });
    }
  };

  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowForm(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-blue-600">Loading job openings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Job Openings</h1>
          <p className="text-gray-600">Add Job and help to your friends</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>Add Job Opening</span>
        </button>
      </div>

      {/* Add Job Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 id="modal-title" className="text-xl font-bold text-gray-900 mb-4">Add New Job Opening</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DA Name</label>
                  <input
                    type="text"
                    value={formData.da_name}
                    onChange={(e) => setFormData({ ...formData, da_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Link</label>
                  <input
                    type="url"
                    value={formData.job_link}
                    onChange={(e) => setFormData({ ...formData, job_link: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File Upload (Optional)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.txt"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <span>Choose File</span>
                    </label>
                    {formData.file_name && (
                      <span className="text-sm text-gray-600">{formData.file_name}</span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {submitting ? 'Adding...' : 'Add Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Recent Jobs */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-green-900 mb-4">Recently Added Jobs</h2>

        {recentJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No jobs added yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Job Opening</h3>
                    <div className="space-y-1 text-sm">
                      <div className="text-gray-700">DA: {job.da_name}</div>
                      <div className="text-gray-700">Company: {job.company_name}</div>
                      {job.phone_number && (
                        <div className="text-gray-700">Phone: {job.phone_number}</div>
                      )}
                      <div>
                        <a
                          href={job.job_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          View Job Details
                        </a>
                      </div>
                      {job.file_name && (
                        <div className="text-gray-700">{job.file_name}</div>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobOpenings;
