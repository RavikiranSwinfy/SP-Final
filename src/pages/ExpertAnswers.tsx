import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const ExpertAnswers: React.FC = () => {
  const { questions, answers, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  const topics = ['All', 'Advanced Excel', 'SQL', 'Power BI', 'Tableau', 'Python', 'AI', 'ML'];

  const answeredQuestions = questions.filter(question => 
    answers.some(answer => answer.question_id === question.id)
  );

  const filteredQuestions = answeredQuestions.filter(question => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = selectedTopic === 'All' || selectedTopic === '' || question.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  const getAnswersForQuestion = (questionId: string) => {
    return answers.filter(answer => answer.question_id === questionId);
  };

  const groupedByTopic = filteredQuestions.reduce((acc, question) => {
    if (!acc[question.topic]) {
      acc[question.topic] = [];
    }
    acc[question.topic].push(question);
    return acc;
  }, {} as Record<string, typeof questions>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Loading expert answers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Expert Answers</h1>
        <p className="text-gray-600">Browse answered questions and expert responses</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {topics.map(topic => (
                <option key={topic} value={topic === 'All' ? '' : topic}>{topic}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {Object.keys(groupedByTopic).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No answered questions found</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByTopic).map(([topic, topicQuestions]) => (
            <div key={topic} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                {topic}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({topicQuestions.length} questions)
                </span>
              </h2>

              <div className="space-y-6">
                {topicQuestions.map((question) => {
                  const questionAnswers = getAnswersForQuestion(question.id);
                  
                  return (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                      {/* Question */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{question.text}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            {question.asked_by}
                          </span>
                          <span className="flex items-center">
                            {new Date(question.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Answers */}
                      <div className="space-y-4">
                        {questionAnswers.map((answer) => (
                          <div key={answer.id} className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                            <p className="text-gray-800 mb-2">{answer.answer_text}</p>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span className="flex items-center">
                                Expert: {answer.answered_by}
                              </span>
                              <span className="flex items-center">
                                {new Date(answer.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpertAnswers;