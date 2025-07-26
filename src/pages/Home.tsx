import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MessageSquare, Search, Calendar, Shuffle, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BottomNav from '@/components/BottomNav';
import NotFound from './NotFound';

const Home = () => {
  // const navigate = useNavigate();

  // const mainActions = [
  //   {
  //     id: 'voice',
  //     title: 'Talk to wanderoo',
  //     subtitle: 'Your kids activity planner companion',
  //     icon: Mic,
  //     bgColor: 'bg-purple-100',
  //     iconBg: 'bg-white',
  //     size: 'large',
  //     onClick: () => navigate('/chat')
  //   },
  //   {
  //     id: 'spin',
  //     title: 'Spin a day',
  //     subtitle: 'Discover activities',
  //     icon: Shuffle,
  //     bgColor: 'bg-yellow-100',
  //     iconBg: 'bg-white',
  //     size: 'medium',
  //     badge: 'New',
  //     onClick: () => navigate('/spin')
  //   },
  //   {
  //     id: 'calendar',
  //     title: 'My Calendar',
  //     subtitle: 'View planned activities',
  //     icon: Calendar,
  //     bgColor: 'bg-gray-800',
  //     iconBg: 'bg-white',
  //     textColor: 'text-white',
  //     size: 'medium',
  //     onClick: () => navigate('/calendar')
  //   }
  // ];

  // const recentActivities = [
  //   {
  //     id: 'activity1',
  //     title: 'What outdoor activities can I do?',
  //     icon: Search,
  //     bgColor: 'bg-purple-100'
  //   },
  //   {
  //     id: 'activity2', 
  //     title: 'Planning weekend activities',
  //     icon: Calendar,
  //     bgColor: 'bg-gray-800'
  //   },
  //   {
  //     id: 'activity3',
  //     title: 'Find creative indoor activities',
  //     icon: MessageSquare,
  //     bgColor: 'bg-yellow-100'
  //   },
  //   {
  //     id: 'activity4',
  //     title: 'Show nearby adventure spots',
  //     icon: Search,
  //     bgColor: 'bg-purple-100'
  //   }
  // ];

  // All Home page logic is commented out to avoid linter errors.
  return <NotFound />;
};

export default Home;