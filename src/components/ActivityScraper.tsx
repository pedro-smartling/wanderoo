import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Search, MapPin, Calendar, Users } from 'lucide-react';

interface ScrapedActivity {
  title: string;
  description: string;
  location: string;
  date_time: string;
  price: number | null;
  age_group: string;
  category: string;
  external_url: string;
  organizer: string;
  image_url?: string;
  tags: string[];
}

export const ActivityScraper = () => {
  const [location, setLocation] = useState('New York');
  const [category, setCategory] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedActivities, setScrapedActivities] = useState<ScrapedActivity[]>([]);
  const { toast } = useToast();

  const handleScrape = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('scrape-activities', {
        body: {
          location,
          category,
          sources: ['eventbrite', 'meetup']
        }
      });

      if (error) {
        console.error('Scraping error:', error);
        toast({
          title: "Error",
          description: "Failed to scrape activities. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data.success) {
        setScrapedActivities(data.activities || []);
        toast({
          title: "Success!",
          description: `Found ${data.activities?.length || 0} activities and saved ${data.inserted || 0} new ones.`,
        });
      } else {
        toast({
          title: "No Results",
          description: data.message || "No activities found for your search.",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Activity Scraper
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., New York, Los Angeles"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., educational, creative, sports"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleScrape} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scraping Activities...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Scrape Activities
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {scrapedActivities.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Found {scrapedActivities.length} Activities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scrapedActivities.map((activity, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 space-y-3">
                  {activity.image_url && (
                    <img 
                      src={activity.image_url} 
                      alt={activity.title}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  )}
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm line-clamp-2">{activity.title}</h4>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="line-clamp-1">{activity.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(activity.date_time).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{activity.age_group}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {activity.organizer}
                      </Badge>
                      {activity.price !== null && (
                        <Badge variant="outline" className="text-xs">
                          ${activity.price}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {activity.category}
                      </Badge>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs"
                      onClick={() => window.open(activity.external_url, '_blank')}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};