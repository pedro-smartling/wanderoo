import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MessageSquare, Search, Calendar, Shuffle, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BottomNav from '@/components/BottomNav';

const Home = () => {
  const navigate = useNavigate();

  const mainActions = [
    {
      id: 'voice',
      title: 'Talk to wanderoo',
      subtitle: 'Your kids activity planner companion',
      icon: Mic,
      bgColor: 'bg-purple-100',
      iconBg: 'bg-white',
      size: 'large',
      onClick: () => navigate('/chat')
    },
    {
      id: 'spin',
      title: 'Spin a day',
      subtitle: 'Discover activities',
      icon: Shuffle,
      bgColor: 'bg-yellow-100',
      iconBg: 'bg-white',
      size: 'medium',
      badge: 'New',
      onClick: () => navigate('/spin')
    },
    {
      id: 'calendar',
      title: 'My Calendar',
      subtitle: 'View planned activities',
      icon: Calendar,
      bgColor: 'bg-gray-800',
      iconBg: 'bg-white',
      textColor: 'text-white',
      size: 'medium',
      onClick: () => navigate('/calendar')
    }
  ];

  const recentActivities = [
    {
      id: 'activity1',
      title: 'What outdoor activities can I do?',
      icon: Search,
      bgColor: 'bg-purple-100'
    },
    {
      id: 'activity2', 
      title: 'Planning weekend activities',
      icon: Calendar,
      bgColor: 'bg-gray-800'
    },
    {
      id: 'activity3',
      title: 'Find creative indoor activities',
      icon: MessageSquare,
      bgColor: 'bg-yellow-100'
    },
    {
      id: 'activity4',
      title: 'Show nearby adventure spots',
      icon: Search,
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Hello James</h1>
          <p className="text-muted-foreground text-lg">Make your day easy with us</p>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {mainActions.map((action) => {
            const Icon = action.icon;
            const isLarge = action.size === 'large';
            
            return (
              <Card
                key={action.id}
                className={`
                  ${action.bgColor} 
                  ${isLarge ? 'col-span-2 h-32' : 'h-32'} 
                  p-4 cursor-pointer hover:scale-105 transition-transform border-none relative overflow-hidden
                `}
                onClick={action.onClick}
              >
                {action.badge && (
                  <Badge className="absolute top-3 right-3 bg-red-500 text-white text-xs">
                    {action.badge}
                  </Badge>
                )}
                
                <div className="flex flex-col justify-between h-full">
                  <div className={`${action.iconBg} w-10 h-10 rounded-full flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${action.textColor === 'text-white' ? 'text-gray-800' : 'text-gray-600'}`} />
                  </div>
                  
                  <div>
                    <h3 className={`font-semibold text-lg mb-1 ${action.textColor || 'text-gray-900'}`}>
                      {action.title}
                    </h3>
                    <p className={`text-sm ${action.textColor === 'text-white' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {action.subtitle}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Activities Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">Recent Search</h2>
            <button className="text-muted-foreground text-sm hover:text-foreground">
              See All
            </button>
          </div>

          <div className="space-y-3">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              
              return (
                <Card 
                  key={activity.id}
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className={`${activity.bgColor} w-10 h-10 rounded-full flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${activity.bgColor.includes('gray-800') ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-foreground font-medium">{activity.title}</p>
                    </div>
                    
                    <button className="text-muted-foreground hover:text-foreground">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                        <div className="w-1 h-1 bg-current rounded-full mx-1"></div>
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                      </div>
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default Home;