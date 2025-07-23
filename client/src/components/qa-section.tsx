import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, ChevronRight, BookOpen, BookText, ScrollText, BookMarked, ListChecks } from "lucide-react";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useOfflineStorage } from "@/hooks/use-offline-storage";
import { useLanguageContext } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { QAQuestion } from "@shared/schema";

interface QASectionProps {
  searchQuery: string;
  onExpandAnswer: (question: QAQuestion) => void;
}

function hasAdditionalContent(question: QAQuestion) {
  return [
    question.subjectOverview,
    question.etymology,
    question.churchDocuments,
    question.scriptureSupport,
    question.earlyChurchFathers,
    question.summaryPoints
  ].some(Boolean);
}

export function QASection({ searchQuery, onExpandAnswer }: QASectionProps) {
  const { getOfflineData } = useOfflineStorage();
  const { bookmarks, toggleBookmark } = useBookmarks();
  const { currentLanguage } = useLanguageContext();
  
  const { data: questions = [], isLoading } = useQuery({
    queryKey: searchQuery ? ['/api/qa/search', searchQuery, currentLanguage] : ['/api/qa', currentLanguage],
    queryFn: async () => {
      try {
        if (searchQuery) {
          const response = await fetch(`/api/qa/search/${encodeURIComponent(searchQuery)}?lang=${currentLanguage}`);
          if (!response.ok) throw new Error('Network request failed');
          return response.json();
        } else {
          const response = await fetch(`/api/qa?lang=${currentLanguage}`);
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
          <Card key={i} className="animate-pulse overflow-hidden">
            <CardContent className="p-4">
              <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
            <div className="h-10 bg-gray-100"></div>
          </Card>
        ))}
      </div>
    );
  }

  const isBookmarked = (questionId: number) => {
    return bookmarks.some(b => b.contentType === 'qa' && b.contentId === questionId);
  };

  const getContentPreview = (question: QAQuestion) => {
    if (question.summaryPoints) {
      const firstPoint = question.summaryPoints.split('\n')[0];
      return firstPoint.replace(/^•\s*/, '');
    }
    return question.answer;
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
          <Card key={question.id} className="transition-all hover:shadow-md overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {question.question}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark('qa', question.id);
                  }}
                  className="flex-shrink-0 p-1.5 rounded-full hover:bg-gray-100 transition-all -mt-1 -mr-1"
                  aria-label={isBookmarked(question.id) ? "Remove bookmark" : "Bookmark this question"}
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
                {getContentPreview(question)}
              </div>
              
              {question.category && (
                <div className="mt-2 mb-3">
                  <Badge variant="outline" className="bg-catholic-green/10 text-catholic-green border-catholic-green/20 text-xs">
                    {question.category}
                  </Badge>
                </div>
              )}
            </CardContent>
            
            <div className="border-t bg-gray-50 px-4 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onExpandAnswer(question)}
                className="text-catholic-green hover:bg-catholic-green/5 w-full justify-between group"
              >
                <span>Read full answer</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
