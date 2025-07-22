import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface HREntry {
  id: string;
  da_name: string;
  company_name: string;
  hr_name: string;
  hr_contact: string;
  created_at: string;
  questions?: string[]; // <-- Add this line
}

export interface Question {
  id: string;
  text: string;
  topic: string;
  asked_by: string;
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
  company_name: string; // <-- Added this line
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
    // 1. Fetch all HR entries
    const { data: hrEntries, error: hrError } = await supabase
      .from('hr_entries')
      .select('*');
    if (hrError) throw hrError;

    // 2. Fetch all questions
    const { data: questions, error: qError } = await supabase
      .from('questions')
      .select('*');
    if (qError) throw qError;

    // 3. Combine: attach questions to their HR entry
    const hrEntriesWithQuestions = hrEntries.map(entry => ({
      ...entry,
      questions: questions.filter(q => q.hr_entry_id === entry.id),
    }));

    // 4. Set state (replace setHrEntries with your state setter)
    setHREntries(hrEntriesWithQuestions);
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

  const addHREntry = async (entry: Omit<HREntry, 'id' | 'created_at' | 'questions'> & { questions: string[] }) => {
    // 1. Insert HR entry
    const { questions, ...hrData } = entry;
    const { data: hrEntry, error: hrError } = await supabase
      .from('hr_entries')
      .insert([hrData])
      .select()
      .single();
    if (hrError) throw hrError;

    // 2. Insert questions with hr_entry_id
    if (questions && questions.length > 0) {
      const questionRows = questions.map((q) => ({
        text: q,
        topic: '', // or fill as needed
        asked_by: '', // or fill as needed
        hr_entry_id: hrEntry.id,
      }));
      const { error: qError } = await supabase.from('questions').insert(questionRows);
      if (qError) throw qError;
    }

    // 3. Optionally, fetch questions and add to hrEntry object for local state
    // ...your state update logic...
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
    // Ensure all required fields are present and handle optional fields
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
      // Show alert for error
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