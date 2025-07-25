import React, { useState } from 'react';
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
}

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

  const currentDate = new Date();
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    const startOfWeek = date.getDate() - date.getDay() + 1;
    date.setDate(startOfWeek + i);
    return date;
  });

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
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
          My calendar!
        </h1>
        <p className="text-muted-foreground text-sm">
          {activities.length === 0 
            ? "No activities scheduled yet. Add some from 'Spin a day'!" 
            : `You have ${totalTasks} activities scheduled today.`
          }
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
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No activities yet</h3>
            <p className="text-muted-foreground mb-6">
              Visit 'Spin a day' to discover and add activities to your calendar
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="h-12 px-6 rounded-2xl"
            >
              Go to Spin a day
            </Button>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              {/* Time */}
              <div className="text-2xl font-bold text-foreground w-16 pt-2">
                {activity.time}
              </div>
              
              {/* Activity Card */}
              <div className={`flex-1 p-4 rounded-2xl border border-border/50 transition-all duration-300 hover:shadow-soft ${getActivityBgColor(activity.color)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {activity.title}
                    </p>
                    {activity.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.description}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      {activity.location && (
                        <span className="text-xs px-2 py-1 bg-muted rounded-full">
                          📍 {activity.location}
                        </span>
                      )}
                      {activity.duration && (
                        <span className="text-xs px-2 py-1 bg-muted rounded-full">
                          ⏱️ {activity.duration}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Delete Button with Confirmation */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="ml-2 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
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