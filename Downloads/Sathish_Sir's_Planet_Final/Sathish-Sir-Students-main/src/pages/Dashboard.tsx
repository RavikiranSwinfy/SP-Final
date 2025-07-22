import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

// ✅ Local image imports
import HrIcon from '../assets/HR.jpg';
import QuestionsIcon from '../assets/questions.png';
import AnswersIcon from '../assets/answers.png';
import UnansweredIcon from '../assets/unanswered.png';

const Dashboard: React.FC = () => {
  const { hrEntries, questions, answers, jobs, loading } = useApp();

  const unansweredCount = questions.length - answers.length;

  // 📊 1. Most Asked Questions
  const questionFrequency = questions.reduce((acc: Record<string, number>, q) => {
    acc[q.text] = (acc[q.text] || 0) + 1;
    return acc;
  }, {});

  const mostAskedQuestions = Object.entries(questionFrequency)
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 📊 2. Recently Added Questions by Topic
  const recentQuestionsByDate = questions.filter(q => {
    const date = new Date(q.created_at);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  });

  // Group recent questions by topic
  const topicCounts: Record<string, number> = {};
  recentQuestionsByDate.forEach(q => {
    const topic = q.topic || 'Unknown';
    topicCounts[topic] = (topicCounts[topic] || 0) + 1;
  });

    const recentQuestions = recentQuestionsByDate;

  const questionsPerDay: Record<string, number> = {};
  recentQuestions.forEach(q => {
    const date = new Date(q.created_at).toLocaleDateString();
    questionsPerDay[date] = (questionsPerDay[date] || 0) + 1;
  });

  const recentQuestionData = Object.entries(questionsPerDay).map(([date, count]) => ({ date, count }));

  // 📊 3. Current Jobs Count by Company
  const companyCounts = jobs.reduce((acc: Record<string, number>, job) => {
    const company = job.da_name || 'Unknown';
    acc[company] = (acc[company] || 0) + 1;
    return acc;
  }, {});

  const jobCompanyData = Object.entries(companyCounts).map(([company, count]) => ({ company, count }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  if (loading) return <p className="text-center p-4">Loading...</p>;

  return (
     <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sathish Sir's Planet</h1>
        <p className="text-gray-600">Welcome to Sathish Sir's Planet</p>
      </div>
    <div className="p-4 space-y-6">
      {/* 🔹 Cards Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-xl p-4 text-center">
          <img src={HrIcon} alt="HR" className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm text-gray-500">HR Entries</p>
          <p className="text-xl font-bold text-blue-600">{hrEntries.length}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4 text-center">
          <img src={QuestionsIcon} alt="Questions" className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Questions</p>
          <p className="text-xl font-bold text-green-600">{questions.length}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4 text-center">
          <img src={AnswersIcon} alt="Answers" className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Answers</p>
          <p className="text-xl font-bold text-yellow-600">{answers.length}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4 text-center">
          <img src={UnansweredIcon} alt="Unanswered" className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Unanswered</p>
          <p className="text-xl font-bold text-red-600">{unansweredCount}</p>
        </div>
      </div>

      {/* 🔹 Graphs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Graph 1: Most Asked Questions */}
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-2">Top 5 Most Asked Questions</h2>
          <ResponsiveContainer width="50%" height={250}>
            <BarChart data={mostAskedQuestions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="text" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0e02eaff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Graph 2: Recent Questions */}
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-2">Questions in Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={recentQuestionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#068737ff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Graph 3: Jobs per Company */}
        <div className="bg-white shadow rounded-xl p-4 md:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Jobs per Company</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={jobCompanyData}
                dataKey="count"
                nameKey="company"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {jobCompanyData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
