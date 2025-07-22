import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import DashboardIcon from '../assets/dashboard.png';
import HrIcon from '../assets/HR.jpg';
import AskIcon from '../assets/questions.png';
import RecentIcon from '../assets/recent.png';
import AnswersIcon from '../assets/answers.png';
import JobsIcon from '../assets/jobs.png';
import CurrentIcon from '../assets/recent.png';
import LogoIcon from '../assets/Sathish.jpg';
import MenuIcon from '../assets/menu.png';
import CloseIcon from '../assets/close.png';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: DashboardIcon },
    { path: '/hr-database', label: 'HR Database', icon: HrIcon },
    { path: '/ask-questions', label: 'Ask Questions', icon: AskIcon },
    { path: '/recent-questions', label: 'Recent Questions', icon: RecentIcon },
    { path: '/expert-answers', label: 'Expert Answers', icon: AnswersIcon },
    { path: '/job-openings', label: 'Job Openings', icon: JobsIcon },
    { path: '/current-jobs', label: 'Current Jobs', icon: CurrentIcon },
  ];

  // ✅ Fix: only exact path '/' matches Dashboard
  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img src={LogoIcon} alt="Sathish Sir's Planet" className="h-10 w-10 rounded" />
            <span className="text-lg font-bold text-gray-900">Sathish Sir's Planet</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 flex-nowrap overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center whitespace-nowrap space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-green-700'
                    : 'text-blue-900 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                <img src={item.icon} alt={item.label} className="h-5 w-5 rounded" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <img
                src={isOpen ? CloseIcon : MenuIcon}
                alt="Menu"
                className="h-6 w-6 rounded"
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <img src={item.icon} alt={item.label} className="h-5 w-5 rounded" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
