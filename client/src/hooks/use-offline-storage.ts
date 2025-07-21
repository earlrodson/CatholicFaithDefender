import { useState, useCallback } from "react";
import { offlineStorage } from "@/lib/offline-storage";

export function useOfflineStorage() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const initializeOfflineData = useCallback(async () => {
    try {
      // Fetch and cache all data types
      const [qaData, prayersData, documentsData, bibleData] = await Promise.all([
        fetch('/api/qa').then(res => res.json()).catch(() => []),
        fetch('/api/prayers').then(res => res.json()).catch(() => []),
        fetch('/api/documents').then(res => res.json()).catch(() => []),
        fetch('/api/bible').then(res => res.json()).catch(() => [])
      ]);

      // Store data offline
      await offlineStorage.setItem('qa', qaData);
      await offlineStorage.setItem('prayers', prayersData);
      await offlineStorage.setItem('documents', documentsData);
      await offlineStorage.setItem('bible', bibleData);
      
      console.log('Offline data initialized successfully');
    } catch (error) {
      console.error('Failed to initialize offline data:', error);
    }
  }, []);

  const getOfflineData = useCallback(async (contentType: string, searchQuery?: string) => {
    try {
      const data = await offlineStorage.getItem(contentType);
      if (!data) return [];

      if (!searchQuery) return data;

      // Simple client-side search
      return data.filter((item: any) => {
        const searchFields = ['question', 'answer', 'title', 'content', 'book'];
        return searchFields.some(field => 
          item[field]?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    } catch (error) {
      console.error('Failed to get offline data:', error);
      return [];
    }
  }, []);

  return {
    isOnline,
    initializeOfflineData,
    getOfflineData
  };
}
