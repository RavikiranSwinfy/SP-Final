import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const AskQuestions: React.FC = () => {
  const { addQuestion } = useApp();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [questions, setQuestions] = useState([{ id: Date.now(), text: '' }]);
  const [askedBy, setAskedBy] = useState('');

  const topics = ['Advanced Excel', 'SQL', 'Power BI', 'Tableau', 'Python', 'AI', 'ML'];

  const addQuestionField = () => {
    setQuestions([...questions, { id: Date.now(), text: '' }]);
  };

  const removeQuestionField = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const updateQuestion = (id: number, text: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTopic && askedBy && questions.some(q => q.text.trim())) {
      try {
        for (const question of questions) {
          if (question.text.trim()) {
            await addQuestion({
              text: question.text.trim(),
              topic: selectedTopic,
              asked_by: askedBy.trim(),
            });
          }
        }
        setQuestions([{ id: Date.now(), text: '' }]);
        setSelectedTopic('');
        setAskedBy('');
        alert('Questions submitted successfully!');
      } catch (error) {
        console.error('Error submitting questions:', error);
        alert('Failed to submit questions. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-900 mb-3">Ask Your Questions</h1>
        <p className="text-lightgreen-600">Submit your doubts and questions to get expert answers</p>
      </div>

      <div className="bg-blue-50 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Asked By Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
            <input
              type="text"
              value={askedBy}
              onChange={(e) => setAskedBy(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Topic Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Topic</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Choose a topic...</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          {/* Questions Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">Questions</label>
              <button
                type="button"
                onClick={addQuestionField}
                className="flex items-center space-x-1 text-blue-700 hover:text-blue-900 text-sm"
              >
                <span>Add Question</span>
              </button>
            </div>

            <div className="space-y-3">
              {questions.map((question, index) => (
                <div key={question.id} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <textarea
                      value={question.text}
                      onChange={(e) => updateQuestion(question.id, e.target.value)}
                      placeholder={`Question ${index + 1}...`}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      required={index === 0}
                    />
                  </div>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestionField(question.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <span>Submit Questions</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskQuestions;