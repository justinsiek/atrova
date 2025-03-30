export type AI_STATUS = 'idle' | 'loading' | 'success' | 'error'; 

export interface EventType {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  timestamp: number; // Unix timestamp in milliseconds
  color: "pink" | "mint" | "blue" | "purple" | "orange";
  description?: string;
  isRecurring: boolean;
  recurringDays: string | null;
  recurringEndDate: string | null;
}

export interface Day {
  day: number;
  month: number;
  year: number;
  weekday: string;
  isToday: boolean;
} 