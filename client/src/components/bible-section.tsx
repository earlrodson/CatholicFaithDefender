import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Book } from "lucide-react";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useOfflineStorage } from "@/hooks/use-offline-storage";
import { cn } from "@/lib/utils";
import type { BibleVerse } from "@shared/schema";

interface BibleSectionProps {
  searchQuery: string;
}

export function BibleSection({ searchQuery }: BibleSectionProps) {
  const { getOfflineData } = useOfflineStorage();
  const { bookmarks, toggleBookmark } = useBookmarks();
  
  const { data: verses = [], isLoading } = useQuery({
    queryKey: searchQuery ? ['/api/bible/search', searchQuery] : ['/api/bible'],
    queryFn: async () => {
      try {
        if (searchQuery) {
          const response = await fetch(`/api/bible/search/${encodeURIComponent(searchQuery)}`);
          if (!response.ok) throw new Error('Network request failed');
          return response.json();
        } else {
          const response = await fetch('/api/bible');
          if (!response.ok) throw new Error('Network request failed');
          return response.json();
        }
      } catch (error) {
        console.log('Using offline data for Bible');
        return getOfflineData('bible', searchQuery);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
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

  const isBookmarked = (verseId: number) => {
    return bookmarks.some(b => b.contentType === 'bible' && b.contentId === verseId);
  };

  // Daily reading (first verse for now)
  const dailyReading = verses.find((v: BibleVerse) => v.book === "John" && v.chapter === 3) || verses[0];

  return (
    <div className="space-y-4">
      {/* Bible Book Categories */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="transition-all hover:shadow-md">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-catholic-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Book className="w-6 h-6 text-catholic-green" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Old Testament</h3>
            <p className="text-xs text-gray-600">39 Books</p>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-catholic-gold bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Book className="w-6 h-6 text-catholic-gold" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">New Testament</h3>
            <p className="text-xs text-gray-600">27 Books</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Reading */}
      {dailyReading && (
        <Card className="bg-gradient-to-r from-catholic-gold to-yellow-600 text-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Daily Reading</h3>
            <div className="mb-4">
              <p className="text-sm opacity-90 mb-2">
                {dailyReading.book} {dailyReading.chapter}:{dailyReading.verse}
              </p>
              <p className="text-sm italic">
                {dailyReading.content}
              </p>
            </div>
            <Button 
              variant="ghost"
              className="text-white bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
            >
              Read Full Chapter →
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Popular/Search Results */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {searchQuery ? 'Search Results' : 'Popular Verses'}
        </h3>
        
        {verses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">
                {searchQuery ? 'No verses found matching your search.' : 'No verses available.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          verses.map((verse: BibleVerse) => (
            <Card key={verse.id} className="transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-catholic-green">
                    {verse.book} {verse.chapter}:{verse.verse}
                  </span>
                  <button
                    onClick={() => toggleBookmark('bible', verse.id)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-all"
                  >
                    <Bookmark 
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isBookmarked(verse.id) 
                          ? "fill-catholic-gold text-catholic-gold" 
                          : "text-gray-400 hover:text-catholic-gold"
                      )}
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-700">{verse.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
