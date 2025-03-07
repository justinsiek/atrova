import { motion } from 'framer-motion'
import { AI_STATUS } from '../types'
import { COLORS } from '@/constants/colors'
import { User, Bell, ChevronDown, Settings } from 'lucide-react'

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
  username?: string
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
  weekOffset,
  username = "Guest"
}: CalendarToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-3 gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={goToToday}
          className="px-3 py-1.5 rounded-md shadow-sm text-sm font-medium"
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
            className="px-2.5 py-1.5 rounded-l-md text-sm font-medium"
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
            className="px-2.5 py-1.5 rounded-r-md text-sm font-medium"
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
      
      <div className="flex items-center gap-2">
        <button
          className="p-1.5 rounded-full hover:bg-opacity-10 transition-colors"
          style={{ 
            color: COLORS.darkBrown,
            backgroundColor: COLORS.paperWhite,
            border: `1px solid ${COLORS.borderLight}`
          }}
        >
          <Bell size={16} />
        </button>
        
        <button
          className="p-1.5 rounded-full hover:bg-opacity-10 transition-colors"
          style={{ 
            color: COLORS.darkBrown,
            backgroundColor: COLORS.paperWhite,
            border: `1px solid ${COLORS.borderLight}`
          }}
        >
          <Settings size={16} />
        </button>
        
        <div 
          className="flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer"
          style={{ 
            backgroundColor: COLORS.paperWhite,
            border: `1px solid ${COLORS.borderLight}`
          }}
        >
          <div 
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ backgroundColor: COLORS.eventMint }}
          >
            <User size={14} color={COLORS.darkBrown} />
          </div>
          
          <div className="flex flex-col leading-tight">
            <span 
              className="text-sm font-medium"
              style={{ color: COLORS.darkBrown }}
            >
              {username}
            </span>
            <span 
              className="text-xs"
              style={{ color: COLORS.lightBrown }}
            >
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          
          <ChevronDown size={14} color={COLORS.lightBrown} />
        </div>
      </div>
    </div>
  )
} 