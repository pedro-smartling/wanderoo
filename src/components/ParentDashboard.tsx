import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  TrendingUp, 
  Star, 
  Sun,
  Plus,
  Search,
  Settings,
  ChevronRight,
  Heart,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  title: string;
  day: string;
  time: string;
  location: string;
  distance: string;
  type: 'indoor' | 'outdoor';
  category: string;
  icon: string;
  cost: string;
}

interface Recommendation {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  distance: string;
  type: 'indoor' | 'outdoor';
  category: string;
  icon: string;
  weatherNote: string;
}

const ParentDashboard: React.FC = () => {
  // Sample family data based on planning
  const upcomingActivities: Activity[] = [
    {
      id: '1',
      title: 'Soft Play Centre',
      day: 'Wednesday',
      time: '4:00 PM',
      location: 'Bounce & Play',
      distance: '2.3 miles',
      type: 'indoor',
      category: 'Soft Play',
      icon: '🎈',
      cost: '£15'
    },
    {
      id: '2',
      title: 'Natural History Museum',
      day: 'Saturday',
      time: '10:00 AM',
      location: 'City Museum',
      distance: '4.8 miles',
      type: 'indoor',
      category: 'Museum',
      icon: '🏛️',
      cost: 'Free'
    },
    {
      id: '3',
      title: 'Riverside Park Playground',
      day: 'Saturday',
      time: '2:30 PM',
      location: 'Riverside Park',
      distance: '1.5 miles',
      type: 'outdoor',
      category: 'Playground',
      icon: '🎪',
      cost: 'Free'
    },
    {
      id: '4',
      title: 'Petting Farm Visit',
      day: 'Sunday',
      time: '11:00 AM',
      location: 'Sunny Meadows Farm',
      distance: '8.2 miles',
      type: 'outdoor',
      category: 'Farm',
      icon: '🐑',
      cost: '£28'
    }
  ];

  const smartRecommendations: Recommendation[] = [
    {
      id: 'r1',
      title: 'Little Artists Studio',
      subtitle: 'Art & Craft Workshop',
      description: 'Perfect for Emma! Paint, create, and explore creativity together.',
      distance: '3.2 miles',
      type: 'indoor',
      category: 'Art & Craft',
      icon: '🎨',
      weatherNote: 'Indoor activity - perfect for any weather!'
    },
    {
      id: 'r2',
      title: 'Mini Football Skills',
      subtitle: 'Sports Session',
      description: 'New activity type - Leo will love running around!',
      distance: '5.8 miles',
      type: 'outdoor',
      category: 'Sports',
      icon: '⚽',
      weatherNote: 'Outdoor fun - best on dry days'
    },
    {
      id: 'r3',
      title: 'Autumn Nature Trail',
      subtitle: 'Botanical Gardens',
      description: 'Seasonal adventure combining nature and learning.',
      distance: '6.5 miles',
      type: 'outdoor',
      category: 'Park',
      icon: '🍂',
      weatherNote: 'Outdoor adventure - check the forecast first'
    }
  ];

  const familyStats = {
    activitiesThisMonth: 12,
    monthlyGoal: 16,
    hoursOutdoors: 28.5,
    timeSaved: 4.5,
    totalMiles: 87,
    totalSpent: 96,
    emmaFavorite: { name: 'Art & Craft', icon: '🎨', percentage: 100 },
    leoFavorite: { name: 'Playgrounds', icon: '🎪', percentage: 100 }
  };

  const progressPercentage = (familyStats.activitiesThisMonth / familyStats.monthlyGoal) * 100;

  const handleViewDetails = (activityId: string) => {
    console.log('View details for activity:', activityId);
    // TODO: Navigate to activity details page
  };

  const handleAddToWeekend = (recommendationId: string) => {
    console.log('Add to weekend plan:', recommendationId);
    // TODO: Add to calendar/planner
  };

  const handlePlanWeekend = () => {
    console.log('Plan this weekend');
    // TODO: Navigate to weekend planner
  };

  const handleBrowseActivities = () => {
    console.log('Browse activities');
    // TODO: Navigate to discover/browse page
  };

  const handleFamilyPreferences = () => {
    console.log('Family preferences');
    // TODO: Navigate to settings/preferences page
  };

  return (
    <div className="min-h-screen bg-[#FBF7EF] pb-28">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FD7A37] to-[#FF6B35] px-6 pt-8 pb-6 text-white">
        <h1 className="text-2xl font-bold mb-1">Welcome back! 👋</h1>
        <p className="text-white/90 text-sm">Your family's activity hub</p>
      </div>

      <div className="px-4 -mt-4 pb-6 space-y-4">
        {/* 1. Weekly Activity Summary Card - Most Prominent */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#FD7A37]" />
                <h2 className="text-lg font-bold text-gray-900">This Week's Adventures</h2>
              </div>
              <Badge variant="secondary" className="bg-[#FEF08A] text-gray-800 border-0">
                4 planned
              </Badge>
            </div>

            <div className="space-y-3">
              {upcomingActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={cn(
                    "relative bg-gradient-to-r rounded-xl p-4 border-2 transition-all",
                    index === 0 
                      ? "from-[#FFF4ED] to-[#FFEDD5] border-[#FD7A37]/30 shadow-md" 
                      : "from-white to-gray-50 border-gray-200"
                  )}
                >
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-[#FD7A37] text-white border-0 shadow-md">
                        <Clock className="h-3 w-3 mr-1" />
                        Next up!
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-gray-100">
                      {activity.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                        {activity.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-2">
                        <span className="font-medium text-[#FD7A37]">
                          {activity.day} {activity.time}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {activity.distance}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs border",
                              activity.type === 'indoor' 
                                ? "bg-blue-50 text-blue-700 border-blue-200" 
                                : "bg-green-50 text-green-700 border-green-200"
                            )}
                          >
                            {activity.type === 'indoor' ? '🏠 Indoor' : '🌳 Outdoor'}
                          </Badge>
                          <span className="text-xs font-medium text-gray-700">
                            {activity.cost}
                          </span>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDetails(activity.id)}
                          className="h-8 px-3 text-xs font-medium text-[#FD7A37] hover:bg-[#FD7A37]/10"
                        >
                          Details
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 2. Family Quick Stats */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-[#6BC159]/10 to-[#FEF08A]/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-[#6BC159]" />
              <h2 className="text-lg font-bold text-gray-900">Family Stats</h2>
            </div>

            {/* Main stat - Activities this month */}
            <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-3xl font-black text-[#FD7A37]">
                    {familyStats.activitiesThisMonth}
                  </div>
                  <div className="text-sm text-gray-600">Activities this month</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    Goal: {familyStats.monthlyGoal}
                  </div>
                  <div className="text-xs text-gray-500">
                    {familyStats.monthlyGoal - familyStats.activitiesThisMonth} to go!
                  </div>
                </div>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(progressPercentage)}% complete - You're doing amazing! 🎉
              </div>
            </div>

            {/* Kids' favorites */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white rounded-xl p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{familyStats.emmaFavorite.icon}</span>
                  <div className="text-xs">
                    <div className="font-semibold text-gray-900">Emma loves</div>
                    <div className="text-gray-600">{familyStats.emmaFavorite.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-[#FFA800] text-[#FFA800]" />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{familyStats.leoFavorite.icon}</span>
                  <div className="text-xs">
                    <div className="font-semibold text-gray-900">Leo loves</div>
                    <div className="text-gray-600">{familyStats.leoFavorite.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-[#FFA800] text-[#FFA800]" />
                  ))}
                </div>
              </div>
            </div>

            {/* Additional stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                <Sun className="h-4 w-4 text-[#FFA800] mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">{familyStats.hoursOutdoors}h</div>
                <div className="text-[10px] text-gray-600">Outdoors</div>
              </div>

              <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                <Clock className="h-4 w-4 text-[#6BC159] mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">{familyStats.timeSaved}h</div>
                <div className="text-[10px] text-gray-600">Time Saved</div>
              </div>

              <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                <Award className="h-4 w-4 text-[#FD7A37] mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">{familyStats.totalMiles}mi</div>
                <div className="text-[10px] text-gray-600">Explored</div>
              </div>
            </div>

            <div className="mt-3 text-center">
              <p className="text-xs text-gray-600">
                💪 You've saved <span className="font-bold text-[#6BC159]">{familyStats.timeSaved} hours</span> vs manual planning!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 3. Smart Recommendations Section */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-purple-600 fill-purple-600" />
              <h2 className="text-lg font-bold text-gray-900">Picked Just For You</h2>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Based on your family's preferences and past adventures
            </p>

            <div className="space-y-3">
              {smartRecommendations.map((recommendation) => (
                <div
                  key={recommendation.id}
                  className="bg-white rounded-xl p-4 border-2 border-purple-100 hover:border-purple-300 transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-2xl">
                      {recommendation.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">
                        {recommendation.title}
                      </h3>
                      <p className="text-xs text-purple-600 font-medium mb-1">
                        {recommendation.subtitle}
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {recommendation.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          recommendation.type === 'indoor' 
                            ? "bg-blue-50 text-blue-700 border-blue-200" 
                            : "bg-green-50 text-green-700 border-green-200"
                        )}
                      >
                        {recommendation.weatherNote}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {recommendation.distance}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleAddToWeekend(recommendation.id)}
                    className="w-full mt-3 h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium border-0"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Weekend Plan
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 4. Quick Actions Panel */}
        <Card className="shadow-lg border-2 border-[#FD7A37]/20">
          <CardContent className="p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">
              Ready for More Fun?
            </h2>

            <div className="space-y-3">
              {/* Primary CTA */}
              <Button
                onClick={handlePlanWeekend}
                className="w-full h-14 bg-gradient-to-r from-[#FD7A37] to-[#FF6B35] hover:from-[#FF6B35] hover:to-[#FD7A37] text-white font-bold text-base rounded-xl shadow-md border-0"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Plan This Weekend
              </Button>

              {/* Secondary CTA */}
              <Button
                onClick={handleBrowseActivities}
                variant="outline"
                className="w-full h-12 border-2 border-[#FD7A37] text-[#FD7A37] hover:bg-[#FD7A37]/10 font-semibold rounded-xl"
              >
                <Search className="h-4 w-4 mr-2" />
                Browse Activities
              </Button>

              {/* Tertiary action */}
              <button
                onClick={handleFamilyPreferences}
                className="w-full h-12 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                <Settings className="h-4 w-4" />
                Family Preferences
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Encouraging footer message */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-600">
            ✨ Keep up the amazing work, you're making wonderful memories! ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;

