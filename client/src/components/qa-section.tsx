import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useOfflineStorage } from "@/hooks/use-offline-storage";
import { cn } from "@/lib/utils";
import type { QAQuestion } from "@shared/schema";

interface QASectionProps {
  searchQuery: string;
  onExpandAnswer: (question: QAQuestion) => void;
}

export function QASection({ searchQuery, onExpandAnswer }: QASectionProps) {
  const { getOfflineData } = useOfflineStorage();
  const { bookmarks, toggleBookmark } = useBookmarks();
  
  const { data: questions = [], isLoading } = useQuery({
    queryKey: searchQuery ? ['/api/qa/search', searchQuery] : ['/api/qa'],
    queryFn: async () => {
      try {
        if (searchQuery) {
          const response = await fetch(`/api/qa/search/${encodeURIComponent(searchQuery)}`);
          if (!response.ok) throw new Error('Network request failed');
          return response.json();
        } else {
          const response = await fetch('/api/qa');
          if (!response.ok) throw new Error('Network request failed');
          return response.json();
        }
      } catch (error) {
        // Fallback to offline data
        console.log('Using offline data for Q&A');
        return getOfflineData('qa', searchQuery);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const isBookmarked = (questionId: number) => {
    return bookmarks.some(b => b.contentType === 'qa' && b.contentId === questionId);
  };

  return (
    <div className="space-y-4">
      {questions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">
              {searchQuery ? 'No questions found matching your search.' : 'No questions available.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        questions.map((question: QAQuestion) => (
          <Card key={question.id} className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900 pr-4">
                  {question.question}
                </h3>
                <button
                  onClick={() => toggleBookmark('qa', question.id)}
                  className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-all"
                >
                  <Bookmark 
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isBookmarked(question.id) 
                        ? "fill-catholic-gold text-catholic-gold" 
                        : "text-gray-400 hover:text-catholic-gold"
                    )}
                  />
                </button>
              </div>
              <div className="text-sm text-gray-600 line-clamp-3 mb-3">
                {question.answer}
              </div>
              <Button
                variant="ghost"
                onClick={() => onExpandAnswer(question)}
                className="text-catholic-blue hover:text-blue-700 p-0 h-auto"
              >
                Read Full Answer →
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
