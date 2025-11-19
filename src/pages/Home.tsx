import React from 'react';
import ParentDashboard from '@/components/ParentDashboard';
import BottomNav from '@/components/BottomNav';

const Home = () => {
  return (
    <div className="relative min-h-screen bg-[#FBF7EF]">
      <ParentDashboard />
      <BottomNav activeTab="home" />
    </div>
  );
};

export default Home;