import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['/api/search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return null;
      
      const response = await fetch(`/api/search/${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Search failed');
      return response.json();
    },
    enabled: !!searchQuery.trim(),
  });

  const performSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    searchQuery,
    searchResults,
    isLoading,
    performSearch
  };
}
