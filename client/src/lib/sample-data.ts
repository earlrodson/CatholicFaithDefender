// This file contains sample data structure references
// The actual data is loaded from the server/storage

export interface SampleData {
  qa: Array<{
    id: number;
    question: string;
    answer: string;
    fullAnswer?: string;
    category?: string;
  }>;
  prayers: Array<{
    id: number;
    title: string;
    content: string;
    category?: string;
    latin?: string;
  }>;
  documents: Array<{
    id: number;
    title: string;
    content: string;
    type: string;
    author?: string;
    articleCount?: number;
  }>;
  bible: Array<{
    id: number;
    book: string;
    chapter: number;
    verse: number;
    content: string;
    testament: string;
  }>;
}

// Sample data is now loaded from the server via the storage layer
// This ensures consistency between offline and online modes
