import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useOfflineStorage } from "@/hooks/use-offline-storage";
import { cn } from "@/lib/utils";
import type { Document } from "@shared/schema";

interface DocumentsSectionProps {
  searchQuery: string;
}

export function DocumentsSection({ searchQuery }: DocumentsSectionProps) {
  const { getOfflineData } = useOfflineStorage();
  const { bookmarks, toggleBookmark } = useBookmarks();
  
  const { data: documents = [], isLoading } = useQuery({
    queryKey: searchQuery ? ['/api/documents/search', searchQuery] : ['/api/documents'],
    queryFn: async () => {
      try {
        if (searchQuery) {
          const response = await fetch(`/api/documents/search/${encodeURIComponent(searchQuery)}`);
          if (!response.ok) throw new Error('Network request failed');
          return response.json();
        } else {
          const response = await fetch('/api/documents');
          if (!response.ok) throw new Error('Network request failed');
          return response.json();
        }
      } catch (error) {
        console.log('Using offline data for documents');
        return getOfflineData('documents', searchQuery);
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
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const isBookmarked = (documentId: number) => {
    return bookmarks.some(b => b.contentType === 'documents' && b.contentId === documentId);
  };

  return (
    <div className="space-y-4">
      {documents.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">
              {searchQuery ? 'No documents found matching your search.' : 'No documents available.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        documents.map((document: Document) => (
          <Card key={document.id} className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">{document.title}</h3>
                <button
                  onClick={() => toggleBookmark('documents', document.id)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-all"
                >
                  <Bookmark 
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isBookmarked(document.id) 
                        ? "fill-catholic-gold text-catholic-gold" 
                        : "text-gray-400 hover:text-catholic-gold"
                    )}
                  />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">{document.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {document.articleCount ? `${document.articleCount} articles` : document.type}
                  </span>
                  {document.author && (
                    <span className="text-xs text-gray-400">• {document.author}</span>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  className="text-catholic-green hover:text-green-700 p-0 h-auto"
                >
                  Browse →
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
