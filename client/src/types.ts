export type AI_STATUS = 'idle' | 'loading' | 'success' | 'error'; 

export interface EventType {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: number;
  color: "pink" | "mint" | "blue" | "purple" | "orange";
  description?: string;
  aiGenerated?: boolean;
}

export interface Day {
  day: number;
  month: number;
  year: number;
  weekday: string;
  isToday: boolean;
} 