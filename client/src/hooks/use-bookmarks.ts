import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Bookmark } from "@shared/schema";

export function useBookmarks() {
  const [localBookmarks, setLocalBookmarks] = useState<Bookmark[]>([]);
  const queryClient = useQueryClient();

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('catholic-faith-bookmarks');
      if (stored) {
        setLocalBookmarks(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load bookmarks from localStorage:', error);
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('catholic-faith-bookmarks', JSON.stringify(localBookmarks));
    } catch (error) {
      console.error('Failed to save bookmarks to localStorage:', error);
    }
  }, [localBookmarks]);

  const { data: serverBookmarks = [] } = useQuery({
    queryKey: ['/api/bookmarks'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/bookmarks?userId=default');
        if (!response.ok) throw new Error('Failed to fetch bookmarks');
        return response.json();
      } catch (error) {
        // Return local bookmarks if server request fails
        return localBookmarks;
      }
    },
  });

  // Combine server and local bookmarks
  const bookmarks = [...serverBookmarks, ...localBookmarks.filter(
    local => !serverBookmarks.some((server: Bookmark) => 
      server.contentType === local.contentType && server.contentId === local.contentId
    )
  )];

  const createBookmarkMutation = useMutation({
    mutationFn: async (bookmark: { contentType: string; contentId: number }) => {
      try {
        const response = await apiRequest('POST', '/api/bookmarks', {
          ...bookmark,
          userId: 'default'
        });
        return response.json();
      } catch (error) {
        // Fallback to local storage
        const newBookmark: Bookmark = {
          id: Date.now(),
          contentType: bookmark.contentType,
          contentId: bookmark.contentId,
          userId: 'default',
          createdAt: new Date()
        };
        setLocalBookmarks(prev => [...prev, newBookmark]);
        return newBookmark;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] });
    }
  });

  const deleteBookmarkMutation = useMutation({
    mutationFn: async ({ contentType, contentId }: { contentType: string; contentId: number }) => {
      try {
        await apiRequest('DELETE', `/api/bookmarks/${contentType}/${contentId}?userId=default`);
      } catch (error) {
        // Fallback to local removal
        setLocalBookmarks(prev => 
          prev.filter(b => !(b.contentType === contentType && b.contentId === contentId))
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] });
    }
  });

  const toggleBookmark = useCallback((contentType: string, contentId: number) => {
    const isBookmarked = bookmarks.some(
      b => b.contentType === contentType && b.contentId === contentId
    );

    if (isBookmarked) {
      deleteBookmarkMutation.mutate({ contentType, contentId });
    } else {
      createBookmarkMutation.mutate({ contentType, contentId });
    }
  }, [bookmarks, createBookmarkMutation, deleteBookmarkMutation]);

  return {
    bookmarks,
    toggleBookmark,
    isLoading: createBookmarkMutation.isPending || deleteBookmarkMutation.isPending
  };
}
