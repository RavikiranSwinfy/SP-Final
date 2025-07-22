import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface HREntry {
  id: string;
  da_name: string;
  company_name: string;
  hr_name: string;
  hr_contact: string;
  created_at: string;
}

export interface Question {
  id: string;
  text: string;
  topic?: string; // <-- Added topic property
  created_at: string;
}

export interface Answer {
  id: string;
  question_id: string;
  answer_text: string;
  answered_by: string;
  created_at: string;
}

export interface Job {
  id: string;
  da_name: string;
  company_name: string;
  phone_number?: string | null;
  job_link: string;
  file_name?: string | null;
  created_at: string;
}

interface AppContextType {
  hrEntries: HREntry[];
  questions: Question[];
  answers: Answer[];
  jobs: Job[];
  loading: boolean;
  addHREntry: (entry: Omit<HREntry, 'id' | 'created_at'>) => Promise<void>;
  addQuestion: (question: Omit<Question, 'id' | 'created_at'>) => Promise<void>;
  addAnswer: (answer: Omit<Answer, 'id' | 'created_at'>) => Promise<void>;
  addJob: (job: Omit<Job, 'id' | 'created_at'>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hrEntries, setHREntries] = useState<HREntry[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHREntries = async () => {
    const { data, error } = await supabase
      .from('hr_entries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching HR entries:', error);
      return;
    }
    setHREntries(data || []);
  };

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching questions:', error);
      return;
    }
    setQuestions(data || []);
  };

  const fetchAnswers = async () => {
    const { data, error } = await supabase
      .from('answers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching answers:', error);
      return;
    }
    setAnswers(data || []);
  };

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching jobs:', error);
      return;
    }
    setJobs(data || []);
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([
      fetchHREntries(),
      fetchQuestions(),
      fetchAnswers(),
      fetchJobs()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addHREntry = async (entry: Omit<HREntry, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('hr_entries')
      .insert([entry])
      .select()
      .single();
    if (error) {
      console.error('Error adding HR entry:', error);
      throw error;
    }
    setHREntries(prev => [data, ...prev]);
  };

  const addQuestion = async (question: Omit<Question, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('questions')
      .insert([question])
      .select()
      .single();
    if (error) {
      console.error('Error adding question:', error);
      throw error;
    }
    setQuestions(prev => [data, ...prev]);
  };

  const addAnswer = async (answer: Omit<Answer, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('answers')
      .insert([answer])
      .select()
      .single();
    if (error) {
      console.error('Error adding answer:', error);
      throw error;
    }
    setAnswers(prev => [data, ...prev]);
  };

  const addJob = async (job: Omit<Job, 'id' | 'created_at'>) => {
    const jobToInsert = {
      da_name: job.da_name,
      company_name: job.company_name,
      job_link: job.job_link,
      phone_number: job.phone_number ?? null,
      file_name: job.file_name ?? null,
    };
    const { data, error } = await supabase
      .from('jobs')
      .insert([jobToInsert])
      .select()
      .single();
    if (error) {
      window.alert('Failed to add job opening. Please try again.');
      console.error('Error adding job:', error);
      throw error;
    }
    setJobs(prev => [data, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      hrEntries,
      questions,
      answers,
      jobs,
      loading,
      addHREntry,
      addQuestion,
      addAnswer,
      addJob,
      refreshData,
    }}>
      {children}
    </AppContext.Provider>
  );
};
