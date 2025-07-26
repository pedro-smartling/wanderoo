import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, Bell, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';

interface ScheduledActivity {
  id: string;
  time: string;
  title: string;
  description: string;
  completed: boolean;
  color: 'yellow' | 'blue' | 'beige' | 'green';
  category: string;
  location: string;
  duration: string;
  scheduledDate?: string; // Add scheduled date field
}

const getMonthDays = (year: number, month: number) => {
  const days = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const Calendar: React.FC = () => {
  const navigate = useNavigate();
  
  // Load approved activities from localStorage
  const [activities, setActivities] = useState<ScheduledActivity[]>(() => {
    const saved = localStorage.getItem('approvedActivities');
    return saved ? JSON.parse(saved) : [];
  });

  // Save activities to localStorage whenever activities change
  React.useEffect(() => {
    localStorage.setItem('approvedActivities', JSON.stringify(activities));
  }, [activities]);

  // Infinite day scroller state
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [centerMonth, setCenterMonth] = useState(today.getMonth());
  const [centerYear, setCenterYear] = useState(today.getFullYear());

  // Generate days for prev, current, next month
  const prevMonth = centerMonth === 0 ? 11 : centerMonth - 1;
  const prevYear = centerMonth === 0 ? centerYear - 1 : centerYear;
  const nextMonth = centerMonth === 11 ? 0 : centerMonth + 1;
  const nextYear = centerMonth === 11 ? centerYear + 1 : centerYear;

  const prevMonthDays = getMonthDays(prevYear, prevMonth);
  const currentMonthDays = getMonthDays(centerYear, centerMonth);
  const nextMonthDays = getMonthDays(nextYear, nextMonth);
  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  // Index of today in allDays
  const todayIndex = prevMonthDays.length + today.getDate() - 1;
  // Index of selectedDate in allDays
  const selectedIndex = allDays.findIndex(
    d => d.toDateString() === selectedDate.toDateString()
  );

  // Ref for the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // On mount, scroll to today
  React.useEffect(() => {
    if (scrollContainerRef.current && todayIndex >= 0) {
      const container = scrollContainerRef.current;
      const element = container.children[todayIndex] as HTMLElement;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [todayIndex]);

  // When selectedDate changes, scroll to center it
  React.useEffect(() => {
    if (scrollContainerRef.current && selectedIndex >= 0) {
      // Use scrollIntoView with center alignment and a slight delay for better positioning
      setTimeout(() => {
        const container = scrollContainerRef.current;
        const element = container?.children[selectedIndex] as HTMLElement;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }, 150);
    }
  }, [selectedIndex]);

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  const getActivityBorderColor = (color: string) => {
    switch (color) {
      case 'yellow': return 'bg-[#ffbf00]';
      case 'blue': return 'bg-[#57ae3c]';
      case 'beige': return 'bg-[#9a51e0]';
      case 'green': return 'bg-[#57ae3c]';
      default: return 'bg-[#9a51e0]';
    }
  };

  // Filter activities for the selected date
  const getActivitiesForDate = (date: Date) => {
    const dateString = date.toDateString();
    const filteredActivities = activities.filter(activity => {
      if (activity.scheduledDate) {
        return new Date(activity.scheduledDate).toDateString() === dateString;
      }
      // For backward compatibility, if no scheduledDate, show for today
      return date.toDateString() === today.toDateString();
    });

    // Sort activities by time
    return filteredActivities.sort((a, b) => {
      const timeA = convertTimeToMinutes(a.time);
      const timeB = convertTimeToMinutes(b.time);
      return timeA - timeB;
    });
  };

  // Helper function to convert time string to minutes for sorting
  const convertTimeToMinutes = (timeString: string): number => {
    // Handle formats like "3:30 PM", "2:00 PM", "9.30 am", "1 pm", etc.
    const normalizedTime = timeString.toLowerCase().replace(/\./g, ':');
    
    // Extract time parts using regex
    const timeMatch = normalizedTime.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/);
    
    if (!timeMatch) {
      // If no match, return a default value (e.g., for malformed times)
      return 0;
    }

    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2] || '0');
    const period = timeMatch[3];

    // Convert to 24-hour format
    if (period === 'pm' && hours !== 12) {
      hours += 12;
    } else if (period === 'am' && hours === 12) {
      hours = 0;
    }

    // Return total minutes since midnight
    return hours * 60 + minutes;
  };

  const selectedDateActivities = getActivitiesForDate(selectedDate);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="bg-[#fbf7ef] relative size-full">
      {/* Main Header */}
      <div className="absolute bg-white h-[108px] left-0 top-0 w-[375px] rounded-bl-[24px] rounded-br-[24px] shadow-[0px_6px_16px_0px_rgba(0,0,0,0.12)]" style={{ zIndex: 10 }}>
        <div className="flex flex-col items-center justify-center h-full px-6 pt-[52px] pb-4">
          <div className="flex flex-col items-center gap-[7px] relative w-full">
            <h1 className="font-['Reddit_Sans'] font-semibold text-[#222222] text-[18px] text-center">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
            </h1>
            <p className="font-['Reddit_Sans'] font-normal text-[#222222] text-[16px] text-center opacity-60 tracking-[-0.8px]">
              {selectedDate.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Day Scroller */}
      <div className="absolute bg-white h-[108px] left-0 top-24 w-[375px] rounded-bl-[24px] rounded-br-[24px] shadow-[0px_6px_16px_0px_rgba(0,0,0,0.12)]">
        <div className="flex items-center h-full px-6 pt-[22px] pb-4">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto w-full scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {allDays.map((date, idx) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const hasActivities = getActivitiesForDate(date).length > 0;
              return (
                <div key={date.toISOString()} className="flex flex-col items-center gap-2 min-w-[40px] flex-shrink-0">
                  {/* Day Letter */}
                  <div className="flex items-center justify-center w-[18px] h-6">
                    {isSelected ? (
                      <div className="bg-[#ff5401] rounded-md size-6 flex items-center justify-center">
                        <span className="font-['Reddit_Sans'] font-semibold text-white text-[16px]">
                          {date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-['Reddit_Sans'] font-semibold text-[#222222] text-[16px]">
                        {date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                      </span>
                    )}
                  </div>
                  
                  {/* Date Number */}
                  <button
                    onClick={() => handleDateClick(date)}
                    className={`relative flex items-center justify-center ${!isSelected ? 'opacity-60' : ''}`}
                  >
                    <span className={`font-['Reddit_Sans'] ${isSelected ? 'font-semibold text-[#202020]' : 'font-normal text-[#222222]'} text-[16px] tracking-[-0.8px]`}>
                      {date.getDate().toString().padStart(2, '0')}
                    </span>
                    {/* Activity indicator dot */}
                    {hasActivities && !isSelected && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#ff5401] rounded-full"></div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activities Content */}
      <div className="absolute left-6 top-[204px] w-[327px] flex flex-col gap-4 py-6">
        {selectedDateActivities.length === 0 ? (
          <div className="text-center py-12 w-full">
            <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-['Reddit_Sans'] font-semibold text-[#222222] mb-2">
              No activities for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </h3>
            <p className="text-[#222222] opacity-60 font-['Reddit_Sans'] mb-6">
              Visit 'Spin a day' to discover and add activities to your calendar
            </p>
            <Button 
              onClick={() => navigate('/spin')}
              className="h-12 px-6 rounded-2xl bg-[#ff5401] hover:bg-[#ff5401]/90 text-white font-['Reddit_Sans']"
            >
              Go to Spin a day
            </Button>
          </div>
        ) : (
          selectedDateActivities.map((activity, index) => (
            <div key={activity.id} className={`flex flex-col gap-2 pb-4 w-full ${index === selectedDateActivities.length - 1 ? 'mb-10' : ''}`}>
              <div className="font-['Reddit_Sans'] font-semibold text-[#202020] text-[20px] tracking-[-1px]">
                {activity.time}
              </div>
              <div className="bg-white flex gap-3 p-3 rounded-2xl shadow-[0px_6px_16px_0px_rgba(0,0,0,0.12)] w-full relative">
                <div className={`${getActivityBorderColor(activity.color)} rounded-full w-2 flex-shrink-0 self-stretch`} />
                <div className="flex-1 pt-1 pr-10">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <h4 className="font-['Reddit_Sans'] font-semibold text-[#222222] text-[16px]">
                          {activity.title}
                        </h4>
                        <p className="font-['Reddit_Sans'] font-normal text-[#202020] text-[14px] tracking-[-0.5px] leading-[22px]">
                          {activity.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <div className="bg-[#ffd7b6] flex items-center justify-center h-6 px-3 py-2 rounded-[34px]">
                          <span className="font-['Reddit_Sans'] font-medium text-[#202020] text-[13px] tracking-[-0.5px] whitespace-nowrap">
                            📍 {activity.location}
                          </span>
                        </div>
                        <div className="bg-[#ffd7b6] flex items-center justify-center h-6 px-3 py-2 rounded-[34px]">
                          <span className="font-['Reddit_Sans'] font-medium text-[#202020] text-[13px] tracking-[-0.5px] whitespace-nowrap">
                            ⏰ {activity.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Delete Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="absolute right-3 top-3 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Activity</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{activity.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => deleteActivity(activity.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Calendar;