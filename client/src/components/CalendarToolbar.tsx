import { motion } from 'framer-motion'
import { AI_STATUS } from '../types'
import { COLORS } from '@/constants/colors'

interface CalendarToolbarProps {
  view: 'week' | 'day'
  setView: (view: 'week' | 'day') => void
  previousWeek: () => void
  nextWeek: () => void
  goToToday: () => void
  showTimeLabels: boolean
  setShowTimeLabels: (show: boolean) => void
  addEvent: () => void
  weekOffset: number
}

export function CalendarToolbar({
  view,
  setView,
  previousWeek,
  nextWeek,
  goToToday,
  showTimeLabels,
  setShowTimeLabels,
  addEvent,
  weekOffset
}: CalendarToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div className="flex items-center gap-2">
        <button
          onClick={goToToday}
          className="px-4 py-2 rounded-md shadow-sm text-sm font-medium"
          style={{ 
            backgroundColor: COLORS.paperWhite, 
            color: COLORS.darkBrown,
            border: `1px solid ${COLORS.borderLight}`
          }}
        >
          Today
        </button>
        
        <div className="flex rounded-md shadow-sm" role="group">
          <button
            onClick={previousWeek}
            className="px-3 py-2 rounded-l-md text-sm font-medium"
            style={{ 
              backgroundColor: COLORS.paperWhite, 
              color: COLORS.darkBrown,
              border: `1px solid ${COLORS.borderLight}`
            }}
          >
            ←
          </button>
          <button
            onClick={nextWeek}
            className="px-3 py-2 rounded-r-md text-sm font-medium"
            style={{ 
              backgroundColor: COLORS.paperWhite, 
              color: COLORS.darkBrown,
              border: `1px solid ${COLORS.borderLight}`,
              borderLeft: 'none'
            }}
          >
            →
          </button>
        </div>
        
        <div 
          className="ml-2 text-sm font-medium"
          style={{ color: COLORS.darkBrown }}
        >
          {weekOffset === 0 ? "This Week" : 
           weekOffset === 1 ? "Next Week" :
           weekOffset === -1 ? "Last Week" :
           weekOffset > 0 ? `${weekOffset} Weeks Ahead` :
           `${Math.abs(weekOffset)} Weeks Ago`}
        </div>
      </div>    
    </div>
  )
} 