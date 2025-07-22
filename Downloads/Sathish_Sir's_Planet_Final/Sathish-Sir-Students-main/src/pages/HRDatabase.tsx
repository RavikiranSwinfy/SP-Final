import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const HRDatabase: React.FC = () => {
  const { hrEntries, addHREntry, loading, questions, addQuestion } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    da_name: '',
    company_name: '',
    hr_name: '',
    hr_contact: '',
  });

  // For multiple questions
  const [questionsList, setQuestionsList] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');

  const filteredEntries = hrEntries.filter(entry =>
    entry.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.hr_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(entry.hr_contact).includes(searchTerm)
  );

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentQuestion.trim()) {
      setQuestionsList([...questionsList, currentQuestion.trim()]);
      setCurrentQuestion('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.da_name && formData.company_name && formData.hr_name && formData.hr_contact) {
      try {
        await addHREntry(formData);

        // Add all questions (only text)
        for (const q of questionsList) {
            await addQuestion({
            text: q,
            topic: formData.company_name
            });
        }

        setFormData({ da_name: '', company_name: '', hr_name: '', hr_contact: '' });
        setQuestionsList([]);
        setCurrentQuestion('');
        setShowForm(false);
      } catch (error) {
        console.error('Error adding data:', error);
        alert('Failed to add HR entry or questions. Please try again.');
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
    <div className="space-y-6 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">HR Database</h1>
          <p className="text-blue-800">Search HR contacts and Add HR Contacts</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>Add HR Entry</span>
          </button>
        </div>
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

      {/* Add HR Form Modal (with Questions) */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
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

                {/* Add Questions Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Add Questions</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                      <input
                        type="text"
                        value={currentQuestion}
                        onChange={(e) => setCurrentQuestion(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Type your question"
                      />
                    </div>
                    <div className="flex space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        + Add More Questions
                      </button>
                    </div>
                  </div>
                  {/* Show added questions */}
                  {questionsList.length > 0 && (
                    <ul className="mt-4 list-disc pl-5 text-green-700">
                      {questionsList.map((q, idx) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ da_name: '', company_name: '', hr_name: '', hr_contact: '' });
                      setQuestionsList([]);
                      setCurrentQuestion('');
                    }}
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
              </div>
            </div>
          ))
        )}
      </div>

      {/* Asked Questions Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-green-900 mb-4">Asked Questions</h2>
        {questions.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No questions found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map((q) => (
              <div key={q.id} className="bg-green-50 rounded-lg shadow p-4">
                <div className="font-semibold text-green-900 mb-2">{q.text}</div>
                {/* Topic and Asked By removed */}
                <div className="text-xs text-gray-400">{new Date(q.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HRDatabase;
