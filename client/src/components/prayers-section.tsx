import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Star, Heart, Sun } from "lucide-react";
import { useOfflineStorage } from "@/hooks/use-offline-storage";
import { useLanguageContext } from "@/hooks/use-language";
import type { Prayer } from "@shared/schema";

interface PrayersSectionProps {
  searchQuery: string;
}

export function PrayersSection({ searchQuery }: PrayersSectionProps) {
  const { getOfflineData } = useOfflineStorage();
  const { currentLanguage } = useLanguageContext();
  
  const { data: prayers = [], isLoading } = useQuery({
    queryKey: searchQuery ? ['/api/prayers/search', searchQuery, currentLanguage] : ['/api/prayers', currentLanguage],
    queryFn: async () => {
      try {
        if (searchQuery) {
          const response = await fetch(`/api/prayers/search/${encodeURIComponent(searchQuery)}?lang=${currentLanguage}`);
          if (!response.ok) throw new Error('Network request failed');
          return response.json();
        } else {
          const response = await fetch(`/api/prayers?lang=${currentLanguage}`);
          if (!response.ok) throw new Error('Network request failed');
          return response.json();
        }
      } catch (error) {
        console.log('Using offline data for prayers');
        return getOfflineData('prayers', searchQuery);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getIconForCategory = (category: string | null) => {
    switch (category) {
      case 'Essential': return Shield;
      case 'Marian': return Star;
      case 'Guardian Angel': return Sun;
      default: return Heart;
    }
  };

  const getColorForCategory = (category: string | null) => {
    switch (category) {
      case 'Essential': return 'bg-catholic-green bg-opacity-10 text-catholic-green';
      case 'Marian': return 'bg-catholic-gold bg-opacity-10 text-catholic-gold';
      case 'Guardian Angel': return 'bg-catholic-sage bg-opacity-10 text-catholic-sage';
      default: return 'bg-catholic-light-green bg-opacity-10 text-catholic-light-green';
    }
  };

  // Featured prayer (first prayer for now)
  const featuredPrayer = prayers.find((p: Prayer) => p.title === "Hail Mary") || prayers[0];

  return (
    <div className="space-y-4">
      {/* Prayer Grid */}
      <div className="grid grid-cols-2 gap-3">
        {prayers.slice(0, 4).map((prayer: Prayer) => {
          const Icon = getIconForCategory(prayer.category);
          const colorClass = getColorForCategory(prayer.category);
          
          return (
            <Card key={prayer.id} className="transition-all hover:shadow-md">
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${colorClass}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{prayer.title}</h3>
                <p className="text-xs text-gray-600">{prayer.category || 'Prayer'}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Featured Prayer */}
      {featuredPrayer && (
        <Card className="catholic-gradient text-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Prayer of the Day</h3>
            <p className="text-sm opacity-90 italic mb-4 line-clamp-3">
              {featuredPrayer.content}
            </p>
            <Button 
              variant="ghost"
              className="text-white bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
            >
              View Full Prayer →
            </Button>
          </CardContent>
        </Card>
      )}

      {/* All Prayers List */}
      {searchQuery && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
          {prayers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No prayers found matching your search.</p>
              </CardContent>
            </Card>
          ) : (
            prayers.map((prayer: Prayer) => (
              <Card key={prayer.id} className="transition-all hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{prayer.title}</h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {prayer.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {prayer.content}
                  </p>
                  <Button variant="ghost" className="text-catholic-green p-0 h-auto">
                    View Full Prayer →
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
