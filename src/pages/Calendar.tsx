import React, { useState } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';

interface ScheduledActivity {
  id: string;
  time: string;
  title: string;
  description: string;
  completed: boolean;
  color: 'yellow' | 'blue' | 'beige' | 'green';
}

const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ScheduledActivity[]>([
    {
      id: '1',
      time: '09:00',
      title: 'An appointment with a children\'s dentist',
      description: '',
      completed: true,
      color: 'yellow'
    },
    {
      id: '2',
      time: '15:30',
      title: 'Get Ben for football lessons',
      description: 'which will be preparation for the competition, which will take place on 17.03.2024.',
      completed: false,
      color: 'blue'
    },
    {
      id: '3',
      time: '16:00',
      title: 'Pick up Anita from English lessons',
      description: '',
      completed: false,
      color: 'beige'
    },
    {
      id: '4',
      time: '20:00',
      title: 'To go with my husband to a performance',
      description: 'for which we had been waiting for two months. Time together.',
      completed: false,
      color: 'green'
    }
  ]);

  const currentDate = new Date();
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    const startOfWeek = date.getDate() - date.getDay() + 1;
    date.setDate(startOfWeek + i);
    return date;
  });

  const toggleActivity = (id: string) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id 
          ? { ...activity, completed: !activity.completed }
          : activity
      )
    );
  };

  const getActivityBgColor = (color: string) => {
    switch (color) {
      case 'yellow': return 'bg-gradient-to-br from-primary/20 to-primary/10';
      case 'blue': return 'bg-gradient-to-br from-secondary to-secondary/80';
      case 'beige': return 'bg-gradient-to-br from-muted to-muted/60';
      case 'green': return 'bg-gradient-to-br from-accent to-accent/80';
      default: return 'bg-muted';
    }
  };

  const completedTasks = activities.filter(a => a.completed).length;
  const totalTasks = activities.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 pt-12 mb-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/')}
          className="w-10 h-10 p-0 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full">
            <CalendarIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Greeting Section */}
      <div className="px-4 mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Hello Monica!
        </h1>
        <p className="text-2xl text-primary font-medium mb-4">
          Good day
        </p>
        <p className="text-muted-foreground text-sm">
          You've to complete <span className="font-semibold text-foreground">{totalTasks - completedTasks} tasks</span> today.
        </p>
      </div>

      {/* Date Header */}
      <div className="px-4 mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          {currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            day: '2-digit', 
            month: 'long' 
          })}
        </h2>
      </div>

      {/* Week Calendar */}
      <div className="px-4 mb-8">
        <div className="flex justify-between">
          {currentWeek.map((date, index) => {
            const isToday = date.toDateString() === currentDate.toDateString();
            return (
              <div key={index} className="flex flex-col items-center">
                <span className="text-sm text-muted-foreground mb-1">
                  {weekDays[index]}
                </span>
                <div className={`w-10 h-10 flex items-center justify-center rounded-2xl font-semibold transition-all duration-300 ${
                  isToday 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'text-foreground hover:bg-muted'
                }`}>
                  {date.getDate().toString().padStart(2, '0')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Schedule */}
      <div className="px-4 space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            {/* Time */}
            <div className="text-2xl font-bold text-foreground w-16 pt-2">
              {activity.time}
            </div>
            
            {/* Activity Card */}
            <div className={`flex-1 p-4 rounded-2xl border border-border/50 transition-all duration-300 hover:shadow-soft ${getActivityBgColor(activity.color)}`}>
              <div className="flex items-start gap-3">
                <Checkbox 
                  checked={activity.completed}
                  onCheckedChange={() => toggleActivity(activity.id)}
                  className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <div className="flex-1">
                  <p className={`font-medium text-foreground ${
                    activity.completed ? 'line-through opacity-60' : ''
                  }`}>
                    {activity.title}
                  </p>
                  {activity.description && (
                    <p className={`text-sm text-muted-foreground mt-1 ${
                      activity.completed ? 'line-through opacity-60' : ''
                    }`}>
                      {activity.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;