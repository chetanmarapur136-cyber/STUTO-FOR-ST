
export interface User {
  id: string;
  name: string;
  email: string;
  course: string;
  semester: string;
  attendanceGoal: number;
  monthlyBudget: number;
  darkMode: boolean;
}

export interface Subject {
  id: string;
  name: string;
  teacher: string;
  totalPlanned?: number;
}

export type AttendanceStatus = 'present' | 'absent';

export interface AttendanceRecord {
  id: string;
  subjectId: string;
  date: string;
  status: AttendanceStatus;
}

export interface Mark {
  id: string;
  subjectId: string;
  examName: string;
  score: number;
  total: number;
  date: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: 'Food' | 'Travel' | 'Books' | 'Hostel' | 'Misc';
  date: string;
  note: string;
}

export interface Event {
  id: string;
  title: string;
  type: 'Exam' | 'Assignment' | 'Study Plan' | 'Fee' | 'Other';
  date: string;
}

export interface Note {
  id: string;
  subjectId: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface AppData {
  user: User | null;
  subjects: Subject[];
  attendance: AttendanceRecord[];
  marks: Mark[];
  expenses: Expense[];
  events: Event[];
  notes: Note[];
}
