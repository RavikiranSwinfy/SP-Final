import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const HRDatabase: React.FC = () => {
  const { hrEntries, addHREntry, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    da_name: '',
    company_name: '',
    hr_name: '',
    hr_contact: '',
    questions: [''], // <-- Add questions array
  });

  const filteredEntries = hrEntries.filter(entry =>
    entry.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.hr_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.hr_contact.includes(searchTerm)
  );

  const handleQuestionChange = (idx: number, value: string) => {
    const updated = [...formData.questions];
    updated[idx] = value;
    setFormData({ ...formData, questions: updated });
  };

  const handleAddQuestion = () => {
    setFormData({ ...formData, questions: [...formData.questions, ''] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.da_name &&
      formData.company_name &&
      formData.hr_name &&
      formData.hr_contact
    ) {
      try {
        await addHREntry(formData);
        setFormData({
          da_name: '',
          company_name: '',
          hr_name: '',
          hr_contact: '',
          questions: [''],
        });
        setShowForm(false);
        alert('HR entry added successfully!'); // <-- Add this line
      } catch (error) {
        console.error('Error adding HR entry:', error);
        alert('Failed to add HR entry. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Loading HR database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">HR Database</h1>
          <p className="text-blue-800">Search HR contacts and Add HR Contacts</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>Add HR Entry</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by company name, HR name, or phone number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Add HR Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add New HR Entry</h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">HR Name</label>
                  <input
                    type="text"
                    value={formData.hr_name}
                    onChange={(e) => setFormData({ ...formData, hr_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">HR Contact</label>
                  <input
                    type="tel"
                    value={formData.hr_contact}
                    onChange={(e) => setFormData({ ...formData, hr_contact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Questions</label>
                  {formData.questions.map((q, idx) => (
                    <div key={idx} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={q}
                        onChange={(e) => handleQuestionChange(idx, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Question ${idx + 1}`}
                        required
                      />
                      {idx === formData.questions.length - 1 && (
                        <button
                          type="button"
                          onClick={handleAddQuestion}
                          className="ml-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                          title="Add another question"
                        >
                          +
                        </button>
                      )}
                    </div>
                  ))}
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
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* HR Entries List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEntries.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No HR entries found</p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{entry.hr_name}</h3>
                  <p className="text-sm text-gray-500">Added by {entry.da_name}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(entry.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-900">{entry.company_name}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-900">{entry.hr_contact}</span>
                </div>
                {entry.questions && entry.questions.length > 0 && (
                  <div>
                    <div className="font-semibold text-sm text-gray-700">Questions:</div>
                    <ul className="list-disc list-inside text-sm text-gray-800">
                      {entry.questions.map((q: string, i: number) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HRDatabase;