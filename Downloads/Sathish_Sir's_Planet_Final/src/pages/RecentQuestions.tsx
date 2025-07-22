import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const RecentQuestions: React.FC = () => {
  const { questions, answers, addAnswer, loading } = useApp();
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [answeredBy, setAnsweredBy] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Group questions by topic
  const groupedQuestions = questions.reduce((acc, question) => {
    if (!acc[question.topic]) {
      acc[question.topic] = [];
    }
    acc[question.topic].push(question);
    return acc;
  }, {} as Record<string, typeof questions>);

  // Lock scroll when modal is open
  useEffect(() => {
    if (selectedQuestion) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedQuestion]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion || !answerText.trim() || !answeredBy.trim()) return;

    setSubmitting(true);
    try {
      await addAnswer({
        question_id: selectedQuestion,
        answer_text: answerText.trim(),
        answered_by: answeredBy.trim(),
      });
      setSelectedQuestion(null);
      setAnswerText('');
      setAnsweredBy('');
      alert('Answer submitted successfully!');
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getAnswerCount = (questionId: string) => {
    return answers.filter(answer => answer.question_id === questionId).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Recent Questions</h1>
        <p className="text-blue-600">Questions submitted by users, grouped by topic</p>
      </div>

      {Object.keys(groupedQuestions).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No questions submitted yet</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedQuestions).map(([topic, topicQuestions]) => (
            <div key={topic} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                {topic}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({topicQuestions.length} questions)
                </span>
              </h2>

              <div className="space-y-4">
                {topicQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-gray-900 font-medium flex-1">{question.text}</p>
                      <div className="flex items-center space-x-2 ml-4">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded ${
                            getAnswerCount(question.id) > 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {getAnswerCount(question.id) > 0 ? 'Answered' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-4">
                        <span>{question.asked_by}</span>
                        <span>{new Date(question.created_at).toLocaleDateString()}</span>
                      </div>
                      <span className="text-xs">{getAnswerCount(question.id)} answers</span>
                    </div>

                    <button
                      onClick={() => setSelectedQuestion(question.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Give Answer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Answer Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Submit Answer</h2>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  {questions.find((q) => q.id === selectedQuestion)?.text}
                </p>
              </div>

              <form onSubmit={handleSubmitAnswer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={answeredBy}
                    onChange={(e) => setAnsweredBy(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Enter your answer..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedQuestion(null);
                      setAnswerText('');
                      setAnsweredBy('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Answer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentQuestions;
